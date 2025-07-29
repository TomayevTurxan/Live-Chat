import { useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer/simplepeer.min.js";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
// MUI Icons
import PhoneIcon from "@mui/icons-material/Phone";
import UserContext from "../../context/UserInfo";
import CallContext from "../../context/CallContext";

const VideoCall = ({
  open,
  onClose,
  recipientUser,
  incomingCallData,
  setIncomingCallData,
}) => {
  const { socket } = useContext(UserContext);
  const [me, setMe] = useState("");
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [isCalling, setIsCalling] = useState(false);
  const localStreamRef = useRef(null);
  const [connectionError, setConnectionError] = useState("");
  const retryTimeoutRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const {
    receivingCall,
    setReceivingCall,
    caller,
    setCaller,
    callerSignal,
    setCallerSignal,
    callAccepted,
    setCallAccepted,
  } = useContext(CallContext);

  // Production-ready STUN/TURN configuration
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
    // Add free TURN servers for better connectivity
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ];

  useEffect(() => {
    if (!socket) {
      console.warn("Socket not ready, waiting...");
      return;
    }

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    socket.on("callAccepted", () => {
      setCallAccepted(true);
    });

    socket.on("callEnded", () => {
      cleanupCall();
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
      socket.off("callEnded");
      socket.off("callAccepted");
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [socket]);

  const cleanupCall = () => {
    console.log("Cleanup call triggered");

    // Reset UI states
    setIsCalling(false);
    setReceivingCall(false);
    setCallAccepted(false);
    setCaller("");
    setCallerSignal(null);
    setName("");
    setIncomingCallData(null);
    setConnectionError("");
    setRetryCount(0);

    // Clear retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Destroy peer connection
    if (connectionRef.current) {
      try {
        connectionRef.current.destroy();
      } catch (error) {
        console.warn("Error destroying peer connection:", error);
      }
      connectionRef.current = null;
    }

    // Stop media streams
    if (localStreamRef.current) {
      try {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.warn("Error stopping tracks:", error);
      }
      localStreamRef.current = null;
    }

    // Clear video elements
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }

    // Remove socket listeners
    socket.off("callAccepted");
  };

  const createPeerConnection = (isInitiator, stream) => {
    const peer = new Peer({
      initiator: isInitiator,
      trickle: false,
      stream: stream,
      config: {
        iceServers: iceServers,
        iceCandidatePoolSize: 10,
      },
      // Add additional options for better connectivity
      reconnectTimer: 3000,
      iceTransportPolicy: "all",
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
    });

    // Enhanced error handling and connection monitoring
    peer.on("error", (err) => {
      console.error("Peer error:", err);

      if (err.message && err.message.includes("Connection failed")) {
        handleConnectionError();
      } else {
        setConnectionError(
          `Connection error: ${err.message || "Unknown error"}`
        );
        if (isInitiator) {
          setIsCalling(false);
        } else {
          setCallAccepted(false);
        }
      }
    });

    peer.on("connect", () => {
      console.log("Peer connected successfully");
      setConnectionError("");
      setRetryCount(0);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
      cleanupCall();
    });

    // Monitor connection state
    if (peer._pc) {
      peer._pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", peer._pc.iceConnectionState);

        if (
          peer._pc.iceConnectionState === "failed" ||
          peer._pc.iceConnectionState === "disconnected"
        ) {
          handleConnectionError();
        }
      };

      peer._pc.onconnectionstatechange = () => {
        console.log("Connection state:", peer._pc.connectionState);

        if (peer._pc.connectionState === "failed") {
          handleConnectionError();
        }
      };
    }

    return peer;
  };

  const handleConnectionError = () => {
    if (retryCount < MAX_RETRIES) {
      setConnectionError(
        `Connection failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`
      );
      setRetryCount((prev) => prev + 1);

      retryTimeoutRef.current = setTimeout(() => {
        if (isCalling && recipientUser?._id) {
          console.log("Retrying call...");
          callUser(recipientUser._id);
        }
      }, 2000);
    } else {
      setConnectionError(
        "Connection failed after multiple attempts. Please check your network and try again."
      );
      setIsCalling(false);
      setCallAccepted(false);
    }
  };

  const callUser = (id) => {
    console.log("=== CALLING USER DEBUG ===");
    console.log("Target ID:", id);
    console.log("Current callAccepted:", callAccepted);
    console.log("Current isCalling:", isCalling);
    console.log("Current receivingCall:", receivingCall);
    console.log("========================");

    // CRITICAL: Reset ALL states before starting new call
    setCallAccepted(false);
    setReceivingCall(false);
    setCaller("");
    setCallerSignal(null);
    setConnectionError("");
    setRetryCount(0);

    setIsCalling(true);

    getCameraStream()
      .then((currentStream) => {
        localStreamRef.current = currentStream;
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        const peer = createPeerConnection(true, currentStream);

        peer.on("signal", (data) => {
          socket.emit("callUser", {
            userToCall: id,
            signalData: data,
            from: me,
            name: name,
          });
        });

        peer.on("stream", (remoteStream) => {
          console.log("Remote stream received in callUser");
          if (
            userVideo.current &&
            userVideo.current.srcObject !== remoteStream
          ) {
            userVideo.current.srcObject = remoteStream;
          }
        });

        socket.off("callAccepted");
        socket.on("callAccepted", (signal) => {
          console.log("Call accepted signal received");
          setCallAccepted(true);
          try {
            peer.signal(signal);
          } catch (error) {
            console.error("Error signaling peer:", error);
            handleConnectionError();
          }
        });

        connectionRef.current = peer;
      })
      .catch((error) => {
        console.error("Error getting camera stream:", error);
        setIsCalling(false);
        setCallAccepted(false); // Bu əlavə olundu
        setConnectionError(
          "Could not access camera/microphone. Please check permissions."
        );
      });
  };

  const answerCall = () => {
    setConnectionError("");
    setCallAccepted(true);

    getCameraStream()
      .then((currentStream) => {
        localStreamRef.current = currentStream;
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        const peer = createPeerConnection(false, currentStream);

        peer.on("signal", (data) => {
          setCallAccepted(true);
          socket.emit("answerCall", { signal: data, to: caller });
        });

        peer.on("stream", (remoteStream) => {
          console.log("Remote stream received in answerCall");
          if (
            userVideo.current &&
            userVideo.current.srcObject !== remoteStream
          ) {
            userVideo.current.srcObject = remoteStream;
          }
        });

        try {
          peer.signal(callerSignal);
        } catch (error) {
          console.error("Error signaling caller:", error);
          setConnectionError(
            "Failed to establish connection. Please try again."
          );
          setCallAccepted(false);
        }

        connectionRef.current = peer;
      })
      .catch((error) => {
        console.error("Error getting camera stream:", error);
        setCallAccepted(false);
        setConnectionError(
          "Could not access camera/microphone. Please check permissions."
        );
      });
  };

  const getCameraStream = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      const defaultCameraId = videoDevices[0]?.deviceId;

      return navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: defaultCameraId ? { exact: defaultCameraId } : undefined,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      throw error;
    }
  };

  const leaveCall = () => {
    console.log("Leaving call - resetting all states");

    // First, emit the callEnded event
    socket.emit("callEnded");

    // Reset all call-related states immediately
    setIncomingCallData(null);
    setIsCalling(false);
    setCallAccepted(false);
    setReceivingCall(false);
    setCaller("");
    setCallerSignal(null);
    setName("");
    setConnectionError("");
    setRetryCount(0);

    // Clear timeout if exists
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Clean up peer connection
    if (connectionRef.current) {
      try {
        connectionRef.current.destroy();
      } catch (error) {
        console.warn("Error destroying peer connection:", error);
      }
      connectionRef.current = null;
    }

    // Stop local stream
    if (localStreamRef.current) {
      try {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.warn("Error stopping tracks:", error);
      }
      localStreamRef.current = null;
    }

    // Clear video sources
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }

    // Remove socket listeners
    socket.off("callAccepted");

    console.log("Call cleanup completed");
  };

  useEffect(() => {
    if (incomingCallData) {
      setReceivingCall(true);
      setCaller(incomingCallData.from);
      setName(incomingCallData.name);
      setCallerSignal(incomingCallData.signal);
    }
  }, [incomingCallData, callAccepted]);

  useEffect(() => {
    if (!open) {
      setIncomingCallData(null);
      socket.emit("callEnded");
      cleanupCall();
    }
  }, [open]);

  console.log("userVideo.current", userVideo);
  console.log("callAccepted", callAccepted);
  console.log("isCalling", isCalling);

  return (
    <Dialog
      open={open}
      onClose={() => {
        leaveCall();
        onClose();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#121212",
          color: "#fff",
          minHeight: "75vh",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        },
      }}
    >
      <DialogContent
        sx={{ p: 0, height: "75vh", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            bgcolor: "black",
            position: "relative",
          }}
        >
          <Box
            sx={{
              flex: 1,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "black",
            }}
          >
            <video
              ref={userVideo}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            {!callAccepted && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  zIndex: 1,
                  textAlign: "center",
                  px: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {isCalling
                    ? "Calling..."
                    : receivingCall
                    ? "Incoming call..."
                    : "No active call"}
                </Typography>

                {connectionError && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ff6b6b",
                      backgroundColor: "rgba(255,107,107,0.1)",
                      padding: "8px 16px",
                      borderRadius: 1,
                      maxWidth: "400px",
                    }}
                  >
                    {connectionError}
                  </Typography>
                )}
              </Box>
            )}

            <video
              ref={myVideo}
              autoPlay
              muted
              playsInline
              style={{
                position: "absolute",
                width: "200px",
                height: "120px",
                bottom: 16,
                right: 16,
                border: "2px solid white",
                borderRadius: "8px",
                objectFit: "cover",
                zIndex: 10,
                display: callAccepted || isCalling ? "block" : "none",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            px: 3,
            py: 2,
            borderTop: "1px solid #333",
            backgroundColor: "#1e1e1e",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {callAccepted || isCalling ? (
              <Button variant="contained" color="error" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              !receivingCall && (
                <IconButton
                  color="success"
                  onClick={() => {
                    callUser(recipientUser._id);
                  }}
                  disabled={!recipientUser?._id || !!connectionError}
                >
                  <PhoneIcon fontSize="large" />
                </IconButton>
              )
            )}
          </Box>
        </Box>

        {receivingCall && !callAccepted && (
          <Box
            sx={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "#222",
              px: 4,
              py: 2,
              borderRadius: 2,
              boxShadow: 4,
              textAlign: "center",
              zIndex: 20,
            }}
          >
            <Typography variant="body1">{name} is calling...</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setReceivingCall(false);
                  setCaller("");
                  setCallerSignal(null);
                  setName("");
                  setIncomingCallData(null);
                }}
              >
                Decline
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;

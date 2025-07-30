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
  const { socket, userInfo } = useContext(UserContext);
  const [me, setMe] = useState("");
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [isCalling, setIsCalling] = useState(false);
  const localStreamRef = useRef(null);
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

  useEffect(() => {
    if (!socket) {
      console.warn("Socket not ready, waiting...");
      return;
    }

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      console.log("data", data);
      setReceivingCall(true);
      setCaller(data.from);
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
    };
  }, [socket]);

  const cleanupCall = () => {
    setIsCalling(false);
    setReceivingCall(false);
    setCallAccepted(false);
    setCaller("");
    setCallerSignal(null);
    setIncomingCallData(null);

    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }

    socket.off("callAccepted");
  };

  const callUser = (id) => {
    console.log("id", id);
    setIsCalling(true);

    getCameraStream()
      .then((currentStream) => {
        localStreamRef.current = currentStream;
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: currentStream,
        });
        peer.on("signal", (data) => {
          socket.emit("callUser", {
            userToCall: id,
            signalData: data,
            from: me,
            name: userInfo?.name,
          });
        });

        peer.on("stream", (remoteStream) => {
          if (
            userVideo.current &&
            userVideo.current.srcObject !== remoteStream
          ) {
            userVideo.current.srcObject = remoteStream;
          }
        });

        socket.on("callAccepted", (signal) => {
          setCallAccepted(true);
          peer.signal(signal);
        });

        connectionRef.current = peer;
      })
      .catch((error) => {
        console.error("Error getting camera stream:", error);
        setIsCalling(false);
      });
  };

  const answerCall = () => {
    getCameraStream()
      .then((currentStream) => {
        localStreamRef.current = currentStream;
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: currentStream,
        });

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

        peer.signal(callerSignal);
        connectionRef.current = peer;
      })
      .catch((error) => {
        console.error("Error getting camera stream:", error);
        setCallAccepted(false);
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
        },
        audio: true,
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      throw error;
    }
  };

  const leaveCall = () => {
    setIncomingCallData(null);
    setIsCalling(false);
    cleanupCall();
    socket.emit("callEnded");
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
  console.log("callAcepted", callAccepted);
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
      props={{
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
                // display: callAccepted ? "block" : "none",
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
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  zIndex: 1,
                }}
              >
                <Typography variant="h6">
                  {isCalling
                    ? "Calling..."
                    : receivingCall
                    ? "Incoming call..."
                    : "No active call"}
                </Typography>
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
                  disabled={!recipientUser?._id}
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

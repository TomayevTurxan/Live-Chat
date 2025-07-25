import React, { useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer/simplepeer.min.js";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
// MUI Icons
import PhoneIcon from "@mui/icons-material/Phone";
import AssignmentIcon from "@mui/icons-material/Assignment";
import UserContext from "../../context/UserInfo";

const VideoCall = ({ open, onClose, recipientUser }) => {
  const { socket } = useContext(UserContext);
  const [me, setMe] = useState("");
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [copied, setCopied] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const localStreamRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(me);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy ID: ", err);
    }
  };
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

    socket.on("callEnded", () => {
      setIsCalling(false);
      setCallEnded(true);
      setReceivingCall(false);
      setCallAccepted(false);
      connectionRef.current?.destroy();
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
      socket.off("callEnded");
    };
  }, [socket]);

  const callUser = (id) => {
    setIsCalling(true);
    getCameraStream().then((currentStream) => {
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
          name: name,
        });
      });

      peer.on("stream", (remoteStream) => {
        if (userVideo.current && userVideo.current.srcObject !== remoteStream) {
          userVideo.current.srcObject = remoteStream;
        }
      });

      socket.on("callAccepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });

      connectionRef.current = peer;
    });
  };

  const answerCall = () => {
    getCameraStream().then((currentStream) => {
      localStreamRef.current = currentStream;
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }

      setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: currentStream,
      });

      peer.on("signal", (data) => {
        socket.emit("answerCall", { signal: data, to: caller });
      });

      peer.on("stream", (remoteStream) => {
        if (userVideo.current && userVideo.current.srcObject !== remoteStream) {
          userVideo.current.srcObject = remoteStream;
        }
      });

      peer.signal(callerSignal);
      connectionRef.current = peer;
    });
  };
  const getCameraStream = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === "videoinput");

    const defaultCameraId = videoDevices[0]?.deviceId;

    return navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: defaultCameraId ? { exact: defaultCameraId } : undefined,
      },
      audio: true,
    });
  };

  const leaveCall = () => {
    setIsCalling(false);
    setCallEnded(true);
    setReceivingCall(false);
    setCallAccepted(false);
    setCaller("");
    setCallerSignal(null);
    setIdToCall("");
    setCopied(false);
    connectionRef.current?.destroy();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }

    connectionRef.current?.destroy();
    socket.emit("callEnded");
  };


  console.log("myVideo", myVideo);
  console.log("userVideo", userVideo);
  console.log("callAccepted", callAccepted);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        {/* Videos */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            bgcolor: "black",
            position: "relative",
          }}
        >
          {/* Remote Video */}
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
            {callAccepted && (
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
            )}

            {myVideo&& (
              <video
                ref={myVideo}
                autoPlay
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
                }}
              />
            )}
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
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}
          >
            <TextField
              label="Your Name"
              variant="filled"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                onClick={handleCopy}
                color={copied ? "success" : "primary"}
              >
                {copied ? "Copied!" : "Copy ID"}
              </Button>

              <TextField
                label="ID to call"
                variant="filled"
                size="small"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#aaa" } }}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>

          {/* Right - Call buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {callAccepted || isCalling ? (
              <Button variant="contained" color="error" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <IconButton
                color="success"
                onClick={() => {
                  if (!idToCall) {
                    alert("Please enter an ID.");
                    return;
                  }
                  callUser(idToCall);
                }}
              >
                <PhoneIcon fontSize="large" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Incoming Call Prompt */}
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
            }}
          >
            <Typography variant="body1">{name} is calling...</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={answerCall}
            >
              Answer
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;

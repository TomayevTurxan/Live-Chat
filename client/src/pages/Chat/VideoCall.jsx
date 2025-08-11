import { useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer/simplepeer.min.js";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Avatar,
  Fade,
  Slide,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  CallEnd as CallEndIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from "@mui/icons-material";
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
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

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
    let interval;
    if (callAccepted) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callAccepted]);

  useEffect(() => {
    let timeout;
    if (showControls && callAccepted) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, callAccepted]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!socket) return;

    const handleMe = (id) => setMe(id);
    const handleCallUser = (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    };
    const handleCallEnded = () => cleanupCall();

    socket.on("me", handleMe);
    socket.on("callUser", handleCallUser);
    socket.on("callEnded", handleCallEnded);

    return () => {
      socket.off("me", handleMe);
      socket.off("callUser", handleCallUser);
      socket.off("callEnded", handleCallEnded);
    };
  }, [socket]);

  const cleanupCall = () => {
    setIsCalling(false);
    setReceivingCall(false);
    setCallAccepted(false);
    setCaller("");
    setCallerSignal(null);
    setIncomingCallData(null);
    setCallDuration(0);
    setIsVideoEnabled(true);
    setIsAudioEnabled(true);

    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    if (userVideo.current) userVideo.current.srcObject = null;
    if (myVideo.current) myVideo.current.srcObject = null;

    socket?.off("callAccepted");
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const callUser = (id) => {
    setIsCalling(true);

    getCameraStream()
      .then((currentStream) => {
        localStreamRef.current = currentStream;
        if (myVideo.current) myVideo.current.srcObject = currentStream;

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: currentStream,
        });

        peer.on("signal", (data) => {
          socket.emit("callUser", {
            userToCall: id,
            signalData: data,
            from: me || socket.id,
            name: userInfo?.name,
          });
        });

        peer.on("stream", (remoteStream) => {
          if (userVideo.current) userVideo.current.srcObject = remoteStream;
        });

        socket.once("callAccepted", (signal) => {
          setCallAccepted(true);
          peer.signal(signal);
        });

        connectionRef.current = peer;
      })
      .catch((err) => {
        console.error("Error getting camera:", err);
        setIsCalling(false);
      });
  };

  const answerCall = () => {
    getCameraStream()
      .then((currentStream) => {
        localStreamRef.current = currentStream;
        if (myVideo.current) myVideo.current.srcObject = currentStream;

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
          if (userVideo.current) userVideo.current.srcObject = remoteStream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
      })
      .catch((err) => {
        console.error("Error answering call:", err);
        setCallAccepted(false);
      });
  };

  const getCameraStream = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === "videoinput");
    const defaultCameraId = videoDevices[0]?.deviceId;

    return navigator.mediaDevices.getUserMedia({
      video: defaultCameraId ? { deviceId: { exact: defaultCameraId } } : true,
      audio: true,
    });
  };

  const leaveCall = () => {
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
  }, [incomingCallData]);

  useEffect(() => {
    if (!open && (callAccepted || isCalling || receivingCall)) {
      socket.emit("callEnded");
      cleanupCall();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        leaveCall();
        onClose();
      }}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0a0a0a',
          borderRadius: 3,
          overflow: 'hidden',
          height: '85vh',
          maxHeight: '85vh',
        }
      }}
    >
      <DialogContent 
        sx={{ 
          p: 0, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative'
        }}
        onMouseMove={() => setShowControls(true)}
      >
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          bgcolor: '#000', 
          position: 'relative',
          borderRadius: '12px 12px 0 0',
          overflow: 'hidden'
        }}>
          <video
            ref={userVideo}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          
          {!callAccepted && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                zIndex: 1,
              }}
            >
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 3,
                  border: '4px solid rgba(255,255,255,0.2)',
                  fontSize: '3rem'
                }}
                src={recipientUser?.avatar}
              >
                {recipientUser?.name?.charAt(0) || name?.charAt(0)}
              </Avatar>
              
              <Typography variant="h4" sx={{ color: '#fff', mb: 2, fontWeight: 300 }}>
                {recipientUser?.name || name}
              </Typography>
              
              <Typography variant="h6" sx={{ color: '#888', mb: 4 }}>
                {isCalling ? "Calling..." : receivingCall ? "Incoming call..." : "Ready to call"}
              </Typography>

              {isCalling && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[...Array(3)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#4CAF50',
                        animation: 'pulse 1.5s infinite',
                        animationDelay: `${i * 0.3}s`,
                        '@keyframes pulse': {
                          '0%, 80%, 100%': { opacity: 0.3 },
                          '40%': { opacity: 1 },
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
          
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 200,
              height: 120,
              borderRadius: 2,
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.3)',
              display: callAccepted || isCalling ? "block" : "none",
              zIndex: 10,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                border: '2px solid rgba(255,255,255,0.6)',
              }
            }}
          >
            {isVideoEnabled ? (
              <video
                ref={myVideo}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box sx={{
                width: "100%",
                height: "100%",
                bgcolor: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <VideocamOffIcon sx={{ color: '#666', fontSize: 40 }} />
              </Box>
            )}
          </Box>

          {callAccepted && (
            <Fade in={showControls}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  animation: 'blink 2s infinite',
                  '@keyframes blink': {
                    '0%, 50%': { opacity: 1 },
                    '51%, 100%': { opacity: 0.3 },
                  }
                }} />
                <Typography variant="body2" sx={{ color: '#fff', fontFamily: 'monospace' }}>
                  {formatDuration(callDuration)}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>

        <Slide direction="up" in={showControls || !callAccepted}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              px: 4,
              py: 3,
              bgcolor: 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {callAccepted || isCalling ? (
              <>
                <IconButton
                  onClick={toggleVideo}
                  sx={{
                    bgcolor: isVideoEnabled ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                    color: isVideoEnabled ? '#4CAF50' : '#f44336',
                    border: `2px solid ${isVideoEnabled ? '#4CAF50' : '#f44336'}`,
                    transition: 'all 0.2s ease',
                    width: 56,
                    height: 56
                  }}
                >
                  {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>

                <IconButton
                  onClick={toggleAudio}
                  sx={{
                    bgcolor: isAudioEnabled ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                    color: isAudioEnabled ? '#4CAF50' : '#f44336',
                    border: `2px solid ${isAudioEnabled ? '#4CAF50' : '#f44336'}`,
                    '&:hover': {
                      bgcolor: isAudioEnabled ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease',
                    width: 56,
                    height: 56
                  }}
                >
                  {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
                </IconButton>

                <IconButton
                  onClick={leaveCall}
                  sx={{
                    bgcolor: '#f44336',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#d32f2f',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease',
                    width: 64,
                    height: 64,
                    mx: 2
                  }}
                >
                  <CallEndIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </>
            ) : (
              !receivingCall && (
                <IconButton
                  onClick={() => callUser(recipientUser._id)}
                  disabled={!recipientUser?._id}
                  sx={{
                    bgcolor: '#4CAF50',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#45a049',
                      transform: 'scale(1.1)'
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(76, 175, 80, 0.3)',
                      color: 'rgba(255,255,255,0.5)'
                    },
                    transition: 'all 0.2s ease',
                    width: 72,
                    height: 72
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 32 }} />
                </IconButton>
              )
            )}
          </Box>
        </Slide>

        {receivingCall && !callAccepted && (
          <Slide direction="up" in={true}>
            <Box
              sx={{
                position: "absolute",
                bottom: "120px",
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                px: 4,
                py: 3,
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: "center",
                zIndex: 20,
                minWidth: 300
              }}
            >
              <Avatar
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mx: 'auto', 
                  mb: 2,
                  border: '3px solid rgba(255,255,255,0.3)'
                }}
                src={recipientUser?.avatar}
              >
                {name?.charAt(0)}
              </Avatar>
              
              <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                {name}
              </Typography>
              
              <Typography variant="body2" sx={{ color: '#888', mb: 3 }}>
                Incoming video call...
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2, justifyContent: 'center' }}>
                <IconButton
                  onClick={answerCall}
                  sx={{
                    bgcolor: '#4CAF50',
                    color: '#fff',
                    width: 56,
                    height: 56,
                    '&:hover': {
                      bgcolor: '#45a049',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <PhoneIcon />
                </IconButton>
                
                <IconButton
                  onClick={() => {
                    setReceivingCall(false);
                    setCaller("");
                    setCallerSignal(null);
                    setName("");
                  }}
                  sx={{
                    bgcolor: '#f44336',
                    color: '#fff',
                    width: 56,
                    height: 56,
                    '&:hover': {
                      bgcolor: '#d32f2f',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <CallEndIcon />
                </IconButton>
              </Box>
            </Box>
          </Slide>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;
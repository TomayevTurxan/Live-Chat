import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Avatar,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Call,
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import { useVideoCall } from "../../hooks/useVideoCall";

// Hook-u import edirik (hookun öz adı və yeri sənin layihəndən asılıdır)

const CallUser = ({ open, onClose, recipientUser }) => {
  // Hookdan destructure edirik
  const {
    stream,
    callAccepted,
    calling,
    isReceivingCall,
    caller,
    audioEnabled,
    videoEnabled,
    myVideo,
    userVideo,
    answerCall,
    endCall,
    toggleAudio,
    toggleVideo,
    rejectCall,
  } = useVideoCall();

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleEndCall}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          color: "white",
          minHeight: "80vh",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Remote Video (Main) */}
          {callAccepted ? (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 2,
              }}
            >
              <Avatar
                src={recipientUser?.avatar}
                sx={{ width: 120, height: 120 }}
              >
                {recipientUser?.name?.charAt(0)}
              </Avatar>
              <Typography variant="h5" color="white">
                {isReceivingCall
                  ? "Incoming call..."
                  : calling
                  ? "Calling..."
                  : recipientUser?.name}
              </Typography>
              {isReceivingCall && caller && (
                <Typography variant="body1" color="white" sx={{ opacity: 0.7 }}>
                  {caller?.name} is calling you
                </Typography>
              )}
            </Box>
          )}

          {/* Local Video (Picture in Picture) */}
          {stream && (
            <Paper
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 200,
                height: 150,
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Paper>
          )}

          {/* Call Controls */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 2,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              borderRadius: 3,
              p: 2,
            }}
          >
            {/* Accept Call (only show for incoming calls) */}
            {isReceivingCall && !callAccepted && (
              <>
                <IconButton
                  onClick={answerCall}
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    "&:hover": { backgroundColor: "darkgreen" },
                  }}
                >
                  <Call />
                </IconButton>
                <IconButton
                  onClick={rejectCall}
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": { backgroundColor: "darkred" },
                  }}
                >
                  <CallEnd />
                </IconButton>
              </>
            )}

            {/* Audio Toggle */}
            {(callAccepted || calling) && (
              <IconButton
                onClick={toggleAudio}
                sx={{
                  backgroundColor: audioEnabled
                    ? "rgba(255,255,255,0.2)"
                    : "red",
                  color: "white",
                }}
              >
                {audioEnabled ? <Mic /> : <MicOff />}
              </IconButton>
            )}

            {/* Video Toggle */}
            {(callAccepted || calling) && (
              <IconButton
                onClick={toggleVideo}
                sx={{
                  backgroundColor: videoEnabled
                    ? "rgba(255,255,255,0.2)"
                    : "red",
                  color: "white",
                }}
              >
                {videoEnabled ? <Videocam /> : <VideocamOff />}
              </IconButton>
            )}

            {/* End Call */}
            {!isReceivingCall && (
              <IconButton
                onClick={handleEndCall}
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": { backgroundColor: "darkred" },
                }}
              >
                <CallEnd />
              </IconButton>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CallUser;

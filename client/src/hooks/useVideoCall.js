import Peer from "simple-peer";
import { useState, useRef, useEffect, useContext } from "react";
import { useUser } from "../context/contexts";
import UserContext from "../context/UserInfo";

export const useVideoCall = () => {
  const { socket } = useContext(UserContext);
  const { userInfo } = useUser();

  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [calling, setCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (!socket) return;

    // Socket event listeners
    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setIsReceivingCall(true);
      setCaller({ id: from, name: callerName });
      setCallerSignal(signal);
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
      }
    });

    socket.on("callEnded", () => {
      endCall();
    });

    return () => {
      socket.off("callUser");
      socket.off("callAccepted");
      socket.off("callEnded");
    };
  }, [socket]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      if (myVideo.current) myVideo.current.srcObject = stream;
      return stream;
    } catch (error) {
      console.error("initializeMedia error:", error);
      throw error;
    }
  };

  const callUser = async (recipientId) => {
    console.log("callUser function called with recipientId:", recipientId);
    if (!recipientId) {
      console.error("Recipient ID required");
      return;
    }

    try {
      console.log("Requesting user media...");
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("Before creating peer");
      try {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: currentStream,
        });

        console.log("Peer instance created:", peer);
        console.log("Peer instance created, id:", peer._id);
      } catch (error) {
        console.error("Error creating peer:", error);
      }

      console.log("After creating peer");
      //   console.log("Peer instance created:", peer);

      //   peer.on("signal", (data) => {
      //     console.log("Signal event triggered", data);
      //     socket.emit("callUser", {
      //       userToCall: recipientId,
      //       signalData: data,
      //       from: socket.id,
      //       name: userInfo?.name,
      //     });
      //   });

      //   connectionRef.current = peer;
    } catch (error) {
      console.error("Error inside callUser:", error);
    }
  };

  const answerCall = async () => {
    try {
      const currentStream = await initializeMedia();
      setCallAccepted(true);

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: currentStream,
      });
      console.log("socket.id:", socket.id);

      peer.on("signal", (data) => {
        console.log("Emitting 'callUser'", {
          userToCall: data.recipientId,
          signalData: data,
          from: socket.id,
        });
        socket.emit("callUser", {
          userToCall: data.recipientId,
          signalData: data,
          from: socket.id,
          name: userInfo?.name,
        });
      });

      peer.on("stream", (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      });

      peer.on("close", () => {
        endCall();
      });

      peer.on("error", (error) => {
        console.error("Peer connection error:", error);
        endCall();
      });

      if (callerSignal) {
        peer.signal(callerSignal);
      }

      connectionRef.current = peer;
    } catch (error) {
      console.error("Error answering call:", error);
      endCall();
    }
  };

  const endCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setCalling(false);
    setIsReceivingCall(false);
    setCaller(null);
    setCallerSignal(null);

    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    // Clear video elements
    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }

    socket.emit("callEnded");
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const rejectCall = () => {
    setIsReceivingCall(false);
    setCaller(null);
    setCallerSignal(null);
    socket.emit("callEnded");
  };
  //   useEffect(() => {
  //     if (!socket) return;

  //     socket.on("callUser", (data) => {
  //       console.log("🔥 Incoming 'callUser' event data:", data);
  //       const { from, name: callerName, signal } = data;
  //       setIsReceivingCall(true);
  //       setCaller({ id: from, name: callerName });
  //       setCallerSignal(signal);
  //     });

  //     return () => {
  //       socket.off("callUser");
  //     };
  //   }, [socket]);

  return {
    // State
    stream,
    callAccepted,
    callEnded,
    calling,
    isReceivingCall,
    caller,
    audioEnabled,
    videoEnabled,

    // Refs
    myVideo,
    userVideo,

    // Actions
    callUser,
    answerCall,
    endCall,
    toggleAudio,
    toggleVideo,
    rejectCall,
    initializeMedia,
  };
};

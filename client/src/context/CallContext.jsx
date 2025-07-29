import React, { createContext, useState } from "react";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  return (
    <CallContext.Provider
      value={{
        receivingCall,
        setReceivingCall,
        caller,
        setCaller,
        callerSignal,
        setCallerSignal,
        callAccepted,
        setCallAccepted,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export default CallContext;

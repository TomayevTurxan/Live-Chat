// context/PotentialChatContext.js
import { createContext, useState } from "react";

const PotentialChatContext = createContext();

export const PotentialChatProvider = ({ children }) => {
  const [potentialChats, setPotentialChats] = useState([]);
  const [potentialLoading, setPotentialLoading] = useState(false);
  return (
    <PotentialChatContext.Provider
      value={{
        potentialChats,
        setPotentialChats,
        potentialLoading,
        setPotentialLoading,
      }}
    >
      {children}
    </PotentialChatContext.Provider>
  );
};

export default PotentialChatContext;

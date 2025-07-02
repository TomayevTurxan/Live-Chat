import { useContext } from "react";
import UserContext from "../../context/UserInfo";
import { Chip } from "@mui/material";

const ChipOnline = ({ recipientUser }) => {
  const { onlineUsers } = useContext(UserContext);

  return (
    <Chip
      label={
        onlineUsers?.some(
          (onlineUser) => onlineUser.userId === recipientUser._id
        )
          ? "Online"
          : "Offline"
      }
      size="small"
      color={
        onlineUsers?.some(
          (onlineUser) => onlineUser.userId === recipientUser._id
        )
          ? "success"
          : "default"
      }
      sx={{
        height: 20,
        fontSize: "0.7rem",
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
};

export default ChipOnline;

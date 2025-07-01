import { Grid, LinearProgress } from "@mui/material";
import { useGetMessages } from "../../features/queries";

const ChatMessages = ({ currentChat }) => {
  const { data: messages, isLoading } = useGetMessages(currentChat?._id);

  if (isLoading) return <LinearProgress />;

  return (
    <Grid container height="80vh" direction="column" spacing={1}>
      {messages?.map((msg) => (
        <Grid item key={msg._id}>
          <div>{msg.text}</div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ChatMessages;

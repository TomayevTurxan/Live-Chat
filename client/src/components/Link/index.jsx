import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

const Link = ({ children, ...props }) => {
  return (
    <MuiLink component={RouterLink} to="/register" sx={{ ml: 1 }} {...props}>
      {children}
    </MuiLink>
  );
};

export default Link;

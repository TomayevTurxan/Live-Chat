import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import Link from "../../components/Link";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <Box p={4} width="100%" maxWidth={450}>
      <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">
        Welcome Back
      </Typography>
      <Typography variant="body2" mb={3}>
        Enter your email and password to access your account.
      </Typography>

      <LoginForm />

      <Box mt={2} display="flex" justifyContent="space-between">
        <FormControlLabel control={<Checkbox />} label="Remember Me" />
        <Link to="/register">Forgot Your Password?</Link>
      </Box>

      <Box mt={3} textAlign="center">
        <Typography variant="body2">
          Don’t Have An Account?
          <Link to="/register">Register Now</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;

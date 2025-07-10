import {
  Box,
  Typography,
} from "@mui/material";
import RegisterForm from "./RegisterForm";

const Register = () => {

  return (
    <Box p={4} width="100%" maxWidth={450}>
      <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">
        Create an Account
      </Typography>
      <Typography variant="body2" mb={3}>
        Sign up with your email and password to get started.
      </Typography>

      <RegisterForm />

      {/* <Box mt={2} display="flex" justifyContent="space-between">
        <FormControlLabel control={<Checkbox />} label="Remember Me" />
        <Link to="/forgot-password">Forgot Your Password?</Link>
      </Box>

      <Box mt={3} textAlign="center">
        <Typography variant="body2">
          Already have an account?
          <Link to="/login">Log In</Link>
        </Typography>
      </Box> */}
    </Box>
  );
};

export default Register;

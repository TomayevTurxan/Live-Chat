import { Box, Typography } from "@mui/material";
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
    </Box>
  );
};

export default Register;

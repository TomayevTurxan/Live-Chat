import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import Link from "../components/Link";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box p={4} width="100%" maxWidth={450}>
      <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">
        Welcome Back
      </Typography>
      <Typography variant="body2" mb={3}>
        Enter your email and password to access your account.
      </Typography>

      <Stack spacing={2}>
        <TextField label="Email" type="email" fullWidth />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          slotProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" fullWidth sx={{ mt: 1 }}>
          Log In
        </Button>
      </Stack>

      <Box mt={2} display="flex" justifyContent="space-between">
        <FormControlLabel control={<Checkbox />} label="Remember Me" />
        <Link to="/register" ml={2}>
          Forgot Your Password?
        </Link>
      </Box>

      <Box mt={3} textAlign="center">
        <Typography variant="body2">
          Don’t Have An Account?
          <Link to="/register" ml={2}>
            Register Now
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;

import {
  Button,
  Stack,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import Link from "../../../components/Link";
import TextFieldForm from "../../../components/TextFieldForm/TextFieldForm";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../../features/mutations";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();
  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data) => {
    register(data, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <Stack spacing={2}>
          <TextFieldForm name="name" formLabel="Name" type="text" fullWidth />
          <TextFieldForm
            name="email"
            formLabel="Email"
            type="email"
            fullWidth
          />
          <TextFieldForm
            name="password"
            formLabel="Password"
            type="password"
            fullWidth
          />
          <Button variant="contained" fullWidth sx={{ mt: 1 }} type="submit">
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>
          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Already have an account?
              <Link to="/login">Log In</Link>
            </Typography>
          </Box>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;

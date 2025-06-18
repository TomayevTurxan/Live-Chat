import { Button, Stack, Box, Typography } from "@mui/material";
import Link from "../../../components/Link";
import TextFieldForm from "../../../components/TextFieldForm/TextFieldForm";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../lib/axiosInstance";

const RegisterForm = () => {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/users/register", data);
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
            Register
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

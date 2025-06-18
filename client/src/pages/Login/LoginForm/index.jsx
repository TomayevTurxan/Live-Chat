import { Button, Stack } from "@mui/material";
import TextFieldForm from "../../../components/TextFieldForm/TextFieldForm";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import axiosInstance from "../../../lib/axiosInstance";
import { useUser } from "../../../context/contexts";

const LoginForm = () => {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { setUserInfo } = useUser();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/users/login", data);
      console.log("Login successful:", response.data);
      setUserInfo(response.data);
      navigate("/chat");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={2}>
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
            Log In
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default LoginForm;

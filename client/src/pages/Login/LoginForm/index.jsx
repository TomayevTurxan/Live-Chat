import { Button, CircularProgress, Stack } from "@mui/material";
import TextFieldForm from "../../../components/TextFieldForm/TextFieldForm";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useUser } from "../../../context/contexts";
import { useLogin } from "../../../features/mutations";

const LoginForm = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { setUserInfo } = useUser();

  const onSubmit = (data) => {
    login(data, {
      onSuccess: (responseData) => {
        setUserInfo(responseData);
        navigate("/chat");
      },
    });
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
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default LoginForm;

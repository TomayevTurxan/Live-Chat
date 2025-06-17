import { Box, Grid, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid size={4} display="flex" alignItems="center" justifyContent="center">
        <Outlet />
      </Grid>

      <Grid
        size={8}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(25, 93, 221, 1)",
          p: 4,
        }}
      >
        <Box maxWidth={600}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Effortlessly manage your team and operations.
          </Typography>
          <Typography variant="body2" mb={3}>
            Log in to access your CRM dashboard and manage your team.
          </Typography>
          <Box
            component="img"
            src="/loginPic.avif"
            alt="CRM Dashboard"
            width="100%"
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;

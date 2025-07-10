import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid 
        size={isMobile ? 12 : 4} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Outlet />
      </Grid>

      {!isMobile && (
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
            <Typography variant="h4" fontWeight={600} gutterBottom color="white">
              Instantly connect with your customers via live chat.
            </Typography>
            <Typography variant="body2" mb={3} color="white">
              Log in to access your live chat dashboard and support your users in
              real time.
            </Typography>
            <Box
              component="img"
              src="/loginPic.avif"
              alt="Live Chat Dashboard"
              width="100%"
            />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default AuthLayout;
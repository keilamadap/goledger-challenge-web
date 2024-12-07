import React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import HeadsetIcon from "@mui/icons-material/Headset";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ backgroundColor: "#7b1fa2" }}>
        <Toolbar>
          <Typography
            sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
            variant="h6"
          >
            <HeadsetIcon />
            Blockchain Streaming Service
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "background.paper" }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Blockchain Streaming Service
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

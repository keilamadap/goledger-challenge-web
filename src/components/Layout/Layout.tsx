import React from "react";
import { Typography, Container, Box } from "@mui/material";
import MusicBanner from "../MusicBanner/Banner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <MusicBanner />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "#1976d2" }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="#FFF" align="center">
            © {new Date().getFullYear()} Streaming Service
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

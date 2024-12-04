import React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Blockchain Streaming Service</Typography>
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

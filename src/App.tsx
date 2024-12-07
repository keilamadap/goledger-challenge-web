import React from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "./components/Layout/Layout";
import ArtistList from "./components/ArtistList/ArtistList";
import AlbumList from "./components/AlbumList/AlbumList";
import SongList from "./components/SongList/SongList";
import PlaylistList from "./components/PlaylistList/PlaylistList";

const theme = createTheme();
const queryClient = new QueryClient();

const App: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 2,
              color: "#86ee27",
            }}
          >
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab
                label="Artists"
                sx={{
                  color: "#0f4b85",
                }}
              />
              <Tab label="Albums" sx={{ color: "#0f4b85" }} />
              <Tab label="Songs" sx={{ color: "#0f4b85" }} />
              <Tab label="Playlists" sx={{ color: "#0f4b85" }} />
            </Tabs>
          </Box>
          {tabValue === 0 && <ArtistList />}
          {tabValue === 1 && <AlbumList />}
          {tabValue === 2 && <SongList />}
          {tabValue === 3 && <PlaylistList />}
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

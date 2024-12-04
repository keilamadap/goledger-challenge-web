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
import Layout from "./components/Layout";
import ArtistList from "./components/ArtistList";
import AlbumList from "./components/AlbumList";
import SongList from "./components/SongList";
import PlaylistList from "./components/PlaylistList";

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
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Artists" />
              <Tab label="Albums" />
              <Tab label="Songs" />
              <Tab label="Playlists" />
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

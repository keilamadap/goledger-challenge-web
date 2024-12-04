import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com", // Replace with your actual API base URL
});

export const fetchArtists = async () => {
  const response = await api.get("/artists");
  return response.data;
};

export const fetchAlbums = async () => {
  const response = await api.get("/albums");
  return response.data;
};

export const fetchSongs = async () => {
  const response = await api.get("/songs");
  return response.data;
};

export const fetchPlaylists = async () => {
  const response = await api.get("/playlists");
  return response.data;
};

export const addArtist = async (artist: { name: string }) => {
  const response = await api.post("/artists", artist);
  return response.data;
};

export const updateArtist = async (id: string, artist: { name: string }) => {
  const response = await api.put(`/artists/${id}`, artist);
  return response.data;
};

export const deleteArtist = async (id: string) => {
  await api.delete(`/artists/${id}`);
};

// Similar functions for albums, songs, and playlists...

export const addAlbum = async (album: { title: string; artistId: string }) => {
  const response = await api.post("/albums", album);
  return response.data;
};

export const updateAlbum = async (
  id: string,
  album: { title: string; artistId: string }
) => {
  const response = await api.put(`/albums/${id}`, album);
  return response.data;
};

export const deleteAlbum = async (id: string) => {
  await api.delete(`/albums/${id}`);
};

export const addSong = async (song: { title: string; albumId: string }) => {
  const response = await api.post("/songs", song);
  return response.data;
};

export const updateSong = async (
  id: string,
  song: { title: string; albumId: string }
) => {
  const response = await api.put(`/songs/${id}`, song);
  return response.data;
};

export const deleteSong = async (id: string) => {
  await api.delete(`/songs/${id}`);
};

export const addPlaylist = async (playlist: {
  name: string;
  songIds: string[];
}) => {
  const response = await api.post("/playlists", playlist);
  return response.data;
};

export const updatePlaylist = async (
  id: string,
  playlist: { name: string; songIds: string[] }
) => {
  const response = await api.put(`/playlists/${id}`, playlist);
  return response.data;
};

export const deletePlaylist = async (id: string) => {
  await api.delete(`/playlists/${id}`);
};

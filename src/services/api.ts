import axios from "axios";

export const api = axios.create({
  baseURL: "http://ec2-54-91-215-149.compute-1.amazonaws.com/api",
  headers: {
    Authorization: "Basic cHNBZG1pbjpnb2xlZGdlcg==",
    Accept: "application/json",
  },
});

export const fetchSchema = async () => {
  const response = await api.get("/query/getSchema");
  return response.data;
};

export const fetchSongs = async () => {
  const response = await api.post("query/search", {
    query: {
      selector: {
        "@assetType": "song",
      },
    },
  });
  return response.data.result;
};
export const fetchAlbums = async () => {
  const response = await api.post("query/search", {
    query: {
      selector: {
        "@assetType": "album",
      },
    },
  });
  return response.data.result;
};

export const updateAsset = async (assetId: string, assetData: any) => {
  const response = await api.put(`/invoke/updateAsset/${assetId}`, assetData);
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

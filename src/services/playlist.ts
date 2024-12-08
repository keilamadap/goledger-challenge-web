import {
  AddPlaylistParams,
  Playlist,
  UpdatePlaylistParams,
} from "../types/playlists";
import api from "./api";

export const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await api.post("/query/search", {
    query: {
      selector: {
        "@assetType": "playlist",
      },
    },
  });
  return response.data;
};

export const addNewPlaylist = async (
  playlistData: AddPlaylistParams
): Promise<unknown> => {
  const response = await api.post("/invoke/createAsset", {
    asset: [
      {
        "@assetType": "playlist",
        name: playlistData.name,
        songs: playlistData.selectedSongs,
        private: playlistData.isPrivate,
      },
    ],
  });
  return response.data;
};

export const updatePlaylist = async (
  playlistData: UpdatePlaylistParams
): Promise<unknown> => {
  const response = await api.put("/invoke/updateAsset", {
    update: {
      "@assetType": "playlist",
      "@key": playlistData.id,
      private: playlistData.private,
      songs: playlistData.songs,
    },
  });
  return response.data;
};

export const deletePlaylist = async (key: string): Promise<unknown> => {
  const response = await api.delete("/invoke/deleteAsset", {
    data: {
      key: {
        "@assetType": "playlist",
        "@key": key,
      },
    },
  });
  return response.data;
};

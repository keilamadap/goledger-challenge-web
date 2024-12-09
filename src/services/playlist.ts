import {
  AddPlaylistParams,
  Playlist,
  UpdatePlaylistParams,
} from "../types/playlists";
import api from "./api";

export const fetchPlaylists = async (): Promise<Playlist[]> => {
  const response = await api.post("/query/search", {
    query: {
      selector: {
        "@assetType": "playlist",
      },
    },
  });
  return response.data.result;
};

export const addNewPlaylist = async (
  playlistData: AddPlaylistParams
): Promise<unknown> => {
  const response = await api.post("/invoke/createAsset", {
    asset: [
      {
        "@assetType": "playlist",
        name: playlistData.name,
        songs: playlistData.songs,
        private: playlistData.private,
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
      "@key": playlistData["@key"],
      private: playlistData.private,
      name: playlistData.name,
      songs: playlistData.songs,
    },
  });
  return response.data;
};

export const removePlaylist = async (key: string): Promise<unknown> => {
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

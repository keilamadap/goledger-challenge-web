import { ApiResponse, CreateSongParams } from "../interfaces/songs";
import apiClient from "./api";

export const fetchSongs = async (): Promise<ApiResponse> => {
  const response = await apiClient.post("/query/search", {
    query: {
      selector: {
        "@assetType": "song",
      },
    },
  });
  return response.data;
};

export const addSong = async (payload: CreateSongParams): Promise<unknown> => {
  const { name, albumId } = payload;
  const { data } = await apiClient.post("/invoke/createAsset", {
    asset: [
      {
        "@assetType": "song",
        name,
        album: {
          "@key": albumId,
        },
      },
    ],
  });
  return data;
};

export const updateSong = async (
  payload: CreateSongParams
): Promise<unknown> => {
  const { name, albumId, id } = payload;
  const { data } = await apiClient.put("/invoke/updateAsset", {
    update: {
      "@assetType": "song",
      name,
      "@key": id,
      album: {
        "@assetType": "album",
        "@key": albumId,
      },
    },
  });
  return data;
};

export const removeSong = async (payload: {
  id: string;
  name: string;
  albumId: string;
}): Promise<unknown> => {
  const { data } = await apiClient.delete("/invoke/deleteAsset", {
    data: {
      key: {
        "@assetType": "song",
        id: payload.id,
        name: payload.name,
        album: { "@key": payload.albumId },
        cascade: true,
      },
    },
  });
  return data;
};

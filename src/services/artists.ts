import { Artist, AddArtistParams, UpdateArtistParams } from "../types/artists";
import api from "./api";

export const fetchArtists = async (): Promise<Artist[]> => {
  const response = await api.post("/query/search", {
    query: {
      selector: {
        "@assetType": "artist",
      },
    },
  });
  return response.data.result;
};

export const addNewArtist = async (
  artistData: AddArtistParams
): Promise<unknown> => {
  const response = await api.post("/invoke/createAsset", {
    asset: [
      {
        "@assetType": "artist",
        name: artistData.name,
        country: artistData.country,
      },
    ],
  });
  return response.data;
};

export const updateArtist = async (
  key: string,
  artistData: UpdateArtistParams
): Promise<unknown> => {
  const response = await api.put("/invoke/updateAsset", {
    update: {
      "@assetType": "artist",
      "@key": key,
      ...artistData,
    },
  });
  return response.data;
};

export const removeArtist = async (key: string): Promise<unknown> => {
  const response = await api.delete("/invoke/deleteAsset", {
    data: {
      key: {
        "@assetType": "artist",
        "@key": key,
        cascade: true,
      },
    },
  });
  return response.data;
};

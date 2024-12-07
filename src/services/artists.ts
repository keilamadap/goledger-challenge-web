import {
  Artist,
  CreateArtistData,
  UpdateArtistData,
} from "../interfaces/artists";
import apiClient from "./api";

export const fetchArtists = async (): Promise<Artist[]> => {
  const response = await apiClient.post("/query/search", {
    query: {
      selector: {
        "@assetType": "artist",
      },
    },
  });
  return response.data.result;
};

export const createArtist = async (
  artistData: CreateArtistData
): Promise<unknown> => {
  console.log("artistData", artistData);
  const response = await apiClient.post("/invoke/createAsset", {
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
  artistData: UpdateArtistData
): Promise<unknown> => {
  console.log("artistData", artistData, key);
  const response = await apiClient.put("/invoke/updateAsset", {
    update: {
      "@assetType": "artist",
      "@key": key,
      ...artistData,
    },
  });
  return response.data;
};

export const deleteArtist = async (key: string): Promise<unknown> => {
  const response = await apiClient.delete("/invoke/deleteAsset", {
    data: {
      key: {
        "@assetType": "artist",
        "@key": key,
      },
    },
  });
  return response.data;
};

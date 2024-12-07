import { Album, CreateAlbumData, UpdateAlbumData } from "../interfaces/album";
import apiClient from "./apiClient";

export const fetchAlbums = async (): Promise<Album[]> => {
  const response = await apiClient.post("/query/search", {
    query: {
      selector: {
        "@assetType": "album",
      },
    },
  });
  return response.data.result;
};

export const createAlbum = async (
  albumData: CreateAlbumData
): Promise<unknown> => {
  const { name, year, artistSelected } = albumData;
  const response = await apiClient.post("/invoke/createAsset", {
    asset: [
      {
        "@assetType": "album",
        name: name,
        artist: {
          "@key": artistSelected["@key"],
        },
        year: year,
      },
    ],
  });
  return response.data;
};

export const updateAlbum = async (
  albumData: UpdateAlbumData
): Promise<unknown> => {
  const response = await apiClient.put("/invoke/updateAsset", {
    update: {
      "@assetType": "album",
      "@key": albumData.id,
      year: albumData.year,

      ...albumData,
    },
  });
  console.log(" response.data", response.data);
  return response.data;
};

export const deleteAlbum = async (key: string): Promise<unknown> => {
  const response = await apiClient.delete("/invoke/deleteAsset", {
    data: {
      key: {
        "@assetType": "album",
        "@key": key,
      },
    },
  });
  return response.data;
};

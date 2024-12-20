import { Album, AddAlbumParams, UpdateAlbumParams } from "../types/album";
import api from "./api";

export const fetchAlbums = async (): Promise<Album[]> => {
  const response = await api.post("/query/search", {
    query: {
      selector: {
        "@assetType": "album",
      },
    },
  });
  return response.data.result;
};

export const addNewAlbum = async (
  albumData: AddAlbumParams
): Promise<unknown> => {
  const { name, year, artist } = albumData;
  const response = await api.post("/invoke/createAsset", {
    asset: [
      {
        "@assetType": "album",
        name: name,
        artist: {
          "@key": artist["@key"],
        },
        year: year,
      },
    ],
  });
  return response.data;
};

export const updateAlbum = async (
  albumData: UpdateAlbumParams
): Promise<unknown> => {
  const response = await api.put("/invoke/updateAsset", {
    update: {
      "@assetType": "album",
      year: albumData.year,
      ...albumData,
    },
  });
  return response.data;
};

export const removeAlbum = async (key: string): Promise<unknown> => {
  const response = await api.delete("/invoke/deleteAsset", {
    data: {
      key: {
        "@assetType": "album",
        "@key": key,
        cascade: true,
      },
    },
  });

  return response.data;
};

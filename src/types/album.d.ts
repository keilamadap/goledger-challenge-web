export type Album = {
  id: string;
  albumId: string;
  name: string;
  year: string;
  "@key": string;
  artist: {
    "@assetType": string;
    "@key": string;
  };
};

export type AddAlbumParams = {
  name: string;
  year: number;
  artist: {
    name: string;
    "@key": string;
  };
};

export type UpdateAlbumParams = {
  name: string;
  year?: number;
};

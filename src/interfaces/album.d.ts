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

export type artistSelectedType = {
  name: string;
  "@key": string;
};

export type CreateAlbumParams = {
  name: string;
  year: number;
  artist: artistSelectedType;
};

export type UpdateAlbumParams = {
  name: string;
  year?: number;
};

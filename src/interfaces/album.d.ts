export interface Album {
  id: string;
  albumId: string;
  name: string;
  year: string;
  "@key": string;
  artist: {
    "@assetType": string;
    "@key": string;
  };
}

export type artistSelectedType = {
  name: string;
  "@key": string;
};

export type CreateAlbumData = {
  name: string;
  year: number;
  artist: artistSelectedType;
};

export type UpdateAlbumData = {
  name: string;
  year?: number;
};

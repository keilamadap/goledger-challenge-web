export interface Album {
  id: string;
  albumId: string;
  name: string;
  year: string;
  "@key": string;
}

export type artistSelectedType = {
  name: string;
  "@key": string;
};

export type CreateAlbumData = {
  name: string;
  year: string;
  artistSelected: artistSelectedType;
};

export type UpdateAlbumData = {
  id: string;
  name: string;
  year?: string;
};

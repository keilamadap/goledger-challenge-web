export type Artist = {
  id: string;
  name: string;
  country: string;
  "@key": string;
};

export type CreateArtistData = {
  name: string;
  country: string;
};

export type UpdateArtistData = {
  name?: string;
  country?: string;
};

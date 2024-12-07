export type Artist = {
  id: string;
  name: string;
  country: string;
  "@key": string;
};

export type CreateArtistParams = {
  name: string;
  country: string;
};

export type UpdateArtistParams = {
  name?: string;
  country?: string;
};

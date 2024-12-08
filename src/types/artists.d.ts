export type Artist = {
  id: string;
  name: string;
  country: string;
  "@key": string;
};

export type AddArtistParams = {
  name: string;
  country: string;
};

export type UpdateArtistParams = {
  name?: string;
  country?: string;
};

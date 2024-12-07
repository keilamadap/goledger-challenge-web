export type Song = {
  id: string;
  name: string;
  album: { "@key": string };
  "@key": string;
};

export type ApiResponse = {
  metadata: null;
  result: Song[];
};

export type CreateSongParams = {
  id?: string;
  name: string;
  albumId: string;
  "@key"?: string;
};

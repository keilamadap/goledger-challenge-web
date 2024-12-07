export interface Song {
  id: string;
  name: string;
  album: { "@key": string };
  "@key": string;
}

export interface ApiResponse {
  metadata: null;
  result: Song[];
}

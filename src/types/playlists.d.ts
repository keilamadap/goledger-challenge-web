import { Song } from "./songs";

export type Playlist = {
  id: string;
  name: string;
  songs: Song[];
  private: boolean;
  "@key": string;
};

export type AddPlaylistParams = {
  name: string;
  "@key"?: string;
  private: boolean;
  songs?: {
    "@key": string;
  }[];
};

export type UpdatePlaylistParams = {
  private: boolean;
  "@key"?: string;
  name: string;
  songs: {
    "@key": string;
  }[];
};

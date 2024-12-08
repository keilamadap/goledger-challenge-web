export type Playlist = {
  id: string;
  name: string;
  songs: string[];
  isPrivate: boolean;
};

export type AddPlaylistParams = {
  name: string;
  isPrivate: boolean;
  selectedSongs?: {
    "@key": string;
  }[];
};

export type UpdatePlaylistParams = {
  id: string;
  private: boolean;
  songs: {
    "@key": string;
  }[];
};

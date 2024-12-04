import React, { createContext, useState, useContext } from "react";

interface Artist {
  id: string;
  name: string;
}

interface Album {
  id: string;
  title: string;
  artistId: string;
}

interface Song {
  id: string;
  title: string;
  albumId: string;
}

interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

interface AppContextType {
  artists: Artist[];
  albums: Album[];
  songs: Song[];
  playlists: Playlist[];
  addArtist: (artist: Omit<Artist, "id">) => void;
  addAlbum: (album: Omit<Album, "id">) => void;
  addSong: (song: Omit<Song, "id">) => void;
  addPlaylist: (playlist: Omit<Playlist, "id">) => void;
  updateArtist: (id: string, artist: Partial<Artist>) => void;
  updateAlbum: (id: string, album: Partial<Album>) => void;
  updateSong: (id: string, song: Partial<Song>) => void;
  updatePlaylist: (id: string, playlist: Partial<Playlist>) => void;
  removeArtist: (id: string) => void;
  removeAlbum: (id: string) => void;
  removeSong: (id: string) => void;
  removePlaylist: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const addArtist = (artist: Omit<Artist, "id">) => {
    setArtists([...artists, { ...artist, id: Date.now().toString() }]);
  };

  const addAlbum = (album: Omit<Album, "id">) => {
    setAlbums([...albums, { ...album, id: Date.now().toString() }]);
  };

  const addSong = (song: Omit<Song, "id">) => {
    setSongs([...songs, { ...song, id: Date.now().toString() }]);
  };

  const addPlaylist = (playlist: Omit<Playlist, "id">) => {
    setPlaylists([...playlists, { ...playlist, id: Date.now().toString() }]);
  };

  const updateArtist = (id: string, artist: Partial<Artist>) => {
    setArtists(artists.map((a) => (a.id === id ? { ...a, ...artist } : a)));
  };

  const updateAlbum = (id: string, album: Partial<Album>) => {
    setAlbums(albums.map((a) => (a.id === id ? { ...a, ...album } : a)));
  };

  const updateSong = (id: string, song: Partial<Song>) => {
    setSongs(songs.map((s) => (s.id === id ? { ...s, ...song } : s)));
  };

  const updatePlaylist = (id: string, playlist: Partial<Playlist>) => {
    setPlaylists(
      playlists.map((p) => (p.id === id ? { ...p, ...playlist } : p))
    );
  };

  const removeArtist = (id: string) => {
    setArtists(artists.filter((a) => a.id !== id));
  };

  const removeAlbum = (id: string) => {
    setAlbums(albums.filter((a) => a.id !== id));
  };

  const removeSong = (id: string) => {
    setSongs(songs.filter((s) => s.id !== id));
  };

  const removePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        artists,
        albums,
        songs,
        playlists,
        addArtist,
        addAlbum,
        addSong,
        addPlaylist,
        updateArtist,
        updateAlbum,
        updateSong,
        updatePlaylist,
        removeArtist,
        removeAlbum,
        removeSong,
        removePlaylist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

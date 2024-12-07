import React, { useCallback, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { addSong, fetchSongs, removeSong, updateSong } from "../services/songs";
import { fetchAlbums } from "../services/albums";
import { ApiResponse, Song } from "../interfaces/songs";
import { Album } from "../interfaces/album";

const SongList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState<string | null>("");
  const [editingId, setEditingId] = useState<string>("");

  const { data: songsList, refetch: refetchSongs } = useQuery<
    ApiResponse,
    unknown
  >("song", fetchSongs);

  const { data: albums = [] } = useQuery<Album[]>("album", fetchAlbums);

  const songs = songsList?.result;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setAlbumId("");
    setEditingId("");
  };

  const { mutate: mutateSong } = useMutation(updateSong, {
    onSuccess: (data) => {
      handleClose();
      refetchSongs();
    },
  });

  const { mutate: removeMutation } = useMutation(removeSong, {
    onSuccess: () => {
      refetchSongs();
    },
  });

  const handleSubmit = () => {
    if (title && albumId) {
      if (editingId) {
        mutateSong({
          albumId: editingId,
          id: editingId,
          name: title,
        });
      } else {
        addSong({ name: title, albumId: albumId });
        refetchSongs();
        handleClose();
      }

      setTitle("");
      setAlbumId(null);
    }
  };

  const handleEditSong = useCallback((song: Song) => {
    setTitle(song.name);
    setEditingId(song["@key"]);
    setAlbumId(song?.album["@key"]);
    setOpen(true);
  }, []);

  const handleRemoveSong = useCallback(
    (song: Song) => {
      removeMutation({
        id: song["@key"],
        name: song.name,
        albumId: song.album["@key"],
      });
    },
    [removeMutation]
  );

  const getAlbumName = (albumKey: string) => {
    const album = albums?.find((album: Album) => album["@key"] === albumKey);
    return album ? album.name : "Unknown Album";
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Songs
      </Typography>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Add Song
      </Button>
      {songs && songs.length === 0 ? (
        <Typography>No songs found. Add some songs to get started!</Typography>
      ) : (
        <List>
          {songs &&
            songs.map((song) => (
              <ListItem key={song.id} divider>
                <ListItemText
                  primary={song.name}
                  secondary={getAlbumName(song?.album["@key"])}
                />
                <Button
                  onClick={() => {
                    console.log("song", song);
                    handleEditSong(song);
                  }}
                >
                  Edit
                </Button>

                <Button onClick={() => handleRemoveSong(song)} color="error">
                  Delete
                </Button>
              </ListItem>
            ))}
        </List>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? "Edit Song" : "Add Song"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Song Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="album-label">Album</InputLabel>
            <Select
              label="Album"
              value={albumId || ""}
              onChange={(e) => setAlbumId(e.target.value as string)}
            >
              {albums &&
                albums?.map((album) => (
                  <MenuItem key={album["@key"]} value={album["@key"]}>
                    {album.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => handleSubmit()}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SongList;

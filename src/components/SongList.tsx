import React, { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
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
import { useQuery } from "react-query";
import { fetchAlbums, fetchSongs } from "../services/api";

const SongList: React.FC = () => {
  const { addSong, updateSong, removeSong } = useAppContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const {
    data: songs,
    isLoading,
    isError,
  } = useQuery("songs", () => fetchSongs());

  const { data: albums } = useQuery("albums", () => fetchAlbums());
  // console.log("albums:", albums);
  // console.log("songs:", songs);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setAlbumId("");
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateSong(editingId, { title, albumId });
    } else {
      addSong({ title, albumId });
    }
    handleClose();
  };

  const handleEdit = (song: {
    key: string;
    name: string;
    album: { key: string };
  }) => {
    setTitle(song.name);
    setEditingId(song.key);
    // @ts-ignore
    setAlbumId(song.album["@key"]);
    setOpen(true);
  };

  const getAlbumName = (albumKey: string): string => {
    const album = albums?.find(
      (album: { key: string; "@key"?: string }) => album["@key"] === albumKey
    );
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
            songs.map(
              (song: { key: string; name: string; album: { key: string } }) => (
                <ListItem key={song.key} divider>
                  <ListItemText
                    primary={song.name}
                    // @ts-ignore
                    secondary={getAlbumName(song.album["@key"])}
                  />
                  <Button onClick={() => handleEdit(song)}>Edit</Button>

                  <Button onClick={() => removeSong(song.key)} color="error">
                    Delete
                  </Button>
                </ListItem>
              )
            )}
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
            <InputLabel shrink id="album-label">
              Album
            </InputLabel>
            <Select
              label="Album"
              value={albumId || ""}
              onChange={(e) => setAlbumId(e.target.value as string)}
            >
              {albums &&
                albums?.map((album: { key: string; name: string }) => (
                  // @ts-ignore
                  <MenuItem key={album["@key"]} value={album["@key"]}>
                    {album.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SongList;

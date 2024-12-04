import React, { useState } from "react";
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

const SongList: React.FC = () => {
  const { songs, albums, addSong, updateSong, removeSong } = useAppContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleEdit = (song: { id: string; title: string; albumId: string }) => {
    setTitle(song.title);
    setAlbumId(song.albumId);
    setEditingId(song.id);
    setOpen(true);
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
              (song: { id: string; title: string; albumId: string }) => (
                <ListItem key={song.id} divider>
                  <ListItemText
                    primary={song.title}
                    secondary={
                      albums.find((a) => a.id === song.albumId)?.title ||
                      "Unknown Album"
                    }
                  />
                  <Button onClick={() => handleEdit(song)}>Edit</Button>
                  <Button onClick={() => removeSong(song.id)} color="error">
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
            <InputLabel>Album</InputLabel>
            <Select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value as string)}
            >
              {albums.map((album) => (
                <MenuItem key={album.id} value={album.id}>
                  {album.title}
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

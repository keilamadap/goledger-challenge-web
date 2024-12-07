import React, { useState } from "react";
// import { useAppContext } from "../contexts/AppContext";
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

const PlaylistList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setSelectedSongs([]);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (editingId) {
      // updatePlaylist(editingId, { name, songIds: selectedSongs });
    } else {
      // addPlaylist({ name, songIds: selectedSongs });
    }
    handleClose();
  };

  const handleEdit = (playlist: {
    id: string;
    name: string;
    songIds: string[];
  }) => {
    setName(playlist.name);
    setSelectedSongs(playlist.songIds);
    setEditingId(playlist.id);
    setOpen(true);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Playlists
      </Typography>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Add Playlist
      </Button>
      {/* {playlists && playlists.length === 0 ? (
        <Typography>
          No playlists found. Create a playlist to get started!
        </Typography>
      ) : (
        <List>
          {playlists &&
            playlists.map(
              (playlist: { id: string; name: string; songIds: string[] }) => (
                <ListItem key={playlist.id} divider>
                  <ListItemText
                    primary={playlist.name}
                    secondary={`${playlist.songIds.length} songs`}
                  />
                  <Button onClick={() => handleEdit(playlist)}>Edit</Button>
                  <Button
                    onClick={() => removePlaylist(playlist.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </ListItem>
              )
            )}
        </List>
      )} */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingId ? "Edit Playlist" : "Add Playlist"}
        </DialogTitle>
        {/* <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Songs</InputLabel>
            <Select
              multiple
              value={selectedSongs}
              onChange={(e) => setSelectedSongs(e.target.value as string[])}
              renderValue={(selected) => (
                <div>
                  {(selected as string[]).map((value) => (
                    <span key={value}>
                      {songs.find((s) => s.id === value)?.title},{" "}
                    </span>
                  ))}
                </div>
              )}
            >
              {songs.map((song) => (
                <MenuItem key={song.id} value={song.id}>
                  {song.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent> */}
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

export default PlaylistList;

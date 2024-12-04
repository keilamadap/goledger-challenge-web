import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
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
  CircularProgress,
} from "@mui/material";
import {
  fetchAlbums,
  fetchArtists,
  addAlbum,
  updateAlbum,
  deleteAlbum,
} from "../services/api";

const AlbumList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: albums, isLoading, isError } = useQuery("albums", fetchAlbums);
  const { data: artists } = useQuery("artists", fetchArtists);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const addMutation = useMutation(addAlbum, {
    onSuccess: () => {
      queryClient.invalidateQueries("albums");
    },
  });

  const updateMutation = useMutation(
    ({
      id,
      album,
    }: {
      id: string;
      album: { title: string; artistId: string };
    }) => updateAlbum(id, album),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("albums");
      },
    }
  );

  const deleteMutation = useMutation(deleteAlbum, {
    onSuccess: () => {
      queryClient.invalidateQueries("albums");
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setArtistId("");
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, album: { title, artistId } });
    } else {
      addMutation.mutate({ title, artistId });
    }
    handleClose();
  };

  const handleEdit = (album: {
    id: string;
    title: string;
    artistId: string;
  }) => {
    setTitle(album.title);
    setArtistId(album.artistId);
    setEditingId(album.id);
    setOpen(true);
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error loading albums</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Albums
      </Typography>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Add Album
      </Button>
      {albums && albums.length === 0 ? (
        <Typography>
          No albums found. Add some albums to get started!
        </Typography>
      ) : (
        <List>
          {albums &&
            albums.map(
              (album: { id: string; title: string; artistId: string }) => (
                <ListItem key={album.id} divider>
                  <ListItemText
                    primary={album.title}
                    secondary={
                      artists?.find(
                        (a: { id: string }) => a.id === album.artistId
                      )?.name || "Unknown Artist"
                    }
                  />
                  <Button onClick={() => handleEdit(album)}>Edit</Button>
                  <Button
                    onClick={() => deleteMutation.mutate(album.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </ListItem>
              )
            )}
        </List>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? "Edit Album" : "Add Album"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Album Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Artist</InputLabel>
            <Select
              value={artistId}
              onChange={(e) => setArtistId(e.target.value as string)}
            >
              {artists &&
                artists.map((artist: { id: string; name: string }) => (
                  <MenuItem key={artist.id} value={artist.id}>
                    {artist.name}
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

export default AlbumList;

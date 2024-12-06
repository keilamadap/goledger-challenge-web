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
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  fetchSchema,
  addArtist,
  updateArtist,
  deleteArtist,
} from "../services/api";

const ArtistList: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    data: artists,
    isLoading,
    isError,
  } = useQuery("artists", fetchSchema);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const addMutation = useMutation(addArtist, {
    onSuccess: () => {
      queryClient.invalidateQueries("artists");
    },
  });

  const updateMutation = useMutation(
    ({ id, artist }: { id: string; artist: { name: string } }) =>
      updateArtist(id, artist),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("artists");
      },
    }
  );

  const deleteMutation = useMutation(deleteArtist, {
    onSuccess: () => {
      queryClient.invalidateQueries("artists");
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, artist: { name } });
    } else {
      addMutation.mutate({ name });
    }
    handleClose();
  };

  const handleEdit = (artist: { id: string; name: string }) => {
    setName(artist.name);
    setEditingId(artist.id);
    setOpen(true);
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error loading artists</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Artists
      </Typography>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Add Artist
      </Button>
      {artists && artists.length === 0 ? (
        <Typography>
          No artists found. Add some artists to get started!
        </Typography>
      ) : (
        <List>
          {artists &&
            artists.map((artist: { id: string; name: string }) => (
              <ListItem key={artist.id} divider>
                <ListItemText primary={artist.name} />
                <Button onClick={() => handleEdit(artist)}>Edit</Button>
                <Button
                  onClick={() => deleteMutation.mutate(artist.id)}
                  color="error"
                >
                  Delete
                </Button>
              </ListItem>
            ))}
        </List>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? "Edit Artist" : "Add Artist"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Artist Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

export default ArtistList;

import React, { useEffect, useState, useCallback } from "react";
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
  Box,
  CircularProgress,
  Backdrop,
  FormHelperText,
} from "@mui/material";
import {
  addSong,
  fetchSongs,
  removeSong,
  updateSong,
} from "../../services/songs";
import { fetchAlbums } from "../../services/albums";
import { ApiResponse, Song } from "../../interfaces/songs";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { Album } from "../../interfaces/album";
import Snackbar from "../Snackbar/Snackbar";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { yupResolver } from "@hookform/resolvers/yup";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

const validationSchema = yup.object({
  title: yup.string().required("Song title is required"),
  albumId: yup.string().required("Please select an album"),
});

const SongList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [isLoading, setIsLoading] = useState(false);
  const [songToRemove, setSongToRemove] = useState<Song | null>(null);

  const {
    control,
    handleSubmit: formSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { title: "", albumId: "" },
  });

  const handleSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setIsSnackbarOpen(true);
    setSnackbarSeverity(severity);
  };

  const handleOpenConfirmDialog = (song: Song) => {
    setSongToRemove(song);
    setIsDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsDialogOpen(false);
    setSongToRemove(null);
  };

  const handleCloseAddSongModal = () => {
    setOpen(false);
    setEditingId("");
    reset();
  };

  const handleSubmit = async (data: { title: string; albumId: string }) => {
    setIsLoading(true);
    try {
      if (editingId) {
        await updateSong({
          id: editingId,
          name: data.title,
          albumId: data.albumId,
        });
        handleSnackbar("Song updated successfully", "success");
      } else {
        await addSong({ name: data.title, albumId: data.albumId });
        handleSnackbar("Song added successfully", "success");
      }
      const updatedSongs: ApiResponse = await fetchSongs();
      setSongs(updatedSongs.result);
      const updatedAlbums = await fetchAlbums();
      setAlbums(updatedAlbums);
      handleCloseAddSongModal();
    } catch (error) {
      handleSnackbar("Error saving the song", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSong = useCallback(
    (song: Song) => {
      setEditingId(song["@key"]);
      setValue("title", song.name);
      setValue("albumId", song.album["@key"]);
      setOpen(true);
    },
    [setValue]
  );

  const handleRemoveSong = useCallback(async () => {
    if (!songToRemove) return;
    setIsLoading(true);
    try {
      await removeSong({
        id: songToRemove["@key"],
        name: songToRemove.name,
        albumId: songToRemove.album["@key"],
      });
      const updatedSongs: ApiResponse = await fetchSongs();
      setSongs(updatedSongs.result);
      handleSnackbar("Song removed successfully", "success");
    } catch (error) {
      handleSnackbar("Error removing the song", "error");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setSongToRemove(null);
    }
  }, [songToRemove]);

  const getAlbumName = (albumKey: string) => {
    const album = albums.find((album: Album) => album["@key"] === albumKey);
    return album ? album.name : "Unknown Album";
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const songsData: ApiResponse = await fetchSongs();
        setSongs(songsData.result);

        const albumsData: Album[] = await fetchAlbums();
        setAlbums(albumsData);
      } catch (error) {
        handleSnackbar("Error fetching songs", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Backdrop open={isLoading} style={{ zIndex: 1600 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Songs
        </Typography>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
        >
          Add song
        </Button>
      </Box>
      {!isLoading && songs.length === 0 ? (
        <Typography>No songs found. Add some songs to get started!</Typography>
      ) : (
        <List>
          {songs.map((song) => (
            <ListItem key={song.id} divider>
              <ListItemText
                primary={song.name}
                secondary={getAlbumName(song?.album["@key"])}
              />
              <Button onClick={() => handleEditSong(song)}>
                <CreateIcon />
              </Button>
              <Button
                onClick={() => handleOpenConfirmDialog(song)}
                color="error"
              >
                <DeleteOutlineIcon />
              </Button>
            </ListItem>
          ))}
        </List>
      )}
      <Dialog open={open} onClose={handleCloseAddSongModal}>
        <DialogTitle>{editingId ? "Edit song" : "Add song"}</DialogTitle>
        <DialogContent>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Song title"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />

          <Controller
            name="albumId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense" error={!!errors.albumId}>
                <InputLabel>Album</InputLabel>
                <Select {...field} label="Album" error={!!errors.albumId}>
                  {albums.map((album) => (
                    <MenuItem key={album["@key"]} value={album["@key"]}>
                      {album.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.albumId && (
                  <FormHelperText>{errors.albumId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddSongModal}>Cancel</Button>
          <Button
            onClick={formSubmit(handleSubmit)}
            variant="contained"
            color="secondary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        severity={snackbarSeverity}
        isOpen={isSnackbarOpen}
        setIsOpen={setIsSnackbarOpen}
        message={snackbarMessage}
      />

      <ConfirmDialog
        open={isDialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleRemoveSong}
        title="Attention"
        message={`Are you sure you want to delete the song "${songToRemove?.name}"?`}
      />
    </>
  );
};

export default SongList;

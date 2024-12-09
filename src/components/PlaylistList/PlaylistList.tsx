import React, { useCallback, useEffect, useState } from "react";
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
  Backdrop,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Box,
  Switch,
} from "@mui/material";
import * as yup from "yup";
import {
  addNewPlaylist,
  fetchPlaylists,
  removePlaylist,
  updatePlaylist,
} from "../../services/playlist";
import { Playlist } from "../../types/playlists";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApiResponse, Song } from "../../types/songs";
import { fetchSongs } from "../../services/songs";
import SimpleSnackbar from "../Snackbar/Snackbar";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import HttpsIcon from "@mui/icons-material/Https";

const validationSchema = yup.object({
  playlist: yup.string().required("Please inform a playlist name"),
  songs: yup
    .array()
    .of(yup.string().required("Each song must be a valid string"))
    .min(1, "Please select at least one song")
    .required("Please select a song"),
  private: yup.boolean(),
});

const PlaylistList: React.FC = () => {
  const [openAddPlaylistModal, setOpenAddPlaylistModal] = useState(false);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [playlistToRemove, setPlaylistToRemove] = useState<Playlist | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    control,
    handleSubmit: formSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { playlist: "", songs: [], private: false },
  });

  const handleCloseAddPlaylistModal = () => {
    setOpenAddPlaylistModal(false);
    setEditingId(null);
    reset();
  };

  const handleSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setIsSnackbarOpen(true);
    setSnackbarSeverity(severity);
  };

  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      const playlistData: Playlist[] = await fetchPlaylists();
      setPlaylists(playlistData);
      const songsData: ApiResponse = await fetchSongs();
      setAllSongs(songsData.result);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const formattedSongs = data.songs.map((songKey: string) => {
        const songDetails = allSongs.find((song) => song["@key"] === songKey);
        return {
          "@assetType": "song",
          "@key": songKey,
          name: songDetails?.name || "Unknown",
          album: {
            "@assetType": "album",
            "@key": songDetails?.album["@key"] || "",
          },
        };
      });

      const payload = {
        "@assetType": "playlist",
        "@key": editingId || undefined,
        name: data.playlist,
        private: data.private,
        songs: formattedSongs,
      };

      if (editingId) {
        await updatePlaylist(payload);
        handleSnackbar("Playlist updated successfully", "success");
      } else {
        await addNewPlaylist(payload);
        handleSnackbar("Playlist created successfully", "success");
      }

      const updatedPlaylists = await fetchPlaylists();
      setPlaylists(updatedPlaylists);
      handleCloseAddPlaylistModal();
    } catch (error) {
      console.error("Error saving the playlist:", error);
      handleSnackbar("Error saving the playlist", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (playlist: Playlist) => {
    setValue("playlist", playlist.name);
    setValue(
      "songs",
      playlist.songs.map((song) => song["@key"])
    );
    setValue("private", playlist.private);
    setEditingId(playlist["@key"]);
    setOpenAddPlaylistModal(true);
  };

  const handleOpenConfirmDialog = (playlist: Playlist) => {
    setPlaylistToRemove(playlist);
    setIsDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsDialogOpen(false);
    setPlaylistToRemove(null);
  };

  const handleRemovePlaylist = useCallback(async () => {
    if (!playlistToRemove) return;
    setIsLoading(true);
    try {
      await removePlaylist(playlistToRemove["@key"]);
      const updatedPlaylists: Playlist[] = await fetchPlaylists();
      setPlaylists(updatedPlaylists);
      handleSnackbar("Song removed successfully", "success");
    } catch (error) {
      handleSnackbar("Error removing the song", "error");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setPlaylistToRemove(null);
    }
  }, [playlistToRemove]);

  const filteredPlaylists = playlists?.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getData();
  }, [getData]);

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
          Playlists
        </Typography>
        <Button
          onClick={() => setOpenAddPlaylistModal(true)}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Add playlist
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        label="Search playlists"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      {filteredPlaylists && filteredPlaylists.length === 0 ? (
        <Typography>
          {searchTerm
            ? "No playlists found matching your search."
            : "No playlists found. Create a playlist to get started!"}
        </Typography>
      ) : (
        <List>
          {filteredPlaylists?.map((playlist) => (
            <ListItem key={playlist["@key"]} divider>
              <ListItemText
                primary={
                  <>
                    {playlist.name}
                    {playlist.private && (
                      <HttpsIcon sx={{ width: "30px" }} />
                    )}{" "}
                  </>
                }
                secondary={
                  playlist.songs?.length > 0
                    ? playlist.songs
                        .map(
                          (song) =>
                            allSongs.find((s) => s["@key"] === song["@key"])
                              ?.name || "Unknown"
                        )
                        .join(", ")
                    : "No songs"
                }
              />
              <Button onClick={() => handleEdit(playlist)}>
                <CreateIcon />
              </Button>
              <Button
                onClick={() => handleOpenConfirmDialog(playlist)}
                color="error"
              >
                <DeleteOutlineIcon />
              </Button>
            </ListItem>
          ))}
        </List>
      )}
      <Dialog
        open={openAddPlaylistModal}
        onClose={handleCloseAddPlaylistModal}
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Edit playlist" : "Add playlist"}
        </DialogTitle>
        <DialogContent>
          <Controller
            name="playlist"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Playlist name"
                fullWidth
                error={!!errors.playlist}
                helperText={errors.playlist?.message}
              />
            )}
          />
          <Controller
            name="private"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Private playlist"
              />
            )}
          />
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              mt: 1,
              fontWeight: 600,
            }}
          >
            Select songs:
          </Typography>
          <Controller
            name="songs"
            control={control}
            render={({ field }) => (
              <FormGroup>
                {allSongs.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 2 }}
                  >
                    No songs available
                  </Typography>
                ) : (
                  allSongs.map((song) => (
                    <FormControlLabel
                      key={song["@key"]}
                      control={
                        <Checkbox
                          checked={field.value.includes(song["@key"])}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, song["@key"]]
                              : field.value.filter(
                                  (id: string) => id !== song["@key"]
                                );
                            field.onChange(newValue);
                          }}
                        />
                      }
                      label={song.name}
                    />
                  ))
                )}
              </FormGroup>
            )}
          />

          {errors.songs && (
            <FormHelperText error>{errors.songs.message}</FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddPlaylistModal}>Cancel</Button>
          <Button
            onClick={formSubmit(handleSubmit)}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <SimpleSnackbar
        severity={snackbarSeverity}
        isOpen={isSnackbarOpen}
        setIsOpen={setIsSnackbarOpen}
        message={snackbarMessage}
      />
      <ConfirmDialog
        open={isDialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleRemovePlaylist}
        title="Attention"
        message={`Are you sure you want to delete the playlist "${playlistToRemove?.name}"?`}
      />
    </>
  );
};

export default PlaylistList;

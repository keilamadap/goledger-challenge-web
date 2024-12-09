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
  CircularProgress,
  Backdrop,
  Box,
} from "@mui/material";
import * as yup from "yup";
import {
  addNewArtist,
  fetchArtists,
  removeArtist,
  updateArtist,
} from "../../services/artists";
import { Artist } from "../../types/artists";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SimpleSnackbar from "../Snackbar/Snackbar";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

const validationSchema = yup.object({
  artist: yup.string().required("Please inform an artist"),
  country: yup.string().required("Please inform a country"),
});

const ArtistList: React.FC = () => {
  const [openAddArtistModal, setOpenAddArtistModal] = useState(false);
  const [artistToRemove, setArtistToRemove] = useState<Artist | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [artists, setArtists] = useState<Artist[]>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const {
    control,
    handleSubmit: formSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { artist: "", country: "" },
  });

  const handleCloseAddArtistModal = () => {
    setOpenAddArtistModal(false);
    setEditingId(null);
    reset();
  };

  const handleSnackbar = useCallback(
    (message: string, severity: "success" | "error") => {
      setSnackbarMessage(message);
      setIsSnackbarOpen(true);
      setSnackbarSeverity(severity);
    },
    []
  );

  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      const artistsData: Artist[] = await fetchArtists();
      setArtists(artistsData);
    } catch (error) {
      handleSnackbar("Error fetching data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [handleSnackbar]);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const selectedArtist = artists?.find(
        (artist) => artist["@key"] === editingId
      );

      const artistData = {
        "@assetType": "artist",
        "@key": editingId || "",
        name: values.artist || "",
        country: values.country || selectedArtist?.country,
      };

      if (editingId) {
        await updateArtist(editingId, artistData);
      } else {
        await addNewArtist(artistData);
      }

      handleCloseAddArtistModal();
      handleSnackbar("Artist saved successfully", "success");

      await getData();
    } catch (error) {
      handleSnackbar("Error saving the artist", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditArtist = (artist: Artist) => {
    setValue("artist", artist.name);
    setValue("country", artist.country);
    setEditingId(artist["@key"]);
    setOpenAddArtistModal(true);
  };

  const handleRemoveArtist = useCallback(async () => {
    if (!artistToRemove) return;
    setIsLoading(true);
    try {
      await removeArtist(artistToRemove["@key"]);
      const updatedSongs = await fetchArtists();
      setArtists(updatedSongs);
      handleSnackbar("Artist removed successfully", "success");
    } catch (error) {
      handleSnackbar("Error removing the artist", "error");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setArtistToRemove(null);
    }
  }, [artistToRemove, handleSnackbar]);

  const handleOpenConfirmDialog = (artist: Artist) => {
    setArtistToRemove(artist);
    setIsDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsDialogOpen(false);
    setArtistToRemove(null);
  };

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
          Artists
        </Typography>

        <Button
          onClick={() => setOpenAddArtistModal(true)}
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
        >
          Add Artist
        </Button>
      </Box>
      {!isLoading && artists?.length === 0 ? (
        <Typography>
          No artists found. Add some artists to get started!
        </Typography>
      ) : (
        <List>
          {artists &&
            artists.map((artist: Artist) => (
              <ListItem key={artist["@key"]} divider>
                <ListItemText primary={artist.name} />
                <Button onClick={() => handleEditArtist(artist)}>
                  {" "}
                  <CreateIcon />
                </Button>
                <Button
                  onClick={() => handleOpenConfirmDialog(artist)}
                  color="error"
                >
                  <DeleteOutlineIcon />
                </Button>
              </ListItem>
            ))}
        </List>
      )}
      <Dialog open={openAddArtistModal} onClose={handleCloseAddArtistModal}>
        <DialogTitle>{editingId ? "Edit artist" : "Add artist"}</DialogTitle>
        <DialogContent>
          <Controller
            name="artist"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                name="artist"
                label="Artist name"
                fullWidth
                error={!!errors.artist}
                helperText={errors.artist?.message}
              />
            )}
          />
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                name="country"
                label="Country"
                fullWidth
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddArtistModal}>Cancel</Button>
          <Button
            onClick={formSubmit(handleSubmit)}
            variant="contained"
            color="secondary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={isDialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleRemoveArtist}
        title="Attention"
        message={`Are you sure you want to delete the artist "${artistToRemove?.name}"?`}
      />

      <SimpleSnackbar
        severity={snackbarSeverity}
        isOpen={isSnackbarOpen}
        setIsOpen={setIsSnackbarOpen}
        message={snackbarMessage}
      />
    </>
  );
};

export default ArtistList;

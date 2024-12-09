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
  Pagination,
  InputAdornment,
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
import { Controller, FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SimpleSnackbar from "../Snackbar/Snackbar";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import SearchIcon from "@mui/icons-material/Search";

const itemsPerPage = 5;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

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

  const handleSubmit = async (values: FieldValues) => {
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

  const filteredArtists = artists?.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil((filteredArtists?.length || 0) / itemsPerPage);

  const paginatedItems = filteredArtists?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(Math.max(totalPages, 1));
    }
  }, [filteredArtists?.length, totalPages, page]);

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
          color="primary"
          sx={{ mb: 2 }}
        >
          Add artist
        </Button>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        label="Search"
        placeholder="Type for artist name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, mt: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      {!isLoading && paginatedItems?.length === 0 ? (
        <Typography>
          {searchTerm
            ? "No artists found matching your search."
            : "No artists found. Create a playlist to get started!"}
        </Typography>
      ) : (
        <List>
          {paginatedItems &&
            paginatedItems.map((artist: Artist) => (
              <ListItem key={artist["@key"]} divider>
                <ListItemText
                  primary={artist.name}
                  secondary={artist.country}
                />
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
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Pagination count={totalPages} page={page} onChange={handleChangePage} />

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

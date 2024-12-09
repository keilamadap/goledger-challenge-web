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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
  FormHelperText,
  Backdrop,
  Box,
  Pagination,
  InputAdornment,
} from "@mui/material";
import * as yup from "yup";
import { fetchAlbums } from "../../services/albums";
import { fetchArtists } from "../../services/artists";
import { Album } from "../../types/album";
import { Artist } from "../../types/artists";
import SimpleSnackbar from "../Snackbar/Snackbar";
import { Controller, FieldValues, useForm } from "react-hook-form";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { yupResolver } from "@hookform/resolvers/yup";
import { addNewAlbum, removeAlbum, updateAlbum } from "../../services/albums";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import SearchIcon from "@mui/icons-material/Search";

const itemsPerPage = 5;

const validationSchema = yup.object({
  album: yup.string().required("Album title is required"),
  artist: yup.string().required("Please select an artist"),
});

const AlbumList: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openNewAlbumModal, setOpenNewAlbumModal] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [isLoading, setIsLoading] = useState(false);
  const [albumToRemove, setAlbumToRemove] = useState<Album | null>(null);
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
    defaultValues: { album: "", artist: "" },
  });

  const handleCloseAddAlbumModal = () => {
    setOpenNewAlbumModal(false);
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
      const albumsData: Album[] = await fetchAlbums();
      setAlbums(albumsData);
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
      const selectedArtist = artists.find(
        (artist) => artist["@key"] === values.artist
      );

      const albumData = {
        "@assetType": "album",
        "@key": editingId || "",
        name: values.album,
        year: new Date().getFullYear(),
        artist: {
          "@assetType": "artist",
          "@key": values.artist || "",
          name: selectedArtist?.name || "",
          country: selectedArtist?.country || "",
        },
      };

      if (editingId) {
        await updateAlbum(albumData);
      } else {
        await addNewAlbum(albumData);
      }

      handleCloseAddAlbumModal();
      handleSnackbar("Album saved successfully", "success");

      await getData();
    } catch (error) {
      handleSnackbar("Error saving the album", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAlbum = useCallback(
    (album: Album) => {
      setEditingId(album["@key"]);
      setValue("album", album.name);
      setValue("artist", album.artist["@key"]);
      setOpenNewAlbumModal(true);
    },
    [setValue]
  );

  const getArtistName = (artistKey: string) => {
    const artist = artists.find(
      (artist: Artist) => artist["@key"] === artistKey
    );
    return artist ? artist.name : "Unkown artist";
  };

  const handleRemoveAlbum = useCallback(async () => {
    if (!albumToRemove) return;
    setIsLoading(true);
    try {
      await removeAlbum(albumToRemove["@key"]);
      const updatedSongs = await fetchAlbums();
      setAlbums(updatedSongs);
      handleSnackbar("Album removed successfully", "success");
    } catch (error) {
      handleSnackbar("Error removing the album", "error");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setAlbumToRemove(null);
    }
  }, [albumToRemove, handleSnackbar]);

  const handleOpenConfirmDialog = (album: Album) => {
    setAlbumToRemove(album);
    setIsDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsDialogOpen(false);
    setAlbumToRemove(null);
  };

  const filteredAlbums = albums?.filter((album) =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil((filteredAlbums?.length || 0) / itemsPerPage);

  const paginatedItems = filteredAlbums?.slice(
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
  }, [filteredAlbums?.length, totalPages, page]);

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
          Albums
        </Typography>
        <Button
          onClick={() => setOpenNewAlbumModal(true)}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Add album
        </Button>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        label="Search"
        placeholder="Search albums..."
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
      {!isLoading && paginatedItems.length === 0 ? (
        <Typography>
          {searchTerm
            ? "No albums found matching your search."
            : "No albums found. Create a playlist to get started!"}
        </Typography>
      ) : (
        <List>
          {paginatedItems &&
            paginatedItems.map((album: Album) => (
              <ListItem key={album["@key"]} divider>
                <ListItemText
                  primary={album.name}
                  secondary={getArtistName(album.artist["@key"])}
                />
                <Button onClick={() => handleEditAlbum(album)}>
                  <CreateIcon />
                </Button>
                <Button
                  onClick={() => handleOpenConfirmDialog(album)}
                  color="error"
                >
                  <DeleteOutlineIcon />
                </Button>
              </ListItem>
            ))}
        </List>
      )}

      <Dialog open={openNewAlbumModal} onClose={handleCloseAddAlbumModal}>
        <DialogTitle>{editingId ? "Edit album" : "Add album"}</DialogTitle>
        <DialogContent>
          <Controller
            name="album"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Album title"
                fullWidth
                error={!!errors.album}
                helperText={errors.album?.message}
              />
            )}
          />
          <Controller
            name="artist"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense" error={!!errors.artist}>
                <InputLabel>Artist</InputLabel>
                <Select {...field} label="Artist">
                  {artists.map((artist) => (
                    <MenuItem key={artist["@key"]} value={artist["@key"]}>
                      {artist.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.artist && (
                  <FormHelperText>{errors.artist.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddAlbumModal}>Cancel</Button>
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
        onConfirm={handleRemoveAlbum}
        title="Attention"
        message={`Are you sure you want to delete the album "${albumToRemove?.name}"?`}
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

export default AlbumList;

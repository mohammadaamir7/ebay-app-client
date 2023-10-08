import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./ItemEditOptions.css";
import { Link, useParams } from "react-router-dom";
import {
  getListingDetail,
  updateField,
  updateItem,
  updateListing,
} from "../../features/panelItemSlice";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import ConfirmationModal from "../modals/ConfirmationModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const ListingEditOptions = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { status, data, error } = useSelector((state) => state.panelItem);
  const [fixedPrice, setFixedPrice] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(null);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const getData = async () => {
    const listingData = await dispatch(getListingDetail({ id }));
    if (listingData?.payload?.item) {
      setFixedPrice(listingData?.payload?.item?.fixedPrice);
    }
  };

  const notifyError = () =>
    toast.error("Error in Updating Item", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifySuccess = () =>
    toast.error("Item Updated Successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  useEffect(() => {
    if (status === null || status === "succeeded") {
      getData();
    }
  }, []);

  useEffect(() => {
    console.log("updated", status, data, error);
  }, [status, data, error]);

  if (!status) return <h3>Item not found!</h3>;
  else if (status === "loading") return <h3>Loading...</h3>;
  else if (status === "failed") notifyError();

  const changeInput = (e, key) => {
    e.preventDefault();
    dispatch(updateField({ key, val: e.target.value }));
  };

  const saving = (e) => {
    e.preventDefault();
    dispatch(updateListing({ id, data: { ...data, fixedPrice } }));
    handleClose();
    notifySuccess();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
    // setSelectedItem([id]);
    handleOpen();
  };

  return (
    <>
      <h4 className="title-head">Listing Info{``}</h4>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid md={4}>
          <h4>Details</h4>
          <p className="description-para">Title, SKU and synce status.</p>
        </Grid>
        <Grid md={8} sx={{ mb: 3 }}>
          <div className="card shadow mb-3">
            <ConfirmationModal
              title={"Are you sure you want to save this information?"}
              open={openModal}
              handleClose={handleClose}
              handleSubmit={saving}
            />
            <ThemeProvider theme={defaultTheme}>
              <Container component="main">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mb: 3 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="title"
                          label="ebay title"
                          type="title"
                          id="title"
                          autoComplete="Title"
                          value={data.title}
                          onChange={(e) => changeInput(e, "title")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          autoComplete="SKU"
                          name="sku"
                          fullWidth
                          id="sku"
                          label="SKU"
                          value={data.sku}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          autoComplete="Synced"
                          name="synced"
                          required
                          fullWidth
                          id="synced"
                          label="Synced"
                          value={data.synced}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid md={4}>
          <h4>Pricing</h4>
          <p className="description-para">
            Start Price and its calculation formula.
          </p>
        </Grid>
        <Grid md={8} sx={{ mb: 3 }}>
          <div className="card shadow mb-3">
            <ThemeProvider theme={defaultTheme}>
              <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mb: 3 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="startPrice"
                          label="Start Price"
                          id="startPrice"
                          autoComplete="startPrice"
                          value={data.startPrice}
                          onChange={(e) => changeInput(e, "startPrice")}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          name="previousPrice"
                          label="Previous Price"
                          id="previousPrice"
                          autoComplete="previousPrice"
                          value={data.previousCost}
                        />
                      </Grid>
                      {/* <p style={{fontSize: "8px"}}>Fixed Price</p> */}
                      <Switch
                        checked={fixedPrice}
                        onChange={(e) => setFixedPrice(e.target.checked)}
                        sx={{ mt: 3, ml: 3 }}
                      />
                      <Divider variant="middle" sx={{ mt: 3 }} />
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="priceFormula"
                          label="Price Formula"
                          name="priceFormula"
                          autoComplete="priceFormula"
                          value={`(cost + shipping) * markUp`}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="cost"
                          label="Cost"
                          id="cost"
                          autoComplete="cost"
                          value={`cost: ${data.cost}`}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="shipping"
                          label="Shipping"
                          id="shipping"
                          autoComplete="shipping"
                          value={`shipping: ${data.shippingCost}`}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="handlingCost"
                          label="Handling Cost"
                          id="handlingCost"
                          autoComplete="handlingCost"
                          value={`handlingCost: ${data.handlingCost}`}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid md={4}>
          <h4>Quantity</h4>
          <p className="description-para">
            Previous, Available and sold Quantity.
          </p>
        </Grid>
        <Grid md={8}>
          <div className="card shadow">
            <ThemeProvider theme={defaultTheme}>
              <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mb: 3 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="previousQuantity"
                          label="Previous Quantity"
                          id="previousQuantity"
                          autoComplete="previousQuantity"
                          value={data.previousQuantity}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="availableQuantity"
                          label="Available Quantity"
                          id="availableQuantity"
                          autoComplete="availableQuantity"
                          value={data.quantity}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="soldQuantity"
                          label="Sold Quantity"
                          name="soldQuantity"
                          autoComplete="soldQuantity"
                          value={data.soldQuantity}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 3 }}
                  onClick={(e) => handleOpenMenu(e, id)}
                >
                  Save
                </Button>
              </Container>
            </ThemeProvider>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default ListingEditOptions;

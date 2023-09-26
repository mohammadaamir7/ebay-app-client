import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./ItemEditOptions.css";
import { Link, useParams } from "react-router-dom";
import {
  getListingDetail,
  getStoreInfo,
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
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';

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

const StoreEditOptions = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { status, data, error } = useSelector((state) => state.panelItem);

  useEffect(() => {
    if (status === null || status === "succeeded") {
      dispatch(getStoreInfo({ id }));
    }
  }, []);

  useEffect(() => {
    console.log("updated", status, data, error);
  }, [status, data, error]);

  if (!status) return <h3>Item not found!</h3>;
  else if (status === "loading") return <h3>Loading...</h3>;
  else if (status === "failed") return <h3>Response error...</h3>;

  const changeInput = (e, key) => {
    e.preventDefault();
    dispatch(updateField({ key, val: e.target.value }));
  };

  const saving = (e) => {
    e.preventDefault();
    dispatch(updateListing({ id, data }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <>
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
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="oem"
                      label="OEM"
                      name="oem"
                      autoComplete="OEM"
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
                      autoFocus
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>

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
                      name="previousPrice"
                      label="Previous Price"
                      id="previousPrice"
                      autoComplete="previousPrice"
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
                      value={data.startPrice}
                      onChange={(e) => changeInput(e, "startPrice")}
                    />
                  </Grid>
                  {/* <p style={{fontSize: "8px"}}>Fixed Price</p> */}
                  <Switch sx={{ mt: 3, ml: 3}} />
                  <Divider variant="middle" sx={{ mt: 3}} />
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="priceFormula"
                      label="Price Formula"
                      name="priceFormula"
                      autoComplete="priceFormula"
                      value={`(cost + shipping + handlingCost) * markUp`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="cost"
                      label="Cost"
                      id="cost"
                      autoComplete="cost"
                      value={`cost: ${data.startPrice}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="shipping"
                      label="Shipping"
                      id="shipping"
                      autoComplete="shipping"
                      value={`shipping: ${data.startPrice}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="handlingCost"
                      label="Handling Cost"
                      id="handlingCost"
                      autoComplete="handlingCost"
                      value={`handlingCost: ${data.startPrice}`}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>

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
                      value={data.quantity}
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
                      value={data.quantity}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
};

export default StoreEditOptions;

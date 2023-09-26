import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./ItemEditOptions.css";
import { Link, useParams } from "react-router-dom";
import {
  addNewListings,
  getListingDetail,
  getSupplierInfo,
  updateField,
  updateItem,
  updateListing,
} from "../../features/panelItemSlice";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Input from '@mui/material/Input';
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
import { getNewListings, getStores } from "../../features/panelSlice";
import * as XLSX from 'xlsx';
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  FormControl
} from "@mui/material";

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

const SupplierInfoOptions = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [listingsToAdd, setListingsToAdd] = useState([]);
  const [jsonData, setJsonData] = useState(null);

  const { status, data, error } = useSelector((state) => state.panelItem);
  const { newListings, stores } = useSelector((state) => state.panel)

  useEffect(() => {
    if (status === null || status === "succeeded") {
      dispatch(getSupplierInfo({ id }));
    }
  }, []);

  useEffect(() => {
    console.log("updated", status, data, error);
    dispatch(getNewListings({ site: data?.name }));
    dispatch(getStores({ page: 1, limit: 10 }));
  }, [status, data, error]);

  useEffect(() => {
    setListingsToAdd(newListings)
  }, [newListings, listingsToAdd]);

  const exportToExcel = () => {
      const workbook = XLSX.utils.book_new();

      // Create a worksheet and add data to it
      const worksheet = XLSX.utils.json_to_sheet(listingsToAdd);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Generate a data URL for the workbook
      const dataURL = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "base64",
      });

      // Convert the data URL to a Blob
      const blob = base64toBlob(dataURL);

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a link to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.xlsx";
      a.click();

      // Release the URL object
      window.URL.revokeObjectURL(url);
  };

  const base64toBlob = (base64Data) => {
    const byteCharacters = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteCharacters.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteCharacters.length; i++) {
      uint8Array[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };
  
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

  const fetchNewListings = (e) => {
    exportToExcel()
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonResult = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headers = jsonResult[0];

        // Remove the headers row from the JSON result
        jsonResult.shift();

        // Create JSON data with objects containing key-value pairs
        const jsonDataArray = jsonResult.map((row) => {
          const obj = {};
          row.forEach((cellValue, index) => {
            const header = headers[index];
            obj[header] = cellValue;
          });
          return obj;
        });

        setJsonData(jsonDataArray);
        dispatch(addNewListings({ site: data?.name, items: jsonDataArray, store: data?.store }));
      };
      reader.readAsBinaryString(file);
    }

  };
  
  const openFileDialog = () => {
    document.getElementById('fileInput').click();
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
                    <h5>Fetch Listings</h5>
                    <TextField
                      fullWidth
                      name="name"
                      label="ebay store name"
                      type="name"
                      id="name"
                      autoComplete="name"
                      value={data?.name}
                      sx={{ width: 450 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl sx={{ m: 0, width: 400 }}>
                      <InputLabel>Store</InputLabel>
                      <Select
                        value={data?.store}
                        onChange={(e) => changeInput(e, "store")}
                        input={<OutlinedInput label="Select Store" />}
                      >
                        {stores.map((store) => (
                          <MenuItem key={store} value={store.email}>
                            {store.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Button
                    onClick={fetchNewListings}
                    sx={{ m: 3, mr: 0 }}
                    variant="contained"
                  >
                    Fetch Listings
                  </Button>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".xlsx"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  <Button
                    onClick={openFileDialog}
                    sx={{ m: 3 }}
                    variant="contained"
                  >
                    Add New Listings
                  </Button>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
};

export default SupplierInfoOptions;

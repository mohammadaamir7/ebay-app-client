import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./ItemEditOptions.css";
import { Link, useParams } from "react-router-dom";
import {
  getListingDetail,
  getStoreInfo,
  getSupplierInfo,
  updateField,
  updateItem,
  updateListing,
  updateStore,
} from "../../features/panelItemSlice";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Stack, Switch } from "@mui/material";
import io from "socket.io-client";
import config from "../../config.json";
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

const StoreInfoOptions = () => {
  const socket = io(`${config.DOMAIN}`);

  const { id } = useParams();
  const dispatch = useDispatch();
  const [currentSupplier, setCurrentSupplier] = useState("");

  const { status, data, error } = useSelector((state) => state.panelItem);
  const [isPriceRangeMarkUp, setIsPriceRangeMarkUp] = useState(
    data?.useStoreMarkUp
  );

  const [defaultQuantity, setDefaultQuantity] = useState(0);
  const [quantityAdjustment, setQuantityAdjustment] = useState(0);
  const [storeMarkUp, setStoreMarkUp] = useState(0);

  const [inputFields, setInputFields] = useState([]);

  const [markUpFields, setMarkUpFields] = useState([]);
  const [oAuthToken, setoAuthToken] = useState("");
  const [storeEmail, setstoreEmail] = useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

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
    toast.success("Item Updated Successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleOpenMenu = (event, id) => {
    handleOpen();
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;

    const updatedInputFields = [...inputFields];
    updatedInputFields[index][name] = value;
    setInputFields(updatedInputFields);
  };

  const removeInputFields = (index) => {
    const updatedInputFields = [...inputFields];
    updatedInputFields.splice(index, 1); // Remove the pair at the specified index
    setInputFields(updatedInputFields);
  };

  const addInputFields = () => {
    setInputFields([...inputFields, { min: 0, max: 0, quantity: 0 }]);
  };

  const handleMarkUpInputChange = (index, event) => {
    const { name, value } = event.target;

    const updatedMarkUpFields = [...markUpFields];
    updatedMarkUpFields[index][name] = value;
    setMarkUpFields(updatedMarkUpFields);
  };

  const removeMarkUpFields = (index) => {
    const updatedMarkUpFields = [...markUpFields];
    updatedMarkUpFields.splice(index, 1); // Remove the pair at the specified index
    setMarkUpFields(updatedMarkUpFields);
  };

  const addMarkUpFields = () => {
    setMarkUpFields([...markUpFields, { min: 0, max: 0, markUp: 0 }]);
  };

  const getData = async () => {
    const storeData = await dispatch(getStoreInfo({ id }));
    setIsPriceRangeMarkUp(storeData?.payload?.item?.useStoreMarkUp);
    setStoreMarkUp(storeData?.payload?.item?.markUp);
    setstoreEmail(storeData?.payload?.item?.email);
    setoAuthToken(storeData?.payload?.item?.oAuthToken);
    // if (storeData?.payload?.item) {
    //   const fields = storeData?.payload?.item?.Suppliers?.map((rec) => {
    //     if(rec?.name === storeData?.payload?.item?.Suppliers[0].name){
    //       return {
    //         min: rec?.quantityOffset?.min ? rec?.quantityOffset?.min : 0,
    //         max: rec?.quantityOffset?.max ? rec?.quantityOffset?.max : 0,
    //         quantity: rec?.quantityOffset?.quantity ? rec?.quantityOffset?.quantity : 0,
    //       };
    //     }
    //   });
    //   // const fields = storeData?.payload?.item?.quantityOffset?.map((rec) => ({
    //   //   min: rec?.min,
    //   //   max: rec?.max,
    //   //   quantity: rec?.quantity,
    //   // }));
    //   setInputFields(fields);
    // }
  };

  const handleChange = (event) => {
    const fields = [];
    setCurrentSupplier(event.target.value);
    data?.Suppliers?.map((rec) => {
      if (rec?.name === event.target.value) {
        rec?.quantityOffset?.map((el) =>
          fields.push({
            min: el?.min ? el?.min : 0,
            max: el?.max ? el?.max : 0,
            quantity: el?.quantity ? el?.quantity : 0,
          })
        );
      }
    });

    setInputFields(fields);

    const markUpFields = [];
    data?.Suppliers?.map((rec) => {
      if (rec?.name === event.target.value) {
        rec?.markUpRange?.map((el) =>
          markUpFields.push({
            min: el?.min ? el?.min : 0,
            max: el?.max ? el?.max : 0,
            markUp: el?.markUp ? el?.markUp : 0,
          })
        );
      }
    });

    setMarkUpFields(markUpFields);
    setDefaultQuantity(
      data?.Suppliers?.find((supplier) => supplier?.name === event.target.value)
        ?.defaultQuantity || 0
    );
    setQuantityAdjustment(
      data?.Suppliers?.find((supplier) => supplier?.name === event.target.value)
        ?.quantityAdjustment || 0
    );
  };

  const handleIsMarkUpChange = (event) => {
    setIsPriceRangeMarkUp(event.target.checked);
  };

  useEffect(() => {
    if (status === null || status === "succeeded") {
      getData();
      // dispatch(getStoreInfo({ id }));
    }
  }, []);

  useEffect(() => {
    console.log("updated", status, data, error);
  }, [data, error, inputFields]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("sync-listings", (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  if (!status) return <h3>Item not found!</h3>;
  else if (status === "loading") return <h3>Loading...</h3>;
  else if (status === "failed") notifyError();

  const changeInput = (e, key) => {
    e.preventDefault();
    dispatch(updateField({ key, val: e.target.value }));
  };

  const saving = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      updateStore({
        id,
        data: {
          ...data,
          markUp: storeMarkUp,
          useStoreMarkUp: isPriceRangeMarkUp,
          quantityOffset: inputFields,
          markUpRange: markUpFields,
          supplier: currentSupplier,
          defaultQuantity,
          quantityAdjustment,
          oAuthToken,
        },
      })
    );
    handleClose();
    if(result?.payload?.success){
      notifySuccess();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const handleSync = () => {
    socket.emit("sync-listings", { site: currentSupplier, store: storeEmail });
  };

  return (
    <>
      <h4 className="title-head">Edit Store Info</h4>
      <Grid container spacing={2}>
        <Grid md={4}>
          <h4>Details</h4>
          <p className="description-para">
            Title, Fetch listings data and its format.
          </p>
        </Grid>
        <Grid md={8} sx={{ mb: 3}}>
          <div className="card shadow mb-3">
            <ToastContainer />
            <ConfirmationModal
              title={"Are you sure you want to delete this information?"}
              open={openModal}
              handleClose={handleClose}
              handleSubmit={saving}
            />
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
                    sx={{ mb: 3, mr: "auto" }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h5 className="mb-3">Fetch Listings</h5>
                        <TextField
                          fullWidth
                          name="name"
                          label="ebay store name"
                          type="name"
                          id="name"
                          autoComplete="name"
                          value={data.name}
                          onChange={(e) => changeInput(e, "name")}
                          sx={{ width: 450 }}
                        />
                      </Grid>
                      <Button
                        onClick={() => {}}
                        sx={{ m: 3, mr: 0 }}
                        variant="contained"
                      >
                        Fetch
                      </Button>
                      <Button
                        onClick={() => {}}
                        sx={{ m: 3 }}
                        variant="contained"
                      >
                        Format
                      </Button>
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
          <h4>Mark Up and Quantity </h4>
          <p className="description-para">
            Mark up and Quantity calculation of listings.
          </p>
        </Grid>
        <Grid md={8}>
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
                  <Button
                    variant="contained"
                    onClick={handleSync}
                    disabled={currentSupplier === ""}
                    sx={{ ml: "auto" }}
                  >
                    Sync Listings
                  </Button>
                  <Stack direction="row" sx={{ mb: 3, mr: "auto", mt: "-30px" }}>
                    <Switch
                      checked={isPriceRangeMarkUp}
                      onChange={(e) => handleIsMarkUpChange(e)}
                    />
                    <p className="switch-head">Use Store Mark Up</p>
                  </Stack>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mr: "auto" }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <h5 className="mb-3">ebay store markup</h5>
                        <TextField
                          fullWidth
                          name="markUp"
                          label="ebay store markUp"
                          type="markUp"
                          id="markUp"
                          autoComplete="markUp"
                          value={storeMarkUp}
                          onChange={(e) => setStoreMarkUp(e.target.value)}
                          disabled={!isPriceRangeMarkUp}
                        />
                      </Grid>
                      <Grid item xs={6} sx={{ mt: 5, mb: 2 }}>
                        <Box>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Suppliers
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={currentSupplier}
                              label="Supplier"
                              onChange={handleChange}
                            >
                              {data?.Suppliers?.map((supplier, index) => (
                                <MenuItem value={supplier.name}>
                                  {supplier.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid xs={12} sx={{ ml: 2, mb: 2 }}>
                        <h5
                          for="exampleFormControlTextarea1"
                          className="form-label mt-3 mb-3"
                        >
                          OAuth Token
                        </h5>
                        <textarea
                          className="form-control"
                          id="exampleFormControlTextarea1"
                          rows="3"
                          value={oAuthToken}
                          onChange={(e) => setoAuthToken(e.target.value)}
                        ></textarea>
                      </Grid>
                      <div class="mb-3 ml-5"></div>
                      {currentSupplier && (
                        <>
                          <Grid item xs={6} sx={{ mb: 2 }}>
                            <h5 className="mb-3">
                              Default Quantity and Offset
                            </h5>
                            <TextField
                              fullWidth
                              name="defaultQuantity"
                              label="Default Quantity"
                              type="defaultQuantity"
                              id="defaultQuantity"
                              autoComplete="defaultQuantity"
                              value={defaultQuantity}
                              onChange={(e) =>
                                setDefaultQuantity(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={6} sx={{ mt: 4 }}>
                            <TextField
                              fullWidth
                              name="quantityOffset"
                              label="Quantity Offset"
                              type="quantityOffset"
                              id="quantityOffset"
                              autoComplete="quantityOffset"
                              value={quantityAdjustment}
                              onChange={(e) =>
                                setQuantityAdjustment(e.target.value)
                              }
                            />
                          </Grid>
                        </>
                      )}

                      {currentSupplier && (
                        <Grid>
                          <h5 className="mt-5 descriptive-head">
                            Price range quantity
                          </h5>

                          <div>
                            {inputFields?.map((field, index) => {
                              return (
                                <div key={index}>
                                  <TextField
                                    autoComplete="minPrice"
                                    name="min"
                                    fullWidth
                                    id="minPrice"
                                    label="Min Price"
                                    type="number"
                                    value={field.min}
                                    sx={{ width: 170, m: 2 }}
                                    onChange={(e) =>
                                      handleInputChange(index, e)
                                    }
                                  />
                                  <TextField
                                    autoComplete="maxPrice"
                                    name="max"
                                    fullWidth
                                    id="maxPrice"
                                    label="Max Price"
                                    type="number"
                                    value={field.max}
                                    sx={{ width: 170, m: 2 }}
                                    onChange={(e) =>
                                      handleInputChange(index, e)
                                    }
                                  />
                                  <TextField
                                    autoComplete="quantity"
                                    name="quantity"
                                    fullWidth
                                    id="quantity"
                                    label="Quantity"
                                    type="number"
                                    value={field.quantity}
                                    sx={{ width: 170, mt: 2 }}
                                    onChange={(e) =>
                                      handleInputChange(index, e)
                                    }
                                  />
                                  <Button
                                    sx={{ mt: 3 }}
                                    onClick={() => removeInputFields(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              );
                            })}
                            <Button
                              sx={{ ml: 2 }}
                              variant="contained"
                              onClick={addInputFields}
                            >
                              Add Field
                            </Button>
                          </div>
                        </Grid>
                      )}

                      {!isPriceRangeMarkUp && currentSupplier && (
                        <Grid>
                          <h5 className="mt-5 descriptive-head">
                            Price range markUp
                          </h5>

                          <div>
                            {markUpFields?.map((field, index) => {
                              return (
                                <div key={index}>
                                  <TextField
                                    autoComplete="minPrice"
                                    name="min"
                                    fullWidth
                                    id="minPrice"
                                    label="Min Price"
                                    type="number"
                                    value={field.min}
                                    sx={{ width: 170, m: 2 }}
                                    onChange={(e) =>
                                      handleMarkUpInputChange(index, e)
                                    }
                                  />
                                  <TextField
                                    autoComplete="maxPrice"
                                    name="max"
                                    fullWidth
                                    id="maxPrice"
                                    label="Max Price"
                                    type="number"
                                    value={field.max}
                                    sx={{ width: 170, m: 2 }}
                                    onChange={(e) =>
                                      handleMarkUpInputChange(index, e)
                                    }
                                  />
                                  <TextField
                                    autoComplete="markUp"
                                    name="markUp"
                                    fullWidth
                                    id="markUp"
                                    label="Mark Up"
                                    type="number"
                                    value={field.markUp}
                                    sx={{ width: 170, mt: 2 }}
                                    onChange={(e) =>
                                      handleMarkUpInputChange(index, e)
                                    }
                                  />
                                  <Button
                                    sx={{ mt: 3 }}
                                    onClick={() => removeMarkUpFields(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              );
                            })}
                            <Button
                              sx={{ ml: 2 }}
                              variant="contained"
                              onClick={addMarkUpFields}
                            >
                              Add Field
                            </Button>
                          </div>
                        </Grid>
                      )}
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

export default StoreInfoOptions;

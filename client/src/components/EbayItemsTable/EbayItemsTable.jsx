import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getitemInfo,
  getConfigInfo,
  updateFilter,
  updateItemEditPageActive,
  getListingsInfo,
  getStores,
  getSuppliers,
  deleteListing,
  getListingsBrands,
} from "../../features/panelSlice";

import "./EbayItemsTable.css";
import io from "socket.io-client";
import config from "../../config.json";

import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  FormControl,
} from "@mui/material";
// components
import Label from "../label";
import Iconify from "../iconify";
import Scrollbar from "../scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
// mock
import USERLIST from "../../_mock/user";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import useDebounce from "../../hooks/useDebounce";
import ConfirmationModal from "../modals/ConfirmationModal";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "brand", label: "Brand", alignRight: false },
  { id: "itemId", label: "Item Id", alignRight: false },
  { id: "sku", label: "SKU", alignRight: false },
  { id: "title", label: "Title", alignRight: false },
  { id: "startPrice", label: "Start Price", alignRight: false },
  { id: "quantity", label: "Quantity", alignRight: false },
  //   { id: 'isVerified', label: 'Verified', alignRight: false },
    { id: 'synced', label: 'Synced', alignRight: false },
  { id: "" },
];

const priceRanges = {
  "1 to 50": { min: 1, max: 50 },
  "51 to 100": { min: 51, max: 100 },
  "101 to 150": { min: 101, max: 150 },
  "151 to 200": { min: 151, max: 200 },
  "201 to 250": { min: 201, max: 250 },
  "251 to 300": { min: 251, max: 300 },
  "301 to 350": { min: 301, max: 350 },
  "351 to 400": { min: 351, max: 400 },
};

const quantity = {
  "1 to 5": { min: 1, max: 4 },
  "5 to 10": { min: 5, max: 9 },
  "10 to 15": { min: 10, max: 14 },
  "15 to 20": { min: 15, max: 19 },
  "20 to 25": { min: 20, max: 24 },
  "25 to 30": { min: 25, max: 29 },
  "30 to 35": { min: 30, max: 34 },
  "35 to 40": { min: 35, max: 40 },
};

const soldQuantity = {
  "1 to 5": { min: 1, max: 4 },
  "5 to 10": { min: 5, max: 9 },
  "10 to 15": { min: 10, max: 14 },
  "15 to 20": { min: 15, max: 19 },
  "20 to 25": { min: 20, max: 24 },
  "25 to 30": { min: 25, max: 29 },
  "30 to 35": { min: 30, max: 34 },
  "35 to 40": { min: 35, max: 40 },
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

const limit = 10;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 190,
      fontSize: 20,
    },
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PanelTable = () => {
  // const socket = io(`${config.DOMAIN}`);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const [open, setOpen] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState({
    stores: [],
    suppliers: [],
    price: null,
    quantity: null,
    soldQuantity: null,
    brand: null
  });
  const [isRecordSelected, setIsRecordSelected] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isReRender, setIsReRender] = useState(false);

  const debouncedSearchTerm = useDebounce(filterName, 500);

  const handleChange = (event) => {
    const {
      target: { value, name },
    } = event;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dispatch = useDispatch();
  const {
    pageItems,
    totalpages,
    sites,
    selectedSite,
    selectedBrand,
    searchTerm,
    searchStatus,
    itemEditPageActive,
    listings,
    stores,
    suppliers,
    listingsBrands
  } = useSelector((state) => state.panel);

  const [currentPage, setCurrentPage] = useState(1);

  const notifyError = () =>
    toast.error("Error in Deleting Listings", {
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
    toast.success("Listings Deleted Successfully", {
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
    dispatch(getConfigInfo());
  }, []);

  useEffect(() => {
    dispatch(getStores({ page: currentPage, limit: limit }));
    dispatch(getSuppliers({ page: currentPage, limit: limit }));
    dispatch(getListingsBrands());
  }, [currentPage]);

  useEffect(() => {
    dispatch(
      getListingsInfo({
        page: currentPage,
        limit: rowsPerPage,
        filters: JSON.stringify({
          ...filters,
          searchTerm: debouncedSearchTerm,
        }),
      })
    );
  }, [filters, debouncedSearchTerm, isSuccess, rowsPerPage, isReRender]);

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Connected to server");
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Disconnected from server");
  //   });

  //   socket.on("sync-listings", (data) => {
  //     console.log(data);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);

  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
    setSelectedItem([id]);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listings?.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    if (newSelected.length > 0) {
      setIsRecordSelected(true);
    } else {
      setIsRecordSelected(false);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listings?.length) : 0;

  const filteredUsers = applySortFilter(
    USERLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  const navigate = useNavigate();

  const handlePage = (event) => {
    const direction = event.target.value;

    if (direction === "next" && totalpages > 0) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "previous" && currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleFilterChange = (event, filter) => {
    dispatch(updateFilter({ value: event.target.value, filter }));
  };

  const handleSearch = () => {};

  // const handleSync = () => {
  //   socket.emit("sync-listings", { site: selectedSite });
  // };

  const handleImport = () => {};
  const handleExport = () => {};

  const handleItemEditBtn = (item) => {
    dispatch(updateItemEditPageActive(item));
    navigate("/item-edit");
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteListing({ id: selectedItem }));
    handleClose();
    handleCloseMenu();
    if (result.payload.success) {
      setIsSuccess(true);
      setIsReRender(prev => !prev)
      notifySuccess();
    } else if (!result.payload.success) {
      notifyError();
      setIsSuccess(false);
    }
    setIsRecordSelected(false);
  };

  const handleBulkDelete = async () => {
    const result = await dispatch(deleteListing({ id: selected }));
    handleClose();
    handleCloseMenu();
    if (result.payload.success) {
      setIsSuccess(true);
      setIsReRender(prev => !prev)
      notifySuccess();
    } else if (!result.payload.success) {
      notifyError();
      setIsSuccess(false);
    }
    setIsRecordSelected(false);
  };

  return (
    <>
      <Container>
        <ConfirmationModal
          title={"Are you sure you want to delete this information?"}
          open={openModal}
          handleClose={handleClose}
          handleSubmit={isRecordSelected ? handleBulkDelete : handleDelete}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Listings
          </Typography>
        </Stack>

        <FormControl sx={{ m: 1, width: 190, mb: 3 }}>
          <InputLabel id="demo-multiple-checkbox-label">Store</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={filters.stores}
            name="stores"
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {stores.map((store) => (
              <MenuItem key={store._id} value={store.email}>
                <Checkbox checked={filters.stores.indexOf(store.email) > -1} />
                <ListItemText primary={store.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 190, mb: 3 }}>
          <InputLabel id="demo-multiple-checkbox-label">Supplier</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={filters.suppliers}
            name="suppliers"
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier._id} value={supplier.name}>
                <Checkbox
                  checked={filters.suppliers.indexOf(supplier.name) > -1}
                />
                <ListItemText primary={supplier.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 190, mb: 3 }}>
          <InputLabel id="demo-multiple-checkbox-label">Brand</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            value={filters.brand}
            name="brand"
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            MenuProps={MenuProps}
          >
            <MenuItem value="">None</MenuItem>
            {listingsBrands && listingsBrands?.map((brand) => (
              <MenuItem key={brand} value={brand}>
                <ListItemText primary={brand} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 150 }}>
          <InputLabel id="demo-simple-select-required-label">Price</InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={filters.price}
            name="price"
            label="Price"
            onChange={handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {Object.keys(priceRanges).map((val) => (
              <MenuItem key={val} value={priceRanges[val]}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 150 }}>
          <InputLabel id="demo-simple-select-required-label">
            Quantity
          </InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={filters.quantity}
            name="quantity"
            label="Quantity"
            onChange={handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {Object.keys(quantity).map((val) => (
              <MenuItem key={val} value={quantity[val]}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 150 }}>
          <InputLabel id="demo-simple-select-required-label">
            Sold Quantity
          </InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={filters.soldQuantity}
            name="soldQuantity"
            label="Sold Quantity"
            onChange={handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {Object.keys(soldQuantity).map((val) => (
              <MenuItem key={val} value={soldQuantity[val]}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <Button
          onClick={handleOpen}
          variant="outlined"
          sx={{ mt: 3, mb: 3 }}
          disabled={selected.length < 1}
        >
          Delete Selected
        </Button>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selectedIds={selected}
            isSearchable={true}
          />
          <ToastContainer />

          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={listings.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {listings &&
                  listings
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((item) => {
                      // const { id, name, role, status, company, avatarUrl, isVerified } = item;
                      const selectedUser = selected.indexOf(item._id) !== -1;
                      return (
                        <TableRow
                          hover
                          key={item._id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedUser}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedUser}
                              onChange={(event) => handleClick(event, item._id)}
                            />
                          </TableCell>

                          <TableCell align="left">{item.brand}</TableCell>
                          <TableCell
                            className="ebay-url"
                            align="left"
                            onClick={() =>
                              window.open(
                                `https://www.ebay.com/itm/${item.itemId}`,
                                "_blank"
                              )
                            }
                          >
                            {item.itemId}
                          </TableCell>

                          <TableCell align="left">{item.sku}</TableCell>
                          <TableCell align="left">{item.title}</TableCell>
                          <TableCell align="left">{item.startPrice}</TableCell>
                          <TableCell align="left">{item.quantity}</TableCell>

                          <TableCell align="left">
                            <Label
                              color={
                                (item.synced === false && "error") || "success"
                              }
                            >
                              {item.synced ? "Synced" : "Un-Synced"}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(e) => handleOpenMenu(e, item._id)}
                            >
                              <Iconify icon={"eva:more-vertical-fill"} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={listings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => navigate(`/listing-edit/${selectedItem}`)}>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleOpen} sx={{ color: "error.main" }}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
};

export default PanelTable;

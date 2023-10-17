import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getitemInfo,
  getConfigInfo,
  getSearchInfo,
  updateFilter,
  updateItemEditPageActive,
  deleteItem,
} from "../../features/panelSlice";

import "./PanelTable.css";
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
  Select,
  InputLabel,
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
import useDebounce from "../../hooks/useDebounce";
import ConfirmationModal from "../modals/ConfirmationModal";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "image", label: "Image", alignRight: false },
  { id: "site", label: "Site", alignRight: false },
  { id: "brand", label: "Brand", alignRight: false },
  { id: "itemNumber", label: "Item Number", alignRight: false },
  { id: "title", label: "Title", alignRight: false },
  { id: "price", label: "Price", alignRight: false },
  { id: "quantity", label: "Quantity", alignRight: false },
  //   { id: 'isVerified', label: 'Verified', alignRight: false },
  //   { id: 'status', label: 'Status', alignRight: false },
  { id: "" },
];

const brands = [
  "2GIG",
  "Active Thermal Mgmt",
  "ACURUS",
  "ALARM.COM",
  "Altronix",
  "Amazon",
  "American Recorder Technology",
  "Amplifier Technologies",
  "Apple",
  "Araknis Networks",
  "Arlington",
  "Arlo Network Cameras",
  "Atlona",
  "Attero Tech",
  "AudioControl",
  "August",
  "Autonomic",
  "AVPro Edge",
  "BenQ",
  "Binary",
  "BrightSign",
  "Calrad Electronics",
  "Carlon",
  "Chief",
  "Clare Controls",
  "ClareVision",
  "ClearOne",
  "Cleerline",
  "Da Lite",
  "Definitive Technology",
  "Denon",
  "Digital Watchdog",
  "Direct Connect",
  "DirectUPS",
  "DoorBird",
  "Dottie",
  "Dragonfly",
  "Dynamat",
  "Earthquake Sound",
  "Ecobee",
  "EERO",
  "ELK Products",
  "Episode",
  "Evolution by Vanco",
  "Exacq",
  "Flexson",
  "Fortress Chairs",
  "FSR Inc",
  "Furman",
  "FX LUMINAIRE",
  "Google",
  "GRI",
  "Holland Electronics",
  "Hosa",
  "House Logix",
  "Hunt",
  "INNEOS",
  "IOGear",
  "iPort",
  "Jasco",
  "Jensen Transformers",
  "Just Add Power",
  "JVC",
  "Kantech",
  "KEF",
  "Klipsch",
  "Kwikset",
  "Labor Saving Devices",
  "Legion",
  "Leviton Security & Automation",
  "LG COMMERCIAL",
  "LG Electronics",
  "LiftMaster",
  "LINEAR LLC",
  "Louroe",
  "Luma Surveillance",
  "Lutron",
  "Luxul",
  "MantelMount",
  "Marantz",
  "Middle Atlantic",
  "Midlite Products",
  "Nest Labs",
  "ON-Q-Legrand",
  "OPTEX",
  "OvrC",
  "Panamax",
  "Parasound",
  "Planar",
  "Planet Waves",
  "Platinum Tools",
  "Primacoustic",
  "Pro Control",
  "Qolsys",
  "QSC",
  "Rachio",
  "Rack-a-Tiers",
  "Raytec",
  "Resolution Products",
  "Ring",
  "Rockustics",
  "Roku",
  "Router Limits",
  "RTI",
  "Russound",
  "Samsung",
  "Sanus",
  "Screen Innovations",
  "Seco-larm",
  "Sense",
  "SEURA",
  "Shure",
  "SolidDrive",
  "Sonance Outdoor Products",
  "Sonos",
  "SONY",
  "Sony Commercial",
  "SoundTube",
  "Spinetix",
  "Strong Mounts",
  "Strong Racks",
  "SunBrite",
  "Sunfire",
  "Telguard",
  "Total Control Light",
  "TP-Link",
  "TRIAD",
  "Triplett",
  "Ubiquiti",
  "Universal Power Group",
  "Universal Remote Control",
  "Vanco",
  "Veracity",
  "Versiton",
  "Vertical Cable",
  "Victrola",
  "Visualint",
  "Vivitek",
  "Vivotek",
  "WattBox",
  "Williams Sound",
  "Wilson Electronics",
  "Wirepath",
  "Xantech",
  "Yale Security",
  "Yamaha Electronics",
  "Yamaha Pro",
  "Zigen",
];

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
  "1 to 50": { min: 1, max: 49 },
  "50 to 100": { min: 50, max: 99 },
  "100 to 150": { min: 100, max: 149 },
  "150 to 200": { min: 150, max: 199 },
  "200 to 250": { min: 200, max: 249 },
  "250 to 300": { min: 250, max: 299 },
  "300 to 350": { min: 300, max: 349 },
  "350 to 400": { min: 350, max: 400 },
};

const PanelTable = () => {
  // const socket = io(`${config.DOMAIN}`);

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
  } = useSelector((state) => state.panel);

  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    site: "",
    price: null,
    quantity: null,
  });
  const [isRecordSelected, setIsRecordSelected] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isReRender, setIsReRender] = useState(false);

  const debouncedSearchTerm = useDebounce(filterName, 500);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const handleChange = (event) => {
    const {
      target: { value, name },
    } = event;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const notifyError = () =>
    toast.error("Error in Deleting Item", {
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
    toast.success("Item Deleted Successfully", {
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
    if (searchTerm.length > 0) {
      handleSearch();
    }
  }, [currentPage]);

  useEffect(() => {
    dispatch(
      getitemInfo({
        page: page + 1,
        limit: rowsPerPage,
        filters: JSON.stringify({
          ...filters,
          searchTerm: debouncedSearchTerm,
        }),
      })
    );
  }, [filters, debouncedSearchTerm, rowsPerPage, isSuccess, isReRender]);

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Connected to server");
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Disconnected from server");
  //   });

  //   socket.on("sync-listings", (data) => {
  //     console.log(data);
  //     dispatch(
  //       getSearchInfo({
  //         term: searchTerm,
  //         site: selectedSite,
  //         brand: selectedBrand,
  //         page: currentPage,
  //         limit: limit,
  //       })
  //     );
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);

  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
    setSelectedItem(id);
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
      const newSelecteds = pageItems.map((n) => n._id);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pageItems?.length) : 0;

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

  const handleSearch = () => {
    dispatch(
      getSearchInfo({
        term: searchTerm,
        site: selectedSite,
        brand: selectedBrand,
        page: currentPage,
        limit: limit,
      })
    );
  };

  // const handleSync = () => {
  //   socket.emit("sync-listings", { site: selectedSite });
  // };

  const handleItemEditBtn = (item) => {
    dispatch(updateItemEditPageActive(item));
    navigate("/item-edit");
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteItem({ id: [selectedItem] }));
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
    const result = await dispatch(deleteItem({ id: selected }));
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
      {/* <div className="panel-table">
        <div className="panel-data-control">
          <div className="panel-table-search">
            <input
              type="text"
              className="panel-data-control-search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(event) => handleFilterChange(event, "term")}
            />
          </div>
          <div className="panel-table-control">
            <div className="panel-table-filter">
              <select
                className="panel-site-selector"
                value={selectedSite}
                onChange={(event) => handleFilterChange(event, "site")}
              >
                <option value="" hidden defaultChecked>
                  Choose Site
                </option>
                <option value="">None</option>
                {console.log("sites : ", sites)}
                {sites &&
                  sites.map((obj) => {
                    return (
                      <option key={obj.site} value={obj.site}>
                        {obj.site}
                      </option>
                    );
                  })}
              </select>
              <select
                className="panel-brand-selector"
                value={selectedBrand}
                onChange={(event) => handleFilterChange(event, "brand")}
              >
                <option value="" hidden defaultChecked>
                  Choose Brand
                </option>
                <option value="">None</option>
                {sites &&
                  sites.map((obj) => {
                    if (selectedSite && obj.site !== selectedSite) {
                      return null;
                    }
                    return obj.brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ));
                  })}
              </select>
              <div className="panel-price-selector">
                <input
                  type="number"
                  className="panel-data-control-price"
                  placeholder="Min Price"
                />
                <input
                  type="number"
                  className="panel-data-control-price"
                  placeholder="Max Price"
                />
              </div>
            </div>
            <div className="panel-table-search-btn">
              <div className="panel-search">
                <Button
                  variant="contained"
                  className="panel-search-btn"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
            <div className="panel-table-search-btn">
              <div className="panel-search">
                <Button
                  variant="contained"
                  className="panel-search-btn"
                  onClick={handleSync}
                >
                  Sync Listings
                </Button>
              </div>
            </div>
          </div>
          <span>{searchStatus}</span>
        </div>
        <div className="panel-data-table-control">
          <div className="panel-page-control-wrapper">
            <span>
              {currentPage} of {totalpages}
            </span>
            <button
              className="panel-page-control-btn"
              value="previous"
              onClick={handlePage}
            >
              <i className="fi fi-br-angle-left"></i>
            </button>
            <button
              className="panel-page-control-btn"
              value="next"
              onClick={handlePage}
            >
              <i className="fi fi-br-angle-right"></i>
            </button>
          </div>
        </div>
      </div> */}
      <Container>
        <ToastContainer />
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
            Scraped Data
          </Typography>
        </Stack>
        <FormControl sx={{ m: 1, width: 150 }}>
          <InputLabel id="demo-simple-select-required-label">Site</InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={filters.site}
            name="site"
            label="Site"
            onChange={handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {sites &&
              sites.map((obj) => {
                return (
                  <MenuItem key={obj.site} value={obj.site}>
                    {obj.site}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 150 }}>
          <InputLabel id="demo-simple-select-required-label">Brand</InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={filters.brand}
            name="brand"
            label="Brand"
            onChange={handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {sites &&
              sites.map((obj) => {
                if (selectedSite && obj.site !== selectedSite) {
                  return null;
                }
                return brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ));
              })}
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
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={pageItems.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {pageItems &&
                  pageItems
                    // ?.slice(
                    //   page * rowsPerPage,
                    //   page * rowsPerPage + rowsPerPage
                    // )
                    .map((item) => {
                      // const {
                      //   id,
                      //   name,
                      //   role,
                      //   status,
                      //   company,
                      //   avatarUrl,
                      //   isVerified,
                      // } = row;
                      const selectedUser =
                        selected.indexOf(item._id) !== -1;

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
                              onChange={(event) =>
                                handleClick(event, item._id)
                              }
                            />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              {/* <Avatar alt={name} src={avatarUrl} /> */}
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{item.site}</TableCell>
                          <TableCell align="left">{item.brand}</TableCell>

                          <TableCell align="left">{item.itemNumber}</TableCell>
                          <TableCell align="left">{item.productName}</TableCell>
                          <TableCell align="left">{item.price}</TableCell>
                          <TableCell align="left">
                            {item.quantity}
                          </TableCell>
                          {/* 
                            <TableCell align="left">
                              {isVerified ? "Yes" : "No"}
                            </TableCell>

                            <TableCell align="left">
                              <Label
                                color={
                                  (status === "banned" && "error") || "success"
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell> */}

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
            count={pageItems.length}
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
        <MenuItem onClick={() => navigate(`/item-edit/${selectedItem}`)}>
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

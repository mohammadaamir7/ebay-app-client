import React, {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from 'react-router-dom';

import {useSelector, useDispatch} from 'react-redux';
import {
    getitemInfo,
    getConfigInfo,
    getSearchInfo,
    updateFilter,
    updateItemEditPageActive,
    getListingsInfo
} from '../../features/panelSlice';

import "./EbayItemsTable.css";
import io from "socket.io-client";
import config from "../../config.json"

import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
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
} from '@mui/material';
// components
import Label from '../label';
import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'brand', label: 'Brand', alignRight: false },
  { id: 'itemId', label: 'Item Id', alignRight: false },
  { id: 'sku', label: 'SKU', alignRight: false },
  { id: 'oem', label: 'OEM', alignRight: false },
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'startPrice', label: 'Start Price', alignRight: false },
  { id: 'quantity', label: 'Quantity', alignRight: false },
//   { id: 'isVerified', label: 'Verified', alignRight: false },
//   { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

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
  return order === 'desc'
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const limit = 10;

const PanelTable = () => {
    const socket = io(`${config.DOMAIN}`);

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
        listings
    } = useSelector(state => state.panel);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getConfigInfo());
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0) {
            handleSearch();
        } else {
            dispatch(getListingsInfo({page: currentPage, limit: limit}));
        }
    }, [currentPage]);

    useEffect(() => {
      socket.on("connect", () => {
        console.log("Connected to server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });

      socket.on("sync-listings", (data) => {
        console.log(data);
        dispatch(getSearchInfo({
            term: searchTerm,
            site: selectedSite,
            brand: selectedBrand,
            page: currentPage,
            limit: limit
        }));
      });

      return () => {
        socket.disconnect();
      };
    }, [socket]);

    const [open, setOpen] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const [page, setPage] = useState(0);
  
    const [order, setOrder] = useState('asc');
  
    const [selected, setSelected] = useState([]);
  
    const [orderBy, setOrderBy] = useState('name');
  
    const [filterName, setFilterName] = useState('');
  
    const [rowsPerPage, setRowsPerPage] = useState(5);
  
    const handleOpenMenu = (event, id) => {
      setOpen(event.currentTarget);
      setSelectedItem(id)
    };
  
    const handleCloseMenu = () => {
      setOpen(null);
    };
  
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = USERLIST.map((n) => n.name);
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
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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
  
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
  
    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);
  
    const isNotFound = !filteredUsers.length && !!filterName;

    const navigate = useNavigate();

    const handlePage = (event) => {
        const direction = event.target.value;

        if (direction === 'next' && totalpages > 0) {
            setCurrentPage(prevPage => prevPage + 1);
        } else if (direction === 'previous' && currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleFilterChange = (event, filter) => {
        dispatch(updateFilter({value: event.target.value, filter}));
    }

    const handleSearch = () => {
        dispatch(getSearchInfo({
            term: searchTerm,
            site: selectedSite,
            brand: selectedBrand,
            page: currentPage,
            limit: limit
        }));
    }

    const handleSync = () => {
       socket.emit("sync-listings", { site: selectedSite });
    }
    const handleImport = () => {};
    const handleExport = () => {};

    const handleItemEditBtn = (item) => {
        dispatch(updateItemEditPageActive(item));
        navigate('/item-edit');
    }

    return (
      <>
      <div className="panel-table">
          <div className="panel-data-control">
            {/* <div className="panel-table-search">
              <input
                type="text"
                className="panel-data-control-search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) => handleFilterChange(event, "term")}
              />
            </div> */}
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
                  {sites &&
                    sites.map((obj) => {
                      return (
                        <option key={obj.site} value={obj.site}>
                          {obj.site}
                        </option>
                      );
                    })}
                </select>
                {/* <select
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
                </div> */}
              </div>
              {/* <div className="panel-table-search-btn">
                <div className="panel-search">
                  <Button variant="contained" className="panel-search-btn" onClick={handleSearch}>
                    Search
                  </Button>
                </div>
              </div> */}
              <div className="panel-table-search-btn">
                <div className="panel-search">
                  <Button variant="contained" onClick={handleSync}>
                    Sync Listings
                  </Button>
                </div>
              </div>
              <div className="panel-table-search-btn">
                <div className="panel-search">
                  <Button variant="contained" onClick={handleImport}>
                    Listings Import
                  </Button>
                </div>
              </div>
              <div className="panel-table-search-btn">
                <div className="panel-search">
                  <Button variant="contained" onClick={handleExport}>
                    Listings Export
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
        </div>
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              Ebay Listings
            </Typography>
          </Stack>

          <Card>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                      {
                         listings && listings.map((item) => (
                          <TableRow
                            hover
                            key={item._id}
                            tabIndex={-1}
                            role="checkbox"
                            // selected={selectedUser}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                // checked={selectedUser}
                                // onChange={(event) => handleClick(event, name)}
                              />
                            </TableCell>


                            <TableCell align="left">{item.brand}</TableCell>
                            <TableCell align="left">{item.itemId}</TableCell>

                            <TableCell align="left">
                              {item.sku}
                            </TableCell>
                            <TableCell align="left">
                              {item.oem}
                            </TableCell>
                            <TableCell align="left">{item.title}</TableCell>
                            <TableCell align="left">
                              {item.startPrice}
                            </TableCell>
                            <TableCell align="left">{item.quantity}</TableCell>
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
                                onClick={e => handleOpenMenu(e, item._id)}
                              >
                                <Iconify icon={"eva:more-vertical-fill"} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete
                            words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pageItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePage}
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

          <MenuItem sx={{ color: "error.main" }}>
            <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
        
      </>
    );
};

export default PanelTable;
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  getitemInfo,
  getConfigInfo,
  updateFilter,
  updateItemEditPageActive,
  getListingsInfo,
  getSuppliers,
} from "../../features/panelSlice";

import "./SuppliersTable.css";
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
} from "@mui/material";
// components
import Label from "../label";
import Iconify from "../iconify";
import Scrollbar from "../scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
// mock
import USERLIST from "../../_mock/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Supplier", alignRight: false },
  { id: "itemIdentifier", label: "Item Identifier", alignRight: false },
  { id: "" },
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
    suppliers,
  } = useSelector((state) => state.panel);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getConfigInfo());
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      handleSearch();
    } else {
      dispatch(getSuppliers({ page: currentPage, limit: limit }));
    }
  }, [currentPage]);

  const [open, setOpen] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

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

  const handleSync = () => {
    socket.emit("sync-listings", { site: selectedSite });
  };
  const handleImport = () => {};
  const handleExport = () => {};

  const handleItemEditBtn = (item) => {
    dispatch(updateItemEditPageActive(item));
    navigate("/item-edit");
  };

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Suppliers
          </Typography>
          <div className="panel-table">
            <Button
              sx={{ ml: "auto" }}
              onClick={() => navigate("/add-supplier")}
              variant="contained"
            >
              Add Supplier
            </Button>
          </div>
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
                {console.log("supp : ", suppliers)}
                {suppliers &&
                  suppliers.map((item) => (
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

                      <TableCell align="left">{item.name}</TableCell>
                      <TableCell align="left">{item.itemIdentifier}</TableCell>
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
                  ))}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
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
        <MenuItem onClick={() => navigate(`/supplier-edit/${selectedItem}`)}>
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

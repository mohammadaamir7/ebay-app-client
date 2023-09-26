import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { addStore, addSupplier, updateField } from '../../features/panelItemSlice';
import { useEffect } from 'react';
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  FormControl
} from "@mui/material";
import { getSuppliers } from '../../features/panelSlice';
import { useState } from 'react';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function AddSupplier() {
  const [selectedNames, setSelectedNames] = useState([]);

  const dispatch = useDispatch();
  const { status, data, error } = useSelector((state) => state.panelItem);
  const { suppliers } = useSelector((state) => state.panel);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addStore({ data }));
  };
  
  const changeInput = (e, key) => {
    e.preventDefault();
    dispatch(updateField({ key, val: e.target.value }));
  };

  useEffect(() => {
    console.log("added", status, data, error);
    dispatch(getSuppliers({ page: 1, limit: 10 }));
  }, [status, data, error])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Add Store
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => changeInput(e, "name")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => changeInput(e, "email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="password"
                  value={data.password}
                  onChange={(e) => changeInput(e, "password")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="redirectUrl"
                  label="Redirect Url"
                  type="redirectUrl"
                  id="redirectUrl"
                  autoComplete="redirectUrl"
                  value={data.redirectUrl}
                  onChange={(e) => changeInput(e, "redirectUrl")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="markUp"
                  label="Mark Up"
                  type="markUp"
                  id="markUp"
                  autoComplete="markUp"
                  value={data.markUp}
                  onChange={(e) => changeInput(e, "markUp")}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ m: 0, width: 400 }}>
                  <InputLabel>Multiple Select</InputLabel>
                  <Select
                    multiple
                    value={selectedNames}
                    onChange={(e) => changeInput(e, "suppliers")}
                    input={<OutlinedInput label="Multiple Select" />}
                  >
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier} value={supplier.name}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
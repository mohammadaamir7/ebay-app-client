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
import { addSupplier, updateField } from '../../features/panelItemSlice';
import { useEffect } from 'react';


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
  const dispatch = useDispatch();
  const { status, data, error } = useSelector((state) => state.panelItem);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addSupplier({ data: { ...data, quantityOffset: [] } }));
  };
  
  const changeInput = (e, key) => {
    e.preventDefault();
    dispatch(updateField({ key, val: e.target.value }));
  };

  useEffect(() => {
  }, [status, data, error])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Add Supplier
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  name="itemIdentifier"
                  label="Item Identifier"
                  type="itemIdentifier"
                  id="itemIdentifier"
                  autoComplete="itemIdentifier"
                  value={data.itemIdentifier}
                  onChange={(e) => changeInput(e, "itemIdentifier")}
                />
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
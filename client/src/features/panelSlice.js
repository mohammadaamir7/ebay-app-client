import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import config from '../config.json';

export const getitemInfo = createAsyncThunk(
    'panel/getitemInfo',
    async ({ site, page, limit, filters }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/items`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    params: { page, limit, filters },
                }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getListingsInfo = createAsyncThunk(
    'panel/getListingsInfo',
    async ({ site, page, limit, filters }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
              `${config.DOMAIN}${config.API_PREFIX}/sites/listings`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: { page, limit, filters },
              }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getListingsBrands = createAsyncThunk(
    'panel/getListingsBrands',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
              `${config.DOMAIN}${config.API_PREFIX}/sites/fetchListingsBrands`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getNewListings = createAsyncThunk(
    'panel/getNewListings',
    async ({ site }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/newListings?site=${site}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getSuppliers = createAsyncThunk(
    'panel/getSuppliers',
    async ({ site, page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/suppliers?page=${page}&limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getStores = createAsyncThunk(
    'panel/getStores',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/stores?page=${page}&limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getConfigInfo = createAsyncThunk(
    'panel/getConfigInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/configs`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getSearchInfo = createAsyncThunk(
    'panel/getSearchInfo',
    async ({ term, site, brand, page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/search?term=${term}&site=${site}&brand=${brand}&page=${page}&limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getSearchListingsInfo = createAsyncThunk(
    'panel/getSearchListingsInfo',
    async ({ term, site, brand, page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/searchListings?term=${term}&page=${page}&limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteItem = createAsyncThunk(
    'panelItem/deleteItem',
    async ({id}, {rejectWithValue}) => {
        try {
            const response = await axios.delete(
              `${config.DOMAIN}${config.API_PREFIX}/sites/items`,
              { params: { ids: id } },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteListing = createAsyncThunk(
    'panelItem/deleteListing',
    async ({id}, {rejectWithValue}) => {
        try {
            const response = await axios.delete(
              `${config.DOMAIN}${config.API_PREFIX}/sites/listings`,
              { params: { ids: id } },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteStore = createAsyncThunk(
    'panelItem/deleteStore',
    async ({id}, {rejectWithValue}) => {
        try {
            const response = await axios.delete(
              `${config.DOMAIN}${config.API_PREFIX}/sites/store`,
              { params: { ids: id } },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteSupplier = createAsyncThunk(
    'panelItem/deleteSupplier',
    async ({id}, {rejectWithValue}) => {
        try {
            const response = await axios.delete(
              `${config.DOMAIN}${config.API_PREFIX}/sites/supplier`,
              { params: { ids: id } },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const fetchListings = createAsyncThunk(
    'panelItem/fetchListings',
    async (data, {rejectWithValue}) => {
        try {
            const response = await axios.get(
              `${config.DOMAIN}${config.API_PREFIX}/sites/fetchListings`,
              { params: { data } },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const panelSlice = createSlice({
    name: 'panel',
    initialState: {
        pageItems: [],
        listings: [],
        listingsBrands: [],
        suppliers: [],
        stores: [],
        newListings: [],
        pageLimit: 10,
        page: 1,
        totalpages: 1,
        searchTerm: '',
        selectedSite: '',
        selectedBrand: '',
        sites: [],
        itemEditPageActive: false,
        activeEditItem: {},
        status: null,
        error: null,
    },
    reducers: {
        updateFilter: (state, { payload }) => {
            if (payload.filter === 'site') state.selectedSite = payload.value;
            if (payload.filter === 'brand') state.selectedBrand = payload.value;
            if (payload.filter === 'term') state.searchTerm = payload.value;
        },
        updateItemEditPageActive: (state, { payload }) => {
            state.itemEditPageActive = true;
            state.activeEditItem = payload; 
        },
    },
    extraReducers: {
        [getitemInfo.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getitemInfo.fulfilled]: (state, { payload }) => {
            state.status = 'succeeded';
        
            state.pageItems = payload.items;
            state.totalpages = Math.ceil(payload.total / state.pageLimit);
        },
        [getitemInfo.rejected]: (state, { payload }) => {
            state.status = 'failed';
            state.error = payload;
        },
        [getListingsBrands.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getListingsBrands.fulfilled]: (state, { payload }) => {
            state.status = 'succeeded';
        
            state.listingsBrands = payload.brands;
        },
        [getListingsBrands.rejected]: (state, { payload }) => {
            state.status = 'failed';
            state.error = payload;
        },
        [getNewListings.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getNewListings.fulfilled]: (state, { payload }) => {
            state.status = 'succeeded';
        
            state.newListings = payload.items;
            state.totalpages = Math.ceil(payload.total / state.pageLimit);
        },
        [getNewListings.rejected]: (state, { payload }) => {
            state.status = 'failed';
            state.error = payload;
        },
        [getConfigInfo.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getConfigInfo.fulfilled]: (state, { payload }) => {
            state.status = 'succeeded';
            state.sites = payload.sites;
        },
        [getConfigInfo.rejected]: (state, { payload }) => {
            state.status = 'failed';
            state.error = payload;
        },
        [getSearchInfo.pending]: (state, action) => {
            state.searchStatus = 'Loading...';
        },
        [getSearchInfo.fulfilled]: (state, { payload }) => {
            const results = payload.items.length;
            state.searchStatus = `${results} Results for ${payload.term}`; 

            state.pageItems = payload.items;
            state.totalpages = Math.ceil(payload.total / state.pageLimit);
        },
        [getSearchInfo.rejected]: (state, { payload }) => {
            state.searchStatus = 'Search Error';
            state.error = payload;
        },
        [getListingsInfo.pending]: (state, action) => {
            state.searchListingsStatus = 'Loading...';
        },
        [getListingsInfo.fulfilled]: (state, { payload }) => {
            const results = payload.items.length;
            state.searchListingsStatus = `${results} Results for ${payload.term}`; 

            state.listings = payload.items;
            state.totalpages = Math.ceil(payload.total / state.pageLimit);
        },
        [getListingsInfo.rejected]: (state, { payload }) => {
            state.searchListingsStatus = 'Search Error';
            state.error = payload;
        },
        [getSuppliers.pending]: (state, action) => {
            state.getSuppliersStatus = 'Loading...';
        },
        [getSuppliers.fulfilled]: (state, { payload }) => {
            const results = payload.items.length;
            state.getSuppliersStatus = `${results} Results for suppliers`; 

            state.suppliers = payload.items;
            state.totalpages = Math.ceil(payload.total / state.pageLimit);
        },
        [getSuppliers.rejected]: (state, { payload }) => {
            state.getSuppliersStatus = 'Search Error';
            state.error = payload;
        },
        [getStores.pending]: (state, action) => {
            state.getStores = 'Loading...';
        },
        [getStores.fulfilled]: (state, { payload }) => {
            const results = payload.items.length;
            state.getStores = `${results} Results for stores`; 

            state.stores = payload.items;
            state.totalpages = Math.ceil(payload.total / state.pageLimit);
        },
        [getStores.rejected]: (state, { payload }) => {
            state.getStores = 'Search Error';
            state.error = payload;
        },
        [deleteItem.pending]: (state, action) => {
            state.deleteItem = 'Loading...';
        },
        [deleteItem.fulfilled]: (state, { payload }) => {
            state.deleteItem = `${payload} Results for stores`; 
        },
        [deleteItem.rejected]: (state, { payload }) => {
            state.deleteItem = 'Search Error';
            state.error = payload;
        },
        [deleteListing.pending]: (state, action) => {
            state.deleteListing = 'Loading...';
        },
        [deleteListing.fulfilled]: (state, { payload }) => {
            state.deleteListing = `${payload} Results for stores`; 
        },
        [deleteListing.rejected]: (state, { payload }) => {
            state.deleteListing = 'Search Error';
            state.error = payload;
        },
        [deleteStore.pending]: (state, action) => {
            state.deleteStore = 'Loading...';
        },
        [deleteStore.fulfilled]: (state, { payload }) => {
            state.deleteStore = `${payload} Results for stores`; 
        },
        [deleteStore.rejected]: (state, { payload }) => {
            state.deleteStore = 'Search Error';
            state.error = payload;
        },
        [deleteSupplier.pending]: (state, action) => {
            state.deleteSupplier = 'Loading...';
        },
        [deleteSupplier.fulfilled]: (state, { payload }) => {
            state.deleteSupplier = `${payload} Results for stores`; 
        },
        [deleteSupplier.rejected]: (state, { payload }) => {
            state.deleteSupplier = 'Search Error';
            state.error = payload;
        },
        [fetchListings.pending]: (state, action) => {
            state.fetchListings = 'Loading...';
        },
        [fetchListings.fulfilled]: (state, { payload }) => {
            state.fetchListings = `${payload} Results for stores`; 
        },
        [fetchListings.rejected]: (state, { payload }) => {
            state.fetchListings = 'Fetching Error';
            state.error = payload;
        }
    },
});

export const { updateFilter, updateItemEditPageActive } = panelSlice.actions;

export default panelSlice.reducer;
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

import config from '../config.json';
import { toast } from 'react-toastify';

export const getItemDetail = createAsyncThunk(
    'panelItem/getItemDetail',
    async ({id}, {rejectWithValue}) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/items/${id}`,
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

export const getListingDetail = createAsyncThunk(
    'panelItem/getListingDetail',
    async ({id}, {rejectWithValue}) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/listings/${id}`,
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

export const updateItem = createAsyncThunk(
    'panelItem/updateItem',
    async ({id, data}, {rejectWithValue}) => {
        try {
            console.log("here saving data", data, id)
            const response = await axios.put(`${config.DOMAIN}${config.API_PREFIX}/sites/items/${id}`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateListing = createAsyncThunk(
    'panelItem/updateListing',
    async ({id, data}, {rejectWithValue}) => {
        try {
            console.log("here saving data", data, id)
            const response = await axios.put(`${config.DOMAIN}${config.API_PREFIX}/sites/listing/${id}`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

            return response.data;
        } catch (err) {         
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateStore = createAsyncThunk(
    'panelItem/updateStore',
    async ({id, data}, {rejectWithValue}) => {
        try {
            console.log("here saving data", data, id)
            const response = await axios.put(`${config.DOMAIN}${config.API_PREFIX}/sites/store/${id}`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addSupplier = createAsyncThunk(
    'panelItem/addSupplier',
    async ({id, data}, {rejectWithValue}) => {
        try {
            console.log("here saving data", data, id)
            const response = await axios.post(`${config.DOMAIN}${config.API_PREFIX}/sites/addSupplier/`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            return response.status;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addStore = createAsyncThunk(
    'panelItem/addStore',
    async ({id, data}, {rejectWithValue}) => {
        try {
            console.log("here saving data", data, id)
            const response = await axios.post(`${config.DOMAIN}${config.API_PREFIX}/sites/addStore/`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            return response.status;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addNewListings = createAsyncThunk(
    'panel/addNewListings',
    async ({ site, items, store }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
              `${config.DOMAIN}${config.API_PREFIX}/sites/addNewListings?site=${site}`,
              { items, store },
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

export const getSupplierInfo = createAsyncThunk(
    'panelItem/getSupplierInfo',
    async ({id}, {rejectWithValue}) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/supplier/${id}`,
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

export const getStoreInfo = createAsyncThunk(
    'panelItem/getStoresInfo',
    async ({id}, {rejectWithValue}) => {
        try {
            const response = await axios.get(
                `${config.DOMAIN}${config.API_PREFIX}/sites/store/${id}`,
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

const panelItemSlice = createSlice({
    name: 'panelItem',
    initialState: {
        data: {},
        status: null,
        error: null,
    },
    reducers: {
        updateInventoryField: (state, {payload}) => {
            let items = state.data.inventory
            items[payload.index].quantity = payload.val
            state.data.inventory = [...items]
        },
        updateField: (state, {payload}) => {
            let updateData = state.data
            updateData[payload.key] = payload.val
            state.data = {...updateData}
        },
        addOption: (state, {payload}) => {
            let items = [...state.data.options]
            if (items.indexOf(payload.val) > -1) {
                return
            }
            state.data.options = [...items, payload.val]
        },
        removeOption: (state, {payload}) => {
            let items = [...state.data.options]
            items.splice(payload.ind, 1)
            state.data.options = [...items]
        }
    },
    extraReducers: {
        [getItemDetail.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getItemDetail.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            state.data = payload.item;
        },
        [getItemDetail.rejected]: (state, {payload}) => {
            state.status = 'failed';
            state.error = payload;
        },
        [getListingDetail.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getListingDetail.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            state.data = payload.item;
        },
        [getListingDetail.rejected]: (state, {payload}) => {
            state.status = 'failed';
            state.error = payload;
        },
        [updateItem.pending]: (state, action) => {
            state.status = 'saving';
        },
        [updateItem.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            // state.data = payload.item;
        },
        [updateItem.rejected]: (state, {payload}) => {
            state.status = 'failed';
            state.error = payload;
        },
        [updateListing.pending]: (state, action) => {
            state.status = 'saving';
        },
        [updateListing.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            // state.data = payload.item;
        },
        [updateListing.rejected]: (state, {payload}) => {
            state.status = 'failed';
            state.error = payload;
        },
        [updateStore.pending]: (state, action) => {
            state.status = 'saving';
        },
        [updateStore.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            // state.data = payload.item;
        },
        [updateStore.rejected]: (state, {payload}) => {
            state.status = 'failed';
            state.error = payload;
        },
        [addSupplier.pending]: (state, action) => {
            state.status = 'saving';
        },
        [addSupplier.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            // state.data = payload.item;
        },
        [addSupplier.rejected]: (state, {payload}) => {
            state.status = 'failed';
            state.error = payload;
        },
        [addStore.pending]: (state, action) => {
            state.status = 'saving';
        },
        [addStore.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            // state.data = payload.item;
        },
        [addNewListings.pending]: (state, action) => {
            state.status = 'saving';
        },
        [addNewListings.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            // state.data = payload.item;
        },
        [addNewListings.rejected]: (state, {payload}) => {
            state.status = 'failed';
            state.error = payload;
        },
        [getSupplierInfo.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getSupplierInfo.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            state.data = payload.item;
        },
        [getSupplierInfo.rejected]: (state, {payload}) => {
            state.status = 'failed';
            state.error = payload;
        },
        [getStoreInfo.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getStoreInfo.fulfilled]: (state, {payload}) => {
            state.status = 'succeeded';

            state.data = payload.item;
        },
        [getStoreInfo.rejected]: (state, {payload}) => {
            state.status = 'failed';
            state.error = payload;
        },
    },
});

export const {updateInventoryField, updateField, addOption, removeOption} = panelItemSlice.actions;

export default panelItemSlice.reducer;
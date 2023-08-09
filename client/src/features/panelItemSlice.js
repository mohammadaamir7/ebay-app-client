import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

import config from '../config.json';

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
        }
    },
});

export const {updateInventoryField, updateField, addOption, removeOption} = panelItemSlice.actions;

export default panelItemSlice.reducer;
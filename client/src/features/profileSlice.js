import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import config from '../config.json';

export const updateUserProfile = createAsyncThunk(
	'profile/updateUserProfile',
	async (profileData, { rejectWithValue }) => {
		try {
			const response = await axios.put('', profileData);
			return response.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const sendPasswordResetCode = createAsyncThunk(
	'profile/sendPasswordResetCode',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`${config.DOMAIN}${config.API_PREFIX}/account/profile/send-code`,
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


const profileSlice = createSlice({
	name: 'profile',
	initialState: {
		profileData: {
			firstName: '',
			lastName: '',
			username: '',
			email: '',
		},
		resetedPassword: '',
		passwordModalOpen: false,
		status: null,
		error: null,
	},
	reducers: {
		updateField: (state, { payload }) => {
			state.profileData[payload.field] = payload.value;
		},
		updatePasswordField: (state, { payload }) => {
			state.resetedPassword = payload.value;
		},
		openPasswordModal: (state, action) => {
			state.passwordModalOpen = true;
		},
		closePasswordModal: (state, action) => {
			state.passwordModalOpen = false;
		},
	},
	extraReducers: {
		[updateUserProfile.pending]: (state, action) => {
			state.status = 'loading';
		},
		[updateUserProfile.fulfilled]: (state, { payload }) => {
			state.status = 'succeeded';
		},
		[updateUserProfile.rejected]: (state, { payload }) => {
			state.status = 'failed';
			state.error = payload;
		},
	},
});

export const { updateField, updatePasswordField, openPasswordModal, closePasswordModal } = profileSlice.actions;

export default profileSlice.reducer;

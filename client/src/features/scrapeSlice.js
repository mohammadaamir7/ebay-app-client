import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import config from '../config.json';

export const scrapersAvailable = createAsyncThunk(
	'scrape/scrapersAvailable',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`${config.DOMAIN}${config.API_PREFIX}/scrape/scrapers`,
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

export const scraperConfig = createAsyncThunk(
	'scrape/scraperConfig',
	async (site, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`${config.DOMAIN}${config.API_PREFIX}/scrape/scraper-config?site=${site}`,
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

export const scraperControl = createAsyncThunk(
	'scrape/scraperControl',
	async ({ site, action }, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				`${config.DOMAIN}${config.API_PREFIX}/scrape/scraper-control`,
				{ site, action },
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

export const uploadConfig = createAsyncThunk(
	'scrape/uploadConfig',
	async ({ site, scraperConfig, brand, delayOn, delayTime, interception }, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				`${config.DOMAIN}${config.API_PREFIX}/scrape/upload-config`,
				{ site, scraperConfig, brand, delayOn, delayTime, interception },
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

const scrapeSlice = createSlice({
	name: 'scrape',
	initialState: {
		scrapers: [],
		brands: [],
		selectedSite: '',
		scraperConfig: '',
		brand: '',
		interception: '',
		delay: {
			delayOn: '',
			delayTime: 0
		},
		uploadStatus: '', 
		scraperStatus: {
			text: '',
			pages: 0,
			items: 0
		},
		action: '',
		error: null,
	},
	reducers: {
		updateSite: (state, { payload }) => {
			state.selectedSite = payload;
			state.status = payload;
		},
		updateConfig: (state, { payload }) => {
			state.scraperConfig = payload;
		},
		updateBrand: (state, { payload }) => {
			state.brand = payload;

			state.scraperConfig = JSON.stringify({ ...JSON.parse(state.scraperConfig), brand: payload }, null, 2);
		},
		updateDelay: (state, { payload }) => {
			state.delay.delayOn = payload.delayOn;
			state.delay.delayTime = payload.delayTime;

			state.scraperConfig = JSON.stringify({ ...JSON.parse(state.scraperConfig), delay: payload }, null, 2);
		},
		updateInterception: (state, { payload }) => {
			state.interception = payload;

			state.scraperConfig = JSON.stringify({ ...JSON.parse(state.scraperConfig), interception: payload }, null, 2);
		},
		updateAction: (state, { payload }) => { 
			state.action = payload;
		},
		updateConfigSocket: (state, { payload }) => {
			console.log(payload);
			if (payload.site === state.selectedSite) {
				state.scraperConfig = JSON.stringify(payload.updatedConfigDoc, null, 2);
				state.scraperStatus = payload.updatedConfigDoc.status;
			}
		}
	},
	extraReducers: {
		// scrapersAvailable
		[scrapersAvailable.pending]: (state, action) => {
			// state.status = 'loading';
		},
		[scrapersAvailable.fulfilled]: (state, { payload }) => {
			state.scrapers = payload.scrapers;
		},
		[scrapersAvailable.rejected]: (state, { payload }) => {
			// state.status = 'failed';
			state.error = payload;
		},
		// scraperConfig
		[scraperConfig.pending]: (state, action) => {
			// state.status = 'loading';
		},
		[scraperConfig.fulfilled]: (state, { payload }) => {
			const scraperConfig = payload.scraperConfig;
			state.brands = payload.brands;

			state.scraperConfig = JSON.stringify(scraperConfig, null, 2);

			state.brand = scraperConfig.brand;
			state.interception = scraperConfig.interception;
			state.delay = scraperConfig.delay;

			state.scraperStatus.text = scraperConfig.status.text;
			state.scraperStatus.pages = scraperConfig.status.pages;
			state.scraperStatus.items = scraperConfig.status.items;
		},
		[scraperConfig.rejected]: (state, { payload }) => {
			state.status = 'failed';
			state.error = payload;
		},
		// scraperControl
		[scraperControl.pending]: (state, action) => {
			// state.status = 'loading';
		},
		// [scraperConfig.fulfilled]: (state, { payload }) => {

		// },
		[scraperConfig.rejected]: (state, { payload }) => {
			// state.status = 'failed';
			state.error = payload;
		},
		// updateConfig
		[uploadConfig.pending]: (state, action) => {
			state.uploadStatus = 'Loading';
		},
		[uploadConfig.fulfilled]: (state, { payload }) => {
			state.uploadStatus = 'Saved';
		},
		[uploadConfig.rejected]: (state, { payload }) => {
			state.uploadStatus = 'Failed';
			state.error = payload;
		},
	},
});

export const {
	updateSite,
	updateConfig,
	updateBrand,
	updateDelay,
	updateAction,
	updateInterception,
	updateConfigSocket
} = scrapeSlice.actions;

export default scrapeSlice.reducer;

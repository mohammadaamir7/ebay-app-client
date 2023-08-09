import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './features/profileSlice';
import scrapeReducer from './features/scrapeSlice';
import panelReducer from './features/panelSlice';
import panelItemReducer from './features/panelItemSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    scrape: scrapeReducer,
    panel: panelReducer,
    panelItem: panelItemReducer
  }
});

export default store;

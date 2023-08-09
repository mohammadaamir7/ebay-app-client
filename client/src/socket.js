import io from 'socket.io-client';
import store from './store';
import { updateConfigSocket } from './features/scrapeSlice';

import config from './config.json';

export const socket = io(config.DOMAIN);

socket.on('connect', () => {
  console.log('Redux client connected');
});

socket.on('disconnect', () => {
  console.log('Redux client disconnected');
});

socket.on('config-updated', ({ site, updatedConfigDoc }) => { 
    console.log(updatedConfigDoc)
    store.dispatch(updateConfigSocket({ site, updatedConfigDoc }));
});


socket.on('error', (error) => {
  console.error(`Error from socket: ${error}`);
});
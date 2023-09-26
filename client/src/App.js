import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';

import {socket} from './socket';

import config from './config.json';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/@flaticon/flaticon-uicons/css/all/all.css'
import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import ProtectedRoute from './auth/ProtectedRoute';
import ProtectedEdit from './auth/ProtectedEdit';

import ErrorCode from './pages/ErrorCode/ErrorCode';

import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';

import Profile from './pages/Profile/Profile';

import Scrape from './pages/Scrape/Scrape';
import Panel from './pages/Panel/Panel';
import ItemEdit from './pages/ItemEdit/ItemEdit';
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import Router from './routes';
import ThemeProvider from './theme';
import { HelmetProvider } from 'react-helmet-async';

function App() {
    return (
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter>
            <div className="App">
              <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <Router />
              </ThemeProvider>
              {/* <Sidebar/> */}
              {/* <Routes> */}
              {/* <Route path="/sign-in" element={<SignIn config={config}/>}/> */}
              {/* <Route element={<ProtectedRoute />}> */}
              {/* <Route path="/profile" element={<Profile/>}/> */}
              {/* <Route path="/scrape" element={<Scrape/>}/> */}
              {/* <Route path="/panel" element={<Panel/>}/> */}
              {/* <Route path="/sign-up" element={<SignUp config={config}/>}/> */}
              {/* <Route path="/item-edit/:id" element={<ItemEdit/>}/> */}

              {/* <Route element={<ProtectedEdit />}> */}
              {/* </Route> */}
              {/* <Route path='*' element={<ErrorCode/>}/> */}
              {/* </Routes> */}
            </div>
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    );
}

export default App;

import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';

// import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import Scrape from './pages/Scrape/Scrape';
import SignUp from './pages/SignUp/SignUp';
import Panel from './pages/Panel/Panel';
import EbayPanel from './pages/EbayPanel/EbayPanel';
import SuppliersPanel from './pages/SuppliersPanel/SuppliersPanel';
import StoresPanel from './pages/StoresPanel/StoresPanel';
import ItemEdit from './pages/ItemEdit/ItemEdit';
import Profile from './pages/Profile/Profile';
import config from './config.json';
import ListingEdit from './pages/ListingEdit/ListingEdit';
import AddSupplier from './pages/AddSupplier/AddSupplier';
import SupplierInfoOptions from './components/SupplierInfoOptions/SupplierInfoOptions';
import StoreInfoOptions from './components/StoreInfoOptions/StoreInfoOptions';
import AddStore from './pages/AddStore/AddStore';

// ----------------------------------------------------------------------
export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/listings" />, index: true },
        { path: 'profile', element: <Profile /> },
        { path: 'scrape', element: <Scrape /> },
        { path: 'panel', element: <Panel /> },
        { path: 'listings', element: <EbayPanel /> },
        { path: 'sign-up', element: <SignUp config={config} /> },
        { path: 'item-edit/:id', element: <ItemEdit /> },
        { path: 'listing-edit/:id', element: <ListingEdit /> },
        { path: 'add-supplier', element: <AddSupplier /> },
        { path: 'add-store', element: <AddStore /> },
        { path: 'suppliers', element: <SuppliersPanel /> },
        { path: 'stores', element: <StoresPanel /> },
        { path: 'supplier-edit/:id', element: <SupplierInfoOptions /> },
        { path: 'store-edit/:id', element: <StoreInfoOptions /> },
      ],
    },
    // {
    //   path: 'login',
    //   element: <LoginPage />,
    // },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

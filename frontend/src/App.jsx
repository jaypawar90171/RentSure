import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Landing from './pages/Landing';
import Home from './pages/Home';
// import ContractDetail from './pages/ContractDetail';
import CreateProperty from './pages/CreateProperty';
// import ContractsPage from './pages/PropertiesPage';
import LandlordDashboard from './pages/LandlordDashboard';
import TenantDashboard from './pages/TenantDashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Listings from './pages/Listings';
import RoleSelectionCard from './pages/RoleCard';
import RegisterLandlord from './pages/RegisterLandlord';
import RegisterTenant from './pages/RegisterTenant';
import PropertyDetail from './pages/PropertyDetail';
import PropertiesPage from './pages/PropertiesPage';
import Gemini from './pages/Gemini';

import { MapLocationProvider } from './context/mapContext';
const App = () => {
  return (
    <GoogleOAuthProvider clientId="580101834840-54o1tdjrahtaqp1fsldi9o45903th69t.apps.googleusercontent.com">
      <BrowserRouter>
      <MapLocationProvider>
        <Routes>
          
          <Route path='/properties/:id' element={<PropertyDetail />} />
          <Route path='/create-property' element={<CreateProperty />} />
          <Route path='/properties' element={<PropertiesPage/>} />
          <Route path='/' element={<Landing />} />
          <Route path='/landlord' element={<LandlordDashboard />} />
          <Route path='/tenant' element={<TenantDashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/listing' element={<Listings/>}/>
          <Route path='/roleCard' element={<RoleSelectionCard />} />
          <Route path='/register-landlord' element={<RegisterLandlord />} />
          <Route path='/register-tenant' element={<RegisterTenant />} />
          <Route path='/gemini' element={<Gemini/>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        </MapLocationProvider>

      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
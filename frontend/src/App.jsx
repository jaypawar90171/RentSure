import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Landing from './pages/Landing';
import Home from './pages/Home';
import ContractDetail from './pages/ContractDetail';
import CreateContract from './pages/CreateContract';
import ContractsPage from './pages/ContractsPage';
import LandlordDashboard from './pages/LandlordDashboard';
import TenantDashboard from './pages/TenantDashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Listings from './pages/Listings';
import RoleSelectionCard from './pages/RoleCard';
import RegisterLandlord from './pages/RegisterLandlord';
import RegisterTenant from './pages/RegisterTenant';
const App = () => {
  return (
    <GoogleOAuthProvider clientId="580101834840-54o1tdjrahtaqp1fsldi9o45903th69t.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path='/contracts/:id' element={<ContractDetail />} />
          <Route path='/create-contract' element={<CreateContract />} />
          <Route path='/contracts' element={<ContractsPage />} />
          <Route path='/' element={<Landing />} />
          <Route path='/landlord' element={<LandlordDashboard />} />
          <Route path='/tenant' element={<TenantDashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/listing' element={<Listings/>}/>
          <Route path='/roleCard' element={<RoleSelectionCard />} />
          <Route path='/register-landlord' element={<RegisterLandlord />} />
          <Route path='/register-tenant' element={<RegisterTenant />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
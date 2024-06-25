import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AddAccount from './components/AddAccount';
import DataPage from './components/DataPage';
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-account" element={
        <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
          <AddAccount />
        </MsalAuthenticationTemplate>
      } />
      <Route path="/data" element={<DataPage />} />
    </Routes>
  );
};

export default AppRoutes;
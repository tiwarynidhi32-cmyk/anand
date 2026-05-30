/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './views/Login';

// Module Views
import Dashboard from './views/Dashboard';
import Patients from './views/Patients';
import Appointments from './views/Appointments';
import OPD from './views/OPD';
import IPD from './views/IPD';
import Surgery from './views/Surgery';
import Pharmacy from './views/Pharmacy';
import Optical from './views/Optical';
import Billing from './views/Billing';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';

function ProtectedApp() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients/*" element={<Patients />} />
        <Route path="appointments/*" element={<Appointments />} />
        <Route path="opd/*" element={<OPD />} />
        <Route path="ipd/*" element={<IPD />} />
        <Route path="surgery/*" element={<Surgery />} />
        <Route path="pharmacy/*" element={<Pharmacy />} />
        <Route path="optical/*" element={<Optical />} />
        <Route path="billing/*" element={<Billing />} />
        <Route path="reports" element={<ReportsView />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedApp />
      </Router>
    </AuthProvider>
  );
}



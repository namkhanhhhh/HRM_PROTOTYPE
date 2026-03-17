import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Positions from './pages/Positions';
import { RoleProvider } from './context/RoleContext';
import './styles/main.css';

function App() {
  return (
    <RoleProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes here for prototype */}
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/contracts" element={<div className="card">Hợp đồng Page Placeholder</div>} />
            <Route path="/history" element={<div className="card">Lịch sử Page Placeholder</div>} />
            <Route path="/attendance" element={<Employees />} /> {/* Reusing for demo if needed */}
          </Routes>
        </MainLayout>
      </Router>
    </RoleProvider>
  );
}

export default App;

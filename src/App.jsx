import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Positions from './pages/Positions';
import Contracts from './pages/Contracts';
import EmployeeHistory from './pages/EmployeeHistory';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Expenses from './pages/Expenses';
import { RoleProvider } from './context/RoleContext';
import './styles/main.css';

function App() {
  return (
    <RoleProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/history" element={<EmployeeHistory />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/expenses" element={<Expenses />} />
          </Routes>
        </MainLayout>
      </Router>
    </RoleProvider>
  );
}

export default App;

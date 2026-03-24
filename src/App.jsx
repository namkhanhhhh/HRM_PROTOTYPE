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
import PayrollSetup from './pages/PayrollSetup';
import PayrollCalculation from './pages/PayrollCalculation';
import Profile from './pages/Profile';
import AccountSettings from './pages/AccountSettings';
import SecuritySettings from './pages/SecuritySettings';
import MySalary from './pages/MySalary';
import MyAttendance from './pages/MyAttendance';
import MyLeaves from './pages/MyLeaves';
import MyExpenses from './pages/MyExpenses';
import ReportManagement from './pages/ReportManagement';
import { RoleProvider } from './context/RoleContext';
import { NotificationProvider } from './context/NotificationContext';
import './styles/main.css';

function App() {
  return (
    <RoleProvider>
      <NotificationProvider>
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
              <Route path="/payroll-setup" element={<PayrollSetup />} />
              <Route path="/payroll-calc" element={<PayrollCalculation />} />
              <Route path="/reports" element={<ReportManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/security" element={<SecuritySettings />} />
              <Route path="/my-salary" element={<MySalary />} />
              <Route path="/my-attendance" element={<MyAttendance />} />
              <Route path="/my-leaves" element={<MyLeaves />} />
              <Route path="/my-expenses" element={<MyExpenses />} />
            </Routes>
          </MainLayout>
        </Router>
      </NotificationProvider>
    </RoleProvider>
  );
}

export default App;

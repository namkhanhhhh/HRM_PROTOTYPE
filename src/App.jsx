import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import AdminOverview from './pages/AdminOverview';
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
import PersonalDashboard from './pages/PersonalDashboard';
import Profile from './pages/Profile';
import AccountSettings from './pages/AccountSettings';
import SecuritySettings from './pages/SecuritySettings';
import MySalary from './pages/MySalary';
import MyAttendance from './pages/MyAttendance';
import MyLeaves from './pages/MyLeaves';
import MyExpenses from './pages/MyExpenses';
import ReportManagement from './pages/ReportManagement';
import HRAnalytics from './pages/HRAnalytics';
import FinanceAnalytics from './pages/FinanceAnalytics';
import AttendanceOT from './pages/AttendanceOT';
import AttendanceViolations from './pages/AttendanceViolations';
import AttendanceReconciliation from './pages/AttendanceReconciliation';
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
              <Route path="/attendance-ot" element={<AttendanceOT />} />
              <Route path="/attendance-violations" element={<AttendanceViolations />} />
              <Route path="/attendance-reconciliation" element={<AttendanceReconciliation />} />
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
              <Route path="/personal-overview" element={<PersonalDashboard />} />
              <Route path="/admin-overview" element={<AdminOverview />} />
              <Route path="/hr-analytics" element={<HRAnalytics />} />
              <Route path="/finance-analytics" element={<FinanceAnalytics />} />
            </Routes>
          </MainLayout>
        </Router>
      </NotificationProvider>
    </RoleProvider>
  );
}

export default App;

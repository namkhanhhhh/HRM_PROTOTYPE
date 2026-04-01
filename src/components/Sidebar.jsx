import React from 'react';
import {
  LayoutDashboard, Users, Building2, Briefcase, FileText,
  History, Clock, CheckSquare, Banknote, Settings,
  LogOut, ChevronRight, ShieldCheck, UserCircle, CreditCard, AlertCircle, Home, PieChart, TrendingUp, CalendarDays, Timer, RefreshCw
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

const Sidebar = () => {
  const location = useLocation();
  const { role, setRole } = useRole();

  const adminMenu = [
    {
      section: 'Dashboard Tổng quan',
      items: [
        { icon: <LayoutDashboard size={18} />, label: 'Khái quát hệ thống', path: '/admin-overview' },
        { icon: <PieChart size={18} />, label: 'Phân tích nhân lực', path: '/hr-analytics' },
        { icon: <TrendingUp size={18} />, label: 'Chi phí & Quỹ lương', path: '/finance-analytics' },
      ]
    },
    {
      section: 'Quản lý nhân sự',
      items: [
        { icon: <Users size={18} />, label: 'Nhân viên', path: '/employees' },
        { icon: <Building2 size={18} />, label: 'Phòng ban', path: '/departments' },
        { icon: <Briefcase size={18} />, label: 'Chức vụ', path: '/positions' },
        { icon: <FileText size={18} />, label: 'Hợp đồng lao động', path: '/contracts' },
        { icon: <History size={18} />, label: 'Lịch sử nhân sự', path: '/history' },
      ]
    },
    {
      section: 'Quản lý chấm công',
      items: [
        { icon: <Clock size={18} />, label: 'Dữ liệu chấm công', path: '/attendance' },
        { icon: <Timer size={18} />, label: 'Theo dõi Tăng ca (OT)', path: '/attendance-ot' },
        { icon: <CalendarDays size={18} />, label: 'Thống kê Đi muộn/Về sớm', path: '/attendance-violations' },
        { icon: <RefreshCw size={18} />, label: 'Đối soát Công & Phép', path: '/attendance-reconciliation' },
      ]
    },
    {
      section: 'Quản lý Lương',
      items: [
        { icon: <Settings size={18} />, label: 'Thiết lập chỉ số', path: '/payroll-setup' },
        { icon: <Banknote size={18} />, label: 'Bảng lương thực tế', path: '/payroll-calc' },
      ]
    },
    {
      section: 'Đơn từ & Phê duyệt',
      items: [
        { icon: <CheckSquare size={18} />, label: 'Quản lý nghỉ phép', path: '/leaves' },
        { icon: <CreditCard size={18} />, label: 'Quản lý duyệt chi phí', path: '/expenses' },
        { icon: <AlertCircle size={18} />, label: 'Báo cáo sai sót', path: '/reports' },
      ]
    },
    {
      section: 'Thông tin cá nhân',
      items: [
        { icon: <UserCircle size={18} />, label: 'Hồ sơ tài khoản', path: '/profile' },
      ]
    },
    {
      section: 'Cấu hình Hệ thống',
      items: [
        { icon: <Settings size={18} />, label: 'Cài đặt hệ thống', path: '/settings' },
        { icon: <ShieldCheck size={18} />, label: 'Bảo mật & Mật khẩu', path: '/security' },
      ]
    }
  ];

  const personalMenu = [
    {
      section: 'Dashboard Tổng quan',
      items: [
        { icon: <LayoutDashboard size={18} />, label: 'Báo cáo thu nhập', path: '/personal-overview' },
      ]
    },
    {
      section: 'Lương của tôi',
      items: [
        { icon: <Banknote size={18} />, label: 'Phiếu lương chi tiết', path: '/my-salary' },
      ]
    },
    {
      section: 'Lịch sử chấm công',
      items: [
        { icon: <Clock size={18} />, label: 'Chi tiết điểm danh', path: '/my-attendance' },
      ]
    },
    {
      section: 'Đơn từ & Phê duyệt',
      items: [
        { icon: <CheckSquare size={18} />, label: 'Đơn nghỉ phép', path: '/my-leaves' },
        { icon: <CreditCard size={18} />, label: 'Đơn xin cấp chi phí', path: '/my-expenses' },
      ]
    },
    {
      section: 'Thông tin cá nhân',
      items: [
        { icon: <UserCircle size={18} />, label: 'Hồ sơ của tôi', path: '/profile' },
      ]
    },
    {
      section: 'Trao đổi & Báo cáo',
      items: [
        { icon: <AlertCircle size={18} />, label: 'Báo cáo sai sót', path: '/reports' },
      ]
    }
  ];

  const fullMenu = role === 'admin' ? adminMenu : personalMenu;
  
  // Find which section should be open
  let activeSection = null;
  for (const group of fullMenu) {
    if (group.items.some(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'))) {
      activeSection = group;
      break;
    }
  }

  // fallback if active section is not found
  const displayMenu = activeSection ? [activeSection] : [];

  return (
    <div className="sidebar" style={{
      width: '280px',
      height: '100vh',
      background: 'var(--bg-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Logo Section */}
      <div style={{ padding: '1.5rem 1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <img
            src="/tds_img.jpg"
            alt="Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              objectFit: 'cover',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>TD Solutions</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Platform v2.0</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem' }}>
        <Link to="/" style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          padding: '10px 14px', background: 'rgba(255,255,255,0.06)', 
          borderRadius: '12px', color: '#e2e8f0', fontSize: '0.9rem', 
          textDecoration: 'none', transition: 'all 0.2s', fontWeight: '600',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Home size={18} />
          Về Menu Chính
        </Link>
      </div>

      {/* Navigation Section */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 1rem' }}>
        {displayMenu.map((group, idx) => (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#94a3b8',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '0 0.5rem 0.75rem'
            }}>
              Phân hệ: {group.section}
            </div>
            <ul style={{ listStyle: 'none' }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path} style={{ marginBottom: '0.35rem' }}>
                    <Link to={item.path} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: isActive ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                      color: isActive ? 'white' : '#cbd5e1',
                      transition: 'all 0.2s',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.95rem',
                      border: isActive ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid transparent'
                    }}>
                      <span style={{ color: isActive ? '#60a5fa' : '#94a3b8', display: 'flex' }}>
                        {item.icon}
                      </span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.15)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

        <Link to="/profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          borderRadius: '12px',
          textDecoration: 'none',
          transition: 'all 0.2s',
          cursor: 'pointer',
          background: location.pathname === '/profile' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '0.9rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>
            NK
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Nam Khánh
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>
              khanh.admin
            </div>
          </div>
          <ChevronRight size={16} color="#64748b" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

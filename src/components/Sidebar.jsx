import React from 'react';
import {
  LayoutDashboard, Users, Building2, Briefcase, FileText,
  History, Clock, CheckSquare, Banknote, Settings,
  Bell, User, LogOut, ChevronRight, ShieldCheck, UserCircle, CreditCard, AlertCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

const Sidebar = () => {
  const location = useLocation();
  const { role, setRole } = useRole();

  const adminMenu = [
    {
      section: 'Tổng quan',
      items: [
        { icon: <LayoutDashboard size={18} />, label: 'Tổng quan', path: '/' },
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
        { icon: <Clock size={18} />, label: 'Chấm công', path: '/attendance' },
      ]
    },
    {
      section: 'Lương & Tài chính',
      items: [
        { icon: <Banknote size={18} />, label: 'Bảng lương', path: '/payroll-setup' },
        { icon: <Banknote size={18} />, label: 'Tính lương', path: '/payroll-calc' },
      ]
    },
    {
      section: 'Duyệt & Phê duyệt',
      items: [
        { icon: <CheckSquare size={18} />, label: 'Quản lý nghỉ phép', path: '/leaves' },
        { icon: <CreditCard size={18} />, label: 'Quản lý duyệt chi phí', path: '/expenses' },
        { icon: <AlertCircle size={18} />, label: 'Báo cáo Sai sót', path: '/reports' },
      ]
    }
  ];

  const personalMenu = [
    {
      section: 'Tổng quan',
      items: [
        { icon: <LayoutDashboard size={18} />, label: 'Tổng quan thu nhập', path: '/' },
      ]
    },
    {
      section: 'Lương & Công',
      items: [
        { icon: <Banknote size={18} />, label: 'Lương của tôi', path: '/my-salary' },
        { icon: <Clock size={18} />, label: 'Chi tiết chấm công', path: '/my-attendance' },
      ]
    },
    {
      section: 'Đơn từ & Phê duyệt',
      items: [
        { icon: <CheckSquare size={18} />, label: 'Đơn nghỉ phép', path: '/my-leaves' },
        { icon: <CreditCard size={18} />, label: 'Đơn xin cấp chi phí', path: '/my-expenses' },
      ]
    }
  ];

  const currentMenu = role === 'admin' ? adminMenu : personalMenu;

  return (
    <div className="sidebar" style={{
      width: '260px',
      height: '100vh',
      background: 'var(--bg-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      zIndex: 100
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
              objectFit: 'cover'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>TD Solutions</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>v2.0</span>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
        {currentMenu.map((group, idx) => (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#64748b',
              padding: '0 0.75rem 0.75rem'
            }}>
              {group.section}
            </div>
            <ul style={{ listStyle: 'none' }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path} style={{ marginBottom: '0.25rem' }}>
                    <Link to={item.path} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                      color: isActive ? 'white' : '#94a3b8',
                      transition: 'var(--transition)',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.95rem',
                      borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                    }}>
                      <span style={{ color: isActive ? '#3b82f6' : 'inherit' }}>
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

      {/* Role Switcher & User Profile */}
      <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            fontSize: '0.85rem',
            color: 'white',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={16} color="#3b82f6" />
            Quản trị viên
          </div>

          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            gap: '4px'
          }}>
            <button
              onClick={() => setRole('admin')}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                background: role === 'admin' ? '#3b82f6' : 'transparent',
                color: 'white',
                border: 'none',
                transition: 'all 0.2s'
              }}
            >
              Quản trị
            </button>
            <button
              onClick={() => setRole('personal')}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                background: role === 'personal' ? '#3b82f6' : 'transparent',
                color: 'white',
                border: 'none',
                transition: 'all 0.2s'
              }}
            >
              Cá nhân
            </button>
          </div>
        </div>

        <Link to="/profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          borderRadius: 'var(--radius-lg)',
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
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>
            NK
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Nam Khánh
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>
              Quản trị viên
            </div>
          </div>
          <ChevronRight size={16} color="#475569" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

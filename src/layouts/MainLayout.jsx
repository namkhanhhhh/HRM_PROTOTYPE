import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../context/RoleContext';
import { useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Settings, Key, ChevronDown, UserCircle, Search } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { role } = useRole();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/positions') return 'Quản lý Chức vụ';
    if (path === '/departments') return 'Quản lý phòng ban';
    if (path === '/contracts') return 'Quản lý Hợp đồng Lao động';
    if (path === '/history') return 'Quản lý Lịch sử Nhân sự';
    if (path === '/attendance') return 'Quản lý Chấm công';
    if (path === '/leaves') return 'Quản lý Nghỉ phép';
    if (path === '/expenses') return 'Quản lý Duyệt chi phí';
    return 'Danh sách Nhân viên nội bộ';
  };

  return (
    <div className="app-container" style={{ background: '#f8fafc', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Modern Header */}
        <header style={{
          height: '70px',
          padding: '0 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* Left: Quick Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f1f5f9',
            borderRadius: '10px',
            padding: '8px 16px',
            width: '300px',
            gap: '10px'
          }}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', width: '100%' }}
            />
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button style={{
              color: '#64748b',
              background: 'white',
              border: '1px solid #e2e8f0',
              position: 'relative',
              padding: '10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '6px',
                height: '6px',
                background: '#ef4444',
                borderRadius: '50%'
              }}></span>
            </button>

            <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' }}></div>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '6px 6px 6px 14px',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Nam Khánh</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</div>
                </div>
                <img
                  src="/tds_img.jpg"
                  alt="Avatar"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    border: '1px solid #e2e8f0'
                  }}
                />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 12px)',
                      right: 0,
                      width: '240px',
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                      border: '1px solid #f1f5f9',
                      padding: '8px',
                      zIndex: 100
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Tài khoản đang dùng</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>khanh.admin@tdsolution.vn</div>
                    </div>
                    <button style={profileItemStyle}><UserCircle size={18} /> Hồ sơ của tôi</button>
                    <button style={profileItemStyle}><Settings size={18} /> Cài đặt tài khoản</button>
                    <button style={profileItemStyle}><Key size={18} /> Đổi mật khẩu</button>
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '8px' }}></div>
                    <button style={{ ...profileItemStyle, color: '#ef4444' }}><LogOut size={18} /> Đăng xuất hệ thống</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '2rem 3rem 1rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{getTitle()}</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '400' }}>Cập nhật dữ liệu mới nhất vào lúc {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <motion.main
            key={role + location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '1rem 3rem 3rem' }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

const profileItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '10px 16px',
  borderRadius: '10px',
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#475569',
  cursor: 'pointer',
  transition: 'all 0.2s',
  border: 'none',
  background: 'transparent',
  textAlign: 'left'
};

const selectStyle = {
  padding: '10px 16px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  fontSize: '0.9rem',
  fontWeight: '500',
  background: 'white',
  minWidth: '180px',
  cursor: 'pointer',
  outline: 'none',
  color: '#334155',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

export default MainLayout;

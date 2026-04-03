import React, { useState, useEffect, useRef } from 'react';
import { useRole } from '../context/RoleContext';
import { useNotifications } from '../context/NotificationContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Settings, Key, LogOut, UserCircle, Search,
  AlertCircle, CheckCircle2, Clock, ChevronRight, ChevronDown, X, Receipt, Fingerprint, LayoutGrid, ShieldCheck
} from 'lucide-react';

/* ─── helpers ─── */
function getStatusColor(s) {
  switch (s) {
    case 'Đã sửa': return '#10b981';
    case 'Đang xử lý': return '#3b82f6';
    case 'Từ chối': return '#ef4444';
    default: return '#f59e0b';
  }
}

function ReportIcon({ type }) {
  return type === 'salary'
    ? <Receipt size={16} style={{ flexShrink: 0 }} />
    : <Fingerprint size={16} style={{ flexShrink: 0 }} />;
}

const MainLayout = ({ children }) => {
  const { role, setRole } = useRole();
  const { reports, unreadCount, markRead, markAllRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef(null);

  // close notification panel on outside click
  useEffect(() => {
    const h = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifPanel(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/positions') return 'Quản lý Chức vụ';
    if (path === '/departments') return 'Quản lý phòng ban';
    if (path === '/contracts') return 'Quản lý Hợp đồng Lao động';
    if (path === '/history') return 'Quản lý Lịch sử Nhân sự';
    if (path === '/attendance') return 'Dữ liệu Chấm công';
    if (path === '/attendance-ot') return 'Theo dõi Tăng ca (OT)';
    if (path === '/attendance-violations') return 'Thống kê Đi muộn/Về sớm';
    if (path === '/attendance-reconciliation') return 'Đối soát Công & Phép';
    if (path === '/leaves') return 'Quản lý Nghỉ phép';
    if (path === '/expenses') return 'Quản lý Duyệt chi phí';
    if (path === '/payroll-setup') return 'Thiết lập chỉ số Lương';
    if (path === '/payroll-calc') return 'Tính toán Bảng lương';
    if (path === '/reports') return 'Quản lý Báo cáo Sai sót';
    if (path === '/profile') return 'Thông tin Hồ sơ cá nhân';
    if (path === '/settings') return 'Cấu hình Hệ thống';
    if (path === '/security') return 'Bảo mật & Mật khẩu';
    if (path === '/my-salary') return 'Bảng lương chi tiết';
    if (path === '/my-attendance') return 'Chi tiết Lịch sử Chấm công';
    if (path === '/my-leaves') return 'Quản lý Đơn nghỉ phép';
    if (path === '/my-expenses') return 'Quản lý Đơn cấp Chi phí';
    if (path === '/personal-overview' || path === '/admin-overview') return 'Dashboard tổng quan';
    if (path === '/hr-analytics') return 'Báo cáo Phân tích Nhân sự';
    if (path === '/finance-analytics') return 'Góc nhìn Phân bổ Quỹ lương & Chi phí';
    return 'Danh sách Nhân viên nội bộ';
  };

  const isPlatformHome = location.pathname === '/';

  const handleNotifClick = (r) => {
    markRead(r.id);
    setShowNotifPanel(false);
    if (role === 'admin') navigate('/reports');
  };

  return (
    <div className="app-container" style={{ background: isPlatformHome ? '#ffffff' : '#f8fafc', display: 'flex' }}>
      {!isPlatformHome && <Sidebar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>

        {/* ── HEADER ── */}
        <header style={{
          height: isPlatformHome ? '80px' : '70px',
          padding: '0 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isPlatformHome ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'rgba(255,255,255,0.85)',
          backdropFilter: isPlatformHome ? 'none' : 'blur(12px)',
          borderBottom: isPlatformHome ? 'none' : '1px solid rgba(226,232,240,0.8)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: isPlatformHome ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
        }}>

          {/* Left section / Search */}
          {isPlatformHome ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>
                <LayoutGrid size={24} color="white" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>TD Solutions</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Platform Workspace</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '12px', padding: '10px 18px', width: '300px', gap: '10px', border: '1px solid transparent', transition: 'all 0.2s' }}>
              <Search size={18} color="#64748b" />
              <input type="text" placeholder="Tìm kiếm nhanh chuyên sâu..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', width: '100%', color: '#1e293b' }} />
            </div>
          )}

          {/* Center section: Role Switcher (Platform Home only) */}
          {isPlatformHome && (
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '14px', gap: '6px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <button
                onClick={() => setRole('admin')}
                style={{
                  padding: '8px 24px', borderRadius: '10px', border: 'none',
                  background: role === 'admin' ? '#ffffff' : 'transparent',
                  color: role === 'admin' ? '#0f172a' : '#94a3b8',
                  fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: role === 'admin' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <ShieldCheck size={18} /> Quản trị viên
              </button>
              <button
                onClick={() => setRole('personal')}
                style={{
                  padding: '8px 24px', borderRadius: '10px', border: 'none',
                  background: role === 'personal' ? '#ffffff' : 'transparent',
                  color: role === 'personal' ? '#0f172a' : '#94a3b8',
                  fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: role === 'personal' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <UserCircle size={18} /> Giao diện Nội bộ
              </button>
            </div>
          )}

          {/* Right actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}>

            {/* ── BELL ── */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifPanel(p => !p)}
                style={{ position: 'relative', padding: '10px', borderRadius: '12px', border: isPlatformHome ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', background: isPlatformHome ? 'rgba(255,255,255,0.05)' : (showNotifPanel ? '#eff6ff' : 'white'), color: isPlatformHome ? 'white' : ((showNotifPanel && !isPlatformHome) ? '#3b82f6' : '#64748b'), cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: 6, right: 6, minWidth: 16, height: 16, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '700', color: 'white', padding: '0 3px', lineHeight: 1, boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)' }}>
                    {unreadCount}
                  </motion.span>
                )}
              </button>

              {/* ── NOTIFICATION PANEL ── */}
              <AnimatePresence>
                {showNotifPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.16 }}
                    style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 380, background: 'white', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 500, overflow: 'hidden' }}>

                    {/* Panel header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>Thông báo</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{unreadCount} chưa đọc</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} style={{ fontSize: '0.78rem', color: '#3b82f6', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600', padding: '4px 8px', borderRadius: 6 }}>
                            Đọc tất cả
                          </button>
                        )}
                        {role === 'admin' && (
                          <button onClick={() => { setShowNotifPanel(false); navigate('/reports'); }}
                            style={{ fontSize: '0.78rem', color: '#6366f1', border: '1px solid #e0e7ff', background: '#f5f3ff', cursor: 'pointer', fontWeight: '600', padding: '4px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                            Quản lý <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                      {reports.length === 0 ? (
                        <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Không có thông báo nào</div>
                      ) : reports.map(r => (
                        <motion.div key={r.id} onClick={() => handleNotifClick(r)}
                          whileHover={{ background: '#f8fafc' }}
                          style={{ display: 'flex', gap: 12, padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #f8fafc', background: r.read ? 'white' : '#fafeff', position: 'relative', transition: 'background 0.15s' }}>

                          {/* Unread dot */}
                          {!r.read && <span style={{ position: 'absolute', top: 16, left: 8, width: 7, height: 7, borderRadius: '50%', background: '#3b82f6' }} />}

                          {/* Icon */}
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: r.type === 'salary' ? '#eff6ff' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.type === 'salary' ? '#3b82f6' : '#d97706', flexShrink: 0 }}>
                            <ReportIcon type={r.type} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                              <div style={{ fontSize: '0.855rem', fontWeight: r.read ? '500' : '700', color: '#1e293b', lineHeight: 1.4 }}>
                                Báo sai sót: {r.refLabel}
                              </div>
                              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: getStatusColor(r.status), background: `${getStatusColor(r.status)}15`, padding: '2px 7px', borderRadius: 8, whiteSpace: 'nowrap' }}>
                                {r.status}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.desc}</div>
                            <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: 4 }}>{r.reporter} · {r.createdAt}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' }} />

            {/* ── PROFILE ── */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                {!isPlatformHome && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Nam Khánh</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</div>
                  </div>
                )}
                {isPlatformHome && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ height: '24px', width: '1px', background: '#e2e8f0', marginRight: '1rem' }} />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {!isPlatformHome ? (
                    <img src="/tds_img.jpg" alt="Avatar" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>
                        NK
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Nam Khánh <ChevronDown size={14} color="#94a3b8" />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>
                          {role === 'admin' ? 'Workspace Admin' : 'Employee View'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '240px', background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', padding: '8px', zIndex: 100 }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Tài khoản đang dùng</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>khanh.admin@tdsolution.vn</div>
                    </div>
                    <button style={profileItemStyle} onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}><UserCircle size={18} /> Hồ sơ của tôi</button>
                    <button style={profileItemStyle} onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}><Settings size={18} /> Cài đặt tài khoản</button>
                    <button style={profileItemStyle} onClick={() => { navigate('/security'); setShowProfileMenu(false); }}><Key size={18} /> Đổi mật khẩu</button>
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '8px' }} />
                    <button style={{ ...profileItemStyle, color: '#ef4444' }} onClick={() => setShowProfileMenu(false)}><LogOut size={18} /> Đăng xuất</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {!isPlatformHome && (
            <div style={{ padding: '2rem 3rem 1rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{getTitle()}</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '400' }}>
                Cập nhật dữ liệu mới nhất vào lúc {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}
          <motion.main key={role + location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ padding: isPlatformHome ? '0' : '1rem 3rem 3rem', height: isPlatformHome ? '100%' : 'auto' }}>
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

const profileItemStyle = { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '500', color: '#475569', cursor: 'pointer', transition: 'all 0.2s', border: 'none', background: 'transparent', textAlign: 'left' };

export default MainLayout;

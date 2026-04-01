import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import {
  Users, Clock, CheckSquare, Banknote, UserCircle, Settings,
  LayoutDashboard, AlertCircle, ChevronLeft, ChevronRight, TrendingUp, PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModuleCard = ({ icon, label, subtext, path, colorFrom, colorTo, accent, index }) => {
  const navigate = useNavigate();
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => navigate(path)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        width: '100%',
        height: '200px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #f1f5f9',
        color: '#1e293b',
        cursor: 'pointer',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 20px 40px -10px ${accent}40`;
        e.currentTarget.style.borderColor = accent;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.05)';
        e.currentTarget.style.borderColor = '#f1f5f9';
      }}
    >
      <div style={{
         position: 'absolute',
         top: '-40%',
         right: '-20%',
         width: '180px',
         height: '180px',
         background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
         filter: 'blur(50px)',
         opacity: 0.15,
         borderRadius: '50%',
         zIndex: 0,
         pointerEvents: 'none'
      }} />
      
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '20px',
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: `0 8px 16px -4px ${accent}60`,
        zIndex: 1
      }}>
        {icon}
      </div>
      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'center' }}>
        <div style={{ fontWeight: '700', fontSize: '1.15rem', letterSpacing: '-0.3px', color: '#1e293b' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{subtext}</div>
      </div>
    </motion.button>
  );
};

const Dashboard = () => {
  const { role } = useRole();
  const [page, setPage] = useState(0);

  const adminModules = [
    { label: 'Dashboard Tổng quan', subtext: 'Báo cáo & thống kê', path: '/admin-overview', icon: <LayoutDashboard size={28} strokeWidth={2.5} />, cFrom: '#c084fc', cTo: '#9333ea', accent: '#a855f7' },
    { label: 'Quản lý Nhân sự', subtext: 'Hồ sơ, phòng ban & HDLD', path: '/employees', icon: <Users size={28} strokeWidth={2.5} />, cFrom: '#60a5fa', cTo: '#2563eb', accent: '#3b82f6' },
    { label: 'Quản lý Chấm công', subtext: 'Theo dõi giờ làm việc', path: '/attendance', icon: <Clock size={28} strokeWidth={2.5} />, cFrom: '#34d399', cTo: '#059669', accent: '#10b981' },
    { label: 'Đơn từ & Phê duyệt', subtext: 'Nghỉ phép, duyệt chi', path: '/leaves', icon: <CheckSquare size={28} strokeWidth={2.5} />, cFrom: '#fb923c', cTo: '#ea580c', accent: '#f97316' },
    { label: 'Quản lý Lương', subtext: 'Bảng lương & tính toán', path: '/payroll-calc', icon: <Banknote size={28} strokeWidth={2.5} />, cFrom: '#a78bfa', cTo: '#7c3aed', accent: '#8b5cf6' },
    { label: 'Thông tin cá nhân', subtext: 'Hồ sơ tài khoản', path: '/profile', icon: <UserCircle size={28} strokeWidth={2.5} />, cFrom: '#fb7185', cTo: '#e11d48', accent: '#f43f5e' },
    { label: 'Cấu hình Hệ thống', subtext: 'Phân quyền & cài đặt', path: '/settings', icon: <Settings size={28} strokeWidth={2.5} />, cFrom: '#94a3b8', cTo: '#475569', accent: '#64748b' },
  ];

  const employeeModules = [
    { label: 'Dashboard Tổng quan', subtext: 'Báo cáo thu nhập & KPIs', path: '/personal-overview', icon: <LayoutDashboard size={28} strokeWidth={2.5} />, cFrom: '#818cf8', cTo: '#4f46e5', accent: '#6366f1' },
    { label: 'Lương của tôi', subtext: 'Phiếu lương chi tiết', path: '/my-salary', icon: <Banknote size={28} strokeWidth={2.5} />, cFrom: '#a78bfa', cTo: '#7c3aed', accent: '#8b5cf6' },
    { label: 'Lịch sử Chấm công', subtext: 'Theo dõi điểm danh', path: '/my-attendance', icon: <Clock size={28} strokeWidth={2.5} />, cFrom: '#34d399', cTo: '#059669', accent: '#10b981' },
    { label: 'Đơn từ & Phê duyệt', subtext: 'Xin nghỉ, xin cấp chi phí', path: '/my-leaves', icon: <CheckSquare size={28} strokeWidth={2.5} />, cFrom: '#fb923c', cTo: '#ea580c', accent: '#f97316' },
    { label: 'Thông tin cá nhân', subtext: 'Cập nhật tài khoản', path: '/profile', icon: <UserCircle size={28} strokeWidth={2.5} />, cFrom: '#fb7185', cTo: '#e11d48', accent: '#f43f5e' },
    { label: 'Trao đổi & Báo cáo', subtext: 'Gửi phản hồi sai sót', path: '/reports', icon: <AlertCircle size={28} strokeWidth={2.5} />, cFrom: '#38bdf8', cTo: '#0284c7', accent: '#0ea5e9' },
  ];

  const modules = role === 'admin' ? adminModules : employeeModules;
  const pageSize = 6;
  const totalPages = Math.ceil(modules.length / pageSize);
  
  const currentModules = modules.slice(page * pageSize, (page + 1) * pageSize);

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 800 : -800, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -800 : 800, opacity: 0 })
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipeDistance = offset.x;
    if (swipeDistance < -60 && page < totalPages - 1) {
      setPage(page + 1);
    } else if (swipeDistance > 60 && page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      minHeight: 'calc(100vh - 100px)',
      background: '#f8fafc',
      paddingTop: '3rem',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', marginBottom: '8px' }}>
          Chào mừng đến với TD Solutions
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '400' }}>
          Luôn đồng hành cùng sự phát triển của bạn
        </p>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', padding: '0 2rem' }}>
        
        {totalPages > 1 && page > 0 && (
          <button onClick={() => setPage(page - 1)} style={{ position: 'absolute', left: '-2rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#64748b', transition: 'all 0.2s' }}>
            <ChevronLeft size={24} />
          </button>
        )}

        <div style={{ overflow: 'hidden', padding: '1rem 0 2rem', minHeight: '488px' }}>
          <AnimatePresence mode="wait" custom={page}>
            <motion.div
              key={page}
              custom={page}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, type: 'spring', bounce: 0.1 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2.5rem',
                width: '100%',
                cursor: 'grab'
              }}
              whileTap={{ cursor: 'grabbing' }}
            >
              {currentModules.map((mod, idx) => (
                <ModuleCard
                  key={mod.path}
                  index={idx}
                  icon={mod.icon}
                  label={mod.label}
                  subtext={mod.subtext}
                  path={mod.path}
                  colorFrom={mod.cFrom}
                  colorTo={mod.cTo}
                  accent={mod.accent}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {totalPages > 1 && page < totalPages - 1 && (
          <button onClick={() => setPage(page + 1)} style={{ position: 'absolute', right: '-2rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#64748b', transition: 'all 0.2s' }}>
            <ChevronRight size={24} />
          </button>
        )}

      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: i === page ? '24px' : '8px',
                height: '8px',
                borderRadius: '8px',
                background: i === page ? '#3b82f6' : '#cbd5e1',
                border: 'none',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

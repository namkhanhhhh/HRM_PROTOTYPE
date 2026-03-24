import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

// Seed data — a few pre-existing reports
const INIT_REPORTS = [
  {
    id: 'RPT-001',
    type: 'salary',          // 'salary' | 'attendance'
    refLabel: 'Bảng lương Tháng 03/2026',
    reporter: 'Nguyễn Nam Khánh',
    reporterId: 'NV001',
    dept: 'Kỹ thuật',
    desc: 'Lương OT tháng 3 bị tính thiếu 6 giờ, chỉ ghi nhận 12h thay vì 18h.',
    createdAt: '23/03/2026 09:20',
    status: 'Chờ xử lý',      // 'Chờ xử lý' | 'Đang xử lý' | 'Đã sửa' | 'Từ chối'
    adminNote: '',
    read: false,
  },
  {
    id: 'RPT-002',
    type: 'attendance',
    refLabel: 'Chấm công ngày 12/03/2026',
    reporter: 'Nguyễn Nam Khánh',
    reporterId: 'NV001',
    dept: 'Kỹ thuật',
    desc: 'Ngày 12/03 hệ thống ghi Lỗi chấm công nhưng thực tế đã check-in lúc 08:00 và check-out 17:30.',
    createdAt: '22/03/2026 14:05',
    status: 'Đang xử lý',
    adminNote: 'Đã kiểm tra log máy chấm công, đang chờ IT cấp log chi tiết.',
    read: true,
  },
];

export const NotificationProvider = ({ children }) => {
  const [reports, setReports] = useState(INIT_REPORTS);

  const unreadCount = reports.filter(r => !r.read).length;

  /** Employee submits a new report */
  const addReport = ({ type, refLabel, desc }) => {
    const newReport = {
      id: `RPT-${String(Date.now()).slice(-4)}`,
      type,
      refLabel,
      reporter: 'Nguyễn Nam Khánh',
      reporterId: 'NV001',
      dept: 'Kỹ thuật',
      desc,
      createdAt: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: 'Chờ xử lý',
      adminNote: '',
      read: false,
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  /** Admin marks notification as read */
  const markRead = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, read: true } : r));
  };

  const markAllRead = () => {
    setReports(prev => prev.map(r => ({ ...r, read: true })));
  };

  /** Admin updates report (note, status) */
  const updateReport = (id, changes) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r));
  };

  return (
    <NotificationContext.Provider value={{ reports, unreadCount, addReport, markRead, markAllRead, updateReport }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
};

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Users, Plus, Search, Edit2, Eye,
  CreditCard, X, Save, ArrowLeft,
  DollarSign, User, Briefcase, Calendar,
  ChevronDown, UserX, MoreVertical, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── MOCK DATA ── */
const initEmployees = [
  {
    id: 'NV001', name: 'Nguyễn Nam Khánh', dob: '1995-10-15', gender: 'Nam', avatar: '/tds_img.jpg',
    phone: '0988.123.456', emailCompany: 'khanh.nn@tdsolution.vn', emailPersonal: 'namkhanh.dev@gmail.com',
    addressPermanent: '123 Cầu Giấy, Hà Nội', addressTemporary: '456 Lê Văn Lương, Hà Nội',
    idCard: '001095001234', maritalStatus: 'Độc thân', dept: 'Kỹ thuật', pos: 'Senior Fullstack Dev',
    contractType: 'HĐ Không xác định thời hạn', rank: 'Quản trị viên',
    joinDate: '2022-01-01', officialDate: '2022-03-01', status: 'Đang làm',
    bankAccount: '1234567890', bankName: 'Techcombank',
    salary: { base: 25000000, lunch: 730000, travel: 500000, phone: 200000, diligence: 500000, uniform: 300000, ot: 0 }
  },
  {
    id: 'NV002', name: 'Trần Thị Mai', dob: '1998-05-20', gender: 'Nữ', avatar: '',
    phone: '0912.444.555', emailCompany: 'mai.tt@tdsolution.vn', emailPersonal: 'maimai.hr@gmail.com',
    addressPermanent: 'Thanh Xuân, Hà Nội', addressTemporary: 'Thanh Xuân, Hà Nội',
    idCard: '001098005678', maritalStatus: 'Đã kết hôn', dept: 'Nhân sự', pos: 'HR Manager',
    contractType: 'HĐ 24 tháng', rank: 'Quản lý',
    joinDate: '2023-05-15', officialDate: '2023-07-15', status: 'Đang làm',
    bankAccount: '0987654321', bankName: 'Vietcombank',
    salary: { base: 18000000, lunch: 730000, travel: 500000, phone: 200000, diligence: 500000, uniform: 300000, ot: 0 }
  },
  {
    id: 'NV003', name: 'Lê Hoàng Tuấn', dob: '2000-03-11', gender: 'Nam', avatar: '',
    phone: '0977.000.111', emailCompany: 'tuan.lh@tdsolution.vn', emailPersonal: 'tuanlh2000@gmail.com',
    addressPermanent: 'Đống Đa, Hà Nội', addressTemporary: 'Cầu Giấy, Hà Nội',
    idCard: '001200007890', maritalStatus: 'Độc thân', dept: 'Kinh doanh', pos: 'Business Development',
    contractType: 'HĐ Thử việc', rank: 'Nhân viên',
    joinDate: '2024-09-01', officialDate: '', status: 'Thử việc',
    bankAccount: '5566778899', bankName: 'MB Bank',
    salary: { base: 10000000, lunch: 730000, travel: 300000, phone: 0, diligence: 500000, uniform: 200000, ot: 0 }
  },
];

/* ── STATUS CONFIG ── */
const statusConfig = {
  'Đang làm':  { bg: '#ecfdf5', color: '#059669', dot: '#10b981' },
  'Thử việc':  { bg: '#eff6ff', color: '#3b82f6', dot: '#60a5fa' },
  'Nghỉ phép': { bg: '#fff7ed', color: '#f59e0b', dot: '#fbbf24' },
  'Nghỉ việc': { bg: '#fef2f2', color: '#ef4444', dot: '#f87171' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: '600', background: cfg.bg, color: cfg.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
      {status}
    </span>
  );
};

/* ── AVATAR ── */
const Avatar = ({ src, name, size = 40, radius = 10 }) => (
  <div style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #e0e7ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {src
      ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : <span style={{ fontSize: size * 0.38, fontWeight: '700', color: '#6366f1' }}>{name?.[0] || '?'}</span>}
  </div>
);

/* ── ACTION MENU "..." ── */
const ActionMenu = ({ emp, onView, onEdit, onInactive }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isInactive = emp.status === 'Nghỉ việc';

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: open ? '#f1f5f9' : 'transparent', border: '1px solid transparent', borderColor: open ? '#e2e8f0' : 'transparent', padding: '6px 8px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b', transition: 'all 0.15s' }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}}
      >
        <MoreVertical size={17} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              width: 190, background: 'white', borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9',
              zIndex: 500, padding: 6, overflow: 'hidden'
            }}
          >
            <MenuItem icon={<Eye size={15} />} label="Xem chi tiết" color="#6366f1" onClick={() => { onView(emp); setOpen(false); }} />
            <MenuItem icon={<Edit2 size={15} />} label="Chỉnh sửa" color="#0ea5e9" onClick={() => { onEdit(emp); setOpen(false); }} />
            <div style={{ height: 1, background: '#f1f5f9', margin: '4px 4px' }} />
            <MenuItem
              icon={isInactive ? <CheckCircle size={15} /> : <UserX size={15} />}
              label={isInactive ? 'Kích hoạt lại' : 'Inactive'}
              color={isInactive ? '#10b981' : '#ef4444'}
              onClick={() => { onInactive(emp.id); setOpen(false); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuItem = ({ icon, label, color, onClick }) => (
  <div onClick={onClick}
    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, cursor: 'pointer', color, fontSize: '0.875rem', fontWeight: '500', transition: 'background 0.12s' }}
    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    {icon} {label}
  </div>
);

/* ── SOFT SELECT ── */
const SoftSelect = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = options.find(o => o.value === value);
  const displayLabel = current?.label || label;
  const isActive = value !== '';

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 145 }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', padding: '9px 14px', borderRadius: 10, border: isActive ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', background: isActive ? '#eef2ff' : 'white', color: isActive ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: isActive ? '600' : '500', cursor: 'pointer', transition: 'all 0.2s', boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none' }}>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayLabel}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '100%', background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', zIndex: 400, padding: 6 }}
          >
            {options.map((opt, i) => {
              const isSelected = value === opt.value;
              return (
                <div key={i} onClick={() => { onChange(opt.value); setOpen(false); }}
                  style={{ padding: '8px 12px', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer', fontWeight: isSelected ? '600' : '400', background: isSelected ? '#eef2ff' : 'transparent', color: isSelected ? '#4f46e5' : '#334155', transition: 'background 0.12s' }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >{opt.label}</div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── DATE RANGE PICKER ── */
const DateRangePicker = ({ startDate, endDate, onApply }) => {
  const [open, setOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate || '');
  const [localEnd, setLocalEnd] = useState(endDate || '');
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setLocalStart(startDate || ''); }, [startDate]);
  useEffect(() => { setLocalEnd(endDate || ''); }, [endDate]);

  const quickOptions = [
    { label: 'Hôm nay', action: () => { const t = new Date().toISOString().split('T')[0]; setLocalStart(t); setLocalEnd(t); } },
    { label: 'Tuần này', action: () => { const now = new Date(); const day = now.getDay(); const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); const sun = new Date(mon); sun.setDate(mon.getDate() + 6); setLocalStart(mon.toISOString().split('T')[0]); setLocalEnd(sun.toISOString().split('T')[0]); } },
    { label: 'Tháng này', action: () => { const now = new Date(); setLocalStart(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]); setLocalEnd(new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]); } },
    { label: 'Tháng trước', action: () => { const now = new Date(); setLocalStart(new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]); setLocalEnd(new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]); } },
  ];

  const isActive = startDate || endDate;
  const displayText = startDate && endDate ? `${startDate} → ${endDate}` : startDate ? `Từ ${startDate}` : endDate ? `Đến ${endDate}` : 'Ngày vào làm';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 10, border: isActive ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', background: isActive ? '#eef2ff' : 'white', color: isActive ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: isActive ? '600' : '500', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none' }}>
        <Calendar size={15} style={{ flexShrink: 0 }} />
        <span>{displayText}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            style={{
              position: 'fixed',
              // Positioned via JS after mount – use absolute + overflow visible trick:
              // Actually use absolute with overflow visible on parent
              width: 310, background: 'white', borderRadius: 16,
              boxShadow: '0 16px 40px rgba(0,0,0,0.14)', border: '1px solid #eef2f6',
              zIndex: 9999, padding: '1rem',
              // Force to not be clipped: position after ref
              top: (() => { if (!ref.current) return 56; const r = ref.current.getBoundingClientRect(); return r.bottom + 8; })(),
              left: (() => { if (!ref.current) return 0; const r = ref.current.getBoundingClientRect(); return Math.min(r.left, window.innerWidth - 320); })(),
            }}
          >
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Lựa chọn nhanh</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: '1rem' }}>
              {quickOptions.map(({ label, action }) => (
                <div key={label} onClick={action}
                  style={{ padding: '8px 10px', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer', color: '#334155', transition: 'background 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >{label}</div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569', marginBottom: '0.75rem' }}>Chọn khoảng thời gian</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginBottom: 4, fontWeight: '700' }}>Từ ngày</div>
                  <input type="date" value={localStart} onChange={e => setLocalStart(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginBottom: 4, fontWeight: '700' }}>Đến ngày</div>
                  <input type="date" value={localEnd} onChange={e => setLocalEnd(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button onClick={() => { setLocalStart(''); setLocalEnd(''); onApply('', ''); setOpen(false); }}
                  style={{ flex: 1, padding: '9px', borderRadius: 9, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Hủy</button>
                <button onClick={() => { onApply(localStart, localEnd); setOpen(false); }}
                  style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>Áp dụng</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── DETAIL DRAWER ── */
const DetailDrawer = ({ emp, onClose, onEdit }) => {
  if (!emp) return null;
  const totalAllowance = emp.salary.lunch + emp.salary.travel + emp.salary.phone + emp.salary.diligence + emp.salary.uniform + emp.salary.ot;
  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{value || '—'}</span>
    </div>
  );
  const SectionLabel = ({ icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '1.5rem 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ color: '#6366f1' }}>{icon}</span>
      <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>{title}</span>
    </div>
  );
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.3)', zIndex: 200, backdropFilter: 'blur(3px)' }} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 38 }}
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, background: 'white', zIndex: 201, boxShadow: '-12px 0 48px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1e293b' }}>Hồ sơ nhân viên</span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
              <Edit2 size={15} /> Chỉnh sửa
            </button>
            <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 8, cursor: 'pointer', display: 'flex' }}><X size={18} color="#64748b" /></button>
          </div>
        </div>
        <div style={{ padding: '1.5rem 1.75rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)', borderRadius: 14, marginBottom: '0.5rem' }}>
            <Avatar src={emp.avatar} name={emp.name} size={68} radius={14} />
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#1e293b' }}>{emp.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#6366f1', fontWeight: '600', marginTop: 2 }}>{emp.pos}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>#{emp.id}</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1' }} />
                <StatusBadge status={emp.status} />
              </div>
            </div>
          </div>

          <SectionLabel icon={<Briefcase size={16} />} title="Work Inform" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <InfoRow label="Mã nhân viên" value={emp.id} />
            <InfoRow label="Phòng ban" value={emp.dept} />
            <InfoRow label="Chức vụ" value={emp.pos} />
            <InfoRow label="Loại hợp đồng" value={emp.contractType} />
            <InfoRow label="Cấp bậc / Vai trò" value={emp.rank} />
            <InfoRow label="Trạng thái" value={<StatusBadge status={emp.status} />} />
            <InfoRow label="Ngày vào làm" value={emp.joinDate} />
            <InfoRow label="Ngày chính thức" value={emp.officialDate || '(Chưa xác định)'} />
          </div>

          <SectionLabel icon={<User size={16} />} title="Personal Inform" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <InfoRow label="Ngày sinh" value={emp.dob} />
            <InfoRow label="Giới tính" value={emp.gender} />
            <InfoRow label="Tình trạng HN" value={emp.maritalStatus} />
            <InfoRow label="CCCD / CMND" value={emp.idCard} />
            <InfoRow label="Số điện thoại" value={emp.phone} />
            <InfoRow label="Email CT" value={emp.emailCompany} />
            <InfoRow label="Email CN" value={emp.emailPersonal} />
            <div style={{ gridColumn: 'span 2' }}><InfoRow label="Địa chỉ thường trú" value={emp.addressPermanent} /></div>
            <div style={{ gridColumn: 'span 2' }}><InfoRow label="Địa chỉ tạm trú" value={emp.addressTemporary} /></div>
          </div>

          <SectionLabel icon={<CreditCard size={16} />} title="Thông tin Ngân hàng" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <InfoRow label="Số tài khoản" value={emp.bankAccount} />
            <InfoRow label="Ngân hàng" value={emp.bankName} />
          </div>

          <SectionLabel icon={<DollarSign size={16} />} title="Lương và Phụ cấp" />
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.875rem', borderBottom: '1px dashed #e2e8f0' }}>
              <span style={{ fontWeight: '700', color: '#1e293b' }}>Lương cơ bản (Gross)</span>
              <span style={{ fontWeight: '800', color: '#10b981', fontSize: '1.1rem' }}>{emp.salary.base.toLocaleString('vi-VN')} ₫</span>
            </div>
            {[['Ăn trưa', emp.salary.lunch], ['Đi lại', emp.salary.travel], ['Điện thoại', emp.salary.phone], ['Chuyên cần', emp.salary.diligence], ['Trang phục', emp.salary.uniform], ['Tăng ca (OT)', emp.salary.ot]].map(([lbl, val]) => (
              <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>PC. {lbl}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>{val.toLocaleString('vi-VN')} ₫</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: '700', color: '#1e293b' }}>Tổng phụ cấp</span>
              <span style={{ fontWeight: '700', color: '#f59e0b' }}>{totalAllowance.toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #f1f5f9', background: '#fafafa', display: 'flex', gap: '0.75rem' }}>
          <button onClick={onEdit} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 11, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
            <Edit2 size={16} /> Chỉnh sửa hồ sơ
          </button>
          <button onClick={onClose} style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>Đóng</button>
        </div>
      </motion.div>
    </>
  );
};

/* ── EMPLOYEE FORM ── */
const EmployeeForm = ({ initial, onBack }) => {
  const isEdit = !!initial;
  const [formData, setFormData] = useState(initial || { name: '', id: '', dob: '', gender: 'Nam', emailCompany: '', emailPersonal: '', phone: '', addressPermanent: '', addressTemporary: '', idCard: '', maritalStatus: 'Độc thân', dept: 'Kỹ thuật', pos: '', contractType: 'HĐ Thử việc', rank: '', joinDate: '', officialDate: '', status: 'Thử việc', bankAccount: '', bankName: '', salary: { base: 0, lunch: 0, travel: 0, phone: 0, diligence: 0, uniform: 0, ot: 0 } });
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const setSalary = (key, val) => setFormData(prev => ({ ...prev, salary: { ...prev.salary, [key]: Number(val) } }));
  const ST = ({ title, icon }) => (<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #f1f5f9' }}><span style={{ color: '#6366f1' }}>{icon}</span><h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b' }}>{title}</h3></div>);
  const FG = ({ label, children, required }) => (<div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>{children}</div>);
  const i = { padding: '10px 12px', borderRadius: 9, border: '1.5px solid #e8edf4', fontSize: '0.9rem', outline: 'none', width: '100%', background: 'white' };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: 16, border: '1px solid #eef2f6', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} style={{ padding: 8, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex' }}><ArrowLeft size={20} color="#64748b" /></button>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1e293b' }}>{isEdit ? 'Chỉnh sửa hồ sơ' : 'Thêm nhân viên mới'}</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer', color: '#475569' }}>Hủy</button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}><Save size={17} /> Lưu thông tin</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <section>
            <ST title="Personal Inform" icon={<User size={18} />} />
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 110, height: 110, background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}>
                {formData.avatar ? <img src={formData.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <><Plus size={22} color="#94a3b8" /><span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>Tải ảnh</span></>}
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FG label="Họ và tên" required><input value={formData.name} onChange={e => set('name', e.target.value)} style={i} /></FG>
                <FG label="Mã nhân viên" required><input value={formData.id} onChange={e => set('id', e.target.value)} style={i} /></FG>
                <FG label="Ngày sinh"><input type="date" value={formData.dob} onChange={e => set('dob', e.target.value)} style={i} /></FG>
                <FG label="Giới tính"><select value={formData.gender} onChange={e => set('gender', e.target.value)} style={i}><option>Nam</option><option>Nữ</option><option>Khác</option></select></FG>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <FG label="Số điện thoại"><input value={formData.phone} onChange={e => set('phone', e.target.value)} style={i} /></FG>
              <FG label="Tình trạng hôn nhân"><select value={formData.maritalStatus} onChange={e => set('maritalStatus', e.target.value)} style={i}><option>Độc thân</option><option>Đã kết hôn</option><option>Ly hôn</option></select></FG>
              <FG label="Email Công ty"><input type="email" value={formData.emailCompany} onChange={e => set('emailCompany', e.target.value)} style={i} /></FG>
              <FG label="Email Cá nhân"><input type="email" value={formData.emailPersonal} onChange={e => set('emailPersonal', e.target.value)} style={i} /></FG>
              <div style={{ gridColumn: 'span 2' }}><FG label="Địa chỉ thường trú"><input value={formData.addressPermanent} onChange={e => set('addressPermanent', e.target.value)} style={i} /></FG></div>
              <div style={{ gridColumn: 'span 2' }}><FG label="Địa chỉ tạm trú"><input value={formData.addressTemporary} onChange={e => set('addressTemporary', e.target.value)} style={i} /></FG></div>
              <FG label="CCCD / CMND / Passport"><input value={formData.idCard} onChange={e => set('idCard', e.target.value)} style={i} /></FG>
            </div>
          </section>
          <section>
            <ST title="Thông tin Ngân hàng" icon={<CreditCard size={18} />} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <FG label="Số tài khoản"><input value={formData.bankAccount} onChange={e => set('bankAccount', e.target.value)} style={i} /></FG>
              <FG label="Ngân hàng"><input value={formData.bankName} onChange={e => set('bankName', e.target.value)} style={i} /></FG>
            </div>
          </section>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <section>
            <ST title="Work Inform" icon={<Briefcase size={18} />} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <FG label="Phòng ban"><select value={formData.dept} onChange={e => set('dept', e.target.value)} style={i}><option>Kỹ thuật</option><option>Kinh doanh</option><option>Nhân sự</option><option>Marketing</option></select></FG>
              <FG label="Chức vụ"><input value={formData.pos} onChange={e => set('pos', e.target.value)} style={i} /></FG>
              <FG label="Loại hợp đồng"><select value={formData.contractType} onChange={e => set('contractType', e.target.value)} style={i}><option>HĐ Không xác định thời hạn</option><option>HĐ 24 tháng</option><option>HĐ 12 tháng</option><option>HĐ Thử việc</option></select></FG>
              <FG label="Cấp bậc / Vai trò"><input value={formData.rank} onChange={e => set('rank', e.target.value)} style={i} /></FG>
              <FG label="Ngày vào làm"><input type="date" value={formData.joinDate} onChange={e => set('joinDate', e.target.value)} style={i} /></FG>
              <FG label="Ngày chính thức"><input type="date" value={formData.officialDate} onChange={e => set('officialDate', e.target.value)} style={i} /></FG>
              <FG label="Trạng thái"><select value={formData.status} onChange={e => set('status', e.target.value)} style={i}><option>Đang làm</option><option>Nghỉ phép</option><option>Nghỉ việc</option><option>Thử việc</option></select></FG>
            </div>
          </section>
          <section>
            <ST title="Lương và Phụ cấp" icon={<DollarSign size={18} />} />
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: 'span 2' }}><FG label="Lương cơ bản (Gross)"><input type="number" value={formData.salary.base} onChange={e => setSalary('base', e.target.value)} style={{ ...i, fontWeight: '700', color: '#10b981' }} /></FG></div>
              <FG label="PC. Ăn trưa"><input type="number" value={formData.salary.lunch} onChange={e => setSalary('lunch', e.target.value)} style={i} /></FG>
              <FG label="PC. Đi lại"><input type="number" value={formData.salary.travel} onChange={e => setSalary('travel', e.target.value)} style={i} /></FG>
              <FG label="PC. Điện thoại"><input type="number" value={formData.salary.phone} onChange={e => setSalary('phone', e.target.value)} style={i} /></FG>
              <FG label="Chuyên cần"><input type="number" value={formData.salary.diligence} onChange={e => setSalary('diligence', e.target.value)} style={i} /></FG>
              <FG label="Trang phục"><input type="number" value={formData.salary.uniform} onChange={e => setSalary('uniform', e.target.value)} style={i} /></FG>
              <FG label="Tăng ca (OT)"><input type="number" value={formData.salary.ot} onChange={e => setSalary('ot', e.target.value)} style={i} /></FG>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

/* ── MAIN COMPONENT ── */
const Employees = () => {
  const [employees, setEmployees] = useState(initEmployees);
  const [view, setView] = useState('list');
  const [formInitial, setFormInitial] = useState(null);
  const [detailEmp, setDetailEmp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ dept: '', contractType: '', status: '', startDate: '', endDate: '' });

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));
  const clearFilters = () => { setSearchTerm(''); setFilters({ dept: '', contractType: '', status: '', startDate: '', endDate: '' }); };
  const hasActiveFilter = !!(searchTerm || filters.dept || filters.contractType || filters.status || filters.startDate || filters.endDate);

  // Inactive / reactivate employee
  const handleInactive = (id) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === id
        ? { ...emp, status: emp.status === 'Nghỉ việc' ? 'Đang làm' : 'Nghỉ việc' }
        : emp
    ));
    // If the detail drawer is open for this employee, update it
    setDetailEmp(prev => prev && prev.id === id
      ? { ...prev, status: prev.status === 'Nghỉ việc' ? 'Đang làm' : 'Nghỉ việc' }
      : prev
    );
  };

  const filteredEmployees = useMemo(() => employees.filter(emp => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !term || emp.name.toLowerCase().includes(term) || emp.id.toLowerCase().includes(term) || emp.emailCompany.toLowerCase().includes(term);
    const matchDept = !filters.dept || emp.dept === filters.dept;
    const matchContract = !filters.contractType || emp.contractType === filters.contractType;
    const matchStatus = !filters.status || emp.status === filters.status;
    let matchDate = true;
    if (filters.startDate) matchDate = matchDate && new Date(emp.joinDate) >= new Date(filters.startDate);
    if (filters.endDate) matchDate = matchDate && new Date(emp.joinDate) <= new Date(filters.endDate);
    return matchSearch && matchDept && matchContract && matchStatus && matchDate;
  }), [employees, searchTerm, filters]);

  if (view === 'form') return <EmployeeForm initial={formInitial} onBack={() => { setView('list'); setFormInitial(null); }} />;

  const deptOpts = ['', 'Kỹ thuật', 'Kinh doanh', 'Nhân sự', 'Marketing'].map(v => ({ value: v, label: v || 'Tất cả phòng ban' }));
  const contractOpts = ['', 'HĐ Không xác định thời hạn', 'HĐ 24 tháng', 'HĐ 12 tháng', 'HĐ Thử việc'].map(v => ({ value: v, label: v || 'Tất cả loại HĐ' }));
  const statusOpts = ['', 'Đang làm', 'Thử việc', 'Nghỉ phép', 'Nghỉ việc'].map(v => ({ value: v, label: v || 'Tất cả trạng thái' }));

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>
          Nhân viên <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '400' }}>({filteredEmployees.length} kết quả)</span>
        </h2>
        <button onClick={() => { setFormInitial(null); setView('form'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
          <Plus size={18} /> Thêm nhân viên
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #eef2f6', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input type="text" placeholder="Tìm tên, mã NV, email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: searchTerm ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', background: searchTerm ? '#eef2ff' : '#fafbff', color: '#334155', boxSizing: 'border-box', transition: 'all 0.2s' }} />
        </div>
        <div style={{ width: 1, height: 30, background: '#eef2f6', flexShrink: 0 }} />
        <SoftSelect label="Tất cả phòng ban" value={filters.dept} onChange={v => setFilter('dept', v)} options={deptOpts} />
        <SoftSelect label="Tất cả loại HĐ" value={filters.contractType} onChange={v => setFilter('contractType', v)} options={contractOpts} />
        <SoftSelect label="Tất cả trạng thái" value={filters.status} onChange={v => setFilter('status', v)} options={statusOpts} />
        <div style={{ width: 1, height: 30, background: '#eef2f6', flexShrink: 0 }} />
        <DateRangePicker startDate={filters.startDate} endDate={filters.endDate} onApply={(s, e) => { setFilter('startDate', s); setFilter('endDate', e); }} />
        {hasActiveFilter && (
          <button onClick={clearFilters}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px', borderRadius: 10, border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer', flexShrink: 0 }}>
            <X size={13} /> Xóa lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
            <tr>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nhân viên</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mã NV</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phòng ban</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chức vụ</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ngày vào làm</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Trạng thái</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fbfcff'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar src={emp.avatar} name={emp.name} size={38} radius={9} />
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{emp.emailCompany}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>{emp.id}</td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>{emp.dept}</td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>{emp.pos}</td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>{emp.joinDate}</td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}><StatusBadge status={emp.status} /></td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                  <ActionMenu
                    emp={emp}
                    onView={() => setDetailEmp(emp)}
                    onEdit={() => { setFormInitial(emp); setView('form'); }}
                    onInactive={handleInactive}
                  />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>Không tìm thấy nhân viên phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {detailEmp && (
          <DetailDrawer key="drawer" emp={detailEmp}
            onClose={() => setDetailEmp(null)}
            onEdit={() => { setFormInitial(detailEmp); setDetailEmp(null); setView('form'); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employees;

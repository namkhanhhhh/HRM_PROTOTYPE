import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText, Plus, Search, Edit2, Eye,
  X, Save, ArrowLeft, Calendar,
  ChevronDown, MoreVertical, CheckCircle,
  AlertCircle, History, Download, Trash2,
  Clock, FilePlus, User, UserCheck, ShieldCheck, DollarSign, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── MOCK DATA ── */
const initContracts = [
  {
    id: 'HD001',
    employeeId: 'NV001',
    employeeName: 'Nguyễn Nam Khánh',
    employeeAvatar: '/tds_img.jpg',
    type: 'Chính thức',
    description: 'Hợp đồng lao động không xác định thời hạn cho vị trí Senior Fullstack Dev.',
    attachment: 'HDLD_KhanhNN_2024.pdf',
    managedBy: 'Trần Thị Mai',
    createdBy: 'Admin Tester',
    approvedBy: 'CEO Nguyễn Văn A',
    approvalStatus: 'Approved',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2026-01-01',
    salary: 25000000,
    dept: 'Kỹ thuật',
    history: [
      { date: '2024-01-01', action: 'Tạo mới', user: 'Admin Tester', detail: 'Tạo hợp đồng chính thức lần đầu' }
    ]
  },
  {
    id: 'HD002',
    employeeId: 'NV003',
    employeeName: 'Lê Hoàng Tuấn',
    employeeAvatar: '',
    type: 'Thử việc',
    description: 'Hợp đồng thử việc 2 tháng cho vị trí Business Development.',
    attachment: 'HDTV_TuanLH.pdf',
    managedBy: 'Trần Thị Mai',
    createdBy: 'Admin Tester',
    approvedBy: 'Trần Thị Mai',
    approvalStatus: 'Approved',
    status: 'Active',
    startDate: '2025-02-15',
    endDate: '2025-04-15',
    salary: 10000000,
    dept: 'Kinh doanh',
    history: [
      { date: '2025-02-15', action: 'Tạo mới', user: 'Admin Tester', detail: 'Tạo hợp đồng thử việc' }
    ]
  },
  {
    id: 'HD003',
    employeeId: 'NV002',
    employeeName: 'Trần Thị Mai',
    employeeAvatar: '',
    type: 'Chính thức',
    description: 'Hợp đồng HR Manager.',
    attachment: 'HDLD_MaiTT.pdf',
    managedBy: 'CEO Nguyễn Văn A',
    createdBy: 'Admin Tester',
    approvedBy: 'CEO Nguyễn Văn A',
    approvalStatus: 'Approved',
    status: 'Expired',
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    salary: 18000000,
    dept: 'Nhân sự',
    history: [
      { date: '2023-01-01', action: 'Tạo mới', user: 'Admin Tester', detail: 'Hợp đồng năm 2023' },
      { date: '2024-12-31', action: 'Hết hạn', user: 'System', detail: 'Hết thời hạn hợp đồng' }
    ]
  },
  {
    id: 'HD004',
    employeeId: 'NV004',
    employeeName: 'Phạm Minh Đức',
    employeeAvatar: '',
    type: 'Thời vụ',
    description: 'Hợp đồng thời vụ 3 tháng.',
    attachment: 'HDTV_DucPM.pdf',
    managedBy: 'Nguyễn Nam Khánh',
    createdBy: 'Admin Tester',
    approvedBy: '',
    approvalStatus: 'Pending',
    status: 'Draft',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    salary: 8000000,
    dept: 'Kỹ thuật',
    history: [
      { date: '2025-03-15', action: 'Tạo bản nháp', user: 'Admin Tester', detail: 'Chờ duyệt từ quản lý' }
    ]
  }
];

const initRequests = [
  {
    id: 'REQ001', type: 'Create', targetId: 'HD005', employeeName: 'Võ Thị Lan',
    contractType: 'Thử việc', startDate: '2025-04-01', endDate: '2025-06-01', salary: 9000000,
    dept: 'Marketing', requestedBy: 'Lê Thị HR', requestDate: '2025-03-18 10:45',
    note: 'Nhân sự mới cho dự án Q2', status: 'Pending'
  }
];

/* ── CONFIGURATION ── */
const statusConfig = {
  'Active': { bg: '#ecfdf5', color: '#059669', dot: '#10b981', label: 'Đang hiệu lực' },
  'Draft': { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8', label: 'Bản nháp' },
  'Expired': { bg: '#fef2f2', color: '#ef4444', dot: '#f87171', label: 'Đã hết hạn' },
};

const typeColors = {
  'Thử việc': { color: '#3b82f6', bg: '#eff6ff' },
  'Chính thức': { color: '#059669', bg: '#ecfdf5' },
  'Thời vụ': { color: '#d97706', bg: '#fff7ed' },
  'Cộng tác viên': { color: '#7c3aed', bg: '#f5f3ff' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8', label: status };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: '600', background: cfg.bg, color: cfg.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const cfg = typeColors[type] || { color: '#64748b', bg: '#f1f5f9' };
  return (
    <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: '700', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
      {type}
    </span>
  );
};

const Avatar = ({ src, name, size = 32, radius = 8 }) => (
  <div style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #e0e7ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {src
      ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : <span style={{ fontSize: size * 0.4, fontWeight: '700', color: '#6366f1' }}>{name?.[0] || '?'}</span>}
  </div>
);

/* ── REUSABLE COMPONENTS ── */
const SoftSelect = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  const current = options.find(o => o.value === value);
  const isActive = value !== '';
  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 150 }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', padding: '9px 14px', borderRadius: 10, border: isActive ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', background: isActive ? '#eef2ff' : 'white', color: isActive ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: isActive ? '600' : '500', cursor: 'pointer', transition: 'all 0.2s' }}>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{current?.label || label}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '100%', background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', zIndex: 400, padding: 6 }}>
            {options.map((opt, i) => (
              <div key={i} onClick={() => { onChange(opt.value); setOpen(false); }} style={{ padding: '8px 12px', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer', fontWeight: value === opt.value ? '600' : '400', background: value === opt.value ? '#eef2ff' : 'transparent', color: value === opt.value ? '#4f46e5' : '#334155' }}>
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContractActionMenu = ({ contract, onView, onEdit, onExtend, onCancel, onHistory }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ background: 'transparent', border: 'none', padding: 6, borderRadius: 8, cursor: 'pointer', color: '#64748b' }}>
        <MoreVertical size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'absolute', top: '100%', right: 0, background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, padding: 6, width: 200, border: '1px solid #f1f5f9' }}>
            <div onClick={() => { onView(contract); setOpen(false); }} style={{ padding: '9px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, color: '#6366f1' }}><Eye size={15} /> Xem chi tiết</div>
            <div onClick={() => { onEdit(contract); setOpen(false); }} style={{ padding: '9px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, color: '#0ea5e9' }}><Edit2 size={15} /> Chỉnh sửa</div>
            <div onClick={() => { onHistory(contract); setOpen(false); }} style={{ padding: '9px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, color: '#8b5cf6' }}><History size={15} /> Lịch sử thay đổi</div>
            {contract.status === 'Active' && (
              <>
                <div style={{ height: 1, background: '#f1f5f9', margin: '4px' }} />
                <div onClick={() => { onExtend(contract); setOpen(false); }} style={{ padding: '9px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, color: '#10b981' }}><FilePlus size={15} /> Gia hạn / Cập nhật</div>
                <div onClick={() => { onCancel(contract); setOpen(false); }} style={{ padding: '9px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444' }}><Trash2 size={15} /> Hủy hợp đồng</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── RENEW MODAL ── */
const RenewModal = ({ contract, onClose, onSubmit }) => {
  const today = new Date().toISOString().split('T')[0];
  const [data, setData] = useState({ type: 'Chính thức', startDate: today, endDate: '', note: '', updateTime: new Date().toLocaleString('vi-VN') });
  useEffect(() => {
    if (data.type === 'Chính thức' && data.startDate) {
      const d = new Date(data.startDate);
      d.setFullYear(d.getFullYear() + 1);
      setData(p => ({ ...p, endDate: d.toISOString().split('T')[0] }));
    }
  }, [data.type, data.startDate]);
  const iStyle = { padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e8edf4', outline: 'none', width: '100%', fontSize: '0.875rem', background: 'white' };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'relative', width: 480, background: 'white', borderRadius: 24, boxShadow: '0 24px 60px rgba(0,0,0,0.2)', padding: '2rem', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 }}>Gia hạn / Cập nhật hợp đồng</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b' }}>{contract.id} — {contract.employeeName}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 10, cursor: 'pointer', flexShrink: 0 }}><X size={18} color="#64748b" /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>Loại gia hạn</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Chính thức', 'Thử việc', 'Thực tập'].map(t => (
                <button key={t} onClick={() => setData(p => ({ ...p, type: t, endDate: '' }))} style={{ flex: 1, padding: '10px 4px', borderRadius: 12, border: data.type === t ? '2px solid #6366f1' : '1.5px solid #e8edf4', background: data.type === t ? '#eef2ff' : 'white', color: data.type === t ? '#4f46e5' : '#64748b', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Ngày bắt đầu</label>
              <input type="date" value={data.startDate} onChange={e => setData(p => ({ ...p, startDate: e.target.value }))} style={iStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Ngày kết thúc</label>
              <input type="date" value={data.endDate} onChange={e => setData(p => ({ ...p, endDate: e.target.value }))} style={iStyle} />
              {data.type === 'Chính thức' && <div style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: '600' }}>* Mặc định 1 năm</div>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Ghi chú / Lý do <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea rows={3} value={data.note} onChange={e => setData(p => ({ ...p, note: e.target.value }))} placeholder="VD: Hoàn thành thử việc xuất sắc, đề nghị ký hợp đồng chính thức..." style={{ ...iStyle, resize: 'none' }} />
          </div>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={15} color="#94a3b8" />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Thời điểm cập nhật: <strong style={{ color: '#1e293b' }}>{data.updateTime}</strong></span>
          </div>
          <button onClick={() => { if (!data.note.trim()) { alert('Vui lòng điền ghi chú / lý do.'); return; } onSubmit(data); }} style={{ width: '100%', padding: '13px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
            Gửi yêu cầu phê duyệt →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── HISTORY MODAL ── */
const HistoryModal = ({ contract, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)' }} />
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} style={{ position: 'relative', width: 460, maxHeight: '80vh', background: 'white', borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.15)', padding: '2rem', overflowY: 'auto', zIndex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <History size={20} color="#8b5cf6" />
          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b' }}>Lịch sử thay đổi</span>
        </div>
        <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 10, cursor: 'pointer' }}><X size={18} color="#64748b" /></button>
      </div>
      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
        Hợp đồng <strong style={{ color: '#475569' }}>{contract.id}</strong> • {contract.employeeName}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {contract.history?.length ? contract.history.map((h, i) => (
          <div key={i} style={{ position: 'relative', paddingLeft: '1.75rem', borderLeft: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <div style={{ position: 'absolute', left: -6, top: 3, width: 10, height: 10, borderRadius: '50%', background: '#8b5cf6', border: '3px solid white', boxShadow: '0 0 0 3px #f5f3ff' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b' }}>{h.action}</span>
              <span style={{ fontSize: '0.73rem', color: '#94a3b8' }}>{h.date}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>Bởi: <strong>{h.user}</strong></div>
            <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: 6, background: '#f8fafc', padding: '8px 12px', borderRadius: 10, lineHeight: '1.5' }}>{h.detail}</div>
          </div>
        )) : <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem 0' }}>Chưa có lịch sử ghi nhận</div>}
      </div>
    </motion.div>
  </div>
);


const DetailDrawer = ({ contract, onClose, onEdit }) => {
  if (!contract) return null;
  const SectionLabel = ({ icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '1.5rem 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ color: '#6366f1' }}>{icon}</span>
      <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>{title}</span>
    </div>
  );
  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{value || '—'}</span>
    </div>
  );

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.3)', zIndex: 200, backdropFilter: 'blur(3px)' }} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 550, background: 'white', zIndex: 201, boxShadow: '-12px 0 48px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white' }}>
          <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1e293b' }}>Chi tiết Hợp đồng</span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => onEdit(contract)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}><Edit2 size={15} /> Chỉnh sửa</button>
            <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 8, cursor: 'pointer' }}><X size={18} color="#64748b" /></button>
          </div>
        </div>
        <div style={{ padding: '1.5rem 1.75rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)', borderRadius: 14, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.1)' }}>
              <FileText size={28} color="#6366f1" />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.15rem', color: '#1e293b' }}>{contract.id}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                <StatusBadge status={contract.status} />
                <TypeBadge type={contract.type} />
              </div>
            </div>
          </div>

          <SectionLabel icon={<User size={16} />} title="Thông tin Nhân sự" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#f8fafc', borderRadius: 10 }}>
              <Avatar src={contract.employeeAvatar} name={contract.employeeName} size={42} />
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b' }}>{contract.employeeName}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Mã NV: {contract.employeeId} • {contract.dept}</div>
              </div>
            </div>
            <InfoRow label="Người quản lý" value={contract.managedBy} />
            <InfoRow label="Mức lương" value={`${contract.salary?.toLocaleString('vi-VN')} ₫`} />
          </div>

          <SectionLabel icon={<Calendar size={16} />} title="Thời hạn & Phê duyệt" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <InfoRow label="Ngày hiệu lực" value={contract.startDate} />
            <InfoRow label="Ngày hết hạn" value={contract.endDate} />
            <InfoRow label="Trạng thái duyệt" value={<span style={{ fontWeight: '600', color: contract.approvalStatus === 'Approved' ? '#10b981' : '#f59e0b' }}>{contract.approvalStatus === 'Approved' ? 'Đã phê duyệt' : 'Chờ duyệt'}</span>} />
            <InfoRow label="Người phê duyệt" value={contract.approvedBy || '(Chưa có)'} />
          </div>

          <SectionLabel icon={<FilePlus size={16} />} title="Mô tả & Đính kèm" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <InfoRow label="Mô tả chung" value={contract.description} />
            <div style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={20} color="#94a3b8" />
                <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: '500' }}>{contract.attachment}</span>
              </div>
              <button style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: '600', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Download size={14} /> Tải xuống</button>
            </div>
          </div>

          <SectionLabel icon={<History size={16} />} title="Lịch sử thay đổi" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {contract.history?.map((h, i) => (
              <div key={i} style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div style={{ position: 'absolute', left: -5, top: 0, width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{h.action}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{h.date}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>Thực hiện bởi: <span style={{ fontWeight: '600' }}>{h.user}</span></div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: 4, background: '#f8fafc', padding: '6px 10px', borderRadius: 6 }}>{h.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

/* ── FORM COMPONENT ── */
const ContractForm = ({ initial, onBack }) => {
  const [formData, setFormData] = useState(initial || {
    id: `HD${Math.floor(Math.random() * 9000) + 1000}`,
    employeeId: '',
    employeeName: '',
    type: 'Thử việc',
    description: '',
    attachment: '',
    managedBy: '',
    startDate: '',
    endDate: '',
    salary: 0,
    dept: 'Kỹ thuật',
    status: 'Draft',
    approvalStatus: 'Pending',
    createdBy: 'Admin Tester',
    approvedBy: ''
  });

  const ST = ({ title, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f1f5f9' }}>
      <span style={{ color: '#6366f1' }}>{icon}</span>
      <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{title}</h3>
    </div>
  );
  const FG = ({ label, children, required }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
      {children}
    </div>
  );
  const inputStyle = { padding: '10px 12px', borderRadius: 9, border: '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', width: '100%', background: 'white', boxSizing: 'border-box' };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'white', borderRadius: 16, border: '1px solid #eef2f6', padding: '1.5rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} style={{ padding: 8, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}><ArrowLeft size={18} color="#64748b" /></button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>{initial ? 'Chỉnh sửa Hợp đồng' : 'Tạo Hợp đồng lao động mới'}</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer', color: '#475569', fontSize: '0.875rem' }}>Hủy</button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}><Save size={16} /> Lưu hợp đồng</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <ST title="Thông tin cơ bản" icon={<FileText size={18} />} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FG label="Mã hợp đồng" required><input value={formData.id} disabled style={{ ...inputStyle, background: '#f8fafc' }} /></FG>
              <FG label="Loại hợp đồng" required>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={inputStyle}>
                  <option>Thử việc</option>
                  <option>Chính thức</option>
                  <option>Thời vụ</option>
                  <option>Cộng tác viên</option>
                </select>
              </FG>
              <div style={{ gridColumn: 'span 2' }}>
                <FG label="Chọn nhân viên" required>
                  <select value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} style={inputStyle}>
                    <option value="">-- Chọn nhân viên --</option>
                    <option value="NV001">Nguyễn Nam Khánh (NV001)</option>
                    <option value="NV002">Trần Thị Mai (NV002)</option>
                    <option value="NV003">Lê Hoàng Tuấn (NV003)</option>
                  </select>
                </FG>
              </div>
              <FG label="Ngày bắt đầu" required><input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={inputStyle} /></FG>
              <FG label="Ngày kết thúc"><input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={inputStyle} /></FG>
              <FG label="Mức lương Gross"><input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })} style={inputStyle} /></FG>
              <FG label="Phòng ban"><input value={formData.dept} style={inputStyle} disabled /></FG>
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <ST title="Quản lý & File đính kèm" icon={<ShieldCheck size={18} />} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FG label="Quản lý trực tiếp"><input placeholder="Tên quản lý..." value={formData.managedBy} onChange={e => setFormData({ ...formData, managedBy: e.target.value })} style={inputStyle} /></FG>
              <FG label="Người phê duyệt"><input placeholder="Tên người duyệt..." value={formData.approvedBy} onChange={e => setFormData({ ...formData, approvedBy: e.target.value })} style={inputStyle} /></FG>
              <FG label="Mô tả tổng quát">
                <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, resize: 'none' }} placeholder="Nhập các điều khoản hoặc mô tả quan trọng..." />
              </FG>
              <FG label="File đính kèm (.pdf, .doc)">
                <div style={{ padding: '1.5rem', border: '2px dashed #e2e8f0', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: '#fafbff' }}>
                  <FilePlus size={24} color="#94a3b8" />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Kéo thả hoặc click để tải lên bản scan hợp đồng</span>
                </div>
              </FG>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

/* ── MAIN PAGE ── */
const Contracts = () => {
  const [contracts, setContracts] = useState(initContracts);
  const [requests, setRequests] = useState(initRequests);
  const [view, setView] = useState('list');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedContract, setSelectedContract] = useState(null);
  const [formInitial, setFormInitial] = useState(null);
  const [renewTarget, setRenewTarget] = useState(null);
  const [historyTarget, setHistoryTarget] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '', dept: '', manager: '', salaryMin: '', salaryMax: '' });

  const alerts = useMemo(() => {
    const now = new Date(); const later = new Date(); later.setDate(now.getDate() + 30);
    return contracts.filter(c => { if (!c.endDate || c.status !== 'Active') return false; const e = new Date(c.endDate); return e > now && e <= later; });
  }, [contracts]);

  const suggestions = useMemo(() => contracts.filter(c => c.type === 'Thử việc' && c.status === 'Active' && c.endDate && new Date(c.endDate) <= new Date()), [contracts]);

  const filteredContracts = useMemo(() => contracts.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !term || c.employeeName.toLowerCase().includes(term) || c.id.toLowerCase().includes(term);
    const matchType = !filters.type || c.type === filters.type;
    const matchStatus = !filters.status || c.status === filters.status;
    const matchDept = !filters.dept || c.dept === filters.dept;
    const matchManager = !filters.manager || c.managedBy.toLowerCase().includes(filters.manager.toLowerCase());
    const matchSalary = (!filters.salaryMin || c.salary >= Number(filters.salaryMin)) && (!filters.salaryMax || c.salary <= Number(filters.salaryMax));
    return matchSearch && matchType && matchStatus && matchDept && matchManager && matchSalary;
  }), [contracts, searchTerm, filters]);

  const handleApprove = (req) => {
    const ts = new Date().toLocaleString('vi-VN');
    if (req.type === 'Create') {
      setContracts(p => [{ id: req.targetId, employeeId: 'NV-NEW', employeeName: req.employeeName, employeeAvatar: '', type: req.contractType, description: req.note, attachment: 'HDLD_SCAN.pdf', managedBy: 'Admin', createdBy: req.requestedBy, approvedBy: 'Admin', approvalStatus: 'Approved', status: 'Active', startDate: req.startDate, endDate: req.endDate, salary: req.salary, dept: req.dept || 'Kỹ thuật', history: [{ date: ts, action: 'Khởi tạo', user: 'Admin', detail: 'Phê duyệt từ HR: ' + req.note }] }, ...p]);
    } else if (req.type === 'Renew') {
      setContracts(p => p.map(c => c.id === req.targetId ? { ...c, type: req.contractType, startDate: req.startDate, endDate: req.endDate, history: [...(c.history || []), { date: ts, action: 'Gia hạn hợp đồng', user: 'Admin', detail: req.note }] } : c));
    } else if (req.type === 'Cancel') {
      setContracts(p => p.map(c => c.id === req.targetId ? { ...c, status: 'Expired', history: [...(c.history || []), { date: ts, action: 'Hủy hợp đồng', user: 'Admin', detail: req.note }] } : c));
    }
    setRequests(p => p.filter(r => r.id !== req.id));
  };

  if (view === 'form') return <ContractForm initial={formInitial} onBack={() => { setView('list'); setFormInitial(null); }} />;

  const typeOpts = ['', 'Thử việc', 'Chính thức', 'Thời vụ', 'Cộng tác viên'].map(v => ({ value: v, label: v || 'Tất cả loại HĐ' }));
  const statusOpts = ['', 'Active', 'Draft', 'Expired'].map(v => ({ value: v, label: v ? statusConfig[v].label : 'Tất cả trạng thái' }));
  const deptOpts = ['', 'Kỹ thuật', 'Kinh doanh', 'Nhân sự', 'Marketing'].map(v => ({ value: v, label: v || 'Tất cả phòng ban' }));

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Alerts */}
      {(alerts.length > 0 || suggestions.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {alerts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, color: '#92400e' }}>
              <AlertCircle size={20} color="#f59e0b" />
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                Có <strong>{alerts.length} hợp đồng</strong> sắp hết hạn trong 30 ngày tới. Vui lòng kiểm tra và thực hiện gia hạn.
              </div>
            </motion.div>
          )}
          {suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, color: '#1e40af' }}>
              <UserCheck size={20} color="#3b82f6" />
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                Có <strong>{suggestions.length} nhân viên</strong> đã hoàn thành thử việc. Gợi ý tạo hợp đồng chính thức cho <strong>{suggestions.map(s => s.employeeName).join(', ')}</strong>.
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>Quản lý Hợp đồng Lao động</h2>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <button onClick={() => setActiveTab('list')} style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: activeTab === 'list' ? '#6366f1' : 'transparent', color: activeTab === 'list' ? 'white' : '#64748b', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>Danh sách ({contracts.length})</button>
            <button onClick={() => setActiveTab('approval')} style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: activeTab === 'approval' ? '#f59e0b' : 'transparent', color: activeTab === 'approval' ? 'white' : '#64748b', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s' }}>Chờ phê duyệt {requests.length > 0 && <span style={{ padding: '1px 6px', borderRadius: 20, background: activeTab === 'approval' ? 'rgba(255,255,255,0.85)' : '#fbbf24', color: activeTab === 'approval' ? '#f59e0b' : 'white', fontSize: '0.7rem', fontWeight: '800' }}>{requests.length}</span>}</button>
          </div>
        </div>
        <button onClick={() => { setFormInitial(null); setView('form'); }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
          <Plus size={18} /> Thêm hợp đồng
        </button>
      </div>
      {activeTab === 'approval' && <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '0.75rem 1.25rem', fontSize: '0.85rem', color: '#92400e' }}>Đang xem tab <strong>Phê duyệt</strong> — chỉ Admin nội bộ có quyền thao tác.</div>}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {[
          { label: 'Tổng hợp đồng', count: contracts.length, icon: <FileText size={20} />, color: '#6366f1' },
          { label: 'Đang hiệu lực', count: contracts.filter(c => c.status === 'Active').length, icon: <CheckCircle size={20} />, color: '#10b981' },
          { label: 'Sắp hết hạn', count: alerts.length, icon: <Clock size={20} />, color: '#f59e0b' },
          { label: 'Chờ phê duyệt', count: contracts.filter(c => c.approvalStatus === 'Pending').length, icon: <UserCheck size={20} />, color: '#8b5cf6' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '1.25rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b' }}>{stat.count}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #eef2f6', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input type="text" placeholder="Tìm tên NV, mã HĐ..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: searchTerm ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', background: searchTerm ? '#eef2ff' : '#fafbff' }} />
        </div>
        <div style={{ position: 'relative', flex: '1 1 150px', minWidth: 150 }}>
          <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input type="text" placeholder="Người quản lý..." value={filters.manager} onChange={e => setFilters({ ...filters, manager: e.target.value })} style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, border: filters.manager ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', background: 'white' }} />
        </div>
        <SoftSelect label="Loại hợp đồng" value={filters.type} options={typeOpts} onChange={v => setFilters({ ...filters, type: v })} />
        <SoftSelect label="Trạng thái" value={filters.status} options={statusOpts} onChange={v => setFilters({ ...filters, status: v })} />
        <SoftSelect label="Phòng ban" value={filters.dept} options={deptOpts} onChange={v => setFilters({ ...filters, dept: v })} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '4px 10px', borderRadius: 10, border: '1px solid #e8edf4' }}>
          <DollarSign size={14} color="#94a3b8" />
          <input type="number" placeholder="Lương từ" value={filters.salaryMin} onChange={e => setFilters({ ...filters, salaryMin: e.target.value })} style={{ width: 80, border: 'none', background: 'transparent', fontSize: '0.82rem', outline: 'none' }} />
          <span style={{ color: '#cbd5e1' }}>-</span>
          <input type="number" placeholder="Đến" value={filters.salaryMax} onChange={e => setFilters({ ...filters, salaryMax: e.target.value })} style={{ width: 80, border: 'none', background: 'transparent', fontSize: '0.82rem', outline: 'none' }} />
        </div>
        <button onClick={() => { setSearchTerm(''); setFilters({ type: '', status: '', dept: '', manager: '', salaryMin: '', salaryMax: '' }); }} style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>Đặt lại</button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #eef2f6', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
            <tr>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Hợp đồng</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Nhân viên</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Loại HĐ</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Thời hạn</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Mức lương</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>Trạng thái</th>
              <th style={{ padding: '0.9rem 1rem', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ padding: 8, background: '#f1f5f9', borderRadius: 8, color: '#6366f1' }}><FileText size={18} /></div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.875rem' }}>{c.id}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Duyệt: {c.approvalStatus}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar src={c.employeeAvatar} name={c.employeeName} />
                    <div>
                      <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.875rem' }}>{c.employeeName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.dept}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}><TypeBadge type={c.type} /></td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>{c.startDate}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.endDate || '—'}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '700', color: '#10b981' }}>{c.salary?.toLocaleString('vi-VN')} ₫</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}><StatusBadge status={c.status} /></td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <ContractActionMenu
                    contract={c}
                    onView={() => setSelectedContract(c)}
                    onEdit={(c) => { setFormInitial(c); setView('form'); }}
                    onExtend={(c) => setRenewTarget(c)}
                    onHistory={(c) => setHistoryTarget(c)}
                    onCancel={(c) => {
                      if (window.confirm(`Gửi yêu cầu hủy hợp đồng ${c.id} lên Admin nội bộ?`)) {
                        setRequests(p => [{ id: `REQ${Date.now()}`, type: 'Cancel', targetId: c.id, employeeName: c.employeeName, contractType: c.type, startDate: c.startDate, endDate: c.endDate, salary: c.salary, dept: c.dept, requestedBy: 'HR User', requestDate: new Date().toLocaleString('vi-VN'), note: 'Yêu cầu hủy hợp đồng từ HR', status: 'Pending' }, ...p]);
                        setActiveTab('approval');
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* APPROVAL PANEL */}
      <AnimatePresence>
        {activeTab === 'approval' && (
          <motion.div key="approval-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(390px, 1fr))', gap: '1.25rem' }}>
            {requests.length === 0 && <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem', color: '#94a3b8', fontSize: '0.95rem' }}>Không có yêu cầu nào đang chờ xử lý</div>}
            {requests.map(req => (
              <div key={req.id} style={{ background: 'white', borderRadius: 20, border: '1px solid #eef2f6', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: 3, color: req.type === 'Create' ? '#3b82f6' : req.type === 'Renew' ? '#f59e0b' : '#ef4444' }}>{req.type === 'Create' ? 'Tạo mới' : req.type === 'Renew' ? 'Gia hạn' : 'Hủy bỏ'}</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>{req.id}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>{req.requestDate}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', marginTop: 2 }}>bởi {req.requestedBy}</div>
                  </div>
                </div>
                <div style={{ background: '#fafbff', borderRadius: 14, padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '800', color: '#1e293b', marginBottom: 6 }}>{req.employeeName}</div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.7' }}>
                    <TypeBadge type={req.contractType} />{' '}
                    <span style={{ marginLeft: 4 }}>Lương: {req.salary?.toLocaleString()} ₫</span><br />
                    {req.startDate} → {req.endDate || '—'}
                  </div>
                  {req.note && <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9', fontSize: '0.82rem', fontStyle: 'italic', color: '#64748b' }}>"{req.note}"</div>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleApprove(req)} style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: '#059669', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.875rem' }}><CheckCircle size={15} /> Phê duyệt</button>
                  <button onClick={() => setRequests(p => p.filter(r => r.id !== req.id))} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #fecaca', background: '#fff1f2', color: '#e11d48', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.875rem' }}><XCircle size={15} /> Từ chối</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedContract && <DetailDrawer contract={selectedContract} onClose={() => setSelectedContract(null)} onEdit={(c) => { setFormInitial(c); setSelectedContract(null); setView('form'); }} />}
        {renewTarget && <RenewModal contract={renewTarget} onClose={() => setRenewTarget(null)} onSubmit={(d) => { setRequests(p => [{ id: `REQ${Date.now()}`, type: 'Renew', targetId: renewTarget.id, employeeName: renewTarget.employeeName, contractType: d.type, startDate: d.startDate, endDate: d.endDate, salary: renewTarget.salary, dept: renewTarget.dept, requestedBy: 'HR User', requestDate: new Date().toLocaleString('vi-VN'), note: d.note, status: 'Pending' }, ...p]); setRenewTarget(null); setActiveTab('approval'); }} />}
        {historyTarget && <HistoryModal contract={historyTarget} onClose={() => setHistoryTarget(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Contracts;

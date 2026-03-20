import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  CheckSquare, Plus, Search, Calendar, 
  CheckCircle2, XCircle, Clock, ChevronDown, 
  MoreVertical, Eye, Edit2, History, Save, 
  ArrowLeft, User, FileText, CalendarDays, UserCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── MOCK DATA ── */
const leaveTypes = [
  'Nghỉ phép năm',
  'Nghỉ không lương',
  'Nghỉ ốm',
  'Nghỉ thai sản',
  'Nghỉ kết hôn',
  'Nghỉ việc riêng'
];

const statusStyles = {
  'Chờ duyệt': { bg: '#fff7ed', color: '#f59e0b', icon: <Clock size={14} />, dot: '#fbbf24' },
  'Đã duyệt': { bg: '#ecfdf5', color: '#059669', icon: <CheckCircle2 size={14} />, dot: '#10b981' },
  'Từ chối': { bg: '#fef2f2', color: '#ef4444', icon: <XCircle size={14} />, dot: '#f87171' },
};

const initialLeaves = [
  {
    id: 'L001', empId: 'NV001', empName: 'Nguyễn Nam Khánh', type: 'Nghỉ phép năm',
    from: '2024-03-25T08:00', to: '2024-03-26T17:30', duration: 2,
    reason: 'Giải quyết việc gia đình', status: 'Đã duyệt', approver: 'Trần Thị Mai', approvalNote: 'Đồng ý phê duyệt.',
    createdAt: '2024-03-20T09:00',
    history: [
      { time: '2024-03-20T09:00', user: 'Nguyễn Nam Khánh', action: 'Tạo đơn mới', before: '', after: 'Chờ duyệt' },
      { time: '2024-03-21T10:30', user: 'Trần Thị Mai', action: 'Phê duyệt', before: 'Chờ duyệt', after: 'Đã duyệt', note: 'Đồng ý phê duyệt.' }
    ]
  },
  {
    id: 'L002', empId: 'NV002', empName: 'Trần Thị Mai', type: 'Nghỉ ốm',
    from: '2024-03-22T08:00', to: '2024-03-22T17:30', duration: 1,
    reason: 'Sốt cao, cần nghỉ ngơi', status: 'Chờ duyệt', approver: '', approvalNote: '',
    createdAt: '2024-03-21T08:15',
    history: [
      { time: '2024-03-21T08:15', user: 'Trần Thị Mai', action: 'Tạo đơn mới', before: '', after: 'Chờ duyệt' }
    ]
  },
  {
    id: 'L003', empId: 'NV003', empName: 'Lê Hoàng Tuấn', type: 'Nghỉ phép năm',
    from: '2024-03-15T08:00', to: '2024-03-15T12:00', duration: 0.5,
    reason: 'Đi khám bệnh', status: 'Từ chối', approver: 'Trần Thị Mai', approvalNote: 'Công việc đang gấp, dời sang tuần sau.',
    createdAt: '2024-03-14T14:00',
    history: [
      { time: '2024-03-14T14:00', user: 'Lê Hoàng Tuấn', action: 'Tạo đơn mới', before: '', after: 'Chờ duyệt' },
      { time: '2024-03-14T16:20', user: 'Trần Thị Mai', action: 'Từ chối', before: 'Chờ duyệt', after: 'Từ chối', note: 'Công việc đang gấp, dời sang tuần sau.' }
    ]
  }
];

const employees = [
  { id: 'NV001', name: 'Nguyễn Nam Khánh', avatar: '/tds_img.jpg' },
  { id: 'NV002', name: 'Trần Thị Mai', avatar: '' },
  { id: 'NV003', name: 'Lê Hoàng Tuấn', avatar: '' },
];

/* ── HELPERS ── */
const calculateDays = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = e - s;
  if (diff <= 0) return 0;
  const diffHours = diff / (1000 * 60 * 60);
  if (diffHours <= 4) return 0.5;
  if (diffHours <= 9) return 1;
  return Math.max(0.5, Math.round((diff / (1000 * 60 * 60 * 24)) * 2) / 2);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', { 
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

/* ── COMPONENTS ── */
const Avatar = ({ src, name, size = 38 }) => (
  <div style={{ width: size, height: size, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #e0e7ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         : <span style={{ fontSize: size * 0.38, fontWeight: '700', color: '#6366f1' }}>{name?.[0] || '?'}</span>}
  </div>
);

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || statusStyles['Chờ duyệt'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: '600', background: style.bg, color: style.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot }} />
      {status}
    </span>
  );
};

const DashboardCard = ({ title, count, icon, color }) => (
  <div style={{ background: 'white', padding: '1.5rem', borderRadius: 16, border: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 200, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{title}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{count}</div>
    </div>
  </div>
);

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
    <div ref={ref} style={{ position: 'relative', minWidth: 160 }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', padding: '9px 14px', borderRadius: 10, border: isActive ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', background: isActive ? '#eef2ff' : 'white', color: isActive ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: isActive ? '600' : '500', cursor: 'pointer', transition: 'all 0.2s' }}>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayLabel}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '100%', background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', zIndex: 400, padding: 6 }}>
            {options.map((opt, i) => (
              <div key={i} onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{ padding: '8px 12px', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer', background: value === opt.value ? '#eef2ff' : 'transparent', color: value === opt.value ? '#4f46e5' : '#334155' }}
                onMouseEnter={e => e.currentTarget.style.background = value === opt.value ? '#eef2ff' : '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = value === opt.value ? '#eef2ff' : 'transparent'}
              >{opt.label}</div>
            ))}
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
  ];

  const isActive = startDate || endDate;
  const displayText = startDate && endDate ? `${startDate} → ${endDate}` : startDate ? `Từ ${startDate}` : endDate ? `Đến ${endDate}` : 'Lọc theo ngày';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 10, border: isActive ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', background: isActive ? '#eef2ff' : 'white', color: isActive ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: isActive ? '600' : '500', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
        <Calendar size={15} style={{ flexShrink: 0 }} />
        <span>{displayText}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.16 }}
            style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 300, background: 'white', borderRadius: 16, boxShadow: '0 16px 40px rgba(0,0,0,0.14)', border: '1px solid #eef2f6', zIndex: 9999, padding: '1rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Lựa chọn nhanh</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: '1rem' }}>
              {quickOptions.map(({ label, action }) => (
                <div key={label} onClick={action} style={{ padding: '8px 10px', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer', color: '#334155' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{label}</div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginBottom: 4, fontWeight: '700' }}>Từ ngày</div>
                  <input type="date" value={localStart} onChange={e => setLocalStart(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginBottom: 4, fontWeight: '700' }}>Đến ngày</div>
                  <input type="date" value={localEnd} onChange={e => setLocalEnd(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button onClick={() => { setLocalStart(''); setLocalEnd(''); onApply('', ''); setOpen(false); }} style={{ flex: 1, padding: '9px', borderRadius: 9, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Hủy bộ lọc</button>
                <button onClick={() => { onApply(localStart, localEnd); setOpen(false); }} style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Áp dụng</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── ACTION MENU ── */
const ActionMenu = ({ leave, onViewDetail, onViewHistory, onEdit }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center' }}>
      <button onClick={() => setOpen(!open)}
        style={{ background: open ? '#f1f5f9' : 'transparent', padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', color: '#64748b', transition: 'all 0.15s' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = '#f8fafc'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}>
        <MoreVertical size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, width: 180, background: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #eef2f6', zIndex: 100, padding: 6 }}>
            <div onClick={() => { onViewDetail(leave); setOpen(false); }} style={menuItemStyle}><Eye size={15} color="#6366f1" /> Xem chi tiết</div>
            <div onClick={() => { onViewHistory(leave); setOpen(false); }} style={menuItemStyle}><History size={15} color="#0ea5e9" /> Xem lịch sử</div>
            {leave.status === 'Chờ duyệt' && (
              <>
                <div style={{ height: 1, background: '#f1f5f9', margin: '4px' }} />
                <div onClick={() => { onEdit(leave); setOpen(false); }} style={menuItemStyle}><Edit2 size={15} color="#f59e0b" /> Chỉnh sửa đơn</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const menuItemStyle = { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', color: '#334155', transition: 'background 0.15s' };

/* ── STATUS DROPDOWN (Inline Edit) ── */
const StatusDropdown = ({ leave, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const st = statusStyles[leave.status];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px 4px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: '600', background: st.bg, color: st.color, border: 'none', cursor: 'pointer' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }} />
        {leave.status}
        <ChevronDown size={12} style={{ opacity: 0.7 }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 140, background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #eef2f6', zIndex: 50, padding: 6 }}>
            {['Chờ duyệt', 'Đã duyệt', 'Từ chối'].map(s => {
              if (s === leave.status) return null;
              const sStyle = statusStyles[s];
              return (
                <div key={s} onClick={() => { onStatusChange(leave, s); setOpen(false); }}
                  style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', borderRadius: 8, color: sStyle.color }}
                  onMouseEnter={e => e.currentTarget.style.background = sStyle.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: sStyle.dot }} /> {s}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── MAIN PAGE ── */
const Leaves = () => {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [view, setView] = useState('list'); // list, form
  const [selectedLeave, setSelectedLeave] = useState(null);
  
  // Drawer states
  const [drawerMode, setDrawerMode] = useState(null); // 'detail', 'history'
  
  // Status Modal states
  const [statusModal, setStatusModal] = useState({ open: false, leave: null, newStatus: '', note: '' });

  const [filters, setFilters] = useState({ empId: '', status: '', type: '', startDate: '', endDate: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({ id: '', empId: 'NV001', type: 'Nghỉ phép năm', from: '', to: '', reason: '', duration: 0 });

  useEffect(() => {
    setFormData(prev => ({ ...prev, duration: calculateDays(prev.from, prev.to) }));
  }, [formData.from, formData.to]);

  const filteredLeaves = useMemo(() => leaves.filter(l => {
    const matchSearch = !searchTerm || l.empName.toLowerCase().includes(searchTerm.toLowerCase()) || l.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmp = !filters.empId || l.empId === filters.empId;
    const matchStatus = !filters.status || l.status === filters.status;
    const matchType = !filters.type || l.type === filters.type;
    let matchDate = true;
    if (filters.startDate) matchDate = matchDate && new Date(l.from) >= new Date(filters.startDate);
    if (filters.endDate) matchDate = matchDate && new Date(l.from) <= new Date(filters.endDate + 'T23:59:59');
    return matchSearch && matchEmp && matchStatus && matchType && matchDate;
  }), [leaves, searchTerm, filters]);

  const stats = useMemo(() => ({
    pending: leaves.filter(l => l.status === 'Chờ duyệt').length,
    approved: leaves.filter(l => l.status === 'Đã duyệt').length,
    rejected: leaves.filter(l => l.status === 'Từ chối').length,
    total: leaves.length
  }), [leaves]);

  const handleSaveForm = () => {
    const emp = employees.find(e => e.id === formData.empId);
    if (formData.id) {
      // Edit mode
      setLeaves(prev => prev.map(l => {
        if (l.id === formData.id) {
          const newHistory = [...l.history, { time: new Date().toISOString(), user: emp.name, action: 'Cập nhật', before: l.status, after: l.status, note: 'Sửa thông tin đơn xin nghỉ' }];
          return { ...l, ...formData, history: newHistory };
        }
        return l;
      }));
    } else {
      // Create mode
      const newLeave = {
        ...formData, id: `L00${leaves.length + 1}`, empName: emp.name, status: 'Chờ duyệt', approver: '',
        createdAt: new Date().toISOString(),
        history: [{ time: new Date().toISOString(), user: emp.name, action: 'Tạo đơn mới', before: '', after: 'Chờ duyệt' }]
      };
      setLeaves([newLeave, ...leaves]);
    }
    setView('list');
  };

  const handleConfirmStatusChange = () => {
    const { leave, newStatus, note } = statusModal;
    setLeaves(prev => prev.map(l => {
      if (l.id === leave.id) {
        const newHistory = [...l.history, {
          time: new Date().toISOString(), user: 'Trần Thị Mai', // Admin mock
          action: newStatus === 'Đã duyệt' ? 'Phê duyệt' : newStatus === 'Từ chối' ? 'Từ chối' : 'Đổi trạng thái',
          before: l.status, after: newStatus, note
        }];
        return { ...l, status: newStatus, approver: 'Trần Thị Mai', approvalNote: note, history: newHistory };
      }
      return l;
    }));
    setStatusModal({ open: false, leave: null, newStatus: '', note: '' });
    // Update selected leave if drawer is open
    if (selectedLeave && selectedLeave.id === leave.id) {
      setSelectedLeave({ ...selectedLeave, status: newStatus, approver: 'Trần Thị Mai', approvalNote: note });
    }
  };

  if (view === 'form') {
    const isEdit = !!formData.id;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setView('list')} style={{ padding: 10, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex' }}>
              <ArrowLeft size={20} color="#64748b" />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.02em' }}>
              {isEdit ? 'Chỉnh sửa đơn nghỉ phép' : 'Tạo đơn xin nghỉ phép'}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setView('list')} style={{ padding: '10px 24px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer', color: '#475569' }}>Hủy bỏ</button>
            <button onClick={handleSaveForm} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
              <Save size={18} /> {isEdit ? 'Cập nhật' : 'Gửi duyệt'}
            </button>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #eef2f6', padding: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '3rem' }}>
            {/* Left Col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <FileText size={18} color="#6366f1" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b' }}>Thông tin đơn nghỉ</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Nhân viên</label>
                  <select value={formData.empId} onChange={e => setFormData({ ...formData, empId: e.target.value })} style={inputStyle}>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Loại nghỉ phép</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={inputStyle}>
                    {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Từ ngày - giờ</label>
                  <input type="datetime-local" value={formData.from} onChange={e => setFormData({ ...formData, from: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Đến ngày - giờ</label>
                  <input type="datetime-local" value={formData.to} onChange={e => setFormData({ ...formData, to: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Lý do nghỉ <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} placeholder="Ghi rõ lý do xin nghỉ để cấp rên xem xét..." style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} />
              </div>
            </div>

            {/* Right Col */}
            <div>
              <div style={{ background: '#f8fafc', borderRadius: 16, padding: '1.5rem', border: '1px dashed #cbd5e1', position: 'sticky', top: '5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', color: '#6366f1' }}>
                  <CalendarDays size={20} />
                  <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Tổng thời gian</span>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', lineHeight: 1 }}>
                  {formData.duration} <span style={{ fontSize: '1rem', fontWeight: '600', color: '#64748b' }}>Ngày</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>Hệ thống tự động tính toán số ngày nghỉ dựa trên giờ bắt đầu và kết thúc bạn đã chọn.</p>
                <div style={{ height: 1, background: '#e2e8f0', margin: '1rem 0' }} />
                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Ngày phép còn lại:</span> <span style={{ fontWeight: '700' }}>12 Ngày</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sau khi duyệt:</span> <span style={{ fontWeight: '700', color: '#10b981' }}>{12 - formData.duration} Ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Dashboard */}
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <DashboardCard title="Chờ duyệt" count={stats.pending} icon={<Clock size={24} />} color="#f59e0b" />
        <DashboardCard title="Đã duyệt" count={stats.approved} icon={<CheckCircle2 size={24} />} color="#10b981" />
        <DashboardCard title="Từ chối" count={stats.rejected} icon={<XCircle size={24} />} color="#ef4444" />
        <DashboardCard title="Tổng số đơn" count={stats.total} icon={<FileText size={24} />} color="#6366f1" />
      </div>

      {/* Filter & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #eef2f6', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flex: 1, maxWidth: 900 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder="Tìm kiếm đơn..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', background: '#f8fafc' }} />
          </div>
          <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />
          <SoftSelect label="Nhân viên" value={filters.empId} onChange={v => setFilters({ ...filters, empId: v })} options={[{ value: '', label: 'Tất cả nhân viên' }, ...employees.map(e => ({ value: e.id, label: e.name }))]} />
          <SoftSelect label="Loại nghỉ" value={filters.type} onChange={v => setFilters({ ...filters, type: v })} options={[{ value: '', label: 'Tất cả loại nghỉ' }, ...leaveTypes.map(t => ({ value: t, label: t }))]} />
          <SoftSelect label="Trạng thái" value={filters.status} onChange={v => setFilters({ ...filters, status: v })} options={[{ value: '', label: 'Tất cả trạng thái' }, ...Object.keys(statusStyles).map(k => ({ value: k, label: k }))]} />
          <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />
          <DateRangePicker startDate={filters.startDate} endDate={filters.endDate} onApply={(s, e) => setFilters({ ...filters, startDate: s, endDate: e })} />
        </div>
        <button onClick={() => { setFormData({ id: '', empId: 'NV001', type: 'Nghỉ phép năm', from: '', to: '', reason: '', duration: 0 }); setView('form'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
          <Plus size={18} /> Tạo đơn mới
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
            <tr>
              <th style={thStyle}>Nhân viên</th>
              <th style={thStyle}>Loại nghỉ</th>
              <th style={thStyle}>Thời gian</th>
              <th style={thStyle}>Số ngày</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Người duyệt</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#fbfcff'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ ...tdStyle, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <Avatar src={employees.find(e => e.id === l.empId)?.avatar} name={l.empName} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{l.empName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>#{l.empId}</div>
                  </div>
                </td>
                <td style={tdStyle}>{l.type}</td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>Từ: {formatDate(l.from)}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>Đến: {formatDate(l.to)}</div>
                </td>
                <td style={tdStyle}><span style={{ fontWeight: '800', color: '#6366f1', padding: '4px 8px', background: '#eef2ff', borderRadius: 6 }}>{l.duration}</span></td>
                <td style={tdStyle}>
                  {/* Inline Status Dropdown */}
                  <StatusDropdown leave={l} onStatusChange={(leave, newStatus) => setStatusModal({ open: true, leave, newStatus, note: '' })} />
                </td>
                <td style={tdStyle}>{l.approver || '—'}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <ActionMenu 
                    leave={l}
                    onViewDetail={leave => { setSelectedLeave(leave); setDrawerMode('detail'); }}
                    onViewHistory={leave => { setSelectedLeave(leave); setDrawerMode('history'); }}
                    onEdit={leave => { setFormData({ ...leave }); setView('form'); }}
                  />
                </td>
              </tr>
            ))}
            {filteredLeaves.length === 0 && <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Không tìm thấy đơn nào.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerMode && selectedLeave && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setDrawerMode(null); setSelectedLeave(null); }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.3)', zIndex: 1000, backdropFilter: 'blur(3px)' }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 35, stiffness: 350 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 500, background: 'white', zIndex: 1001, boxShadow: '-12px 0 48px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{drawerMode === 'detail' ? 'Chi tiết đơn nghỉ phép' : 'Lịch sử thay đổi'}</h3>
                <button onClick={() => { setDrawerMode(null); setSelectedLeave(null); }} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
                  <X size={18} color="#64748b" />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)', borderRadius: 16, marginBottom: '1.5rem' }}>
                  <Avatar src={employees.find(e => e.id === selectedLeave.empId)?.avatar} name={selectedLeave.empName} size={56} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' }}>{selectedLeave.empName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '600' }}>#{selectedLeave.empId} • Mã đơn: {selectedLeave.id}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}><StatusBadge status={selectedLeave.status} /></div>
                </div>

                {drawerMode === 'detail' ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #f1f5f9' }}>
                         <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Loại nghỉ</div>
                         <div style={{ fontWeight: '700', color: '#1e293b' }}>{selectedLeave.type}</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #f1f5f9' }}>
                         <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Số ngày</div>
                         <div style={{ fontWeight: '800', color: '#6366f1' }}>{selectedLeave.duration} ngày</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={labelStyle}>Thời gian</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                        <div style={timeBoxStyle}>{formatDate(selectedLeave.from)}</div>
                        <span style={{ color: '#94a3b8' }}>→</span>
                        <div style={timeBoxStyle}>{formatDate(selectedLeave.to)}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={labelStyle}>Lý do</label>
                      <div style={{ marginTop: 8, padding: 16, background: '#f8fafc', borderRadius: 12, fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, border: '1px solid #eef2f6' }}>
                        {selectedLeave.reason}
                      </div>
                    </div>

                    {selectedLeave.approver && (
                      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
                        <label style={{ ...labelStyle, color: '#166534', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><UserCheck size={16}/> Thông tin phê duyệt</label>
                        <div style={{ fontSize: '0.85rem', color: '#166534' }}><span style={{ fontWeight: '700' }}>Người duyệt:</span> {selectedLeave.approver}</div>
                        {selectedLeave.approvalNote && <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: 4 }}><span style={{ fontWeight: '700' }}>Ghi chú:</span> {selectedLeave.approvalNote}</div>}
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
                      <History size={18} color="#6366f1" />
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Lịch sử đơn từ</h4>
                    </div>
                    {/* Reuse history timeline logic */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {selectedLeave.history.slice().reverse().map((h, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                          {i !== selectedLeave.history.length - 1 && <div style={{ position: 'absolute', left: 7, top: 20, bottom: -20, width: 2, background: '#f1f5f9' }} />}
                          <div style={{ width: 16, height: 16, borderRadius: '50%', background: i === 0 ? '#6366f1' : '#e2e8f0', border: '3px solid white', boxShadow: '0 0 0 1px #f1f5f9', zIndex: 1, marginTop: 4 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{h.action}</span>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatDate(h.time)}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Bởi: <span style={{ fontWeight: '600' }}>{h.user}</span></div>
                            {h.before && (
                              <div style={{ fontSize: '0.75rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{h.before}</span> <span>→</span> <span style={{ fontWeight: '600', color: statusStyles[h.after]?.color || '#1e293b' }}>{h.after}</span>
                              </div>
                            )}
                            {h.note && <div style={{ marginTop: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, fontSize: '0.8rem', color: '#475569', borderLeft: '3px solid #cbd5e1' }}>"{h.note}"</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Inline Status Confirmation Modal */}
      <AnimatePresence>
        {statusModal.open && (
           <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setStatusModal({ open: false, leave: null, newStatus: '', note: '' })}
              style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()}
                style={{ background: 'white', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 450, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Xác nhận đổi trạng thái</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  Bạn đang đổi trạng thái đơn của <span style={{ fontWeight: '700', color: '#1e293b' }}>{statusModal.leave.empName}</span> sang <StatusBadge status={statusModal.newStatus} />.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '2rem' }}>
                  <label style={labelStyle}>Ghi chú xác nhận (Bắt buộc)</label>
                  <textarea 
                    value={statusModal.note} onChange={e => setStatusModal(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="Nhập lý do đổi trạng thái..."
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setStatusModal({ open: false, leave: null, newStatus: '', note: '' })} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer', color: '#475569' }}>Hủy</button>
                  <button 
                    disabled={!statusModal.note.trim()}
                    onClick={handleConfirmStatusChange} 
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: statusModal.note.trim() ? '#6366f1' : '#cbd5e1', color: 'white', fontWeight: '600', cursor: statusModal.note.trim() ? 'pointer' : 'not-allowed' }}>
                    Xác nhận
                  </button>
                </div>
              </motion.div>
            </motion.div>
           </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── STYLES ── */
const thStyle = { padding: '1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' };
const tdStyle = { padding: '1.1rem 1rem', fontSize: '0.9rem', color: '#334155', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', transition: 'border 0.2s', background: 'white', boxSizing: 'border-box' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block' };
const timeBoxStyle = { flex: 1, padding: 12, background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', textAlign: 'center' };

export default Leaves;

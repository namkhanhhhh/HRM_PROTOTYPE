import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Plus, Search, Calendar, 
  CheckCircle2, XCircle, Clock, ChevronDown, 
  MoreVertical, Eye, Edit2, History, Save, 
  ArrowLeft, FileText, CalendarDays, UserCheck, X,
  DollarSign, Receipt, MessageSquare, User, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── MOCK DATA ── */
const initialExpenses = [
  {
    id: 'EXP001', creator: 'Nguyễn Nam Khánh', date: '2024-03-15', description: 'Tiền taxi đi gặp khách hàng',
    amount: 150000, note: 'Tuyến đường: Quận 1 - Quận 7', status: 'Đã duyệt', 
    approver: 'Trần Thị Mai', approvalNote: 'Hợp lý, duyệt chi.',
    receipt: '/receipt_sample.jpg', // Representing an uploaded invoice
    createdAt: '2024-03-15T10:00:00',
    history: [
      { time: '2024-03-15T10:00', user: 'Nguyễn Nam Khánh', action: 'Tạo yêu cầu', before: '', after: 'Chờ duyệt' },
      { time: '2024-03-16T09:30', user: 'Trần Thị Mai', action: 'Phê duyệt', before: 'Chờ duyệt', after: 'Đã duyệt', note: 'Hợp lý, duyệt chi.' }
    ]
  },
  {
    id: 'EXP002', creator: 'Trần Thị Mai', date: '2024-03-18', description: 'Mua văn phòng phẩm tháng 3',
    amount: 2500000, note: 'Giấy in, bút, kẹp file...', status: 'Chờ duyệt', 
    approver: '', approvalNote: '',
    receipt: '',
    createdAt: '2024-03-18T14:20:00',
    history: [
      { time: '2024-03-18T14:20', user: 'Trần Thị Mai', action: 'Tạo yêu cầu', before: '', after: 'Chờ duyệt' }
    ]
  },
  {
    id: 'EXP003', creator: 'Lê Hoàng Tuấn', date: '2024-03-10', description: 'Tiền trà nước tiếp khách',
    amount: 500000, note: 'Khách hàng công ty ABC', status: 'Từ chối', 
    approver: 'Nguyễn Nam Khánh', approvalNote: 'Không có hóa đơn đi kèm.',
    receipt: '',
    createdAt: '2024-03-10T08:45:00',
    history: [
      { time: '2024-03-10T08:45', user: 'Lê Hoàng Tuấn', action: 'Tạo yêu cầu', before: '', after: 'Chờ duyệt' },
      { time: '2024-03-11T16:00', user: 'Nguyễn Nam Khánh', action: 'Từ chối', before: 'Chờ duyệt', after: 'Từ chối', note: 'Không có hóa đơn đi kèm.' }
    ]
  }
];

const statusStyles = {
  'Chờ duyệt': { bg: '#fff7ed', color: '#f59e0b', icon: <Clock size={14} />, dot: '#fbbf24' },
  'Đã duyệt': { bg: '#ecfdf5', color: '#059669', icon: <CheckCircle2 size={14} />, dot: '#10b981' },
  'Từ chối': { bg: '#fef2f2', color: '#ef4444', icon: <XCircle size={14} />, dot: '#f87171' },
};

/* ── HELPERS ── */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', { 
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

/* ── COMPONENTS ── */
const Avatar = ({ name, size = 32 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <span style={{ fontSize: size * 0.4, fontWeight: '700', color: '#6366f1' }}>{name?.[0] || '?'}</span>
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
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', padding: '9px 14px', borderRadius: 10, border: isActive ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', background: isActive ? '#eef2ff' : 'white', color: isActive ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: isActive ? '600' : '500', cursor: 'pointer' }}>
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
  const isActive = startDate || endDate;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 10, border: isActive ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', background: isActive ? '#eef2ff' : 'white', color: isActive ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: isActive ? '600' : '500', cursor: 'pointer' }}>
        <Calendar size={15} /> <span>{isActive ? `${startDate} → ${endDate}` : 'Lọc theo ngày'}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 280, background: 'white', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #eef2f6', zIndex: 500, padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>Từ ngày</label><input type="date" value={localStart} onChange={e => setLocalStart(e.target.value)} style={inputStyle} /></div>
              <div><label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>Đến ngày</label><input type="date" value={localEnd} onChange={e => setLocalEnd(e.target.value)} style={inputStyle} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button onClick={() => { setLocalStart(''); setLocalEnd(''); onApply('', ''); setOpen(false); }} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Hủy lọc</button>
                <button onClick={() => { onApply(localStart, localEnd); setOpen(false); }} style={{ flex: 1, padding: 8, borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Lọc</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DashboardCard = ({ title, count, icon, color }) => (
  <div style={{ background: 'white', padding: '1.5rem', borderRadius: 16, border: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 200, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div><div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{title}</div><div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{count}</div></div>
  </div>
);

const ActionMenu = ({ expense, onView, onEdit, onHistory }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button onClick={() => setOpen(!open)} style={{ background: 'transparent', padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', color: '#64748b' }}><MoreVertical size={18} /></button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: 'absolute', top: '100%', right: 0, width: 180, background: 'white', borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.1)', border: '1px solid #eef2f6', zIndex: 100, padding: 6 }}>
            <div onClick={() => { onView(expense); setOpen(false); }} style={menuItemStyle}><Eye size={15} color="#6366f1" /> Xem chi tiết</div>
            <div onClick={() => { onHistory(expense); setOpen(false); }} style={menuItemStyle}><History size={15} color="#0ea5e9" /> Xem lịch sử</div>
            {expense.status === 'Chờ duyệt' && <div onClick={() => { onEdit(expense); setOpen(false); }} style={menuItemStyle}><Edit2 size={15} color="#f59e0b" /> Chỉnh sửa</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const menuItemStyle = { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', color: '#334155' };

const StatusDropdown = ({ expense, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const st = statusStyles[expense.status];
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: '600', background: st.bg, color: st.color, border: 'none', cursor: 'pointer' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }} /> {expense.status} <ChevronDown size={12} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 4, width: 130, background: 'white', borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #eef2f6', zIndex: 50, padding: 6 }}>
            {Object.keys(statusStyles).map(s => (
              s !== expense.status && (
                <div key={s} onClick={() => { onStatusChange(expense, s); setOpen(false); }} style={{ padding: '8px 10px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', borderRadius: 8, color: statusStyles[s].color }} onMouseEnter={e => e.currentTarget.style.background = statusStyles[s].bg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                   <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyles[s].dot, display: 'inline-block', marginRight: 6 }} /> {s}
                </div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── MAIN PAGE ── */
const Expenses = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [view, setView] = useState('list'); // list, form
  const [selectedExp, setSelectedExp] = useState(null);
  const [drawerMode, setDrawerMode] = useState(null); // detail, history
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });
  const [statusModal, setStatusModal] = useState({ open: false, exp: null, newStatus: '', note: '' });

  const [formData, setFormData] = useState({ id: '', creator: 'Nguyễn Nam Khánh', date: '', description: '', amount: '', note: '', receipt: '' });

  const filteredExpenses = useMemo(() => expenses.filter(e => {
    const matchSearch = !searchTerm || e.description.toLowerCase().includes(searchTerm.toLowerCase()) || e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filters.status || e.status === filters.status;
    let matchDate = true;
    if (filters.startDate) matchDate = matchDate && new Date(e.date) >= new Date(filters.startDate);
    if (filters.endDate) matchDate = matchDate && new Date(e.date) <= new Date(filters.endDate);
    return matchSearch && matchStatus && matchDate;
  }), [expenses, searchTerm, filters]);

  const stats = useMemo(() => ({
    pending: expenses.filter(e => e.status === 'Chờ duyệt').length,
    approved: expenses.filter(e => e.status === 'Đã duyệt').length,
    rejected: expenses.filter(e => e.status === 'Từ chối').length,
    total: expenses.length
  }), [expenses]);

  const handleSaveForm = () => {
    if (formData.id) {
      setExpenses(prev => prev.map(e => {
        if (e.id === formData.id) {
          return { ...e, ...formData, history: [...e.history, { time: new Date().toISOString(), user: 'Nguyễn Nam Khánh', action: 'Cập nhật', before: e.status, after: e.status, note: 'Sửa thông tin yêu cầu' }] };
        }
        return e;
      }));
    } else {
      const newExp = {
        ...formData, id: `EXP00${expenses.length + 1}`, status: 'Chờ duyệt', approver: '',
        createdAt: new Date().toISOString(),
        history: [{ time: new Date().toISOString(), user: formData.creator, action: 'Tạo yêu cầu', before: '', after: 'Chờ duyệt' }]
      };
      setExpenses([newExp, ...expenses]);
    }
    setView('list');
  };

  const handleConfirmStatusChange = () => {
    const { exp, newStatus, note } = statusModal;
    setExpenses(prev => prev.map(e => {
      if (e.id === exp.id) {
        return { 
          ...e, status: newStatus, approver: 'Admin Nội bộ', approvalNote: note,
          history: [...e.history, { time: new Date().toISOString(), user: 'Admin Nội bộ', action: 'Đổi trạng thái', before: e.status, after: newStatus, note }]
        };
      }
      return e;
    }));
    setStatusModal({ open: false, exp: null, newStatus: '', note: '' });
  };

  if (view === 'form') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setView('list')} style={{ padding: 10, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}><ArrowLeft size={20} color="#64748b" /></button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{formData.id ? 'Chỉnh sửa yêu cầu chi phí' : 'Tạo yêu cầu chi phí mới'}</h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setView('list')} style={{ padding: '10px 24px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Hủy bỏ</button>
            <button onClick={handleSaveForm} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> {formData.id ? 'Cập nhật' : 'Gửi yêu cầu'}
            </button>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 20, padding: '2.5rem', border: '1px solid #eef2f6', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
               <div style={formGroupStyle}><label style={labelStyle}>Ngày phát sinh</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={inputStyle} /></div>
               <div style={formGroupStyle}><label style={labelStyle}>Số tiền (VND)</label><input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0" style={inputStyle} /></div>
             </div>
             <div style={formGroupStyle}><label style={labelStyle}>Mô tả yêu cầu <span style={{ color: '#ef4444' }}>*</span></label><input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="VD: Tiền taxi, Mua văn phòng phẩm..." style={inputStyle} /></div>
             <div style={formGroupStyle}><label style={labelStyle}>Ghi chú chi tiết</label><textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="Nội dung chi tiết về khoản phí này..." style={{ ...inputStyle, minHeight: 120 }} /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 16, border: '1px dashed #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', color: '#6366f1' }}><Receipt size={20} /><span style={{ fontWeight: '700' }}>Hóa đơn / Chứng từ</span></div>
              <div style={{ width: '100%', height: 160, borderRadius: 12, border: '2px dashed #e2e8f0', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}>
                <Upload size={24} color="#94a3b8" />
                <span style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>Click hoặc kéo thả<br/>ảnh hóa đơn vào đây</span>
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>Chấp nhận: JPG, PNG, PDF (Max 5MB)</div>
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
        <DashboardCard title="Tổng yêu cầu" count={stats.total} icon={<DollarSign size={24} />} color="#6366f1" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #eef2f6', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flex: 1, maxWidth: 850 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder="Tìm kiếm mã đơn, mô tả..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#f8fafc' }} />
          </div>
          <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />
          <SoftSelect label="Trạng thái" value={filters.status} onChange={v => setFilters({...filters, status: v})} options={[{value: '', label: 'Tất cả trạng thái'}, ...Object.keys(statusStyles).map(s => ({value: s, label: s}))]} />
          <DateRangePicker startDate={filters.startDate} endDate={filters.endDate} onApply={(s, e) => setFilters({...filters, startDate: s, endDate: e})} />
        </div>
        <button onClick={() => { setFormData({ id: '', creator: 'Nguyễn Nam Khánh', date: '', description: '', amount: '', note: '', receipt: '' }); setView('form'); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}><Plus size={18} /> Tạo yêu cầu chi phí</button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #eef2f6', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
            <tr>
              <th style={thStyle}>Người tạo</th>
              <th style={thStyle}>Mã đơn</th>
              <th style={thStyle}>Ngày phát sinh</th>
              <th style={thStyle}>Mô tả</th>
              <th style={thStyle}>Số tiền</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid #f8fafc' }} onMouseEnter={el => el.currentTarget.style.background = '#fbfcff'} onMouseLeave={el => el.currentTarget.style.background = 'white'}>
                <td style={{ ...tdStyle, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <Avatar name={e.creator} /> <span style={{ fontWeight: '600' }}>{e.creator}</span>
                </td>
                <td style={tdStyle}><span style={{ color: '#6366f1', fontWeight: '700' }}>#{e.id}</span></td>
                <td style={tdStyle}>{formatDate(e.date)}</td>
                <td style={{ ...tdStyle, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.description}</td>
                <td style={{ ...tdStyle, fontWeight: '700', color: '#1e293b' }}>{formatCurrency(e.amount)}</td>
                <td style={tdStyle}><StatusDropdown expense={e} onStatusChange={(exp, s) => setStatusModal({ open: true, exp, newStatus: s, note: '' })} /></td>
                <td style={tdStyle}>
                  <ActionMenu expense={e} onView={ex => { setSelectedExp(ex); setDrawerMode('detail'); }} onHistory={ex => { setSelectedExp(ex); setDrawerMode('history'); }} onEdit={ex => { setFormData({...ex}); setView('form'); }} />
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && <tr><td colSpan={7} style={{ padding: '3rem', color: '#94a3b8' }}>Không tìm thấy yêu cầu nào.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerMode && selectedExp && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setDrawerMode(null); setSelectedExp(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.3)', zIndex: 1000, backdropFilter: 'blur(3px)' }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 35, stiffness: 350 }} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 500, background: 'white', zIndex: 1001, boxShadow: '-12px 0 48px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{drawerMode === 'detail' ? 'Chi tiết yêu cầu chi phí' : 'Lịch sử thay đổi'}</h3>
                <button onClick={() => { setDrawerMode(null); setSelectedExp(null); }} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: '50%', cursor: 'pointer' }}><X size={18} color="#64748b" /></button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 16, marginBottom: '1.5rem', border: '1px solid #eef2f6' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                     <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8' }}>#{selectedExp.id}</span>
                     <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 20, background: statusStyles[selectedExp.status].bg, color: statusStyles[selectedExp.status].color, fontSize: '0.75rem', fontWeight: '800' }}>{selectedExp.status}</span>
                   </div>
                   <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{formatCurrency(selectedExp.amount)}</div>
                   <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: 5 }}>{selectedExp.description}</div>
                </div>

                {drawerMode === 'detail' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={detailBoxStyle}><div style={detailLabelStyle}><User size={14}/> Người tạo</div><div style={detailValueStyle}>{selectedExp.creator}</div></div>
                      <div style={detailBoxStyle}><div style={detailLabelStyle}><Calendar size={14}/> Ngày phát sinh</div><div style={detailValueStyle}>{formatDate(selectedExp.date)}</div></div>
                    </div>
                    <div><div style={detailLabelStyle}><MessageSquare size={14}/> Ghi chú</div><div style={{ ...detailValueStyle, background: '#f8fafc', padding: 12, borderRadius: 10, marginTop: 6, lineHeight: 1.5 }}>{selectedExp.note || 'Không có ghi chú.'}</div></div>
                    <div>
                      <div style={detailLabelStyle}><Receipt size={14}/> Hóa đơn đính kèm</div>
                      {selectedExp.receipt ? (
                        <div style={{ marginTop: 10, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}><img src={selectedExp.receipt} alt="Receipt" style={{ width: '100%', display: 'block' }} /></div>
                      ) : (
                        <div style={{ marginTop: 10, padding: '2rem', background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>Chưa đính kèm hóa đơn</div>
                      )}
                    </div>
                    {selectedExp.approver && (
                      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
                        <div style={{ ...detailLabelStyle, color: '#166534' }}><UserCheck size={14}/> Phê duyệt bởi: <span style={{ fontWeight: '800' }}>{selectedExp.approver}</span></div>
                        <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: 4 }}>"{selectedExp.approvalNote}"</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {selectedExp.history.slice().reverse().map((h, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                        {i !== selectedExp.history.length - 1 && <div style={{ position: 'absolute', left: 7, top: 20, bottom: -20, width: 2, background: '#f1f5f9' }} />}
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: i === 0 ? '#6366f1' : '#e2e8f0', border: '3px solid white', boxShadow: '0 0 0 1px #f1f5f9', zIndex: 1, marginTop: 4 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}><span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{h.action}</span><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatDateTime(h.time)}</span></div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Bởi: <span style={{ fontWeight: '600' }}>{h.user}</span></div>
                          {h.note && <div style={{ marginTop: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, fontSize: '0.8rem', borderLeft: '3px solid #cbd5e1' }}>"{h.note}"</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {statusModal.open && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 450, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Xác nhận duyệt chi phí</h3>
               <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>Mã đơn: <span style={{ fontWeight: '700', color: '#6366f1' }}>#{statusModal.exp.id}</span> - Số tiền: <span style={{ fontWeight: '700', color: '#1e293b' }}>{formatCurrency(statusModal.exp.amount)}</span></p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '2rem' }}>
                 <label style={labelStyle}>Ghi chú phê duyệt/từ chối <span style={{ color: '#ef4444' }}>*</span></label>
                 <textarea value={statusModal.note} onChange={e => setStatusModal({...statusModal, note: e.target.value})} placeholder="Nhập lý do..." style={{ ...inputStyle, minHeight: 100 }} />
               </div>
               <div style={{ display: 'flex', gap: '1rem' }}>
                 <button onClick={() => setStatusModal({ open: false, exp: null, newStatus: '', note: '' })} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Hủy</button>
                 <button disabled={!statusModal.note.trim()} onClick={handleConfirmStatusChange} style={{ flex: 1, padding: 10, borderRadius: 10, border: 'none', background: statusModal.note.trim() ? '#6366f1' : '#cbd5e1', color: 'white', fontWeight: '600', cursor: statusModal.note.trim() ? 'pointer' : 'not-allowed' }}>Xác nhận</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── STYLES ── */
const thStyle = { padding: '1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '1.1rem 1rem', fontSize: '0.9rem', color: '#334155' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: 6 };
const formGroupStyle = { display: 'flex', flexDirection: 'column' };
const detailBoxStyle = { background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #f1f5f9' };
const detailLabelStyle = { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 };
const detailValueStyle = { fontWeight: '700', color: '#1e293b' };

export default Expenses;

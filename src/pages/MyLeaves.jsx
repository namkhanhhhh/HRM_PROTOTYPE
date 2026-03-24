import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar, CheckCircle2, Clock, XCircle, Plus, Filter,
  FileText, MoreVertical, Eye, HeartPulse, FileWarning,
  ChevronDown, Send, User, MessageSquare, ArrowRight, History, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   ANIMATED SELECT — Giống MyAttendance
═══════════════════════════════════════════════════════════ */
function AnimatedSelect({ value, onChange, options, icon, label, bg = 'white', width = 180 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: width }}>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 12, border: '1.5px solid #eef2f6', background: bg, color: '#1e293b', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', justifyContent: 'space-between', transition: 'border-color 0.2s' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ color: '#3b82f6' }}>{icon}</span>}
          <span style={{ color: '#64748b', fontWeight: '400', marginRight: 2 }}>{label}:</span>
          <span>{selected.label}</span>
        </div>
        <ChevronDown size={14} style={{ color: '#94a3b8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #eef2f6', zIndex: 200, overflow: 'hidden', padding: 4 }}
          >
            {options.map(opt => (
              <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{ padding: '9px 12px', borderRadius: 8, fontSize: '0.875rem', color: value === opt.value ? '#3b82f6' : '#475569', background: value === opt.value ? '#eff6ff' : 'transparent', fontWeight: value === opt.value ? '600' : '400', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = 'transparent'; }}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════ MOCK DATA ═══════════════════════════ */
const LEAVE_BALANCES = [
  { id: 'annual',   label: 'Phép năm',               used: 2, total: 12,           icon: <Calendar size={20} color="#3b82f6" />, color: '#3b82f6', bg: '#eff6ff' },
  { id: 'sick',     label: 'Nghỉ ốm (BHXH)',          used: 1, total: 30,           icon: <HeartPulse size={20} color="#ef4444" />, color: '#ef4444', bg: '#fef2f2' },
  { id: 'unpaid',   label: 'Việc riêng (không lương)', used: 0, total: '∞',          icon: <FileWarning size={20} color="#f59e0b" />, color: '#f59e0b', bg: '#fffbeb' },
  { id: 'maternity',label: 'Thai sản',                used: 0, total: 'Chế độ BHXH',icon: <User size={20} color="#8b5cf6" />, color: '#8b5cf6', bg: '#f3e8ff' },
];

const INIT_LEAVES = [
  {
    id: 'LV-0125', type: 'Nghỉ ốm (BHXH)', durationStr: 'Nửa ngày / Vài giờ',
    session: '08:30 → 11:30', fromDate: '2026-03-25', dispFromDate: '25/03/2026',
    toDate: '2026-03-25', dispToDate: '25/03/2026',
    reason: 'Sốt nhẹ, đi khám bệnh viện', status: 'Chờ duyệt', createdAt: '23/03/2026 09:15',
    history: [
      { action: 'Tạo đơn', user: 'Nam Khánh', time: '23/03/2026 09:15', fromStatus: null, toStatus: 'Chờ duyệt', note: '' }
    ]
  },
  {
    id: 'LV-0110', type: 'Phép năm', durationStr: '1 ngày',
    session: 'Cả ngày', fromDate: '2026-03-15', dispFromDate: '15/03/2026',
    toDate: '2026-03-15', dispToDate: '15/03/2026',
    reason: 'Về quê có việc gia đình', status: 'Đã duyệt', createdAt: '10/03/2026 14:20',
    history: [
      { action: 'Tạo đơn', user: 'Nam Khánh', time: '10/03/2026 14:20', fromStatus: null, toStatus: 'Chờ duyệt', note: '' },
      { action: 'Phê duyệt', user: 'Trần Khang (Quản lý)', time: '10/03/2026 16:00', fromStatus: 'Chờ duyệt', toStatus: 'Chờ HR', note: 'Ok duyệt cho em nhé, ráng thu xếp công việc.' },
      { action: 'HR xác nhận', user: 'Lê Phương (HR)', time: '11/03/2026 09:00', fromStatus: 'Chờ HR', toStatus: 'Đã duyệt', note: 'Đã cập nhật công cho tháng 3.' }
    ]
  },
  {
    id: 'LV-0095', type: 'Phép năm', durationStr: 'Nhiều ngày',
    session: 'Cả ngày', fromDate: '2026-02-15', dispFromDate: '15/02/2026',
    toDate: '2026-02-16', dispToDate: '16/02/2026',
    reason: 'Đi du lịch cùng gia đình', status: 'Đã duyệt', createdAt: '01/02/2026 10:10',
    history: [
      { action: 'Tạo đơn', user: 'Nam Khánh', time: '01/02/2026 10:10', fromStatus: null, toStatus: 'Chờ duyệt', note: '' },
      { action: 'Tự động duyệt', user: 'Hệ thống', time: '02/02/2026 10:00', fromStatus: 'Chờ duyệt', toStatus: 'Đã duyệt', note: 'Đơn được duyệt tự động theo chính sách công ty.' }
    ]
  },
  {
    id: 'LV-0080', type: 'Việc riêng (không lương)', durationStr: '1 ngày',
    session: 'Cả ngày', fromDate: '2026-01-05', dispFromDate: '05/01/2026',
    toDate: '2026-01-05', dispToDate: '05/01/2026',
    reason: 'Xin nghỉ gấp chuyển trọ', status: 'Từ chối', createdAt: '04/01/2026 18:00',
    history: [
      { action: 'Tạo đơn', user: 'Nam Khánh', time: '04/01/2026 18:00', fromStatus: null, toStatus: 'Chờ duyệt', note: '' },
      { action: 'Từ chối', user: 'Trần Khang (Quản lý)', time: '04/01/2026 20:00', fromStatus: 'Chờ duyệt', toStatus: 'Từ chối', note: 'Dự án đang gấp, em có thể dời sang cuối tuần không?' }
    ]
  }
];

const STATUS_OPTS = [
  { value: 'All', label: 'Tất cả trạng thái' },
  { value: 'Chờ duyệt', label: 'Chờ duyệt' },
  { value: 'Đã duyệt', label: 'Đã duyệt' },
  { value: 'Từ chối', label: 'Từ chối' },
];

const DURATION_OPTS = [
  { value: '1 ngày', label: '1 ngày' },
  { value: 'Nhiều ngày', label: 'Nhiều ngày (> 1 ngày)' },
  { value: 'nua-ngay', label: 'Nửa ngày / Vài giờ' },
];

const LEAVE_TYPE_OPTS = [
  { value: 'Phép năm', label: 'Phép năm' },
  { value: 'Nghỉ ốm (BHXH)', label: 'Nghỉ ốm (hưởng BHXH)' },
  { value: 'Việc riêng (không lương)', label: 'Việc riêng (không lương)' },
  { value: 'Chế độ Thai sản', label: 'Chế độ Thai sản' },
];

/* ═══════════════════════════ HELPERS ═══════════════════════════ */
function getStatusCfg(status) {
  switch (status) {
    case 'Đã duyệt':   return { bg: '#ecfdf5', color: '#059669', dot: '#10b981', icon: <CheckCircle2 size={15}/> };
    case 'Chờ duyệt':  return { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b', icon: <Clock size={15}/> };
    case 'Chờ HR':      return { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6', icon: <Clock size={15}/> };
    case 'Từ chối':    return { bg: '#fef2f2', color: '#ef4444', dot: '#f87171', icon: <XCircle size={15}/> };
    default:            return { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8', icon: <FileText size={15}/> };
  }
}

function StatusPill({ status }) {
  const c = getStatusCfg(status);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: c.bg, color: c.color, padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />{status}
    </span>
  );
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
export default function MyLeaves() {
  const [leaves, setLeaves] = useState(INIT_LEAVES);
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate]     = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [leaveForm, setLeaveForm] = useState({
    type: 'Phép năm', durationType: '1 ngày',
    fromDate: '', toDate: '', fromTime: '08:30', toTime: '12:00', reason: ''
  });

  const totalLeaves    = leaves.length;
  const pendingCount   = leaves.filter(l => l.status === 'Chờ duyệt').length;
  const approvedCount  = leaves.filter(l => l.status === 'Đã duyệt').length;
  const rejectedCount  = leaves.filter(l => l.status === 'Từ chối').length;

  const filteredLeaves = useMemo(() => leaves.filter(l => {
    if (statusFilter !== 'All' && l.status !== statusFilter) return false;
    if (filterStartDate && l.fromDate < filterStartDate) return false;
    if (filterEndDate   && l.fromDate > filterEndDate)   return false;
    return true;
  }), [leaves, statusFilter, filterStartDate, filterEndDate]);

  const hasFilter = filterStartDate || filterEndDate || statusFilter !== 'All';

  const handleSubmit = e => {
    e.preventDefault();
    const fDate = leaveForm.fromDate || new Date().toISOString().split('T')[0];
    const tDate = leaveForm.durationType === 'Nhiều ngày' ? (leaveForm.toDate || fDate) : fDate;
    const fmt   = d => d.split('-').reverse().join('/');
    const session = leaveForm.durationType === 'nua-ngay'
      ? `${leaveForm.fromTime} → ${leaveForm.toTime}`
      : 'Cả ngày';

    setLeaves([{
      id: `LV-0${Math.floor(Math.random() * 900 + 100)}`,
      type: leaveForm.type, durationStr: DURATION_OPTS.find(o => o.value === leaveForm.durationType)?.label || leaveForm.durationType,
      session, fromDate: fDate, dispFromDate: fmt(fDate), toDate: tDate, dispToDate: fmt(tDate),
      reason: leaveForm.reason, status: 'Chờ duyệt', createdAt: 'Vừa xong',
      history: [{ action: 'Tạo đơn', user: 'Nam Khánh', time: 'Vừa xong', fromStatus: null, toStatus: 'Chờ duyệt', note: '' }]
    }, ...leaves]);
    setShowCreateModal(false);
    setLeaveForm({ type: 'Phép năm', durationType: '1 ngày', fromDate: '', toDate: '', fromTime: '08:30', toTime: '12:00', reason: '' });
  };

  // close dot-menu on outside click
  useEffect(() => {
    const h = () => setActiveMenuId(null);
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>Quản lý Đơn nghỉ phép</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>Theo dõi quỹ phép và lịch sử xin phép của bạn</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={btnPrimary}>
          <Plus size={18} /> Tạo đơn xin nghỉ
        </button>
      </div>

      {/* LEAVE BALANCE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {LEAVE_BALANCES.map(b => (
          <motion.div key={b.id} whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.07)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ background: 'white', padding: '16px 20px', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14, cursor: 'default' }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{b.icon}</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 3 }}>{b.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: b.color }}>{b.used}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/ {b.total}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MAIN CARD */}
      <div style={card}>
        {/* Card header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1e293b' }}>Lịch sử Đơn từ</h3>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
              Tổng: <strong style={{ color: '#3b82f6' }}>{totalLeaves}</strong>&ensp;
              Chờ: <strong style={{ color: '#f59e0b' }}>{pendingCount}</strong>&ensp;
              Duyệt: <strong style={{ color: '#10b981' }}>{approvedCount}</strong>&ensp;
              Từ chối: <strong style={{ color: '#ef4444' }}>{rejectedCount}</strong>
            </div>
          </div>
        </div>

        {/* FILTER BAR — Animated selects + date inputs */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '16px 20px', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '0.04em' }}><Filter size={13}/> TRẠNG THÁI</span>
            <AnimatedSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_OPTS}
              icon={<Filter size={16}/>}
              label="Lọc"
              bg="white"
              width={200}
            />
          </div>

          <div style={{ width: 1, height: 38, background: '#e2e8f0', alignSelf: 'flex-end', marginBottom: 2 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '0.04em' }}><Calendar size={13}/> KHOẢNG THỜI GIAN</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)}
                style={{ ...dateInput, background: filterStartDate ? '#eff6ff' : 'white', borderColor: filterStartDate ? '#93c5fd' : '#e2e8f0' }} />
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>→</span>
              <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)}
                style={{ ...dateInput, background: filterEndDate ? '#eff6ff' : 'white', borderColor: filterEndDate ? '#93c5fd' : '#e2e8f0' }} />
            </div>
          </div>

          <AnimatePresence>
            {hasFilter && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                onClick={() => { setFilterStartDate(''); setFilterEndDate(''); setStatusFilter('All'); }}
                style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
              >
                <X size={14} /> Bỏ lọc
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* TABLE */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['ID', 'Loại phép', 'Thời lượng', 'Ngày/giờ nghỉ', 'Trạng thái', ''].map((h, i) => (
                  <th key={i} style={{ padding: '13px 14px', color: '#64748b', fontWeight: '600', fontSize: '0.8rem', textAlign: 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredLeaves.map(l => (
                  <motion.tr key={l.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={td}><span style={{ color: '#3b82f6', fontWeight: '600', fontSize: '0.82rem' }}>{l.id}</span></td>
                    <td style={td}><span style={{ fontWeight: '500', color: '#1e293b' }}>{l.type}</span></td>
                    <td style={td}><span style={{ color: '#475569' }}>{l.durationStr}</span></td>
                    <td style={td}>
                      <div style={{ fontWeight: '500', color: '#1e293b', fontSize: '0.85rem' }}>{l.session}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 2 }}>
                        {l.dispFromDate}{l.dispFromDate !== l.dispToDate ? ` → ${l.dispToDate}` : ''}
                      </div>
                    </td>
                    <td style={td}><StatusPill status={l.status} /></td>
                    <td style={{ ...td, position: 'relative' }}>
                      <button onClick={e => { e.stopPropagation(); setActiveMenuId(activeMenuId === l.id ? null : l.id); }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px', borderRadius: 6, color: '#94a3b8' }}>
                        <MoreVertical size={18} />
                      </button>

                      <AnimatePresence>
                        {activeMenuId === l.id && (
                          <motion.div initial={{ opacity: 0, scale: 0.92, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.12 }}
                            onClick={e => e.stopPropagation()}
                            style={{ position: 'absolute', right: 36, top: 8, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 12px 24px rgba(0,0,0,0.1)', width: 170, overflow: 'hidden', zIndex: 50 }}>
                            <button onClick={() => { setShowDetailModal(l); setActiveMenuId(null); }} style={menuBtn}>
                              <Eye size={14} color="#3b82f6" /> Chi tiết thông tin
                            </button>
                            <div style={{ height: 1, background: '#f1f5f9' }} />
                            <button onClick={() => { setShowHistoryModal(l); setActiveMenuId(null); }} style={menuBtn}>
                              <History size={14} color="#6366f1" /> Lịch sử duyệt
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredLeaves.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Không có đơn nào phù hợp bộ lọc.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════ MODAL: CHI TIẾT THÔNG TIN ══════ */}
      <AnimatePresence>
        {showDetailModal && (
          <ModalOverlay onClose={() => setShowDetailModal(null)} title={`Chi tiết Đơn (${showDetailModal.id})`} maxWidth="480px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: getStatusCfg(showDetailModal.status).bg, borderRadius: 12 }}>
                <span style={{ color: getStatusCfg(showDetailModal.status).color }}>{getStatusCfg(showDetailModal.status).icon}</span>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Trạng thái hiện tại</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: getStatusCfg(showDetailModal.status).color }}>{showDetailModal.status}</div>
                </div>
              </div>

              <div style={{ borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {[
                  ['Mã đơn',      showDetailModal.id],
                  ['Loại phép',   showDetailModal.type],
                  ['Thời lượng',  showDetailModal.durationStr],
                  ['Khung giờ',   showDetailModal.session],
                  ['Từ ngày',     showDetailModal.dispFromDate],
                  ['Đến ngày',    showDetailModal.dispToDate],
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none', background: i % 2 ? '#fafafa' : 'white' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>{k}</span>
                    <span style={{ fontSize: '0.85rem', color: '#1e293b' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', padding: '13px 16px', background: 'white' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>Lý do</span>
                  <span style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.6 }}>{showDetailModal.reason}</span>
                </div>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ══════ MODAL: LỊCH SỬ DUYỆT ══════ */}
      <AnimatePresence>
        {showHistoryModal && (
          <ModalOverlay onClose={() => setShowHistoryModal(null)} title={`Lịch sử Đơn (${showHistoryModal.id})`} maxWidth="580px">
            <div style={{ paddingLeft: 4 }}>
              <div style={{ borderLeft: '2px solid #e2e8f0', marginLeft: 8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {showHistoryModal.history.map((h, i) => {
                  const toCfg   = getStatusCfg(h.toStatus);
                  const fromCfg = h.fromStatus ? getStatusCfg(h.fromStatus) : null;
                  return (
                    <div key={i} style={{ position: 'relative', paddingLeft: 24 }}>
                      {/* Timeline dot */}
                      <div style={{ position: 'absolute', left: -29, top: 2, width: 18, height: 18, borderRadius: '50%', background: toCfg.bg, border: `2.5px solid ${toCfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: toCfg.color, display: 'flex' }}>{toCfg.icon}</span>
                      </div>

                      {/* Action title + status flow */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{h.action}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 3 }}>
                            <strong style={{ color: '#334155' }}>{h.time}</strong> · Bởi: <strong style={{ color: '#334155' }}>{h.user}</strong>
                          </div>
                        </div>

                        {/* Status flow pill */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '4px 10px', borderRadius: 10, border: '1px solid #e2e8f0', flexShrink: 0 }}>
                          {fromCfg && <>
                            <span style={{ fontSize: '0.72rem', color: fromCfg.color, fontWeight: '600' }}>{h.fromStatus}</span>
                            <ArrowRight size={12} color="#94a3b8" />
                          </>}
                          <span style={{ fontSize: '0.72rem', color: toCfg.color, fontWeight: '700' }}>{h.toStatus}</span>
                        </div>
                      </div>

                      {/* Note block */}
                      {h.note && (
                        <div style={{ marginTop: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', gap: 10 }}>
                          <MessageSquare size={16} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                            <span style={{ fontWeight: '600', color: '#334155' }}>Ghi chú: </span>
                            <i>"{h.note}"</i>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ══════ MODAL: TẠO ĐƠN MỚI ══════ */}
      <AnimatePresence>
        {showCreateModal && (
          <ModalOverlay onClose={() => setShowCreateModal(false)} title="Tạo đơn xin nghỉ phép" maxWidth="560px">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              {/* Loại nghỉ phép */}
              <div>
                <label style={formLabel}>Loại nghỉ phép <span style={{ color: '#ef4444' }}>*</span></label>
                <AnimatedSelect
                  value={leaveForm.type}
                  onChange={v => setLeaveForm(f => ({ ...f, type: v }))}
                  options={LEAVE_TYPE_OPTS}
                  label="Chọn"
                  bg="#f8fafc"
                  width="100%"
                />
              </div>

              {/* Thời lượng */}
              <div>
                <label style={formLabel}>Thời lượng nghỉ <span style={{ color: '#ef4444' }}>*</span></label>
                <AnimatedSelect
                  value={leaveForm.durationType}
                  onChange={v => setLeaveForm(f => ({ ...f, durationType: v, fromDate: '', toDate: '' }))}
                  options={DURATION_OPTS}
                  label="Chọn"
                  bg="#f8fafc"
                  width="100%"
                />
              </div>

              {/* Dynamic date/time fields — animate swap */}
              <AnimatePresence mode="popLayout">
                {leaveForm.durationType === '1 ngày' && (
                  <motion.div key="one"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}>
                    <label style={formLabel}>Ngày nghỉ <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="date" style={inputStyle} required value={leaveForm.fromDate} onChange={e => setLeaveForm(f => ({ ...f, fromDate: e.target.value }))} />
                  </motion.div>
                )}

                {leaveForm.durationType === 'Nhiều ngày' && (
                  <motion.div key="many"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={formLabel}>Từ ngày <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="date" style={inputStyle} required value={leaveForm.fromDate} onChange={e => setLeaveForm(f => ({ ...f, fromDate: e.target.value }))} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={formLabel}>Đến ngày <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="date" style={inputStyle} required value={leaveForm.toDate} onChange={e => setLeaveForm(f => ({ ...f, toDate: e.target.value }))} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {leaveForm.durationType === 'nua-ngay' && (
                  <motion.div key="half"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={formLabel}>Ngày xin nghỉ <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="date" style={inputStyle} required value={leaveForm.fromDate} onChange={e => setLeaveForm(f => ({ ...f, fromDate: e.target.value }))} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={formLabel}>Từ giờ <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" style={inputStyle} required value={leaveForm.fromTime} onChange={e => setLeaveForm(f => ({ ...f, fromTime: e.target.value }))} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={formLabel}>Đến giờ <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" style={inputStyle} required value={leaveForm.toTime} onChange={e => setLeaveForm(f => ({ ...f, toTime: e.target.value }))} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lý do */}
              <div>
                <label style={formLabel}>Lý do xin nghỉ <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea rows={3} required placeholder="Mô tả rõ lý do để quản lý dễ xét duyệt..."
                  style={{ ...inputStyle, resize: 'none' }} value={leaveForm.reason}
                  onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))} />
              </div>

              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={btnCancel} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>Hủy bỏ</button>
                <button type="submit" style={btnSubmit} onMouseEnter={e => e.currentTarget.style.background = '#2563eb'} onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}>
                  <Send size={16} /> Gửi yêu cầu duyệt
                </button>
              </div>
            </form>
          </ModalOverlay>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ═══════════════════════════ SUB-COMPONENTS ═══════════════════════════ */

function ModalOverlay({ children, onClose, title, maxWidth = '540px' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900 }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.95 }} transition={{ duration: 0.22 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', padding: 28, borderRadius: 24, width: '92%', maxWidth, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1.12rem', fontWeight: '700', color: '#1e293b' }}>{title}</h3>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: '50%', color: '#64748b', cursor: 'pointer', display: 'flex', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
            <X size={18} />
          </button>
        </div>
        <div style={{ overflowY: 'auto' }}>{children}</div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════ STYLES ═══════════════════════════ */
const card       = { background: 'white', padding: '24px', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const btnPrimary = { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: 'none', background: '#3b82f6', color: 'white', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(59,130,246,0.25)', transition: 'background 0.2s' };
const btnCancel  = { flex: 1, padding: 12, borderRadius: 10, border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' };
const btnSubmit  = { flex: 2, padding: 12, borderRadius: 10, border: 'none', background: '#3b82f6', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, transition: 'background 0.2s', boxShadow: '0 2px 6px rgba(59,130,246,0.2)' };
const td         = { padding: '14px 14px', textAlign: 'center', verticalAlign: 'middle', color: '#334155' };
const menuBtn    = { width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#334155', transition: 'background 0.15s' };
const formLabel  = { display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: 8 };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#1e293b', background: '#f8fafc', transition: 'border-color 0.2s', boxSizing: 'border-box' };
const dateInput  = { padding: '8px 12px', borderRadius: 10, border: '1.5px solid', outline: 'none', fontSize: '0.85rem', color: '#1e293b', cursor: 'pointer', transition: 'all 0.2s' };

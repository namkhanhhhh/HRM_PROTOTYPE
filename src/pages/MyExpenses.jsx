import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Receipt, CheckCircle2, Clock, XCircle, Plus, Filter, Calendar,
  FileText, MoreVertical, Eye, History, ChevronDown, Send,
  MessageSquare, ArrowRight, X, Upload, Paperclip, DollarSign, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── AnimatedSelect ─── */
function AnimatedSelect({ value, onChange, options, icon, label, bg = 'white', width = 190 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const sel = options.find(o => o.value === value) || options[0];
  return (
    <div ref={ref} style={{ position: 'relative', minWidth: width }}>
      <button type="button" onClick={() => setOpen(p => !p)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 12, border: '1.5px solid #eef2f6', background: bg, color: '#1e293b', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', justifyContent: 'space-between', transition: 'border-color 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ color: '#3b82f6' }}>{icon}</span>}
          <span style={{ color: '#64748b', fontWeight: '400', marginRight: 2 }}>{label}:</span>
          <span>{sel.label}</span>
        </div>
        <ChevronDown size={14} style={{ color: '#94a3b8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.14 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #eef2f6', zIndex: 200, overflow: 'hidden', padding: 4 }}>
            {options.map(opt => (
              <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{ padding: '9px 12px', borderRadius: 8, fontSize: '0.875rem', color: value === opt.value ? '#3b82f6' : '#475569', background: value === opt.value ? '#eff6ff' : 'transparent', fontWeight: value === opt.value ? '600' : '400', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = 'transparent'; }}>
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MOCK DATA ─── */
const CATEGORY_OPTS = [
  { value: 'Đi lại / Xăng xe', label: 'Đi lại / Xăng xe' },
  { value: 'Ăn uống / Tiếp khách', label: 'Ăn uống / Tiếp khách' },
  { value: 'Văn phòng phẩm', label: 'Văn phòng phẩm' },
  { value: 'Đào tạo / Học phí', label: 'Đào tạo / Học phí' },
  { value: 'Công tác phí', label: 'Công tác phí' },
  { value: 'Khác', label: 'Khác' },
];

const STATUS_OPTS = [
  { value: 'All', label: 'Tất cả trạng thái' },
  { value: 'Chờ duyệt', label: 'Chờ duyệt' },
  { value: 'Đã duyệt', label: 'Đã duyệt' },
  { value: 'Từ chối', label: 'Từ chối' },
];

const INIT_EXPENSES = [
  {
    id: 'EX-0042', date: '2026-03-20', dispDate: '20/03/2026',
    amount: 350000, category: 'Đi lại / Xăng xe',
    desc: 'Xăng xe đi họp với đối tác tại Q1',
    status: 'Chờ duyệt', createdAt: '20/03/2026 18:30',
    invoices: [
      { name: 'hoadon_xang_20_03.jpg', size: '245 KB', type: 'image' },
    ],
    history: [
      { action: 'Tạo đơn', user: 'Nam Khánh', time: '20/03/2026 18:30', fromStatus: null, toStatus: 'Chờ duyệt', note: '' }
    ]
  },
  {
    id: 'EX-0038', date: '2026-03-10', dispDate: '10/03/2026',
    amount: 1_200_000, category: 'Ăn uống / Tiếp khách',
    desc: 'Chi phí ăn tối tiếp khách đối tác Hàn Quốc (4 người)',
    status: 'Đã duyệt', createdAt: '10/03/2026 21:15',
    invoices: [
      { name: 'invoice_dinner.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'receipt_qr.jpg', size: '180 KB', type: 'image' },
    ],
    history: [
      { action: 'Tạo đơn', user: 'Nam Khánh', time: '10/03/2026 21:15', fromStatus: null, toStatus: 'Chờ duyệt', note: '' },
      { action: 'Phê duyệt', user: 'Trần Khang (Quản lý)', time: '11/03/2026 09:00', fromStatus: 'Chờ duyệt', toStatus: 'Chờ Kế toán', note: 'Đã xác nhận buổi tiếp khách, duyệt toàn bộ.' },
      { action: 'Kế toán xác nhận', user: 'Nguyễn Thu (Kế toán)', time: '12/03/2026 14:00', fromStatus: 'Chờ Kế toán', toStatus: 'Đã duyệt', note: 'Đã ghi nhận phiếu chi 0038.' }
    ]
  },
  {
    id: 'EX-0031', date: '2026-02-22', dispDate: '22/02/2026',
    amount: 540_000, category: 'Văn phòng phẩm',
    desc: 'Mua giấy A4, bút và các vật dụng văn phòng',
    status: 'Đã duyệt', createdAt: '22/02/2026 10:00',
    invoices: [
      { name: 'van_phong_pham_feb.jpg', size: '310 KB', type: 'image' },
    ],
    history: [
      { action: 'Tạo đơn', user: 'Nam Khánh', time: '22/02/2026 10:00', fromStatus: null, toStatus: 'Chờ duyệt', note: '' },
      { action: 'Tự động duyệt', user: 'Hệ thống', time: '22/02/2026 12:00', fromStatus: 'Chờ duyệt', toStatus: 'Đã duyệt', note: 'Đơn dưới hạn mức tự duyệt 1.000.000đ.' }
    ]
  },
  {
    id: 'EX-0025', date: '2026-01-15', dispDate: '15/01/2026',
    amount: 5_800_000, category: 'Đào tạo / Học phí',
    desc: 'Khóa học React Advanced trên Udemy (khóa 6 tháng)',
    status: 'Từ chối', createdAt: '15/01/2026 09:30',
    invoices: [
      { name: 'udemy_invoice.pdf', size: '220 KB', type: 'pdf' },
    ],
    history: [
      { action: 'Tạo đơn', user: 'Nam Khánh', time: '15/01/2026 09:30', fromStatus: null, toStatus: 'Chờ duyệt', note: '' },
      { action: 'Từ chối', user: 'Trần Khang (Quản lý)', time: '15/01/2026 16:00', fromStatus: 'Chờ duyệt', toStatus: 'Từ chối', note: 'Năm nay ngân sách đào tạo đã cạn. Em đăng ký Q2 năm sau nhé.' }
    ]
  }
];

/* ─── HELPERS ─── */
function getStatusCfg(status) {
  switch (status) {
    case 'Đã duyệt':    return { bg: '#ecfdf5', color: '#059669', dot: '#10b981', icon: <CheckCircle2 size={14}/> };
    case 'Chờ duyệt':   return { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b', icon: <Clock size={14}/> };
    case 'Chờ Kế toán': return { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6', icon: <Clock size={14}/> };
    case 'Từ chối':     return { bg: '#fef2f2', color: '#ef4444', dot: '#f87171', icon: <XCircle size={14}/> };
    default:             return { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8', icon: <FileText size={14}/> };
  }
}

const fmtVND = n => n.toLocaleString('vi-VN') + ' đ';

function StatusPill({ status }) {
  const c = getStatusCfg(status);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: c.bg, color: c.color, padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />{status}
    </span>
  );
}

/* ─── MAIN ─── */
export default function MyExpenses() {
  const [expenses, setExpenses] = useState(INIT_EXPENSES);
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate,   setFilterEndDate]   = useState('');
  const [showCreateModal,  setShowCreateModal]  = useState(false);
  const [showDetailModal,  setShowDetailModal]  = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [activeMenuId,     setActiveMenuId]     = useState(null);

  // form
  const [form, setForm] = useState({
    date: '', amount: '', category: 'Đi lại / Xăng xe', desc: '', files: []
  });

  const totalCount    = expenses.length;
  const pendingCount  = expenses.filter(e => e.status === 'Chờ duyệt').length;
  const approvedCount = expenses.filter(e => e.status === 'Đã duyệt').length;
  const rejectedCount = expenses.filter(e => e.status === 'Từ chối').length;
  const totalAmount   = expenses.filter(e => e.status === 'Đã duyệt').reduce((s, e) => s + e.amount, 0);

  const filtered = useMemo(() => expenses.filter(e => {
    if (statusFilter !== 'All' && e.status !== statusFilter) return false;
    if (filterStartDate && e.date < filterStartDate) return false;
    if (filterEndDate   && e.date > filterEndDate)   return false;
    return true;
  }), [expenses, statusFilter, filterStartDate, filterEndDate]);

  const hasFilter = filterStartDate || filterEndDate || statusFilter !== 'All';

  const handleSubmit = ev => {
    ev.preventDefault();
    const fmt = d => d.split('-').reverse().join('/');
    setExpenses([{
      id: `EX-0${Math.floor(Math.random() * 900 + 50)}`,
      date: form.date, dispDate: fmt(form.date),
      amount: Number(form.amount), category: form.category,
      desc: form.desc, status: 'Chờ duyệt', createdAt: 'Vừa xong',
      invoices: form.files.map(f => ({ name: f.name, size: '—', type: f.name.endsWith('.pdf') ? 'pdf' : 'image' })),
      history: [{ action: 'Tạo đơn', user: 'Nam Khánh', time: 'Vừa xong', fromStatus: null, toStatus: 'Chờ duyệt', note: '' }]
    }, ...expenses]);
    setShowCreateModal(false);
    setForm({ date: '', amount: '', category: 'Đi lại / Xăng xe', desc: '', files: [] });
  };

  useEffect(() => {
    const h = () => setActiveMenuId(null);
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  /* ─── RENDER ─── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>Quản lý Đơn cấp Chi phí</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>Theo dõi các khoản chi phí cần phê duyệt và hoàn ứng</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={btnPrimary}>
          <Plus size={18} /> Tạo đơn xin chi phí
        </button>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {[
          { label: 'Tổng đơn yêu cầu',  value: totalCount,              color: '#3b82f6', icon: <FileText size={20}/> },
          { label: 'Chờ phê duyệt',      value: `${pendingCount} đơn`,  color: '#f59e0b', icon: <Clock size={20}/> },
          { label: 'Đã được duyệt',      value: `${approvedCount} đơn`, color: '#10b981', icon: <CheckCircle2 size={20}/> },
          { label: 'Đã chi (được duyệt)',value: fmtVND(totalAmount),    color: '#6366f1', icon: <DollarSign size={20}/> },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.07)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ background: 'white', padding: '18px 20px', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: i === 3 ? '1.05rem' : '1.4rem', fontWeight: '700', color: s.color }}>{s.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MAIN TABLE CARD */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1e293b' }}>Danh sách Đơn chi phí</h3>
        </div>

        {/* FILTER BAR */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '16px 20px', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}><Filter size={13}/> TRẠNG THÁI</span>
            <AnimatedSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTS} icon={<Filter size={16}/>} label="Lọc" bg="white" width={210} />
          </div>

          <div style={{ width: 1, height: 38, background: '#e2e8f0', alignSelf: 'flex-end', marginBottom: 2 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={13}/> KHOẢNG THỜI GIAN</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)}
                style={{ ...dateInput, background: filterStartDate ? '#eff6ff' : 'white', borderColor: filterStartDate ? '#93c5fd' : '#e2e8f0' }} />
              <span style={{ color: '#94a3b8' }}>→</span>
              <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)}
                style={{ ...dateInput, background: filterEndDate ? '#eff6ff' : 'white', borderColor: filterEndDate ? '#93c5fd' : '#e2e8f0' }} />
            </div>
          </div>

          <AnimatePresence>
            {hasFilter && (
              <motion.button initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                onClick={() => { setFilterStartDate(''); setFilterEndDate(''); setStatusFilter('All'); }}
                style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
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
                {['Mã đơn', 'Ngày phát sinh', 'Danh mục', 'Số tiền', 'Mô tả', 'Trạng thái', ''].map((h, i) => (
                  <th key={i} style={{ padding: '13px 14px', color: '#64748b', fontWeight: '600', fontSize: '0.8rem', textAlign: 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(ex => (
                  <motion.tr key={ex.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                    style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={td}><span style={{ color: '#6366f1', fontWeight: '600', fontSize: '0.82rem' }}>{ex.id}</span></td>
                    <td style={td}><span style={{ color: '#334155' }}>{ex.dispDate}</span></td>
                    <td style={td}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: '500' }}>
                        {ex.category}
                      </span>
                    </td>
                    <td style={td}><span style={{ fontWeight: '700', color: '#1e293b' }}>{fmtVND(ex.amount)}</span></td>
                    <td style={{ ...td, maxWidth: 220, textAlign: 'left' }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#475569', fontSize: '0.85rem' }}>{ex.desc}</span>
                    </td>
                    <td style={td}><StatusPill status={ex.status} /></td>
                    <td style={{ ...td, position: 'relative' }}>
                      <button onClick={e => { e.stopPropagation(); setActiveMenuId(activeMenuId === ex.id ? null : ex.id); }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px', borderRadius: 6, color: '#94a3b8' }}>
                        <MoreVertical size={18} />
                      </button>
                      <AnimatePresence>
                        {activeMenuId === ex.id && (
                          <motion.div initial={{ opacity: 0, scale: 0.92, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.12 }}
                            onClick={e => e.stopPropagation()}
                            style={{ position: 'absolute', right: 36, top: 8, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 12px 24px rgba(0,0,0,0.1)', width: 170, overflow: 'hidden', zIndex: 50 }}>
                            <button onClick={() => { setShowDetailModal(ex); setActiveMenuId(null); }} style={menuBtn}>
                              <Eye size={14} color="#3b82f6" /> Chi tiết đơn
                            </button>
                            <div style={{ height: 1, background: '#f1f5f9' }} />
                            <button onClick={() => { setShowHistoryModal(ex); setActiveMenuId(null); }} style={menuBtn}>
                              <History size={14} color="#6366f1" /> Lịch sử duyệt
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Không có đơn nào phù hợp bộ lọc.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ MODAL: CHI TIẾT ══ */}
      <AnimatePresence>
        {showDetailModal && (
          <ModalOverlay onClose={() => setShowDetailModal(null)} title={`Chi tiết Đơn chi phí (${showDetailModal.id})`} maxWidth="520px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: getStatusCfg(showDetailModal.status).bg, borderRadius: 12 }}>
                <span style={{ color: getStatusCfg(showDetailModal.status).color }}>{getStatusCfg(showDetailModal.status).icon}</span>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Trạng thái hiện tại</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: getStatusCfg(showDetailModal.status).color }}>{showDetailModal.status}</div>
                </div>
              </div>

              <div style={{ borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {[
                  ['Mã đơn', showDetailModal.id],
                  ['Ngày phát sinh', showDetailModal.dispDate],
                  ['Danh mục', showDetailModal.category],
                  ['Số tiền yêu cầu', <span style={{ fontWeight: '700', color: '#6366f1' }}>{fmtVND(showDetailModal.amount)}</span>],
                  ['Mô tả', showDetailModal.desc],
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none', background: i % 2 ? '#fafafa' : 'white' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>{k}</span>
                    <span style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.5 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Invoices */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Paperclip size={15} color="#6366f1" /> Hoá đơn đính kèm ({showDetailModal.invoices.length} file)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {showDetailModal.invoices.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <Receipt size={18} color={f.type === 'pdf' ? '#ef4444' : '#3b82f6'} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#1e293b' }}>{f.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{f.size}</div>
                      </div>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 6, background: f.type === 'pdf' ? '#fef2f2' : '#eff6ff', color: f.type === 'pdf' ? '#ef4444' : '#3b82f6', fontWeight: '600' }}>
                        {f.type.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ══ MODAL: LỊCH SỬ ══ */}
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
                      <div style={{ position: 'absolute', left: -29, top: 2, width: 18, height: 18, borderRadius: '50%', background: toCfg.bg, border: `2.5px solid ${toCfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: toCfg.color }}>
                        {toCfg.icon}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{h.action}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 3 }}>
                            <strong style={{ color: '#334155' }}>{h.time}</strong> · Bởi: <strong style={{ color: '#334155' }}>{h.user}</strong>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '4px 10px', borderRadius: 10, border: '1px solid #e2e8f0', flexShrink: 0 }}>
                          {fromCfg && <><span style={{ fontSize: '0.72rem', color: fromCfg.color, fontWeight: '600' }}>{h.fromStatus}</span><ArrowRight size={12} color="#94a3b8" /></>}
                          <span style={{ fontSize: '0.72rem', color: toCfg.color, fontWeight: '700' }}>{h.toStatus}</span>
                        </div>
                      </div>
                      {h.note && (
                        <div style={{ marginTop: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', gap: 10 }}>
                          <MessageSquare size={16} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                            <span style={{ fontWeight: '600', color: '#334155' }}>Ghi chú: </span><i>"{h.note}"</i>
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

      {/* ══ MODAL: TẠO ĐƠN ══ */}
      <AnimatePresence>
        {showCreateModal && (
          <ModalOverlay onClose={() => setShowCreateModal(false)} title="Tạo đơn xin cấp chi phí" maxWidth="560px">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

              {/* Danh mục */}
              <div>
                <label style={formLabel}>Danh mục chi phí <span style={{ color: '#ef4444' }}>*</span></label>
                <AnimatedSelect value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={CATEGORY_OPTS} label="Chọn" bg="#f8fafc" width="100%" />
              </div>

              {/* Ngày & Số tiền */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={formLabel}>Ngày phát sinh <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="date" required style={inputS} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={formLabel}>Số tiền (VNĐ) <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" required min={1000} placeholder="350000" style={{ ...inputS, paddingLeft: '38px' }} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#64748b' }}>₫</span>
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label style={formLabel}>Mô tả chi phí <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea rows={3} required placeholder="Mô tả chi tiết mục đích chi tiêu..." style={{ ...inputS, resize: 'none' }} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
              </div>

              {/* Upload hoá đơn */}
              <div>
                <label style={formLabel}>Hoá đơn / Chứng từ đính kèm</label>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px', borderRadius: 12, border: '2px dashed #c7d2fe', background: '#f5f3ff', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f5f3ff'}>
                  <input type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }}
                    onChange={e => setForm(f => ({ ...f, files: [...f.files, ...Array.from(e.target.files)] }))} />
                  <Upload size={24} color="#6366f1" />
                  <span style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '600' }}>Click để tải file lên</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hỗ trợ JPG, PNG, PDF — tối đa 10MB/file</span>
                </label>

                <AnimatePresence>
                  {form.files.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {form.files.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                          <Paperclip size={15} color="#6366f1" />
                          <span style={{ flex: 1, fontSize: '0.82rem', color: '#334155' }}>{f.name}</span>
                          <button type="button" onClick={() => setForm(prev => ({ ...prev, files: prev.files.filter((_, j) => j !== i) }))}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', padding: 2 }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={btnCancel}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>Hủy bỏ</button>
                <button type="submit" style={btnSubmit}
                  onMouseEnter={e => e.currentTarget.style.background = '#2563eb'} onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}>
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

/* ── Modal Wrapper ── */
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

/* ── STYLES ── */
const card      = { background: 'white', padding: '24px', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const btnPrimary= { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: 'none', background: '#6366f1', color: 'white', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.25)', transition: 'background 0.2s' };
const btnCancel = { flex: 1, padding: 12, borderRadius: 10, border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' };
const btnSubmit = { flex: 2, padding: 12, borderRadius: 10, border: 'none', background: '#3b82f6', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, transition: 'background 0.2s', boxShadow: '0 2px 6px rgba(59,130,246,0.2)' };
const td        = { padding: '14px', textAlign: 'center', verticalAlign: 'middle', color: '#334155' };
const menuBtn   = { width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#334155', transition: 'background 0.15s' };
const formLabel = { display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: 8 };
const inputS    = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#1e293b', background: '#f8fafc', transition: 'border-color 0.2s', boxSizing: 'border-box' };
const dateInput = { padding: '8px 12px', borderRadius: 10, border: '1.5px solid', outline: 'none', fontSize: '0.85rem', color: '#1e293b', cursor: 'pointer', transition: 'all 0.2s' };

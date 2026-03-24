import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle, CheckCircle2, Clock, XCircle, Receipt, Fingerprint,
  ChevronDown, Filter, Eye, MessageSquare, Pencil, X, ArrowRight, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';

/* ─── AnimatedSelect ─── */
function AnimatedSelect({ value, onChange, options, label, width = 200 }) {
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
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '9px 14px', borderRadius: 12, border: '1.5px solid #eef2f6', background: 'white', color: '#1e293b', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', transition: 'border-color 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#64748b', fontWeight: '400' }}>{label}:</span>
          <span>{sel.label}</span>
        </div>
        <ChevronDown size={14} style={{ color: '#94a3b8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.13 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #eef2f6', zIndex: 200, overflow: 'hidden', padding: 4 }}>
            {options.map(opt => (
              <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{ padding: '9px 12px', borderRadius: 8, fontSize: '0.875rem', color: value === opt.value ? '#3b82f6' : '#475569', background: value === opt.value ? '#eff6ff' : 'transparent', fontWeight: value === opt.value ? '600' : '400', cursor: 'pointer', transition: 'background 0.1s', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = 'transparent'; }}>
                {opt.icon && opt.icon} {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── helpers ─── */
const STATUS_OPTS = [
  { value: 'All', label: 'Tất cả trạng thái' },
  { value: 'Chờ xử lý', label: 'Chờ xử lý' },
  { value: 'Đang xử lý', label: 'Đang xử lý' },
  { value: 'Đã sửa', label: 'Đã sửa' },
  { value: 'Từ chối', label: 'Từ chối' },
];

const TYPE_OPTS = [
  { value: 'All', label: 'Tất cả loại' },
  { value: 'salary', label: 'Sai sót bảng lương', icon: <Receipt size={14}/> },
  { value: 'attendance', label: 'Sai sót chấm công', icon: <Fingerprint size={14}/> },
];

const STATUS_CHANGE_OPTS = [
  { value: 'Chờ xử lý',  label: 'Chờ xử lý' },
  { value: 'Đang xử lý', label: 'Đang xử lý' },
  { value: 'Đã sửa',     label: 'Đã sửa' },
  { value: 'Từ chối',    label: 'Từ chối' },
];

function getStatusCfg(s) {
  switch (s) {
    case 'Đã sửa':     return { bg: '#ecfdf5', color: '#059669', dot: '#10b981', icon: <CheckCircle2 size={14}/> };
    case 'Đang xử lý': return { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6', icon: <Clock size={14}/> };
    case 'Từ chối':    return { bg: '#fef2f2', color: '#ef4444', dot: '#f87171', icon: <XCircle size={14}/> };
    default:            return { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b', icon: <AlertCircle size={14}/> };
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

/* ─── MAIN ─── */
export default function ReportManagement() {
  const { reports, updateReport, markRead } = useNotifications();
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter,   setTypeFilter]   = useState('All');
  const [detailModal,  setDetailModal]  = useState(null);
  const [editModal,    setEditModal]    = useState(null);
  const [editForm,     setEditForm]     = useState({ status: '', adminNote: '', correction: '' });

  const filtered = reports.filter(r => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (typeFilter   !== 'All' && r.type   !== typeFilter)   return false;
    return true;
  });

  const counts = {
    total:     reports.length,
    pending:   reports.filter(r => r.status === 'Chờ xử lý').length,
    inprog:    reports.filter(r => r.status === 'Đang xử lý').length,
    done:      reports.filter(r => r.status === 'Đã sửa').length,
    rejected:  reports.filter(r => r.status === 'Từ chối').length,
  };

  const openEdit = (r) => {
    markRead(r.id);
    setEditForm({ status: r.status, adminNote: r.adminNote || '', correction: r.correction || '' });
    setEditModal(r);
  };

  const openDetail = (r) => {
    markRead(r.id);
    setDetailModal(r);
  };

  const saveEdit = () => {
    updateReport(editModal.id, {
      status: editForm.status,
      adminNote: editForm.adminNote,
      correction: editForm.correction,
      lastUpdated: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
    });
    setEditModal(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Tổng báo cáo',    value: counts.total,    color: '#6366f1' },
          { label: 'Chờ xử lý',       value: counts.pending,  color: '#f59e0b' },
          { label: 'Đang xử lý',      value: counts.inprog,   color: '#3b82f6' },
          { label: 'Đã sửa xong',     value: counts.done,     color: '#10b981' },
          { label: 'Từ chối',          value: counts.rejected, color: '#ef4444' },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(0,0,0,0.07)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ background: 'white', padding: '16px 20px', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: '1.1rem', fontWeight: '700' }}>{s.value}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500', lineHeight: 1.4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* TABLE CARD */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', padding: 24 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.25rem' }}>Danh sách Báo cáo Sai sót</h3>

        {/* FILTER BAR */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '16px 20px', background: 'linear-gradient(135deg, #f8fafc 0%, #f3e8ff 100%)', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}><Filter size={13}/> TRẠNG THÁI</span>
            <AnimatedSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTS} label="Lọc" width={200} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b' }}>LOẠI BÁO CÁO</span>
            <AnimatedSelect value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTS} label="Loại" width={210} />
          </div>
          <AnimatePresence>
            {(statusFilter !== 'All' || typeFilter !== 'All') && (
              <motion.button initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                onClick={() => { setStatusFilter('All'); setTypeFilter('All'); }}
                style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
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
                {['Mã', 'Loại', 'Nhân viên', 'Liên quan đến', 'Mô tả', 'Gửi lúc', 'Trạng thái', 'Hành động'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 14px', color: '#64748b', fontWeight: '600', fontSize: '0.8rem', textAlign: 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(r => (
                  <motion.tr key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                    style={{ borderBottom: '1px solid #f1f5f9', background: r.read ? 'white' : '#fafeff' }}>
                    <td style={td}><span style={{ color: '#6366f1', fontWeight: '700', fontSize: '0.8rem' }}>{r.id}</span></td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: r.type === 'salary' ? '#eff6ff' : '#fef3c7', color: r.type === 'salary' ? '#2563eb' : '#d97706', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
                        {r.type === 'salary' ? <Receipt size={12}/> : <Fingerprint size={12}/> }
                        {r.type === 'salary' ? 'Bảng lương' : 'Chấm công'}
                      </div>
                    </td>
                    <td style={td}>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.85rem' }}>{r.reporter}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{r.dept}</div>
                    </td>
                    <td style={td}><span style={{ color: '#475569', fontSize: '0.82rem' }}>{r.refLabel}</span></td>
                    <td style={{ ...td, maxWidth: 220, textAlign: 'left' }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#475569', fontSize: '0.82rem' }}>{r.desc}</span>
                    </td>
                    <td style={td}><span style={{ color: '#64748b', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{r.createdAt}</span></td>
                    <td style={td}><StatusPill status={r.status} /></td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button onClick={() => openDetail(r)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, border: '1px solid #e0e7ff', background: '#f5f3ff', color: '#6366f1', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <Eye size={13} /> Xem
                        </button>
                        <button onClick={() => openEdit(r)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <Pencil size={13} /> Xử lý
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Không có báo cáo nào phù hợp bộ lọc.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ MODAL: CHI TIẾT ══ */}
      <AnimatePresence>
        {detailModal && (
          <Overlay onClose={() => setDetailModal(null)} title={`Chi tiết Báo cáo (${detailModal.id})`} maxWidth="500px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: getStatusCfg(detailModal.status).bg, borderRadius: 12 }}>
                {getStatusCfg(detailModal.status).icon}
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Trạng thái</div>
                  <div style={{ fontWeight: '700', color: getStatusCfg(detailModal.status).color }}>{detailModal.status}</div>
                </div>
              </div>

              <div style={{ borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {[
                  ['Mã báo cáo', detailModal.id],
                  ['Loại', detailModal.type === 'salary' ? '🧾 Sai sót bảng lương' : '👆 Sai sót chấm công'],
                  ['Liên quan đến', detailModal.refLabel],
                  ['Nhân viên', `${detailModal.reporter} (${detailModal.reporterId})`],
                  ['Phòng ban', detailModal.dept],
                  ['Gửi lúc', detailModal.createdAt],
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', padding: '11px 16px', borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none', background: i % 2 ? '#fafafa' : 'white' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>{k}</span>
                    <span style={{ fontSize: '0.85rem', color: '#1e293b' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: 6 }}>Nội dung báo cáo:</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>{detailModal.desc}</div>
              </div>

              {detailModal.adminNote && (
                <div style={{ padding: '14px 16px', background: '#eff6ff', borderRadius: 12, border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#2563eb', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><MessageSquare size={14}/> Ghi chú Admin:</div>
                  <div style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.6 }}>{detailModal.adminNote}</div>
                </div>
              )}

              {detailModal.correction && (
                <div style={{ padding: '14px 16px', background: '#ecfdf5', borderRadius: 12, border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#059669', marginBottom: 6 }}>✅ Nội dung đã sửa:</div>
                  <div style={{ fontSize: '0.85rem', color: '#065f46', lineHeight: 1.6 }}>{detailModal.correction}</div>
                </div>
              )}
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      {/* ══ MODAL: XỬ LÝ / CHỈNH SỬA ══ */}
      <AnimatePresence>
        {editModal && (
          <Overlay onClose={() => setEditModal(null)} title={`Xử lý Báo cáo (${editModal.id})`} maxWidth="540px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

              {/* Info summary */}
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: 4 }}>{editModal.refLabel}</div>
                <div style={{ color: '#64748b' }}>{editModal.reporter} · {editModal.dept} · {editModal.createdAt}</div>
                <div style={{ marginTop: 8, color: '#475569', lineHeight: 1.5, borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>{editModal.desc}</div>
              </div>

              {/* Status change */}
              <div>
                <label style={formLabel}>Thay đổi trạng thái</label>
                <AnimatedSelect
                  value={editForm.status}
                  onChange={v => setEditForm(f => ({ ...f, status: v }))}
                  options={STATUS_CHANGE_OPTS}
                  label="Chọn"
                  width="100%"
                />
              </div>

              {/* Admin note */}
              <div>
                <label style={formLabel}>Ghi chú / Phản hồi cho nhân viên <span style={{ color: '#64748b', fontWeight: '400' }}>(tuỳ chọn)</span></label>
                <textarea rows={3} placeholder="Nhập ghi chú, lý do từ chối, hoặc hướng dẫn xử lý..."
                  style={textareaS} value={editForm.adminNote}
                  onChange={e => setEditForm(f => ({ ...f, adminNote: e.target.value }))} />
              </div>

              {/* Correction detail */}
              <div>
                <label style={formLabel}>Nội dung đã sửa thủ công <span style={{ color: '#64748b', fontWeight: '400' }}>(nếu có)</span></label>
                <textarea rows={3} placeholder="Mô tả cụ thể đã sửa gì: Đã điều chỉnh OT từ 12h → 18h trong bảng lương tháng 3..."
                  style={textareaS} value={editForm.correction}
                  onChange={e => setEditForm(f => ({ ...f, correction: e.target.value }))} />
              </div>

              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button onClick={() => setEditModal(null)} style={btnCancel}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>Hủy</button>
                <button onClick={saveEdit} style={btnSave}
                  onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                  onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}>
                  <Save size={15} /> Lưu cập nhật
                </button>
              </div>
            </div>
          </Overlay>
        )}
      </AnimatePresence>
    </div>
  );
}

function Overlay({ children, onClose, title, maxWidth = '540px' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900 }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.95 }} transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', padding: 28, borderRadius: 24, width: '92%', maxWidth, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{title}</h3>
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

const td        = { padding: '13px 14px', textAlign: 'center', verticalAlign: 'middle' };
const formLabel = { display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: 8 };
const textareaS = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#1e293b', background: '#f8fafc', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6, transition: 'border-color 0.2s' };
const btnCancel = { flex: 1, padding: 12, borderRadius: 10, border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' };
const btnSave   = { flex: 2, padding: 12, borderRadius: 10, border: 'none', background: '#6366f1', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, transition: 'background 0.2s', boxShadow: '0 2px 6px rgba(99,102,241,0.25)' };

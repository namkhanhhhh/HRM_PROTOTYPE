import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  History, Search, Plus, Eye, Edit2, Trash2, Filter, 
  Calendar, User, Building2, Briefcase, DollarSign,
  ChevronDown, X, Save, AlertCircle, CheckCircle2,
  ArrowRight, MoreVertical, FileText, SearchCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── MOCK DATA ── */
const initEmployees = [
  { id: 'NV001', name: 'Nguyễn Nam Khánh', dept: 'Kỹ thuật', pos: 'Senior Fullstack Dev', salary: 25000000 },
  { id: 'NV002', name: 'Trần Thị Mai', dept: 'Nhân sự', pos: 'HR Manager', salary: 18000000 },
  { id: 'NV003', name: 'Lê Hoàng Tuấn', dept: 'Kinh doanh', pos: 'Business Development', salary: 10000000 },
];

const initDeptHistory = [
  { id: 'DH001', empId: 'NV001', empName: 'Nguyễn Nam Khánh', type: 'Phòng ban', time: '2024-03-15 09:30', executor: 'Trần Thị Mai', reason: 'Luân chuyển nhân sự định kỳ', supervisor: 'Lê Hoàng Tuấn', status: 'Đang làm', effectiveDate: '2024-04-01', from: 'Kỹ thuật', to: 'R&D', editNote: '' },
  { id: 'DH002', empId: 'NV003', empName: 'Lê Hoàng Tuấn', type: 'Phòng ban', time: '2024-02-10 14:20', executor: 'Admin', reason: 'Tái cấu trúc bộ máy', supervisor: 'Nguyễn Nam Khánh', status: 'Đang làm', effectiveDate: '2024-03-01', from: 'Kinh doanh', to: 'Marketing', editNote: '' },
];

const initPosHistory = [
  { id: 'PH001', empId: 'NV001', empName: 'Nguyễn Nam Khánh', type: 'Chức vụ', time: '2024-01-05 10:00', executor: 'Admin', reason: 'Thăng chức sau kỳ review', supervisor: 'Giám đốc', fromPos: 'Senior Fullstack Dev', toPos: 'Technical Lead', effectiveDate: '2024-02-01', editNote: '' },
  { id: 'PH002', empId: 'NV002', empName: 'Trần Thị Mai', type: 'Chức vụ', time: '2023-12-20 16:45', executor: 'Admin', reason: 'Bổ nhiệm mới', supervisor: 'Giám đốc', fromPos: 'HR Specialist', toPos: 'HR Manager', effectiveDate: '2024-01-01', editNote: '' },
];

const initSalaryHistory = [
  { id: 'SH001', empId: 'NV001', empName: 'Nguyễn Nam Khánh', type: 'Lương', time: '2024-03-01 08:00', executor: 'Trần Thị Mai', target: 'Nguyễn Nam Khánh', decisionMaker: 'Giám đốc', amount: 5000000, currentSalary: 25000000, newSalary: 30000000, effectiveDate: '2024-04-01', reason: 'Review lương năm 2024', editNote: '' },
  { id: 'SH002', empId: 'NV003', empName: 'Lê Hoàng Tuấn', type: 'Lương', time: '2024-01-15 11:30', executor: 'Admin', target: 'Lê Hoàng Tuấn', decisionMaker: 'HR Manager', amount: 2000000, currentSalary: 10000000, newSalary: 12000000, effectiveDate: '2024-02-01', reason: 'Hết hạn thử việc', editNote: '' },
];

/* ── HELPERS ── */
const calculateNet = (gross) => {
  if (!gross || gross <= 0) return { gross: 0, insurance: 0, pit: 0, net: 0 };
  const insurance = gross * 0.105; 
  const deduction = 11000000;
  let taxable = gross - insurance - deduction;
  if(taxable < 0) taxable = 0;
  
  let pit = 0;
  if (taxable <= 5000000) pit = taxable * 0.05;
  else if (taxable <= 10000000) pit = 250000 + (taxable - 5000000) * 0.1;
  else if (taxable <= 18000000) pit = 750000 + (taxable - 10000000) * 0.15;
  else if (taxable <= 32000000) pit = 1950000 + (taxable - 18000000) * 0.2;
  else pit = 4750000 + (taxable - 32000000) * 0.25; 

  const net = gross - insurance - pit;
  return { gross, insurance, pit, net };
};

/* ── COMPONENTS ── */

const StatusBadge = ({ status }) => {
  const cfg = {
    'Đang làm': { bg: '#ecfdf5', color: '#059669', dot: '#10b981' },
    'Nghỉ việc': { bg: '#fef2f2', color: '#ef4444', dot: '#f87171' },
    'Thử việc': { bg: '#eff6ff', color: '#3b82f6', dot: '#60a5fa' },
  }[status] || { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: '400', background: cfg.bg, color: cfg.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
      {status}
    </span>
  );
};

/* ── DATE RANGE PICKER (Ported & Refined) ── */
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

  const isActive = startDate || endDate;
  const displayText = startDate && endDate ? `${startDate} → ${endDate}` : startDate ? `Từ ${startDate}` : endDate ? `Đến ${endDate}` : 'Thời gian hiệu lực';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 10, border: isActive ? '1.5px solid #6366f1' : '1.5px solid #e8edf4', background: isActive ? '#eef2ff' : 'white', color: isActive ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: '400', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
        <Calendar size={15} style={{ flexShrink: 0 }} />
        <span style={{ minWidth: 150, textAlign: 'left' }}>{displayText}</span>
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
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 320, background: 'white', borderRadius: 16,
              boxShadow: '0 16px 40px rgba(0,0,0,0.14)', border: '1px solid #eef2f6',
              zIndex: 100, padding: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: '500', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} color="#6366f1" /> Lọc theo ngày hiệu lực
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6, fontWeight: '400' }}>Từ ngày</div>
                <input type="date" value={localStart} onChange={e => setLocalStart(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', background: '#f8fafc' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6, fontWeight: '400' }}>Đến ngày</div>
                <input type="date" value={localEnd} onChange={e => setLocalEnd(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e8edf4', fontSize: '0.875rem', outline: 'none', background: '#f8fafc' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => { setLocalStart(''); setLocalEnd(''); onApply('', ''); setOpen(false); }}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '400', fontSize: '0.85rem', cursor: 'pointer' }}>Xóa</button>
              <button onClick={() => { onApply(localStart, localEnd); setOpen(false); }}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '400', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>Áp dụng</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── SEARCHABLE EMPLOYEE SELECT ── */
const SearchableEmployeeSelect = ({ value, onChange, placeholder = "Tìm kiếm nhân viên..." }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedItem = initEmployees.find(e => e.id === value);
  const filtered = initEmployees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(!open)} 
        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', cursor: 'pointer', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: value ? '#1e293b' : '#94a3b8' }}>{selectedItem ? `${selectedItem.name} (${selectedItem.id})` : placeholder}</span>
        <ChevronDown size={16} color="#64748b" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', zIndex: 1200, marginTop: 6, overflow: 'hidden' }}
          >
            <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9' }}>
               <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input autoFocus placeholder="Gõ tên hoặc mã..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 8px 8px 32px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }} />
               </div>
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
               {filtered.map(emp => (
                 <div key={emp.id} onClick={() => { onChange(emp); setOpen(false); setSearch(''); }}
                    style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2, background: value === emp.id ? '#f5f3ff' : 'transparent', transition: 'background 0.1s' }}
                    onMouseEnter={e => { if(value !== emp.id) e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={e => { if(value !== emp.id) e.currentTarget.style.background = 'transparent'; }}
                 >
                    <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: value === emp.id ? '500' : '400' }}>{emp.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.id} • {emp.dept} • {emp.pos}</span>
                 </div>
               ))}
               {filtered.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>Không tìm thấy nhân viên</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── MODALS / FORMS ── */

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', padding: '24px', borderRadius: '16px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#f59e0b' }}>
          <AlertCircle size={24} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '500', color: '#1e293b' }}>{title}</h3>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '400', cursor: 'pointer' }}>Hủy bỏ</button>
          <button onClick={onConfirm} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: '400', cursor: 'pointer' }}>Xác nhận</button>
        </div>
      </motion.div>
    </div>
  );
};

const HistoryDetailDrawer = ({ item, onClose }) => {
  if (!item) return null;

  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#94a3b8', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: '400' }}>{value || '—'}</span>
    </div>
  );

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.3)', zIndex: 1100, backdropFilter: 'blur(3px)' }} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 450, background: 'white', zIndex: 1101, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1e293b' }}>Chi tiết lịch sử thay đổi</h3>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 8, cursor: 'pointer' }}><X size={18} color="#64748b" /></button>
        </div>
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                {item.type === 'Phòng ban' && <Building2 size={24} />}
                {item.type === 'Chức vụ' && <Briefcase size={24} />}
                {item.type === 'Lương' && <DollarSign size={24} />}
             </div>
             <div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{item.empName}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Loại thay đổi: <span style={{ color: '#4f46e5', fontWeight: '400' }}>{item.type}</span></div>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <InfoRow label="Thời gian thực hiện" value={item.time} />
            <InfoRow label="Người thay đổi" value={item.executor} />
            <InfoRow label="Hiệu lực từ" value={item.effectiveDate} />
            
            {item.type === 'Phòng ban' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f0f9ff', borderRadius: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: '400' }}>TỪ PHÒNG BAN</div>
                    <div style={{ fontWeight: '400' }}>{item.from}</div>
                  </div>
                  <ArrowRight size={16} color="#0369a1" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: '400' }}>SANG PHÒNG BAN</div>
                    <div style={{ fontWeight: '400' }}>{item.to}</div>
                  </div>
                </div>
                <InfoRow label="Người phụ trách" value={item.supervisor} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#94a3b8', textTransform: 'uppercase' }}>Tình trạng nhân viên</span>
                  <StatusBadge status={item.status} />
                </div>
              </>
            )}

            {item.type === 'Chức vụ' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f5f3ff', borderRadius: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: '400' }}>TỪ CHỨC VỤ</div>
                    <div style={{ fontWeight: '400' }}>{item.fromPos}</div>
                  </div>
                  <ArrowRight size={16} color="#6d28d9" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: '400' }}>SANG CHỨC VỤ</div>
                    <div style={{ fontWeight: '400' }}>{item.toPos}</div>
                  </div>
                </div>
                <InfoRow label="Người định / Tham chiếu" value={item.supervisor} />
              </>
            )}

            {item.type === 'Lương' && (
              <>
                <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#065f46' }}>Lương Gross cũ</span>
                    <span style={{ fontWeight: '400' }}>{item.currentSalary.toLocaleString()} ₫</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed #a7f3d0' }}>
                    <span style={{ fontSize: '0.85rem', color: '#065f46' }}>Mức tăng</span>
                    <span style={{ fontWeight: '500', color: '#059669' }}>+ {item.amount.toLocaleString()} ₫</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#065f46' }}>Lương Gross mới</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#059669' }}>{item.newSalary.toLocaleString()} ₫</span>
                  </div>
                </div>
                <InfoRow label="Người quyết định" value={item.decisionMaker} />
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#94a3b8', textTransform: 'uppercase' }}>Lý do chi tiết</span>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
                {item.reason}
              </div>
            </div>

            {item.editNote && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#f59e0b', textTransform: 'uppercase' }}>Ghi chú chỉnh sửa</span>
                <div style={{ padding: '12px', background: '#fffbeb', borderRadius: '8px', fontSize: '0.9rem', color: '#92400e', lineHeight: '1.6', border: '1px solid #fde68a' }}>
                  {item.editNote}
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
           <button onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: '400', cursor: 'pointer' }}>Đóng cửa sổ</button>
        </div>
      </motion.div>
    </>
  );
};

/* ── FORM DRAWER ── */
const HistoryFormDrawer = ({ data, onClose, onSave }) => {
  const isEdit = !!data;
  const [formData, setFormData] = useState(data || {
    type: 'Phòng ban', empName: '', empId: '', effectiveDate: '', reason: '',
    from: '', to: '', supervisor: '', status: 'Đang làm',
    fromPos: '', toPos: '',
    currentSalary: '',  newSalary: '', decisionMaker: '', editNote: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleEmpSelect = (emp) => {
    setFormData({
      ...formData,
      empId: emp.id,
      empName: emp.name,
      from: emp.dept,
      fromPos: emp.pos,
      currentSalary: emp.salary
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const netCalc = formData.type === 'Lương' ? calculateNet(Number(formData.newSalary) || 0) : null;

  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' };
  const labelStyle = { fontSize: '0.8rem', fontWeight: '500', color: '#64748b', marginBottom: '6px', display: 'block' };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.3)', zIndex: 1100, backdropFilter: 'blur(3px)' }} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 500, background: 'white', zIndex: 1101, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1e293b' }}>{isEdit ? 'Chỉnh sửa bản ghi lịch sử' : 'Thêm lịch sử nhân sự'}</h3>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 8, cursor: 'pointer' }}><X size={18} color="#64748b" /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <form id="history-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {!isEdit && (
              <div>
                <label style={labelStyle}>Loại thay đổi</label>
                <div style={{ display: 'flex', gap: 8 }}>
                   {['Phòng ban', 'Chức vụ', 'Lương'].map(t => (
                     <button key={t} type="button" onClick={() => setFormData({...formData, type: t})}
                        style={{ flex: 1, padding: '10px', borderRadius: 10, border: formData.type === t ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0', background: formData.type === t ? '#f5f3ff' : 'white', color: formData.type === t ? '#6366f1' : '#64748b', fontSize: '0.85rem', fontWeight: formData.type === t ? '500' : '400', transition: 'all 0.2s' }}>
                        {t}
                     </button>
                   ))}
                </div>
              </div>
            )}

            <div>
              <label style={labelStyle}>Nhân viên</label>
              {isEdit ? (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#64748b', fontSize: '0.9rem' }}>
                   {formData.empName} ({formData.empId})
                </div>
              ) : (
                <SearchableEmployeeSelect value={formData.empId} onChange={handleEmpSelect} placeholder="Chọn nhân viên cần thay đổi..." />
              )}
            </div>

            <div>
              <label style={labelStyle}>Hiệu lực từ ngày</label>
              <input required type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} style={inputStyle} />
            </div>

            {formData.type === 'Phòng ban' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Từ phòng ban</label><input required name="from" value={formData.from} onChange={handleChange} style={inputStyle} /></div>
                <div><label style={labelStyle}>Sang phòng ban</label><input required name="to" value={formData.to} onChange={handleChange} style={inputStyle} /></div>
                <div><label style={labelStyle}>Người phụ trách</label><input required name="supervisor" value={formData.supervisor} onChange={handleChange} style={inputStyle} /></div>
                <div>
                  <label style={labelStyle}>Tình trạng nhân viên</label>
                  <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                    <option value="Đang làm">Đang làm</option>
                    <option value="Thử việc">Thử việc</option>
                  </select>
                </div>
              </div>
            )}

            {formData.type === 'Chức vụ' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Từ chức vụ</label><input required name="fromPos" value={formData.fromPos} onChange={handleChange} style={inputStyle} /></div>
                <div><label style={labelStyle}>Sang chức vụ</label><input required name="toPos" value={formData.toPos} onChange={handleChange} style={inputStyle} /></div>
                <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Người tham chiếu / Quyết định</label><input required name="supervisor" value={formData.supervisor} onChange={handleChange} style={inputStyle} /></div>
              </div>
            )}

            {formData.type === 'Lương' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div><label style={labelStyle}>Lương Gross cũ (VNĐ)</label><input required type="number" name="currentSalary" value={formData.currentSalary} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Lương Gross mới (VNĐ)</label><input required type="number" name="newSalary" value={formData.newSalary} onChange={handleChange} style={inputStyle} /></div>
                </div>
                
                {netCalc && netCalc.gross > 0 && (
                   <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: '500', marginBottom: '12px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <DollarSign size={15} color="#10b981" /> Dự toán Lương sau thay đổi (Gross sang Net)
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#64748b' }}>Tổng Lương Gross:</span>
                        <span style={{ fontWeight: '500' }}>{netCalc.gross.toLocaleString()} ₫</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                         <span style={{ color: '#64748b' }}>Bảo hiểm trích từ (10.5%):</span>
                         <span style={{ color: '#ef4444' }}>- {netCalc.insurance.toLocaleString()} ₫</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                         <span style={{ color: '#64748b' }}>Khấu trừ cá nhân:</span>
                         <span style={{ color: '#ef4444' }}>- 11,000,000 ₫</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed #cbd5e1' }}>
                         <span style={{ color: '#64748b' }}>Thuế TNCN tạm tính:</span>
                         <span style={{ color: '#ef4444' }}>- {netCalc.pit.toLocaleString()} ₫</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ fontWeight: '500', color: '#0f172a' }}>Lương Thực Nhận (Net):</span>
                         <span style={{ fontWeight: '600', color: '#10b981', fontSize: '1.05rem' }}>{netCalc.net.toLocaleString()} ₫</span>
                      </div>
                   </div>
                )}

                <div><label style={labelStyle}>Người quyết định</label><input required name="decisionMaker" value={formData.decisionMaker} onChange={handleChange} style={inputStyle} /></div>
              </>
            )}

            <div>
              <label style={labelStyle}>Lý do / Chi tiết hoạt động</label>
              <textarea required name="reason" value={formData.reason} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Nhập lý do chi tiết..." />
            </div>

            {isEdit && (
              <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                 <label style={{ ...labelStyle, color: '#92400e' }}>Take note / Ghi chú cho lần sửa này</label>
                 <textarea required name="editNote" value={formData.editNote} onChange={handleChange} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical', borderColor: '#fcd34d', background: '#fef3c7' }} placeholder="Ghi chú lý do chuyên viên chỉnh sửa bản ghi này..." />
              </div>
            )}
            
          </form>
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9', background: '#fafafa', display: 'flex', gap: '12px' }}>
           <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: '500', cursor: 'pointer' }}>Hủy</button>
           <button type="submit" form="history-form" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
              <Save size={18} /> Lưu bản ghi
           </button>
        </div>

      </motion.div>
    </>
  );
}


/* ── MAIN COMPONENT ── */

const EmployeeHistory = () => {
  const [activeTab, setActiveTab] = useState('dept');
  const [deptHistory, setDeptHistory] = useState(initDeptHistory);
  const [posHistory, setPosHistory] = useState(initPosHistory);
  const [salaryHistory, setSalaryHistory] = useState(initSalaryHistory);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const [detailItem, setDetailItem] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null });

  const tabs = [
    { id: 'dept', label: 'Thay đổi Phòng ban', icon: <Building2 size={16} /> },
    { id: 'pos', label: 'Thay đổi Chức vụ', icon: <Briefcase size={16} /> },
    { id: 'salary', label: 'Tăng lương', icon: <DollarSign size={16} /> },
  ];

  const handleAction = (title, message, callback) => {
    setConfirmModal({ ...confirmModal, open: false });
    setTimeout(() => {
        setConfirmModal({
            open: true,
            title,
            message,
            onConfirm: () => {
              callback();
              setConfirmModal({ ...confirmModal, open: false });
            }
          });
    }, 100);
  };

  const [showToast, setShowToast] = useState(false);
  const toast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(false), 3000);
  };

  const checkDateMatch = (itemDate) => {
     if (!filters.startDate && !filters.endDate) return true;
     const d = new Date(itemDate);
     if (filters.startDate && d < new Date(filters.startDate)) return false;
     if (filters.endDate && d > new Date(filters.endDate)) return false;
     return true;
  };

  const filteredDept = useMemo(() => deptHistory.filter(h => {
    const matchSearch = h.empName.toLowerCase().includes(searchTerm.toLowerCase()) || h.empId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && checkDateMatch(h.effectiveDate);
  }), [deptHistory, searchTerm, filters]);

  const filteredPos = useMemo(() => posHistory.filter(h => {
    const matchSearch = h.empName.toLowerCase().includes(searchTerm.toLowerCase()) || h.empId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && checkDateMatch(h.effectiveDate);
  }), [posHistory, searchTerm, filters]);

  const filteredSalary = useMemo(() => salaryHistory.filter(h => {
    const matchSearch = h.empName.toLowerCase().includes(searchTerm.toLowerCase()) || h.empId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && checkDateMatch(h.effectiveDate);
  }), [salaryHistory, searchTerm, filters]);

  const handleSaveForm = (data) => {
     handleAction(data.id ? 'Xác nhận Chỉnh sửa' : 'Xác nhận Thêm mới', 'Bạn có chắc chắn lưu thông tin bản ghi lịch sử này?', () => {
        const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
        if(data.id) {
            if(data.type === 'Phòng ban') setDeptHistory(prev => prev.map(i => i.id === data.id ? {...data} : i));
            if(data.type === 'Chức vụ') setPosHistory(prev => prev.map(i => i.id === data.id ? {...data} : i));
            if(data.type === 'Lương') {
               data.amount = Number(data.newSalary) - Number(data.currentSalary);
               setSalaryHistory(prev => prev.map(i => i.id === data.id ? {...data} : i));
            }
        } else {
            data.id = 'H' + Math.floor(Math.random() * 10000);
            data.time = nowStr;
            data.executor = 'Admin';
            if(data.type === 'Phòng ban') setDeptHistory([{...data}, ...deptHistory]);
            if(data.type === 'Chức vụ') setPosHistory([{...data}, ...posHistory]);
            if(data.type === 'Lương') {
               data.amount = Number(data.newSalary) - Number(data.currentSalary);
               setSalaryHistory([{...data}, ...salaryHistory]);
            }
        }
        setIsFormOpen(false);
        setEditingData(null);
        toast('Lưu thông tin thành công!');
     });
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Search & Tabs Header */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #eef2f6', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? '#1e293b' : '#64748b',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === tab.id ? '500' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
             <button
               onClick={() => { setEditingData(null); setIsFormOpen(true); }}
               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '400', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}
             >
               <Plus size={18} /> Thêm thay đổi
             </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên theo Tên hoặc Mã..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '11px 12px 11px 38px', borderRadius: '10px', border: '1.5px solid #e8edf4', fontSize: '0.9rem', outline: 'none', background: '#fafbff' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
             <DateRangePicker 
                startDate={filters.startDate} 
                endDate={filters.endDate} 
                onApply={(start, end) => setFilters({...filters, startDate: start, endDate: end})} 
             />
             {(searchTerm || filters.startDate || filters.endDate) && (
               <button onClick={() => {setSearchTerm(''); setFilters({startDate: '', endDate: ''});}} style={{ border: 'none', background: '#fff1f2', color: '#e11d48', height: 40, padding: '0 14px', borderRadius: 10, fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
                 <X size={14} /> Xóa lọc
               </button>
             )}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eef2f6', overflow: 'visible', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
            {activeTab === 'dept' && (
              <tr>
                <th style={{...thStyle, borderTopLeftRadius: '16px'}}>Nhân sự</th>
                <th style={thStyle}>Phòng ban (Từ - Sang)</th>
                <th style={thStyle}>Hiệu lực</th>
                <th style={thStyle}>Người phụ trách</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Thời gian thay đổi</th>
                <th style={{ ...thStyle, textAlign: 'center', borderTopRightRadius: '16px' }}>Hành động</th>
              </tr>
            )}
            {activeTab === 'pos' && (
              <tr>
                <th style={{...thStyle, borderTopLeftRadius: '16px'}}>Nhân sự</th>
                <th style={thStyle}>Chức vụ thay đổi</th>
                <th style={thStyle}>Hiệu lực</th>
                <th style={thStyle}>Người quyết định</th>
                <th style={thStyle}>Lý do</th>
                <th style={thStyle}>Thời gian</th>
                <th style={{ ...thStyle, textAlign: 'center', borderTopRightRadius: '16px' }}>Hành động</th>
              </tr>
            )}
            {activeTab === 'salary' && (
              <tr>
                <th style={{...thStyle, borderTopLeftRadius: '16px'}}>Nhân sự</th>
                <th style={thStyle}>Mức tăng</th>
                <th style={thStyle}>Lương Gross mới</th>
                <th style={thStyle}>Hiệu lực</th>
                <th style={thStyle}>Người quyết định</th>
                <th style={thStyle}>Lý do</th>
                <th style={{ ...thStyle, textAlign: 'center', borderTopRightRadius: '16px' }}>Hành động</th>
              </tr>
            )}
          </thead>
          <tbody>
            {activeTab === 'dept' && filteredDept.map(item => (
              <tr key={item.id} style={trStyle}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{item.empName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.empId}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b' }}>{item.from}</span>
                    <ArrowRight size={12} color="#94a3b8" />
                    <span style={{ fontWeight: '500', color: '#3b82f6' }}>{item.to}</span>
                  </div>
                </td>
                <td style={tdStyle}>{item.effectiveDate}</td>
                <td style={tdStyle}>{item.supervisor}</td>
                <td style={tdStyle}><StatusBadge status={item.status} /></td>
                <td style={tdStyle}>
                   <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>{item.time.split(' ')[0]}</div>
                   <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.time.split(' ')[1]} bởi {item.executor}</div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <ActionButtons item={item} onDetail={() => setDetailItem(item)} onEdit={() => { setEditingData(item); setIsFormOpen(true); }} onAction={handleAction} />
                </td>
              </tr>
            ))}

            {activeTab === 'pos' && filteredPos.map(item => (
              <tr key={item.id} style={trStyle}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{item.empName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.empId}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b' }}>{item.fromPos}</span>
                    <ArrowRight size={12} color="#94a3b8" />
                    <span style={{ fontWeight: '500', color: '#8b5cf6' }}>{item.toPos}</span>
                  </div>
                </td>
                <td style={tdStyle}>{item.effectiveDate}</td>
                <td style={tdStyle}>{item.supervisor}</td>
                <td style={tdStyle}>
                   <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#64748b' }}>{item.reason}</div>
                </td>
                <td style={tdStyle}>
                   <div style={{ fontSize: '0.85rem' }}>{item.time}</div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <ActionButtons item={item} onDetail={() => setDetailItem(item)} onEdit={() => { setEditingData(item); setIsFormOpen(true); }} onAction={handleAction} />
                </td>
              </tr>
            ))}

            {activeTab === 'salary' && filteredSalary.map(item => (
              <tr key={item.id} style={trStyle}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{item.empName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.empId}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ color: '#10b981', fontWeight: '500' }}>+ {item.amount.toLocaleString()} ₫</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{item.newSalary.toLocaleString()} ₫</div>
                </td>
                <td style={tdStyle}>{item.effectiveDate}</td>
                <td style={tdStyle}>{item.decisionMaker}</td>
                <td style={tdStyle}>
                   <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#64748b' }}>{item.reason}</div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <ActionButtons item={item} onDetail={() => setDetailItem(item)} onEdit={() => { setEditingData(item); setIsFormOpen(true); }} onAction={handleAction} />
                </td>
              </tr>
            ))}
            
            {((activeTab === 'dept' && filteredDept.length === 0) || (activeTab === 'pos' && filteredPos.length === 0) || (activeTab === 'salary' && filteredSalary.length === 0)) && (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Không có dữ liệu phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {detailItem && (
          <HistoryDetailDrawer 
            item={detailItem} 
            onClose={() => setDetailItem(null)} 
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isFormOpen && (
          <HistoryFormDrawer 
            data={editingData} 
            onClose={() => { setIsFormOpen(false); setEditingData(null); }} 
            onSave={handleSaveForm}
          />
        )}
      </AnimatePresence>

      <ConfirmationModal 
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, open: false })}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{
              position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
              background: '#1e293b', color: 'white', padding: '12px 24px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              zIndex: 3000
            }}
          >
            <CheckCircle2 size={18} color="#10b981" />
            <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActionButtons = ({ item, onDetail, onEdit, onAction }) => {
  const [showOptions, setShowOptions] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setShowOptions(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setShowOptions(!showOptions)}
        style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: '#94a3b8' }}
      >
        <MoreVertical size={18} />
      </button>
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'absolute', right: '0', top: '100%', zIndex: 1150, background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px -3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', padding: '6px', minWidth: '150px' }}
          >
            <button onClick={() => { onDetail(); setShowOptions(false); }} style={menuItemStyle}><Eye size={14} /> Xem chi tiết</button>
            <button onClick={() => { onEdit(); setShowOptions(false); }} style={menuItemStyle}><Edit2 size={14} /> Chỉnh sửa</button>
            <button onClick={() => { onAction('Vô hiệu hóa', 'Bạn có chắc muốn vô hiệu hóa bản ghi này?', () => {}); setShowOptions(false); }} style={{ ...menuItemStyle, color: '#ef4444' }}><Trash2 size={14} /> Vô hiệu hóa</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#475569', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left'
};

const thStyle = {
  padding: '14px 20px', fontSize: '0.75rem', fontWeight: '500', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'
};

const trStyle = {
  borderBottom: '1px solid #f8fafc', transition: 'background 0.2s', position: 'relative'
};

const tdStyle = {
  padding: '16px 20px', fontSize: '0.9rem', color: '#475569'
};

export default EmployeeHistory;

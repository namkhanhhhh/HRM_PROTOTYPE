import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Clock, Search, Plus, Filter, Calendar, Users, Building2, 
  ChevronDown, X, Upload, Save, Eye, Edit2, Lock, 
  FileSpreadsheet, ArrowLeft, ArrowRight, MoreVertical, CheckCircle2, AlertCircle, Info, Grid, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── MOCK DATA ── */
const initEmployees = [
  { id: 'NV001', name: 'Nguyễn Nam Khánh', dept: 'Kỹ thuật', pos: 'Senior Fullstack Dev', status: 'Đang làm' },
  { id: 'NV002', name: 'Trần Thị Mai', dept: 'Nhân sự', pos: 'HR Manager', status: 'Đang làm' },
  { id: 'NV003', name: 'Lê Hoàng Tuấn', dept: 'Kinh doanh', pos: 'Business Development', status: 'Thử việc' },
  { id: 'NV004', name: 'Phạm Minh Đức', dept: 'Kỹ thuật', pos: 'Frontend Dev', status: 'Đang làm' },
];

const initAttendances = [
  { empId: 'NV001', totalDays: 22, otDays: 4.5, leaveDays: 1, unpaidDays: 0 },
  { empId: 'NV002', totalDays: 21, otDays: 0, leaveDays: 2, unpaidDays: 1 },
  { empId: 'NV003', totalDays: 15, otDays: 2, leaveDays: 0, unpaidDays: 0 },
];

const generateMonthlyDetail = (empId, year, month) => {
  const days = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month - 1, i);
    const dayOfWeek = d.getDay();
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][dayOfWeek];

    if (dayOfWeek === 0) continue; // Skip Sundays

    let status = 'Đủ công';
    let checkIn = '08:15';
    let checkOut = '17:45';
    let lateMins = 0;
    let earlyMins = 0;
    let workedHours = 9.5;
    let workDay = 1.05;

    if (i % 7 === 0) { status = 'Nửa ngày'; checkOut = '12:00'; workedHours = 4; workDay = 0.5; }
    else if (i === 12) { status = 'Lỗi chấm công'; checkOut = '--:--'; workedHours = 0; workDay = 0; }
    else if (i === 15) { status = 'Nghỉ có phép'; checkIn = '--:--'; checkOut = '--:--'; workedHours = 0; workDay = 0; }
    else if (i === 18) { status = 'Nghỉ không phép'; checkIn = '--:--'; checkOut = '--:--'; workedHours = 0; workDay = 0; }
    else if (i === 22) { status = 'Đủ công'; checkIn = '08:45'; lateMins = 15; workedHours = 8.5; workDay = 0.95; }

    days.push({
      date: dateStr,
      dayName,
      dayNumber: i,
      dayOfWeek,
      checkIn,
      checkOut,
      lateMins,
      earlyMins,
      workedHours,
      workDay,
      status,
      otHours: (status === 'Đủ công' && i % 3 === 0) ? 1.5 : 0
    });
  }
  return days;
};

/* ── HELPERS ── */
const calculateAttendance = (checkIn, checkOut) => {
  if (!checkIn || !checkOut || checkIn === '--:--' || checkOut === '--:--') 
     return { hours: 0, workDay: 0, late: 0, early: 0, ot: 0, status: 'Lỗi chấm công' };
  
  const parseTime = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const start = parseTime(checkIn);
  const end = parseTime(checkOut);
  const stdStart = parseTime('08:30');
  const stdEnd = parseTime('17:30');
  const lunchMins = 60;

  const late = Math.max(0, start - stdStart);
  const early = Math.max(0, stdEnd - end);
  const totalMins = end - start - lunchMins;
  let hours = totalMins / 60;
  if(hours < 0) hours = 0;
  
  const workDay = Number((hours / 9).toFixed(2));
  const ot = Math.max(0, (end - stdEnd) / 60);

  let status = 'Đủ công';
  if (workDay >= 1) status = 'Đủ công';
  else if (workDay >= 0.5) status = 'Nửa ngày';
  else status = 'Lỗi chấm công';

  return { hours: hours.toFixed(1), workDay, late, early, ot: ot.toFixed(1), status };
};

/* ── COMPONENTS ── */

const StatusBadge = ({ status }) => {
  const cfg = {
    'Đủ công': { bg: '#ecfdf5', color: '#059669', dot: '#10b981' },
    'Đi làm': { bg: '#ecfdf5', color: '#059669', dot: '#10b981' }, 
    'Nửa ngày': { bg: '#fefce8', color: '#a16207', dot: '#eab308' },
    'Lỗi chấm công': { bg: '#fef2f2', color: '#ef4444', dot: '#f87171' },
    'Nghỉ không phép': { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
    'Nghỉ có phép': { bg: '#ffedd5', color: '#9a3412', dot: '#c2410c' },
    'Nghỉ khác': { bg: '#ffedd5', color: '#9a3412', dot: '#c2410c' },
  }[status] || { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: '500', background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
      {status}
    </span>
  );
};

const SoftSelect = ({ value, onChange, options, icon, label, width = 180 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div ref={ref} style={{ position: 'relative', width }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, border: '1.5px solid #eef2f6', background: 'white', color: '#1e293b', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ color: '#6366f1' }}>{icon}</span>}
          <span style={{ color: '#64748b', fontWeight: '400', marginRight: 4 }}>{label}:</span>
          <span>{selectedOption.label}</span>
        </div>
        <ChevronDown size={14} style={{ color: '#94a3b8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #eef2f6', zIndex: 100, overflow: 'hidden', padding: 4 }}>
            {options.map(opt => (
              <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{ padding: '8px 12px', borderRadius: 8, fontSize: '0.875rem', color: value === opt.value ? '#4f46e5' : '#475569', background: value === opt.value ? '#f5f3ff' : 'transparent', fontWeight: value === opt.value ? '500' : '400', cursor: 'pointer', transition: 'all 0.1s' }}
                onMouseEnter={e => { if(value !== opt.value) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if(value !== opt.value) e.currentTarget.style.background = 'transparent'; }}>
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── MODALS & DRAWERS ── */

const SecretKeyModal = ({ isOpen, onConfirm, onCancel }) => {
  const [key, setKey] = useState('');
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', padding: '24px', borderRadius: '16px', maxWidth: '350px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#f97316' }}>
          <Lock size={30} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>Yêu cầu Secret Key</h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '20px' }}>Dữ liệu quá 2 tháng cần khóa bảo mật để thay đổi.</p>
        <input type="password" placeholder="Nhập mã bí mật..." value={key} onChange={e => setKey(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', marginBottom: '16px', outline: 'none', textAlign: 'center' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Quay lại</button>
          <button onClick={() => onConfirm(key)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#f97316', color: 'white', cursor: 'pointer' }}>Xác thực</button>
        </div>
      </motion.div>
    </div>
  );
};

const AddAttendanceDrawer = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    empId: '', date: new Date().toISOString().split('T')[0],
    checkIn: '08:00', checkOut: '17:30'
  });

  const calc = useMemo(() => calculateAttendance(formData.checkIn, formData.checkOut), [formData.checkIn, formData.checkOut]);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 1100, backdropFilter: 'blur(2px)' }} />
      <motion.div initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 450, background: 'white', zIndex: 1101, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Thêm / Cập nhật Chấm công</h3>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 8, cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 6, display: 'block' }}>Nhân viên</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }}>
                {initEmployees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 6, display: 'block' }}>Ngày chấm công</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 6, display: 'block' }}>Giờ vào</label>
                <input type="time" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 6, display: 'block' }}>Giờ ra</label>
                <input type="time" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
               <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                 <Clock size={16} color="#3b82f6" /> Hệ thống tính toán (Tự động)
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ color: '#64748b' }}>Tổng giờ làm:</div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{calc.hours}h</div>
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ color: '#64748b' }}>Số công quy đổi:</div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#10b981' }}>{calc.workDay} công</div>
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ color: '#64748b' }}>Trễ / Sớm:</div>
                    <div style={{ fontWeight: '500', color: (calc.late > 0 || calc.early > 0) ? '#ef4444' : '#10b981' }}>{calc.late}m / {calc.early}m</div>
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ color: '#64748b' }}>Tăng ca (OT):</div>
                    <div style={{ fontWeight: '500', color: '#3b82f6' }}>{calc.ot}h</div>
                  </div>
               </div>
               <div style={{ marginTop: 16, pt: 16, borderTop: '1px dashed #cbd5e1' }}>
                 <StatusBadge status={calc.status} />
               </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', background: '#fafafa', display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Hủy</button>
          <button onClick={() => { onSave(); onClose(); }} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: '500', cursor: 'pointer' }}>Lưu công</button>
        </div>
      </motion.div>
    </>
  );
};

const CalendarPopup = ({ data, year, month, onClose }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay(); 
  const startIndex = firstDay === 0 ? 6 : firstDay - 1; 

  const getColor = (status) => {
    switch(status) {
      case 'Đủ công': return '#10b981'; 
      case 'Nửa ngày': return '#eab308'; 
      case 'Lỗi chấm công': return '#ef4444'; 
      case 'Nghỉ không phép': return '#94a3b8'; 
      case 'Nghỉ có phép': return '#9a3412'; 
      default: return '#cbd5e1';
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>Lịch chấm công Tháng {month}/{year}</h3>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', padding: 10, borderRadius: 12, cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedDay ? '1fr 300px' : '1fr', flex: 1, overflow: 'hidden' }}>
          {/* Calendar Body */}
          <div style={{ padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                <div key={d} style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', textAlign: 'center', paddingBottom: 8 }}>{d}</div>
              ))}
              
              {Array(startIndex).fill(null).map((_, i) => (
                 <div key={`empty-${i}`} style={{ height: '65px', borderRadius: '12px', background: '#f8fafc' }} />
              ))}

              {Array(daysInMonth).fill(null).map((_, i) => {
                 const dayNum = i + 1;
                 const record = data.find(d => d.dayNumber === dayNum);
                 const color = record ? getColor(record.status) : '#f1f5f9';
                 const isSelected = selectedDay && selectedDay.dayNumber === dayNum;
                 
                 return (
                   <div key={`day-${dayNum}`} 
                     onClick={() => setSelectedDay(record)}
                     style={{ 
                       position: 'relative', height: '65px', borderRadius: '14px', 
                       background: record ? `${color}10` : '#f8fafc', 
                       border: isSelected ? `2.5px solid ${color}` : `1.5px solid ${record ? `${color}40` : '#eef2f6'}`, 
                       display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                       cursor: 'pointer', transition: 'all 0.2s',
                       boxShadow: isSelected ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
                     }}>
                     <span style={{ fontSize: '1rem', fontWeight: '600', color: isSelected ? color : (record ? '#1e293b' : '#94a3b8') }}>{dayNum}</span>
                     {record && <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, marginTop: 4 }} />}
                   </div>
                 );
              })}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              {['Đủ công', 'Nửa ngày', 'Lỗi chấm công', 'Nghỉ có phép', 'Nghỉ không phép'].map(st => (
                <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#64748b' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: getColor(st) }}/> {st}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Day Detail Sidebar */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
                style={{ background: '#f8fafc', borderLeft: '1px solid #eef2f6', padding: '24px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>Chi tiết ngày {selectedDay.date.split('-').reverse().join('/')}</h4>
                  <button onClick={() => setSelectedDay(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}><X size={16} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '12px', border: '1px solid #eef2f6' }}>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Giờ vào/ra</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{selectedDay.checkIn} — {selectedDay.checkOut}</span>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ padding: '12px', background: 'white', borderRadius: '12px', border: '1px solid #eef2f6' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Trễ</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: selectedDay.lateMins > 0 ? '#ef4444' : '#10b981' }}>{selectedDay.lateMins}p</div>
                      </div>
                      <div style={{ padding: '12px', background: 'white', borderRadius: '12px', border: '1px solid #eef2f6' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Sớm</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: selectedDay.earlyMins > 0 ? '#ef4444' : '#10b981' }}>{selectedDay.earlyMins}p</div>
                      </div>
                   </div>
                   <div style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #eef2f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                         <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Số giờ làm</span>
                         <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{selectedDay.workedHours}h</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                         <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Số công</span>
                         <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4f46e5' }}>{selectedDay.workDay}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Tăng ca (OT)</span>
                         <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#8b5cf6' }}>{selectedDay.otHours}h</span>
                      </div>
                   </div>
                   <div style={{ pt: 8 }}>
                      <StatusBadge status={selectedDay.status} />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};


/* ── MAIN PAGE ── */

const Attendance = () => {
  const [viewMode, setViewMode] = useState('overview'); 
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [fMonth, setFMonth] = useState(currentMonth);
  const [fYear, setFYear] = useState(currentYear);
  const [fDept, setFDept] = useState('all');

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleEdit = () => {
    const diff = (currentYear - fYear) * 12 + (currentMonth - fMonth);
    if (diff > 2) setIsSecretOpen(true);
    else setIsAddOpen(true);
  };

  const overviewData = useMemo(() => {
    return initAttendances.map(a => {
      const emp = initEmployees.find(e => e.id === a.empId);
      return { ...a, ...emp };
    }).filter(e => {
      const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = fDept === 'all' || e.dept === fDept;
      return matchSearch && matchDept;
    });
  }, [searchTerm, fDept]);

  const detailData = useMemo(() => {
    if (!selectedEmp) return [];
    return generateMonthlyDetail(selectedEmp.id, fYear, fMonth);
  }, [selectedEmp, fYear, fMonth]);

  const stats = useMemo(() => {
    let totalH = 0, totalW = 0, totalOT = 0, lateCounts = 0, earlyCounts = 0, lateM = 0, earlyM = 0;
    detailData.forEach(d => {
      totalH += d.workedHours;
      totalW += d.workDay;
      totalOT += d.otHours;
      if (d.lateMins > 0) { lateCounts++; lateM += d.lateMins; }
      if (d.earlyMins > 0) { earlyCounts++; earlyM += d.earlyMins; }
    });
    return {
      totalH: totalH.toFixed(1), totalW: totalW.toFixed(2), totalOT: totalOT.toFixed(1),
      lateCounts, earlyCounts, lateM, earlyM
    };
  }, [detailData]);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Filters */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #eef2f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', letterSpacing: '-0.02em' }}>
              {viewMode === 'overview' ? 'Quản lý Chấm công' : `${selectedEmp.name}`}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.875rem' }}>
              <Calendar size={14} /> <span>Tháng {fMonth} / {fYear}</span>
              {viewMode === 'detail' && <span> • {selectedEmp.pos}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             {viewMode === 'detail' && (
               <button onClick={() => setViewMode('overview')} style={secondaryBtnStyle}>
                 <ArrowLeft size={16} /> Quay lại
               </button>
             )}
             {viewMode === 'detail' && (
                <button onClick={() => setIsCalendarOpen(true)} style={{ ...secondaryBtnStyle, background: '#f5f3ff', color: '#7c3aed', border: '1.5px solid #ddd6fe' }}>
                  <Grid size={18} /> Xem dạng Lịch
                </button>
             )}
             <button onClick={() => setIsImportOpen(true)} style={{ ...secondaryBtnStyle, color: '#10b981' }}>
               <FileSpreadsheet size={18} /> Import Excel
             </button>
             <button onClick={() => setIsAddOpen(true)} style={primaryBtnStyle}>
               <Plus size={18} /> Thêm chấm công
             </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input placeholder="Tìm nhân viên theo tên hoặc mã..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px', border: '1.5px solid #eef2f6', outline: 'none', background: '#f8fafc', fontSize: '0.9rem', transition: 'all 0.2s' }} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#eef2f6'} />
          </div>
          
          <SoftSelect label="Tháng" value={fMonth} onChange={setFMonth} icon={<Calendar size={16} />} 
            options={[1,2,3,4,5,6,7,8,9,10,11,12].map(m => ({ value: m, label: `Tháng ${m}` }))} />
          
          <SoftSelect label="Năm" value={fYear} onChange={setFYear} icon={<Calendar size={16} />} 
            options={[currentYear, currentYear-1, currentYear-2, currentYear-3, currentYear-4].map(y => ({ value: y, label: `Năm ${y}` }))} />
          
          <SoftSelect label="Phòng" width={220} value={fDept} onChange={setFDept} icon={<Building2 size={16} />} 
            options={[
              { value: 'all', label: 'Tất cả phòng ban' },
              { value: 'Kỹ thuật', label: 'Kỹ thuật' },
              { value: 'Nhân sự', label: 'Nhân sự' },
              { value: 'Kinh doanh', label: 'Kinh doanh' },
            ]} />
        </div>
      </div>

      {viewMode === 'detail' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
           <StatCard label="Tổng giờ làm" value={`${stats.totalH}h`} color="#3b82f6" bgColor="#eff6ff" />
           <StatCard label="Tổng công" value={stats.totalW} color="#10b981" bgColor="#ecfdf5" />
           <StatCard label="Tăng ca" value={`${stats.totalOT}h`} color="#8b5cf6" bgColor="#f5f3ff" />
           <StatCard label="Số lần đi trễ" value={`${stats.lateCounts}`} color="#ef4444" bgColor="#fef2f2" />
           <StatCard label="Số lần về sớm" value={`${stats.earlyCounts}`} color="#eab308" bgColor="#fefce8" />
           <StatCard label="Tổng phút trễ" value={`${stats.lateM}p`} color="#ef4444" bgColor="#fef2f2" />
           <StatCard label="Tổng phút sớm" value={`${stats.earlyM}p`} color="#eab308" bgColor="#fefce8" />
        </motion.div>
      )}

      {/* Tables View */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        {viewMode === 'overview' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
              <tr>
                <th style={{...thStyle, textAlign: 'left', paddingLeft: '24px'}}>Nhân viên</th>
                <th style={{...thStyle, textAlign: 'left'}}>Phòng ban / Chức vụ</th>
                <th style={thStyle}>Tổng công</th>
                <th style={thStyle}>Tăng ca (OT)</th>
                <th style={thStyle}>Nghỉ phép</th>
                <th style={thStyle}>Nghỉ ko phép</th>
                <th style={{...thStyle, paddingRight: '24px'}}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {overviewData.map(item => (
                <tr key={item.empId} style={{ borderBottom: '1px solid #f8fafc', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfdff'}>
                  <td style={{...tdStyle, textAlign: 'left', paddingLeft: '24px'}}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.empId}</div>
                  </td>
                  <td style={{...tdStyle, textAlign: 'left'}}>
                    <div style={{ color: '#475569' }}>{item.dept}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.pos}</div>
                  </td>
                  <td style={tdStyle}><span style={{ fontWeight: '700', color: '#10b981' }}>{item.totalDays}</span></td>
                  <td style={tdStyle}>{item.otDays} h</td>
                  <td style={tdStyle}>{item.leaveDays}</td>
                  <td style={tdStyle}>{item.unpaidDays}</td>
                  <td style={{...tdStyle, paddingRight: '24px'}}>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <button onClick={() => { setSelectedEmp(item); setViewMode('detail'); }} style={actionBtnStyle} title="Xem chi tiết (Danh sách/Lịch)"><Eye size={18} /></button>
                      <button onClick={() => handleEdit()} style={actionBtnStyle} title="Chỉnh sửa"><Edit2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
                <tr>
                  <th style={thStyle}>Ngày</th>
                  <th style={thStyle}>Thứ</th>
                  <th style={thStyle}>Vào - Ra</th>
                  <th style={thStyle}>Trễ/Sớm (p)</th>
                  <th style={thStyle}>Số giờ làm</th>
                  <th style={thStyle}>Số công</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {detailData.map(day => (
                  <tr key={day.date} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfdff'}>
                    <td style={tdStyle}>{day.date.split('-').reverse().join('/')}</td>
                    <td style={tdStyle}><span style={{ fontWeight: '600', color: day.dayOfWeek===0 ? '#ef4444' : '#64748b' }}>{day.dayName}</span></td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: '600', color: (day.checkIn === '--:--' && day.checkOut === '--:--') ? '#cbd5e1' : '#1e293b' }}>
                        {day.checkIn} — {day.checkOut}
                      </span>
                    </td>
                    <td style={tdStyle}>
                       <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                         <span style={{ color: day.lateMins > 0 ? '#ef4444' : '#10b981', fontWeight: '500' }}>{day.lateMins}</span>
                         <span style={{ color: '#cbd5e1' }}>|</span>
                         <span style={{ color: day.earlyMins > 0 ? '#ef4444' : '#10b981', fontWeight: '500' }}>{day.earlyMins}</span>
                       </div>
                    </td>
                    <td style={tdStyle}>{day.workedHours > 0 ? `${day.workedHours}h` : '-'}</td>
                    <td style={tdStyle}><span style={{ fontWeight: '700', color: day.workDay > 0 ? '#4f46e5' : '#94a3b8' }}>{day.workDay > 0 ? day.workDay : '-'}</span></td>
                    <td style={tdStyle}><StatusBadge status={day.status} /></td>
                    <td style={tdStyle}>
                       <button onClick={(e) => { e.stopPropagation(); handleEdit(); }} style={{ ...actionBtnStyle, color: '#4f46e5' }}><Edit2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {detailData.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Chưa có dữ liệu chấm công cho tháng này</div>}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCalendarOpen && <CalendarPopup data={detailData} month={fMonth} year={fYear} onClose={() => setIsCalendarOpen(false)} />}
        {isAddOpen && <AddAttendanceDrawer onClose={() => setIsAddOpen(false)} onSave={() => {}} />}
        {isSecretOpen && <SecretKeyModal isOpen={isSecretOpen} onCancel={() => setIsSecretOpen(false)} onConfirm={(k) => { if(k==='123') setIsAddOpen(true); setIsSecretOpen(false); }} />}
      </AnimatePresence>

      <AnimatePresence>
        {isImportOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'white', padding: '32px', borderRadius: '24px', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#059669' }}>
                <Upload size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>Import dữ liệu chấm công</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>Chọn tệp tin Excel chứa dữ liệu chấm công tháng {fMonth}/{fYear}.</p>
              <div style={{ border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '48px 20px', cursor: 'pointer', marginBottom: '24px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                <FileSpreadsheet size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
                <div style={{ color: '#475569', fontWeight: '600' }}>Click để tải lên hoặc kéo thả tệp</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: 6 }}>Hỗ trợ .xlsx, .csv - Tối đa 10MB</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setIsImportOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', cursor: 'pointer', fontWeight: '500' }}>Đóng</button>
                <button onClick={() => setIsImportOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#10b981', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>Bắt đầu tải lên</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, value, color, bgColor }) => (
  <motion.div whileHover={{ y: -4 }} style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    <div style={{ fontSize: '1.25rem', fontWeight: '800', color, background: bgColor, padding: '4px 10px', borderRadius: '8px', minWidth: '50px' }}>{value}</div>
  </motion.div>
);

const primaryBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.2)', transition: 'all 0.2s' };
const secondaryBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', border: '1.5px solid #eef2f6', background: 'white', color: '#475569', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' };
const actionBtnStyle = { border: 'none', background: '#f8fafc', color: '#94a3b8', padding: 10, borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', transition: 'all 0.2s' };

const thStyle = { padding: '16px 12px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '14px 12px', fontSize: '0.875rem', color: '#334155', verticalAlign: 'middle' };

export default Attendance;

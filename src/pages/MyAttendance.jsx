import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Calendar, Clock, AlertCircle, FileSpreadsheet, 
  Filter, ChevronLeft, ChevronRight, X, List, Grid, Info, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { CheckCircle2 } from 'lucide-react';

const AnimatedSelect = ({ value, onChange, options, icon, label, bg = 'white' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: '180px' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 12, border: '1.5px solid #eef2f6', background: bg, color: '#1e293b', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ color: '#3b82f6' }}>{icon}</span>}
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
                style={{ padding: '8px 12px', borderRadius: 8, fontSize: '0.875rem', color: value === opt.value ? '#3b82f6' : '#475569', background: value === opt.value ? '#eff6ff' : 'transparent', fontWeight: value === opt.value ? '500' : '400', cursor: 'pointer', transition: 'all 0.1s' }}
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

const calculateAttendance = (checkIn, checkOut) => {
  if (!checkIn || !checkOut || checkIn === '--:--' || checkOut === '--:--') 
     return { hours: 0, workDay: 0, late: 0, early: 0, ot: 0, status: 'Lỗi chấm công', needApproval: false };
  
  const parseTime = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const start = parseTime(checkIn);
  const end = parseTime(checkOut);
  
  const stdStart = 510; // 08:30
  const stdEnd = 1050; // 17:30
  const lunchStart = 720; // 12:00
  const lunchEnd = 780; // 13:00

  const late = Math.max(0, start - stdStart);
  const startEff = Math.max(start, stdStart);
  
  let morningMins = 0;
  if (startEff < lunchStart) {
    morningMins = Math.max(0, Math.min(end, lunchStart) - startEff);
  }
  
  let afternoonMins = 0;
  if (end > lunchEnd) {
    afternoonMins = Math.max(0, end - Math.max(start, lunchEnd));
  }
  
  const totalWorkedMins = morningMins + afternoonMins;
  let hours = totalWorkedMins / 60;
  let workDay = totalWorkedMins / 480;
  let needApproval = false;
  
  if (totalWorkedMins >= 480) {
    workDay = 1.0;
  } else if (totalWorkedMins === 210 && startEff === 510 && end === 720) {
    workDay = 0.45;
  } else if (totalWorkedMins === 270 && startEff === 780 && end === 1050) {
    workDay = 0.55;
  }
  
  if (startEff <= 510 && end >= 750 && end <= 780 && afternoonMins === 0) {
    if (morningMins >= 210) {
      workDay = 0.5;
      needApproval = true;
    }
  }
  
  const ot = Math.max(0, totalWorkedMins - 480) / 60;
  const earlyMins = Math.max(0, stdEnd - end); 
  
  let status = 'Đủ công';
  if (workDay >= 1) status = 'Đủ công';
  else if (workDay >= 0.5 && !needApproval) status = 'Nửa ngày';
  else if (workDay > 0) status = 'Thiếu công';
  else status = 'Lỗi chấm công';
  
  return { 
    hours: Number(hours.toFixed(1)), 
    workDay: Number(workDay.toFixed(2)), 
    late, 
    early: earlyMins, 
    ot: Number(ot.toFixed(1)), 
    status, 
    needApproval 
  };
};

// --- MOCK DATA GENERATOR ---
const generateMonthlyDetail = (year, month) => {
  const days = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month - 1, i);
    const dayOfWeek = d.getDay();
    const dateStr = `${i.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    const dayName = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayOfWeek];

    if (dayOfWeek === 0) {
      days.push({ id: dateStr, date: dateStr, dayName, status: 'Cuối tuần', checkIn: '--:--', checkOut: '--:--', rawDate: d, workDay: 0, hours: 0, ot: 0, lateMins: 0 });
      continue;
    }

    let checkIn = '08:30';
    let checkOut = '17:30';

    if (i === 12) { checkIn = '--:--'; checkOut = '--:--'; } // Lỗi
    else if (i === 15) { checkIn = '--:--'; checkOut = '--:--'; } // Nghỉ có phép
    else if (i === 22) { checkIn = '09:00'; checkOut = '17:30'; } // Muộn ko bù
    else if (i === 28) { checkIn = '--:--'; checkOut = '--:--'; } // Nghỉ ko phép
    else if (i % 5 === 0) { checkOut = '19:30'; } // Tăng ca
    else if (i === 16) { checkIn = '08:30'; checkOut = '12:30'; } // Part time nửa ngày

    const att = calculateAttendance(checkIn, checkOut);
    let status = att.status;
    if (i === 15) status = 'Nghỉ có phép';
    if (i === 28) status = 'Nghỉ không phép';

    days.push({
      id: dateStr,
      date: dateStr,
      dayName,
      status,
      checkIn,
      checkOut,
      workDay: (status === 'Nghỉ có phép' || status === 'Nghỉ không phép') ? 0 : att.workDay,
      hours: att.hours,
      ot: att.ot,
      lateMins: att.late,
      needApproval: att.needApproval,
      rawDate: d
    });
  }
  return days;
};

const MOCK_MONTHS = [
  { value: '2026-02', label: 'Tháng 02/2026', days: generateMonthlyDetail(2026, 2) },
  { value: '2026-01', label: 'Tháng 01/2026', days: generateMonthlyDetail(2026, 1) },
  { value: '2025-12', label: 'Tháng 12/2025', days: generateMonthlyDetail(2025, 12) },
];

export default function MyAttendance() {
  const { addReport } = useNotifications();
  const [selectedMonth, setSelectedMonth] = useState('2026-02');
  const [viewMode, setViewMode] = useState('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReport, setShowReport] = useState(null);
  const [reportText, setReportText] = useState('');
  const [toast, setToast] = useState(null);

  const monthData = MOCK_MONTHS.find(m => m.value === selectedMonth) || MOCK_MONTHS[0];
  
  // Filtered array
  const filteredDays = useMemo(() => {
    let res = monthData.days;
    if (filterStatus !== 'all') {
      res = res.filter(d => {
        if (filterStatus === 'error') return ['Lỗi chấm công', 'Thiếu công', 'Nghỉ không phép'].includes(d.status);
        if (filterStatus === 'leave') return ['Nghỉ có phép', 'Nửa ngày'].includes(d.status);
        if (filterStatus === 'ot') return d.ot > 0;
        return true;
      });
    }
    return res;
  }, [monthData, filterStatus]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalWorkDays = 0;
    let otHours = 0;
    let lateCount = 0;
    let leaveDays = 0;
    monthData.days.forEach(d => {
      totalWorkDays += d.workDay;
      otHours += d.ot;
      if (d.lateMins > 0) lateCount++;
      if (d.status === 'Nghỉ có phép') leaveDays++;
    });
    return {
      workDays: totalWorkDays,
      otHours,
      lateCount,
      leaveDays,
      targetDays: 22
    };
  }, [monthData]);

  const StatusBadge = ({ status }) => {
    const cfg = {
      'Đủ công': { bg: '#ecfdf5', color: '#059669', dot: '#10b981' },
      'Thiếu công': { bg: '#fff7ed', color: '#ea580c', dot: '#f97316' }, 
      'Lỗi chấm công': { bg: '#fef2f2', color: '#ef4444', dot: '#f87171' },
      'Nghỉ không phép': { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
      'Nghỉ có phép': { bg: '#fefce8', color: '#a16207', dot: '#eab308' },
      'Nửa ngày': { bg: '#fefce8', color: '#a16207', dot: '#eab308' },
      'Cuối tuần': { bg: 'transparent', color: '#94a3b8', dot: 'transparent' },
    }[status] || { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' };
  
    if (status === 'Cuối tuần') return <span style={{ color: cfg.color, fontSize: '0.8rem' }}>Cuối tuần</span>;
  
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: '500', background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
        {status}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>Chi tiết lịch sử chấm công</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>Tra cứu ngày công của các kỳ đã chốt</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ ...btnStyle, background: '#10b981', color: 'white' }} onClick={() => alert('Đang xuất Excel...')}>
            <FileSpreadsheet size={16}/> Xuất Excel báo cáo
          </button>
        </div>
      </div>

      {/* FILTER BAR & SUMMARY */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <AnimatedSelect
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={MOCK_MONTHS.map(m => ({ value: m.value, label: m.label }))}
            icon={<Calendar size={18}/>}
            label="Kỳ tra cứu"
            bg="#f8fafc"
          />
          
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
          
          <AnimatedSelect
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'error', label: 'Lỗi / Đi muộn / Không phép' },
              { value: 'leave', label: 'Nghỉ có phép' },
              { value: 'ot', label: 'Có OT' }
            ]}
            icon={<Filter size={18}/>}
            label="Trạng thái"
            bg="#f8fafc"
          />
        </div>

        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          <button onClick={() => setViewMode('list')} style={{ ...viewBtnStyle, background: viewMode === 'list' ? 'white' : 'transparent', color: viewMode === 'list' ? '#3b82f6' : '#64748b', boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
            <List size={16}/> Dạng danh sách
          </button>
          <button onClick={() => setViewMode('calendar')} style={{ ...viewBtnStyle, background: viewMode === 'calendar' ? 'white' : 'transparent', color: viewMode === 'calendar' ? '#3b82f6' : '#64748b', boxShadow: viewMode === 'calendar' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
            <Grid size={16}/> Lịch trực quan
          </button>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <StatCard label="Công thực tế / Chuẩn" value={`${stats.workDays} / ${stats.targetDays}`} icon={<Calendar size={20}/>} color="#3b82f6" />
        <StatCard label="Số giờ OT" value={`${stats.otHours} giờ`} icon={<Clock size={20}/>} color="#8b5cf6" />
        <StatCard label="Đi muộn" value={`${stats.lateCount} lần`} icon={<AlertCircle size={20}/>} color="#f59e0b" />
        <StatCard label="Nghỉ có phép" value={`${stats.leaveDays} ngày`} icon={<Info size={20}/>} color="#10b981" />
      </div>

      <div style={{ background: '#e0e7ff', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.85rem', color: '#3730a3', border: '1px solid #c7d2fe' }}>
        <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Chi tiết đối soát lương:</strong> Mỗi ngày nghỉ không phép hoặc công không đạt sẽ trừ đi giá trị 1 ngày công khỏi lưởng cơ bản. Các khoản OT được nhân với hệ số tại Bảng lương. Nếu thấy lỗi chấm công, vui lòng "Báo sai sót" để HR giải quyết sớm.
        </div>
      </div>

      {/* MAIN VIEW */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {viewMode === 'list' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={thStyle}>Ngày / Thứ</th>
                  <th style={thStyle}>Giờ vào</th>
                  <th style={thStyle}>Giờ ra</th>
                  <th style={thStyle}>Tổng giờ</th>
                  <th style={thStyle}>Đi muộn</th>
                  <th style={thStyle}>Giờ OT</th>
                  <th style={thStyle}>Quy công</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredDays.map((d, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: d.status === 'Cuối tuần' ? '#f8fafc' : (d.needApproval ? '#fefce8' : 'white') }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                         {d.needApproval && <AlertCircle size={14} color="#ea580c" />}
                         <div>
                            <span style={{ fontWeight: '500', color: '#1e293b' }}>{d.date}</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>{d.dayName}</span>
                         </div>
                      </div>
                    </td>
                    <td style={tdStyle}>{d.checkIn}</td>
                    <td style={tdStyle}>{d.checkOut}</td>
                    <td style={tdStyle}>{d.hours > 0 ? `${d.hours}h` : '—'}</td>
                    <td style={{ ...tdStyle, color: d.lateMins > 0 ? '#ef4444' : '#64748b' }}>
                      {d.lateMins > 0 ? `${d.lateMins} phút` : '—'}
                    </td>
                    <td style={{ ...tdStyle, color: d.ot > 0 ? '#3b82f6' : '#64748b', fontWeight: d.ot > 0 ? '600' : '400' }}>
                      {d.ot > 0 ? `${d.ot}h` : '—'}
                    </td>
                    <td style={tdStyle}>
                      {d.workDay > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                          <span style={{ fontWeight: '500', color: '#16a34a' }}>{d.workDay} công</span>
                          {d.needApproval && (
                            <span style={{ fontSize: '0.65rem', color: '#ea580c', fontWeight: 'bold', background: '#ffedd5', padding: '2px 6px', borderRadius: '4px' }}>Cần duyệt 0.5</span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>0 công</span>
                      )}
                    </td>
                    <td style={tdStyle}><StatusBadge status={d.status} /></td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      {d.status !== 'Cuối tuần' && (
                        <button onClick={() => setShowReport(d)} style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginLeft: 'auto' }}>
                          <AlertCircle size={14}/> Báo sai sót
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <CalendarGrid days={monthData.days} onReport={setShowReport} year={2026} month={parseInt(selectedMonth.split('-')[1])} />
          </div>
        )}
      </div>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReport && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowReport(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'white', padding: '24px', borderRadius: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#1e293b' }}>Báo cáo sai sót chấm công</h3>
                <button onClick={() => setShowReport(null)} style={{ border: 'none', background: '#f1f5f9', padding: '6px', borderRadius: '50%', color: '#64748b', cursor: 'pointer' }}><X size={16}/></button>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Ngày: <strong style={{ color: '#1e293b' }}>{showReport.dayName}, {showReport.date}</strong></div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Trạng thái hệ thống: <StatusBadge status={showReport.status} /></div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Giờ ghi nhận: <strong style={{ color: '#1e293b' }}>Vào {showReport.checkIn} — Ra {showReport.checkOut}</strong></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Mô tả thực tế</label>
                <textarea 
                  rows={4} 
                  placeholder="Ví dụ: Kéo nhầm cửa vân tay lúc 8:00 nên máy không nhận..."
                  value={reportText}
                  onChange={e => setReportText(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setShowReport(null); setReportText(''); }} style={{ flex: 1, padding: '12px', border: 'none', background: '#f1f5f9', color: '#475569', borderRadius: '12px', fontWeight: '500', cursor: 'pointer' }}>Hủy bỏ</button>
                <button onClick={() => {
                  if (!reportText.trim()) return;
                  const monthLabel = MOCK_MONTHS.find(m => m.value === selectedMonth)?.label || selectedMonth;
                  addReport({ type: 'attendance', refLabel: `Chấm công ngày ${showReport.date} (${monthLabel})`, desc: reportText });
                  setReportText('');
                  setShowReport(null);
                  setToast('Đã gửi báo cáo đến bộ phận Nhân sự!');
                  setTimeout(() => setToast(null), 3500);
                }} style={{ flex: 1, padding: '12px', border: 'none', background: '#3b82f6', color: 'white', borderRadius: '12px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Send size={16}/> Gửi yêu cầu
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: 'white', padding: '12px 24px', borderRadius: 14, fontSize: '0.9rem', fontWeight: '500', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <CheckCircle2 size={18} color="#10b981" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom Calendar Grid View
function CalendarGrid({ days, onReport, year, month }) {
  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  // Calculate padding days to start on correct weekday
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startPadding = firstDay === 0 ? 6 : firstDay - 1; // 0 is Sunday
  
  const calendarCells = Array(startPadding).fill(null).concat(days);
  const rows = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    rows.push(calendarCells.slice(i, i + 7));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
        {weekdays.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>{d}</div>
        ))}
      </div>
      
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {row.map((cell, j) => {
            if (!cell) return <div key={`empty-${j}`} style={{ background: '#f8fafc', borderRadius: '8px', minHeight: '100px' }} />;
            
            const isWeekend = cell.status === 'Cuối tuần';
            const isError = ['Lỗi chấm công', 'Đi muộn', 'Nghỉ không phép'].includes(cell.status);
            
            return (
              <div key={cell.id} style={{ 
                background: isWeekend ? '#f8fafc' : isError ? '#fef2f2' : 'white', 
                border: `1px solid ${isError ? '#fecaca' : '#e2e8f0'}`, 
                borderRadius: '10px', 
                padding: '10px',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: isWeekend ? '#94a3b8' : '#1e293b' }}>{cell.date.split('/')[0]}</span>
                  {cell.workDay > 0 && <span style={{ fontSize: '0.7rem', background: cell.needApproval ? '#ffedd5' : '#ecfdf5', color: cell.needApproval ? '#ea580c' : '#059669', padding: '2px 6px', borderRadius: '8px', fontWeight: '500' }}>{cell.workDay} công</span>}
                </div>
                
                {!isWeekend && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                    <span style={{ color: cell.lateMins > 0 ? '#ef4444' : 'inherit' }}>Vào: {cell.checkIn}</span>
                    <span>Ra: {cell.checkOut}</span>
                    {cell.status !== 'Đủ công' && (
                      <span style={{ marginTop: 'auto', paddingTop: '4px', fontSize: '0.7rem', fontWeight: '500', color: isError ? '#ef4444' : '#eab308' }}>
                        • {cell.status}
                      </span>
                    )}
                  </div>
                )}

                {!isWeekend && isError && (
                  <button 
                    onClick={() => onReport(cell)}
                    title="Báo cáo sai sót"
                    style={{ position: 'absolute', bottom: '6px', right: '6px', border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <AlertCircle size={14} color="#ef4444" />
                  </button>
                )}
              </div>
            );
          })}
          {/* Fill the last row if less than 7 */}
          {row.length < 7 && Array(7 - row.length).fill(null).map((_, j) => (
             <div key={`empty-end-${j}`} style={{ background: '#f8fafc', borderRadius: '8px', minHeight: '100px' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// --- SUB COMPONENTS & STYLES ---

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{value}</div>
      </div>
    </div>
  );
}

const btnStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', 
  border: 'none', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s'
};

const selectStyle = {
  padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', 
  fontSize: '0.85rem', color: '#1e293b', background: 'transparent', cursor: 'pointer'
};

const viewBtnStyle = {
  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', 
  border: 'none', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'
};

const thStyle = { padding: '14px 16px', color: '#64748b', fontWeight: '500', fontSize: '0.8rem', textAlign: 'center' };
const tdStyle = { padding: '14px 16px', color: '#334155', textAlign: 'center' };

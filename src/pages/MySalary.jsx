import React, { useState } from 'react';
import {
  Banknote, Clock, Shield, Percent, Download,
  AlertCircle, ChevronDown, ChevronRight, X,
  Calendar, TrendingUp, ArrowUpRight, ArrowDownRight,
  FileText, CheckCircle2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';

// ── Constants (mirroring the setup config from admin) ──
const CFG = {
  lunch: 700000,
  gasoline: 500000,
  phone: 500000,
  standardDays: 22,
  insuranceRate: 10.5,   // employee share
  personalDeduction: 15500000,
  dependentDeduction: 6200000,
};

// ── Per-employee profile (my data) ──
const ME = {
  name: 'Nam Khánh',
  gross: 27000000,
  contractType: 'Chính thức',
  dependents: 1,
};

// ── Monthly raw attendance data ──
const MONTHS_DATA = [
  { id: 'm10', period: 'Tháng 10/2025', workDays: 21, leaveDays: 1, otHours: 6,  bonus: 0,       status: 'Đã trả' },
  { id: 'm11', period: 'Tháng 11/2025', workDays: 21, leaveDays: 1, otHours: 4,  bonus: 0,       status: 'Đã trả' },
  { id: 'm12', period: 'Tháng 12/2025', workDays: 22, leaveDays: 0, otHours: 22, bonus: 2000000, status: 'Đã trả' },
  { id: 'm01', period: 'Tháng 01/2026', workDays: 20, leaveDays: 2, otHours: 18, bonus: 1500000, status: 'Đã trả' },
  { id: 'm02', period: 'Tháng 02/2026', workDays: 22, leaveDays: 0, otHours: 8,  bonus: 0,       status: 'Đã trả' },
  { id: 'm03', period: 'Tháng 03/2026', workDays: 21, leaveDays: 1, otHours: 12, bonus: 0,       status: 'Đang xử lý' },
];

// ── Core calculation (same formula as admin PayrollCalculation) ──
function calculateSalary(m) {
  const fixedAllowances = CFG.lunch + CFG.gasoline + CFG.phone;
  const baseSalary      = ME.gross - fixedAllowances;  // no probation since chính thức
  const dailyRate       = baseSalary / CFG.standardDays;
  const hourlyRate      = dailyRate / 8;

  const actualWorkSalary = dailyRate * m.workDays;
  const otSalary         = m.otHours * hourlyRate * 1.5;  // 150% weekday OT

  const allowanceRatio       = Math.min(m.workDays, CFG.standardDays) / CFG.standardDays;
  const allowanceLunch       = CFG.lunch    * allowanceRatio;
  const allowanceTaxable     = (CFG.gasoline + CFG.phone) * allowanceRatio;

  const totalBeforeTax = actualWorkSalary + allowanceLunch + allowanceTaxable + otSalary + m.bonus;

  const insuranceAmt = baseSalary * CFG.insuranceRate / 100;
  const taxableBase  = actualWorkSalary + allowanceTaxable + otSalary + m.bonus;
  const totalDeduct  = CFG.personalDeduction + ME.dependents * CFG.dependentDeduction;
  const netTaxable   = Math.max(0, taxableBase - insuranceAmt - totalDeduct);
  const pitTax       = netTaxable > 0 ? netTaxable * 0.1 : 0;
  const netSalary    = totalBeforeTax - insuranceAmt - pitTax;

  return {
    baseSalary, dailyRate, hourlyRate,
    actualWorkSalary, allowanceLunch, allowanceTaxable,
    otSalary, bonus: m.bonus,
    totalBeforeTax, insuranceAmt, pitTax, netSalary,
    taxableBase, netTaxable,
    workDays: m.workDays, leaveDays: m.leaveDays, otHours: m.otHours
  };
}

// ── Generate mock daily attendance ──
function genDailyAttendance(workDays, leaveDays, otHours) {
  const days = [];
  let wd = 0, ld = 0, otLeft = otHours;
  for (let i = 1; i <= 31; i++) {
    const dayOfWeek = new Date(2026, 2, i).getDay(); // March
    if (i > 31) break;
    if (dayOfWeek === 0 || dayOfWeek === 6) { days.push({ day: i, status: 'Cuối tuần', work: 0, ot: 0 }); continue; }
    if (ld < leaveDays && i % 7 === 3) {
      days.push({ day: i, status: 'Nghỉ phép', work: 0, ot: 0 }); ld++; continue;
    }
    if (wd < workDays) {
      const ot = (otLeft > 0 && i % 4 === 0) ? Math.min(2, otLeft) : 0;
      otLeft -= ot;
      days.push({ day: i, status: ot > 0 ? 'OT' : 'Đi làm', work: 8, ot, checkIn: '08:00', checkOut: ot > 0 ? `${17 + ot}:30` : '17:30' });
      wd++;
    }
  }
  return days;
}

const fmt = (v) => new Intl.NumberFormat('vi-VN').format(Math.round(v)) + 'đ';
const fmtM = (v) => (v / 1_000_000).toFixed(1) + 'M';

export default function MySalary() {
  const { addReport } = useNotifications();
  const [selectedId, setSelectedId]             = useState('m03');
  const [showAttendModal, setShowAttendModal]     = useState(false);
  const [showHistoryDetail, setShowHistoryDetail] = useState(null);
  const [showReport, setShowReport]               = useState(false);
  const [reportForm, setReportForm]               = useState({ reason: '' });
  const [showAllHistory, setShowAllHistory]       = useState(false);
  const [toast, setToast]                         = useState(null);

  const selectedMonth = MONTHS_DATA.find(m => m.id === selectedId);
  const calc           = calculateSalary(selectedMonth);
  const attendDays     = genDailyAttendance(selectedMonth.workDays, selectedMonth.leaveDays, selectedMonth.otHours);

  // Computed chart data for all months
  const chartData = MONTHS_DATA.map(m => {
    const c = calculateSalary(m);
    return {
      period: m.period.replace('Tháng ', 'T'),
      gross: Math.round(c.totalBeforeTax / 1000),
      net: Math.round(c.netSalary / 1000),
      ot: Math.round(c.otSalary / 1000),
      insurance: Math.round(c.insuranceAmt / 1000),
      tax: Math.round(c.pitTax / 1000),
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={h2}>Bảng lương của tôi</h2>
          <p style={subText}>Chi tiết tính lương, chấm công và lịch sử thu nhập cá nhân</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={selectStyle}>
            {MONTHS_DATA.slice().reverse().map(m => <option key={m.id} value={m.id}>{m.period}</option>)}
          </select>
          <button style={btnBlue} onClick={() => alert('Đang kết xuất PDF…')}><Download size={16}/> Tải bảng lương</button>
        </div>
      </div>

      {/* ── TOP: 4 SUMMARY STATS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <StatBox label="Tổng thu nhập (Gross)" value={fmt(calc.totalBeforeTax)} icon={<Banknote size={20}/>} color="#3b82f6" bg="#eff6ff" />
        <StatBox label="Bảo hiểm khấu trừ" value={fmt(calc.insuranceAmt)} sub="10.5% lương cơ sở" icon={<Shield size={20}/>} color="#f59e0b" bg="#fffbeb" />
        <StatBox label="Thuế TNCN" value={fmt(calc.pitTax)} sub="Sau giảm trừ gia cảnh" icon={<Percent size={20}/>} color="#ef4444" bg="#fef2f2" />
        <StatBox label="Thực lĩnh (Net)" value={fmt(calc.netSalary)} icon={<TrendingUp size={20}/>} color="#10b981" bg="#f0fdf4" highlight />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
        
        {/* LEFT: Salary detail breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={cardTitle}>Chi tiết tính lương — {selectedMonth.period}</h3>
              <span style={{ fontSize: '0.75rem', background: selectedMonth.status === 'Đã trả' ? '#dcfce7' : '#fef9c3', color: selectedMonth.status === 'Đã trả' ? '#166534' : '#854d0e', padding: '4px 10px', borderRadius: '20px' }}>
                {selectedMonth.status}
              </span>
            </div>

            {/* Income lines */}
            <SalaryLine
              label={`Lương cơ bản (${calc.workDays}/${CFG.standardDays} ngày công)`}
              value={fmt(calc.actualWorkSalary)}
              onDetail={() => setShowAttendModal(true)}
              detailLabel="Xem chấm công →"
            />
            <SalaryLine label="Tổng phụ cấp (Ăn trưa + Xăng xe + ĐT)" value={fmt(calc.allowanceLunch + calc.allowanceTaxable)} />
            {calc.otHours > 0 && <SalaryLine label={`Lương OT — ${calc.otHours}h × hệ số 1.5`} value={fmt(calc.otSalary)} />}
            {selectedMonth.bonus > 0 && <SalaryLine label="Thưởng / phụ cấp khác" value={fmt(selectedMonth.bonus)} />}

            <SalaryLine label="Tổng thu nhập Gross" value={fmt(calc.totalBeforeTax)} bold />

            <div style={{ height: '1px', borderTop: '1px dashed #e2e8f0', margin: '0.75rem 0' }} />

            {/* Deduction lines */}
            <SalaryLine label="Bảo hiểm khấu trừ (BHXH + BHYT + BHTN — 10.5%)" value={fmt(calc.insuranceAmt)} isDeduct />
            <SalaryLine label="Thuế thu nhập cá nhân (TNCN)" value={fmt(calc.pitTax)} isDeduct />

            {/* Net */}
            <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', color: '#166534' }}>Thực lĩnh</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '500', color: '#16a34a' }}>{fmt(calc.netSalary)}</span>
            </div>

            <button onClick={() => setShowReport(true)} style={{ marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: 'none', background: '#fef2f2', color: '#ef4444', fontWeight: '500', cursor: 'pointer' }}>
              <AlertCircle size={16}/> Báo cáo sai sót bảng lương
            </button>
          </div>

          {/* Chart — full width of left column */}
          <div style={card}>
            <h3 style={{ ...cardTitle, marginBottom: '1.5rem' }}>Biến động thu nhập 6 tháng gần nhất</h3>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={6}/>
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v/1000}M`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={(v, n) => [fmtM(v * 1000), n === 'net' ? 'Thực lĩnh' : n === 'ot' ? 'OT' : n === 'insurance' ? 'Bảo hiểm' : 'Thuế']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }} />
                  <Bar dataKey="net"       fill="#10b981" radius={[4,4,0,0]} name="Thực lĩnh" />
                  <Bar dataKey="ot"        fill="#3b82f6" radius={[4,4,0,0]} name="OT" />
                  <Bar dataKey="insurance" fill="#f59e0b" radius={[4,4,0,0]} name="Bảo hiểm" />
                  <Bar dataKey="tax"       fill="#ef4444" radius={[4,4,0,0]} name="Thuế" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT: Period info + History list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Kỳ lương info */}
          <div style={card}>
            <h3 style={{ ...cardTitle, marginBottom: '1.25rem' }}><Calendar size={18} color="#3b82f6"/> Thông tin kỳ lương</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                ['Kỳ tính lương', selectedMonth.period],
                ['Ngày công chuẩn', `${CFG.standardDays} ngày`],
                ['Công thực tế', `${selectedMonth.workDays} ngày`],
                ['Ngày nghỉ phép', `${selectedMonth.leaveDays} ngày`],
                ['OT ghi nhận', `${selectedMonth.otHours} giờ`],
                ['Người phụ trách', 'Kế toán Trưởng'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{k}</span>
                  <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '500' }}>{v}</span>
                </div>
              ))}
            </div>
            <button style={{ ...btnBlue, width: '100%', justifyContent: 'center', marginTop: '1.25rem' }} onClick={() => alert('Đang kết xuất PDF…')}>
              <Download size={16}/> Tải phiếu lương PDF
            </button>
          </div>

          {/* History list — flexible height to fill */}
          <div style={{ ...card, flex: 1 }}>
            <h3 style={{ ...cardTitle, marginBottom: '1.25rem' }}><Clock size={18} color="#64748b"/> Lịch sử bảng lương</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {MONTHS_DATA.slice().reverse().slice(0, showAllHistory ? undefined : 3).map(m => {
                const c = calculateSalary(m);
                return (
                  <div key={m.id} onClick={() => setShowHistoryDetail({ m, c })} style={historyRow}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '500', color: '#334155' }}>{m.period}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: '500', color: '#10b981' }}>{fmt(c.netSalary)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                      <span>Gross: {fmt(c.totalBeforeTax)}</span>
                      <span style={{ color: m.status === 'Đã trả' ? '#10b981' : '#f59e0b' }}>{m.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {MONTHS_DATA.length > 3 && (
              <button
                onClick={() => setShowAllHistory(p => !p)}
                style={{ width: '100%', marginTop: '0.75rem', padding: '9px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'transparent', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                {showAllHistory ? 'Thu gọn ↑' : `Xem thêm ${MONTHS_DATA.length - 3} kỳ trước ↓`}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ═══════════ MODAL: CHI TIẾT CHẤM CÔNG ═══════════ */}
      <AnimatePresence>
        {showAttendModal && (
          <ModalOverlay onClose={() => setShowAttendModal(false)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '500' }}>Chi tiết chấm công — {selectedMonth.period}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Từng ngày làm việc, OT và nghỉ phép</p>
              </div>
              <button onClick={() => setShowAttendModal(false)} style={closeBtn}><X size={18}/></button>
            </div>

            <div style={{ overflowY: 'auto', maxHeight: '380px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                    {['Ngày', 'Trạng thái', 'Vào', 'Ra', 'Giờ thường', 'OT (h)', 'Quy công OT'].map(h => <th key={h} style={thS}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {attendDays.map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc', background: d.status === 'OT' ? '#eff6ff' : d.status === 'Nghỉ phép' ? '#faf5ff' : 'white' }}>
                      <td style={tdS}>{d.day}/03</td>
                      <td style={tdS}><StatusBadge status={d.status} /></td>
                      <td style={tdS}>{d.checkIn || '—'}</td>
                      <td style={tdS}>{d.checkOut || '—'}</td>
                      <td style={tdS}>{d.work > 0 ? `${d.work}h` : '—'}</td>
                      <td style={{ ...tdS, color: '#3b82f6', fontWeight: d.ot > 0 ? '500' : '400' }}>{d.ot > 0 ? `${d.ot}h` : '—'}</td>
                      <td style={tdS}>{d.ot > 0 ? `${(d.ot / 8).toFixed(2)} công` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '14px' }}>
              {[
                { label: 'Tổng công', val: `${selectedMonth.workDays} ngày` },
                { label: 'OT tổng cộng', val: `${selectedMonth.otHours}h` },
                { label: 'Quy công OT', val: `${(selectedMonth.otHours / 8).toFixed(1)} công` },
                { label: 'Lương cơ bản', val: fmt(calc.actualWorkSalary) },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1e293b', marginTop: '4px' }}>{s.val}</div>
                </div>
              ))}
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ═══════════ MODAL: HISTORY DETAIL ═══════════ */}
      <AnimatePresence>
        {showHistoryDetail && (
          <ModalOverlay onClose={() => setShowHistoryDetail(null)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '500' }}>Chi tiết bảng lương — {showHistoryDetail.m.period}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Tất cả các thành phần tạo nên mức lương thực lĩnh</p>
              </div>
              <button onClick={() => setShowHistoryDetail(null)} style={closeBtn}><X size={18}/></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <SectionLabel label="Thu nhập" />
                {[
                  ['Công thực tế', fmt(showHistoryDetail.c.actualWorkSalary)],
                  ['Phụ cấp ăn trưa', fmt(showHistoryDetail.c.allowanceLunch)],
                  ['Phụ cấp xăng + ĐT', fmt(showHistoryDetail.c.allowanceTaxable)],
                  ['Lương OT', fmt(showHistoryDetail.c.otSalary)],
                  showHistoryDetail.m.bonus > 0 ? ['Thưởng/Phụ cấp khác', fmt(showHistoryDetail.m.bonus)] : null,
                  ['Tổng Gross', fmt(showHistoryDetail.c.totalBeforeTax), true],
                ].filter(Boolean).map(([l, v, b], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc', fontWeight: b ? '500' : '400' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>{l}</span>
                    <span style={{ fontSize: '0.85rem', color: '#1e293b' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <SectionLabel label="Khấu trừ" />
                {[
                  ['Bảo hiểm (10.5%)', fmt(showHistoryDetail.c.insuranceAmt), '#f59e0b'],
                  ['Thuế TNCN', fmt(showHistoryDetail.c.pitTax), '#ef4444'],
                ].map(([l, v, c], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>{l}</span>
                    <span style={{ fontSize: '0.85rem', color: c, fontWeight: '500' }}>-{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500', color: '#166534' }}>Thực lĩnh</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '500', color: '#16a34a' }}>{fmt(showHistoryDetail.c.netSalary)}</span>
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', fontSize: '0.8rem', color: '#64748b', lineHeight: '1.7' }}>
                  <strong>Ngày công:</strong> {showHistoryDetail.m.workDays}/{CFG.standardDays} ngày<br/>
                  <strong>OT:</strong> {showHistoryDetail.m.otHours}h &nbsp; <strong>Nghỉ phép:</strong> {showHistoryDetail.m.leaveDays} ngày
                </div>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ═══════════ MODAL: BÁO CÁO SAI SÓT ═══════════ */}
      <AnimatePresence>
        {showReport && (
          <ModalOverlay onClose={() => setShowReport(false)} maxWidth="480px">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '500' }}>Báo cáo sai sót bảng lương</h3>
              <button onClick={() => setShowReport(false)} style={closeBtn}><X size={18}/></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelS}>Kỳ lương cần báo cáo</label>
                <input value={selectedMonth.period} readOnly style={{ ...inputS, background: '#f8fafc' }} />
              </div>
              <div>
                <label style={labelS}>Mô tả sai sót</label>
                <textarea rows={4} placeholder="VD: Sai số giờ OT ngày 15/03/2026 — thực tế làm 3h nhưng chỉ ghi 1h..." style={{ ...inputS, resize: 'none' }} value={reportForm.reason} onChange={e => setReportForm({ ...reportForm, reason: e.target.value })} />
              </div>
              <div>
                <label style={labelS}>Minh chứng (hình ảnh, file)</label>
                <div style={{ border: '2px dashed #cbd5e1', padding: '1.5rem', textAlign: 'center', borderRadius: '12px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}>Nhấn để tải ảnh lên</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                <button onClick={() => setShowReport(false)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: '500' }}>Hủy</button>
                <button onClick={() => {
                  if (!reportForm.reason.trim()) return;
                  addReport({ type: 'salary', refLabel: `Bảng lương ${selectedMonth.period}`, desc: reportForm.reason });
                  setReportForm({ reason: '' });
                  setShowReport(false);
                  setToast('Đã gửi báo cáo sài sót đến bộ phận Nhân sự!');
                  setTimeout(() => setToast(null), 3500);
                }} style={{ flex: 2, ...btnBlue, justifyContent: 'center' }}>Gửi yêu cầu</button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ── TOAST ── */}
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

// ── Helper Components ──
function StatBox({ label, value, sub, icon, color, bg, highlight }) {
  return (
    <div style={{ padding: '1.5rem', background: bg, borderRadius: '18px', border: `1px solid ${color}25`, boxShadow: highlight ? `0 6px 16px -4px ${color}30` : '0 2px 4px rgba(0,0,0,0.02)' }}>
      <div style={{ background: `${color}20`, padding: '10px', borderRadius: '12px', color, width: 'fit-content', marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: '500', color: '#1e293b' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

function SectionLabel({ label }) {
  return <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '1.25rem', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>{label}</div>;
}

function SalaryLine({ label, value, isDeduct, bold, note, onDetail, detailLabel }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f8fafc' }}>
      <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {label}
        {note && <span style={{ fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{note}</span>}
        {onDetail && <button onClick={onDetail} style={{ border: 'none', background: 'transparent', color: '#3b82f6', fontSize: '0.78rem', cursor: 'pointer', padding: '2px 4px' }}>{detailLabel}</button>}
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: bold ? '600' : '400', color: isDeduct ? '#ef4444' : value === '' ? '#64748b' : '#334155' }}>
        {isDeduct && value !== '' ? `−${value}` : value}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const style = {
    'Đi làm': { bg: '#f0fdf4', c: '#166534' },
    'OT': { bg: '#eff6ff', c: '#1d4ed8' },
    'Nghỉ phép': { bg: '#faf5ff', c: '#7c3aed' },
    'Cuối tuần': { bg: '#f8fafc', c: '#94a3b8' },
  }[status] || { bg: '#f8fafc', c: '#64748b' };
  return <span style={{ background: style.bg, color: style.c, fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '500' }}>{status}</span>;
}

function ModalOverlay({ children, onClose, maxWidth = '820px' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', padding: '2.5rem', borderRadius: '28px', width: '92%', maxWidth, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        {children}
      </motion.div>
    </div>
  );
}

// ── Styles ──
const h2 = { fontSize: '1.25rem', fontWeight: '500', color: '#1e293b' };
const subText = { fontSize: '0.85rem', color: '#64748b', marginTop: '2px' };
const card = { background: 'white', padding: '1.75rem', borderRadius: '20px', border: '1px solid #eef2f6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const cardTitle = { fontSize: '1.05rem', fontWeight: '500', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' };
const selectStyle = { padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', fontSize: '0.9rem', color: '#475569', cursor: 'pointer' };
const btnBlue = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer' };
const historyRow = { padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s' };
const closeBtn = { border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex' };
const thS = { padding: '10px 12px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' };
const tdS = { padding: '10px 12px', fontSize: '0.83rem', color: '#334155' };
const labelS = { display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '6px' };
const inputS = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' };

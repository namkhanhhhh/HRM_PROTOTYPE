import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, ShieldCheck, Percent, Banknote,
  ArrowUpRight, ArrowDownRight, Calendar, Clock, 
  Download, Star, Target, Coffee, ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const allData = {
  '3months': [
    { month: 'T01/26', gross: 32000000, net: 27100000, tax: 2500000, insurance: 2400000, ot: 18, leave: 1 },
    { month: 'T02/26', gross: 26500000, net: 22600000, tax: 1700000, insurance: 2200000, ot: 8, leave: 2 },
    { month: 'T03/26', gross: 27000000, net: 23100000, tax: 1750000, insurance: 2150000, ot: 12, leave: 0 },
  ],
  '6months': [
    { month: 'T10/25', gross: 25000000, net: 21500000, tax: 1500000, insurance: 2000000, ot: 6, leave: 2 },
    { month: 'T11/25', gross: 25000000, net: 21500000, tax: 1510000, insurance: 1990000, ot: 4, leave: 1 },
    { month: 'T12/25', gross: 28500000, net: 24200000, tax: 2100000, insurance: 2200000, ot: 22, leave: 0 },
    { month: 'T01/26', gross: 32000000, net: 27100000, tax: 2500000, insurance: 2400000, ot: 18, leave: 1 },
    { month: 'T02/26', gross: 26500000, net: 22600000, tax: 1700000, insurance: 2200000, ot: 8, leave: 2 },
    { month: 'T03/26', gross: 27000000, net: 23100000, tax: 1750000, insurance: 2150000, ot: 12, leave: 0 },
  ],
  '1year': [
    { month: 'T4/25', gross: 23000000, net: 19800000, tax: 1200000, insurance: 2000000, ot: 4, leave: 3 },
    { month: 'T5/25', gross: 24000000, net: 20600000, tax: 1350000, insurance: 2050000, ot: 9, leave: 2 },
    { month: 'T6/25', gross: 24500000, net: 21100000, tax: 1380000, insurance: 2020000, ot: 10, leave: 1 },
    { month: 'T7/25', gross: 25000000, net: 21500000, tax: 1500000, insurance: 2000000, ot: 14, leave: 2 },
    { month: 'T8/25', gross: 25000000, net: 21500000, tax: 1500000, insurance: 2000000, ot: 5, leave: 2 },
    { month: 'T9/25', gross: 25000000, net: 21500000, tax: 1500000, insurance: 2000000, ot: 7, leave: 0 },
    { month: 'T10/25', gross: 25000000, net: 21500000, tax: 1500000, insurance: 2000000, ot: 6, leave: 2 },
    { month: 'T11/25', gross: 25000000, net: 21500000, tax: 1510000, insurance: 1990000, ot: 4, leave: 1 },
    { month: 'T12/25', gross: 28500000, net: 24200000, tax: 2100000, insurance: 2200000, ot: 22, leave: 0 },
    { month: 'T01/26', gross: 32000000, net: 27100000, tax: 2500000, insurance: 2400000, ot: 18, leave: 1 },
    { month: 'T02/26', gross: 26500000, net: 22600000, tax: 1700000, insurance: 2200000, ot: 8, leave: 2 },
    { month: 'T03/26', gross: 27000000, net: 23100000, tax: 1750000, insurance: 2150000, ot: 12, leave: 0 },
  ],
};

const PersonalDashboard = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const data = allData[timeRange];

  const fmt = (val) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  const fmtM = (val) => (val / 1000000).toFixed(1) + 'M';

  const current = allData['6months'][5]; // Tháng 03/26
  const prev    = allData['6months'][4];
  const netDiff = (((current.net - prev.net) / prev.net) * 100).toFixed(1);
  const totalOT = data.reduce((s, d) => s + d.ot, 0);
  const totalLeave = data.reduce((s, d) => s + d.leave, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* ── 4 STAT CARDS ─ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <GlassCard
          icon={<Banknote size={22} />}
          label="Lương Gross"
          value={fmt(current.gross)}
          sub="Thu nhập tháng 03/2026"
          trend={netDiff > 0 ? `+${netDiff}%` : `${netDiff}%`}
          trendUp={netDiff > 0}
          from="#eff6ff" to="#dbeafe" accent="#3b82f6"
        />
        <GlassCard
          icon={<Percent size={22} />}
          label="Thuế TNCN"
          value={fmt(current.tax)}
          sub="Tạm tính theo biểu lũy tiến"
          from="#fef2f2" to="#fee2e2" accent="#ef4444"
        />
        <GlassCard
          icon={<ShieldCheck size={22} />}
          label="Bảo hiểm khấu trừ"
          value={fmt(current.insurance)}
          sub="BHXH 8% + BHYT 1.5% + BHTN 1%"
          from="#fffbeb" to="#fef3c7" accent="#f59e0b"
        />
        <GlassCard
          icon={<DollarSign size={22} />}
          label="Thực lĩnh (Net)"
          value={fmt(current.net)}
          sub="Sau khấu trừ toàn bộ các khoản"
          trend={netDiff > 0 ? `+${netDiff}%` : `${netDiff}%`}
          trendUp={netDiff > 0}
          from="#f0fdf4" to="#dcfce7" accent="#10b981"
          highlight
        />
      </div>

      {/* ── MAIN CHART + SIDE PANEL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '1.75rem' }}>

        {/* LEFT: AREA CHART */}
        <div style={whiteCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={chartTitle}>Biến động thu nhập cá nhân</h3>
              <p style={chartSub}>So sánh Gross vs Net qua các kỳ lương</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[['3months','3T'],['6months','6T'],['1year','1N']].map(([k,l]) => (
                <button key={k} onClick={() => setTimeRange(k)} style={toggleBtn(timeRange===k)}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <LegendDot color="#3b82f6" label="Lương Gross" />
            <LegendDot color="#10b981" label="Thực lĩnh (Net)" />
          </div>

          <div style={{ height: '295px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={fmtM} />
                <Tooltip
                  contentStyle={{ borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.07)', backdropFilter: 'blur(8px)' }}
                  formatter={(v) => fmt(v)}
                />
                <Area type="monotone" dataKey="gross" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gGross)" />
                <Area type="monotone" dataKey="net"   stroke="#10b981" strokeWidth={2.5} fill="url(#gNet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: SIDE CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Period info */}
          <div style={whiteCard}>
            <h3 style={chartTitle}><Calendar size={18} color="#3b82f6" /> Kỳ lương hiện tại</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
              {[
                ['Kỳ tính lương', 'Tháng 03 / 2026'],
                ['Ngày dự kiến trả', '05/04/2026'],
                ['Trạng thái', '✓ Đã phê duyệt'],
                ['Người phụ trách', 'Kế toán Trưởng'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 13px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{k}</span>
                  <span style={{ fontSize: '0.82rem', color: i===2 ? '#10b981' : '#334155', fontWeight: '500' }}>{v}</span>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', borderRadius: '10px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer' }}>
              <Download size={17} /> Tải phiếu lương PDF
            </button>
          </div>

          {/* Extra stats unique to personal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <MiniCard icon={<Clock size={20} />} label="Giờ OT" value={`${totalOT}h`} sub="Trong kỳ lọc" color="#8b5cf6" from="#f5f3ff" />
            <MiniCard icon={<Coffee size={20} />} label="Ngày nghỉ" value={`${totalLeave} ngày`} sub="Đã sử dụng" color="#f59e0b" from="#fffbeb" />
            <MiniCard icon={<Star   size={20} />} label="KPI Score" value="92/100" sub="Tháng 03" color="#ef4444" from="#fef2f2" />
            <MiniCard icon={<Target size={20} />} label="Hiệu suất" value="115%" sub="Vượt mục tiêu" color="#10b981" from="#f0fdf4" />
          </div>
        </div>

      </div>

      {/* ── BOTTOM: OT BAR CHART ── */}
      <div style={whiteCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={chartTitle}>Giờ làm thêm (OT) theo từng kỳ lương</h3>
            <p style={chartSub}>Theo dõi số giờ OT ghi nhận và ảnh hưởng đến thu nhập</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['3months','3T'],['6months','6T'],['1year','1N']].map(([k,l]) => (
              <button key={k} onClick={() => setTimeRange(k)} style={toggleBtn(timeRange===k)}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 8px 12px rgba(0,0,0,0.06)' }} />
              <Bar dataKey="ot" radius={[8, 8, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={i === data.length - 1 ? '#3b82f6' : '#bfdbfe'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

// ── Helper Components ──
const GlassCard = ({ icon, label, value, sub, trend, trendUp, from, to, accent, highlight }) => (
  <div style={{
    background: `linear-gradient(135deg, ${from}, ${to})`,
    border: `1px solid ${accent}25`,
    borderRadius: '18px',
    padding: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.85rem',
    boxShadow: highlight ? `0 8px 20px -4px ${accent}30` : '0 2px 6px rgba(0,0,0,0.03)',
    backdropFilter: 'blur(4px)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ background: `${accent}18`, padding: '10px', borderRadius: '12px', color: accent }}>{icon}</div>
      {trend && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', fontWeight: '500', color: trendUp ? '#059669' : '#dc2626' }}>
          {trendUp ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>} {trend}
        </span>
      )}
    </div>
    <div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', letterSpacing: '-0.01em' }}>{value}</div>
      <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: '4px' }}>{sub}</div>
    </div>
  </div>
);

const MiniCard = ({ icon, label, value, sub, color, from }) => (
  <div style={{ background: from, border: `1px solid ${color}20`, borderRadius: '14px', padding: '1rem', backdropFilter: 'blur(4px)' }}>
    <div style={{ color, marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</div>
    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{sub}</div>
  </div>
);

const LegendDot = ({ color, label }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div> {label}
  </span>
);

// ── Styles ──
const whiteCard = { background: '#ffffff', border: '1px solid #eef2f6', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' };
const chartTitle = { fontSize: '1.1rem', fontWeight: '500', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' };
const chartSub   = { fontSize: '0.82rem', color: '#64748b', fontWeight: '400', marginTop: '3px' };
const toggleBtn  = (active) => ({ padding: '5px 14px', borderRadius: '8px', border: 'none', background: active ? '#3b82f6' : '#f1f5f9', color: active ? 'white' : '#64748b', fontWeight: '500', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' });

export default PersonalDashboard;

import React from 'react';
import { 
  DollarSign, Banknote, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight,
  Receipt, Wallet
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

const StatCard = ({ icon, label, value, trend, subtext, trendType, color }) => (
  <div style={{ 
    padding: '1.75rem', 
    background: '#ffffff',
    border: '1px solid #eef2f6', 
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.3s'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ 
        width: '46px', height: '46px', borderRadius: '12px', background: `${color}10`, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: color
      }}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      {trend && (
        <span style={{ 
          display: 'flex', alignItems: 'center', gap: '4px',
          color: trendType === 'up' ? '#10b981' : '#ef4444', 
          fontWeight: '500', fontSize: '0.85rem',
          background: trendType === 'up' ? '#ecfdf5' : '#fef2f2',
          padding: '4px 10px', borderRadius: '20px'
        }}>
          {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </span>
      )}
    </div>
    <div>
      <div style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.85rem', fontWeight: '600', color: '#1e293b' }}>{value}</div>
      {subtext && <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', fontWeight: '400' }}>{subtext}</div>}
    </div>
  </div>
);

const salaryPieData = [
  { name: 'Lương cơ bản', value: 65, color: '#3b82f6' },
  { name: 'Thưởng KPI', value: 20, color: '#10b981' },
  { name: 'Phụ cấp', value: 10, color: '#f59e0b' },
  { name: 'Làm thêm giờ', value: 5, color: '#8b5cf6' },
];

const salaryHistoryData = [
  { month: 'Th1', budget: 1.2 },
  { month: 'Th2', budget: 1.3 },
  { month: 'Th3', budget: 1.5 },
  { month: 'Th4', budget: 1.55 },
  { month: 'Th5', budget: 1.6 },
  { month: 'Th6', budget: 1.8 }
];

const FinanceAnalytics = () => {
  return (
    <div className="flex flex-col" style={{ gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <StatCard 
            icon={<Banknote />} label="Tổng quỹ lương Tháng 6" value="1.8 Tỷ" 
            trend="+12%" trendType="up" subtext="So với tháng 5" color="#3b82f6"
          />
          <StatCard 
            icon={<TrendingUp />} label="Thưởng & Hoa hồng" value="360 Tr" 
            trend="+5%" trendType="up" subtext="Tổng thưởng KPI và Doanh số" color="#10b981"
          />
          <StatCard 
            icon={<Wallet />} label="Tổng Phụ cấp" value="180 Tr" 
            trend="-2%" trendType="down" subtext="Ăn trưa, đi lại, trách nhiệm" color="#f59e0b"
          />
          <StatCard 
            icon={<Receipt />} label="Chi phí duyệt ngoài" value="45 Tr" 
            trend="+1%" trendType="up" subtext="Công tác phí, tiếp khách" color="#8b5cf6"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          
          <div style={{ background: '#ffffff', border: '1px solid #eef2f6', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>Phân bổ chi phí lương</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie data={salaryPieData} innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value">
                    {salaryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '10px' }}>
                {salaryPieData.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                    <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eef2f6', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#1e293b' }}>Biến động Quỹ lương (Tỷ VNĐ)</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '400' }}>Chi phí lương theo 6 tháng gần nhất</p>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salaryHistoryData}>
                  <defs>
                    <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
                  <Area type="monotone" dataKey="budget" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorBudget)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
    </div>
  );
};

export default FinanceAnalytics;

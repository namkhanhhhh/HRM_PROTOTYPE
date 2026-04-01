import React from 'react';
import { 
  Users, CheckCircle, Timer, Bell, 
  ArrowUpRight, ArrowDownRight, Briefcase, AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
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

const deptData = [
  { name: 'Kỹ thuật', value: 45 },
  { name: 'Kinh doanh', value: 38 },
  { name: 'Marketing', value: 20 },
  { name: 'Nhân sự', value: 12 },
  { name: 'Tài chính', value: 9 },
];

const HRAnalytics = () => {
  return (
    <div className="flex flex-col" style={{ gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <StatCard 
            icon={<Users />} label="Tổng nhân sự" value="124" 
            trend="+12%" trendType="up" subtext="Hợp đồng đang có hiệu lực" color="#3b82f6"
          />
          <StatCard 
            icon={<Briefcase />} label="Tuyển dụng mới" value="8" 
            trend="+2%" trendType="up" subtext="Trong tháng này" color="#8b5cf6"
          />
          <StatCard 
            icon={<CheckCircle />} label="Tỷ lệ giữ chân" value="95%" 
            trend="+1%" trendType="up" subtext="Nhân viên làm việc trên 1 năm" color="#10b981"
          />
          <StatCard 
            icon={<AlertCircle />} label="Thôi việc" value="3" 
            trend="-2%" trendType="down" subtext="Giảm so với tháng trước" color="#ef4444"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid #eef2f6', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>Cơ cấu nhân sự theo phòng ban</h3>
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ListCard title="Hợp đồng sắp hết hạn" color="#3b82f6" 
              items={[
                { label: 'Trần Thị Thu Thảo', sub: 'Hợp đồng 12 tháng', val: '15 ngày' },
                { label: 'Nguyễn Văn A', sub: 'Thử việc', val: '3 ngày' },
                { label: 'Lê Trần An', sub: 'Hợp đồng 12 tháng', val: '18 ngày' }
              ]} 
            />
            <ListCard title="Nhân viên OT nhiều" color="#f59e0b" 
              items={[
                { label: 'Lê Văn Hoàng', sub: 'Phòng Kỹ thuật', val: '42.5h' },
                { label: 'Phạm Minh Đức', sub: 'Phòng Dự án', val: '38.0h' },
                { label: 'Hoàng Bảo', sub: 'Phòng Kỹ thuật', val: '32.5h' }
              ]} 
            />
          </div>
        </div>
    </div>
  );
};

const ListCard = ({ title, items, color }) => (
  <div style={{ background: '#ffffff', border: '1px solid #eef2f6', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flex: 1 }}>
    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '4px', height: '16px', borderRadius: '10px', background: color }}></div>
      {title}
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>{item.label}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.sub}</div>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: color }}>{item.val || item.time}</div>
        </div>
      ))}
    </div>
  </div>
);

export default HRAnalytics;

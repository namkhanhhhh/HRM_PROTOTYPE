import React from 'react';
import { 
  Users, CheckCircle, Timer, Bell, 
  ArrowUpRight, ArrowDownRight, Trophy, AlertCircle, Building2,
  DollarSign, PieChart as PieChartIcon, TrendingUp, Clock, Calendar
} from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from 'recharts';
import PersonalDashboard from './PersonalDashboard';

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

const employeeSalaryData = [
  { month: 'Th1', nv: 100, salary: 1.2 },
  { month: 'Th2', nv: 110, salary: 1.3 },
  { month: 'Th3', nv: 124, salary: 1.5 },
  { month: 'Th4', nv: 125, salary: 1.55 },
  { month: 'Th5', nv: 130, salary: 1.6 },
  { month: 'Th6', nv: 140, salary: 1.8 }
];

const Dashboard = () => {
  const { role } = useRole();

  if (role === 'admin') {
    return (
      <div className="flex flex-col" style={{ gap: '2rem' }}>
        {/* Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <StatCard 
            icon={<Users />} label="Tổng nhân sự" value="124" 
            trend="+12%" trendType="up" subtext="Hợp đồng đang có hiệu lực" color="#3b82f6"
          />
          <StatCard 
            icon={<CheckCircle />} label="Chấm công hôm nay" value="118/124" 
            trend="95%" trendType="up" subtext="Tỷ lệ chuyên cần thực tế" color="#10b981"
          />
          <StatCard 
            icon={<Timer />} label="Tổng giờ OT" value="45.5h" 
            trend="+8%" trendType="up" subtext="Ghi nhận trong tháng này" color="#f59e0b"
          />
          <StatCard 
            icon={<AlertCircle />} label="Yêu cầu cần duyệt" value="16" 
            subtext="Gồm: Nghỉ phép, Chi phí, OT" color="#ef4444"
          />
        </div>

        {/* Chart Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '2rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid #eef2f6', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#1e293b' }}>Biến động nhân sự & Quỹ lương</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '400' }}>Biểu đồ tăng trưởng theo 6 tháng gần nhất</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div> Nhân viên</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa' }}></div> Lương cơ bản</span>
              </div>
            </div>
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={employeeSalaryData}>
                  <defs>
                    <linearGradient id="colorNv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
                  <Area type="monotone" dataKey="nv" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #eef2f6', borderRadius: '16px', padding: '1.5rem', flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.25rem' }}>Sắp tới & Sự kiện</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: <Calendar size={18} />, title: 'Review lương T7', date: '25/06', color: '#3b82f6' },
                  { icon: <Clock size={18} />, title: 'Họp Manager', date: 'Mùng 1', color: '#8b5cf6' },
                  { icon: <Users size={18} />, title: 'Team Building', date: '20/07', color: '#10b981' }
                ].map((ev, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '10px', borderRadius: '10px', background: '#f8fafc' }}>
                    <div style={{ color: ev.color }}>{ev.icon}</div>
                    <div style={{ flex: 1, fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>{ev.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ev.date}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', padding: '1.5rem', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Trophy size={18} color="#fbbf24" />
                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Top Performer tháng 06</span>
              </div>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: '1.5' }}>Ghi nhận <strong>Nguyễn Nam Khánh</strong> đạt thành tích vượt 120% KPI trong quý 2.</p>
            </div>
          </div>
        </div>

        {/* Bottom Lists Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <ListCard title="Thông báo mới nhất" color="#ef4444" 
            items={[
              { label: 'Quy định làm việc xa mới', sub: 'Cập nhật từ 01/07/2026', time: '2h ago' },
              { label: 'Thông báo đóng BHXH', sub: 'Kỳ tháng 05/2026', time: '5h ago' }
            ]} 
          />
          <ListCard title="Nhân viên OT nhiều" color="#f59e0b" 
            items={[
              { label: 'Lê Văn Hoàng', sub: 'Phòng Kỹ thuật', val: '42.5h' },
              { icon: 'time', label: 'Phạm Minh Đức', sub: 'Phòng Dự án', val: '38.0h' }
            ]} 
          />
          <ListCard title="Hợp đồng sắp hết hạn" color="#3b82f6" 
            items={[
              { label: 'Trần Thị Thu Thảo', sub: 'Hợp đồng 12 tháng', val: '15 ngày' },
              { label: 'Nguyễn Văn A', sub: 'Thử việc', val: '3 ngày' }
            ]} 
          />
        </div>
      </div>
    );
  }

  if (role === 'personal') {
    return <PersonalDashboard />;
  }

  return (
    <div style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #eef2f6' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Giao diện Cá nhân</h2>
      <p style={{ color: '#64748b', marginTop: '8px' }}>Dữ liệu cá nhân của bạn đang được đồng bộ hóa hệ thống.</p>
    </div>
  );
};

const ListCard = ({ title, items, color }) => (
  <div style={{ background: '#ffffff', border: '1px solid #eef2f6', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
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

export default Dashboard;

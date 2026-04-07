import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, Timer, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const depOTData = [
  { name: 'Kỹ thuật', hours: 120 },
  { name: 'Kinh doanh', hours: 45 },
  { name: 'Dự án', hours: 85 },
  { name: 'Nhân sự', hours: 12 },
  { name: 'Marketing', hours: 25 },
];

const otRequests = [
  { id: 'OT001', name: 'Nguyễn Văn A', dep: 'Kỹ thuật', date: '01/06/2026', reqHours: 2, actualHours: 2.5, status: 'pending' },
  { id: 'OT002', name: 'Lê Trần An', dep: 'Kỹ thuật', date: '02/06/2026', reqHours: 4, actualHours: 3.8, status: 'approved' },
  { id: 'OT003', name: 'Phạm Minh Đức', dep: 'Dự án', date: '03/06/2026', reqHours: 1.5, actualHours: 0, status: 'rejected' },
  { id: 'OT004', name: 'Hoàng Thị B', dep: 'Kinh doanh', date: '03/06/2026', reqHours: 2, actualHours: 2, status: 'pending' },
];

const AttendanceOT = () => {
  const [data, setData] = useState(otRequests);

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return { bg: '#ecfdf5', text: '#10b981', label: 'Đã duyệt' };
      case 'rejected': return { bg: '#fef2f2', text: '#ef4444', label: 'Từ chối' };
      default: return { bg: '#fffbeb', text: '#f59e0b', label: 'Chờ duyệt' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', minWidth: 0 }}>
      
      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#3b82f615', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Timer size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Tổng giờ OT (Tháng này)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>287 Giờ</div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f59e0b15', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Đơn chờ duyệt</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>12 Đơn</div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ec489915', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Cảnh báo lố giờ</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>3 Nhân sự</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        {/* Left Chart */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#0f172a', marginBottom: '1.5rem' }}>Phân bổ OT theo Phòng ban</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depOTData} layout="vertical" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Table */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#0f172a' }}>Đối chiếu Đơn xin OT & Thực tế</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" placeholder="Tìm nhân viên..." style={{ padding: '8px 16px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>
                <Filter size={16} /> Lọc
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto', padding: '0 1.5rem 1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px', fontWeight: '600' }}>Nhân viên</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Phòng ban</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Ngày OT</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Số giờ xin phép</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Thực tế check-in</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Đơn từ</th>
                  <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0', fontWeight: '600', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#0f172a' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{row.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.id}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#475569', fontSize: '0.9rem' }}>{row.dep}</td>
                    <td style={{ padding: '16px', color: '#475569', fontSize: '0.9rem' }}>{row.date}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '500', color: '#3b82f6' }}>{row.reqHours}h</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: row.actualHours > row.reqHours ? '#f59e0b' : '#10b981' }}>
                      {row.actualHours}h
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        background: getStatusColor(row.status).bg, 
                        color: getStatusColor(row.status).text, 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' 
                      }}>
                        {getStatusColor(row.status).label}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}>
                        Duyệt công
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AttendanceOT;

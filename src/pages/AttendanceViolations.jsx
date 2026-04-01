import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const violationTrends = [
  { day: '01/06', late: 5, early: 2 },
  { day: '02/06', late: 8, early: 3 },
  { day: '03/06', late: 3, early: 1 },
  { day: '04/06', late: 12, early: 5 },
  { day: '05/06', late: 4, early: 2 },
  { day: '06/06', late: 6, early: 4 },
  { day: '07/06', late: 2, early: 0 },
];

const offenders = [
  { id: 'NV045', name: 'Nguyễn Nam', dep: 'Marketing', lateCount: 5, earlyCount: 2, totalPenalty: '250,000đ', status: 'Cần giải trình' },
  { id: 'NV012', name: 'Trần Khoa', dep: 'Kỹ thuật', lateCount: 4, earlyCount: 0, totalPenalty: '200,000đ', status: 'Đã xử lý' },
  { id: 'NV088', name: 'Lê Thủy', dep: 'Kinh doanh', lateCount: 0, earlyCount: 3, totalPenalty: '150,000đ', status: 'Cần giải trình' },
];

const AttendanceViolations = () => {
  const [data, setData] = useState(offenders);

  return (
    <div className="flex flex-col gap-6">

      {/* Top Warning Area */}
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#991b1b' }}>
        <div style={{ marginTop: '0.2rem' }}>
          <AlertTriangle size={24} color="#ef4444" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '4px' }}>Cảnh báo vi phạm tăng cao</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Số lượng đi muộn ngày 04/06 vượt mốc 10 người. Đã gửi thông báo nhắc nhở tự động đến toàn thể nhân viên.</p>
        </div>
        <button style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', fontSize: '0.85rem', cursor: 'pointer' }}>
          Xem chi tiết ngày 04/06
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eef2f6' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#0f172a', marginBottom: '1.5rem' }}>Biến động Đi muộn & Về sớm (7 ngày qua)</h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={violationTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="late" name="Đi muộn" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="early" name="Về sớm" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List of Offenders */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#0f172a' }}>Danh sách Vi phạm (Tháng này)</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Đề xuất khấu trừ tự động vào bảng lương</p>
            </div>
          </div>
          <div style={{ overflowX: 'auto', padding: '0 1.5rem 1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Nhân viên</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Đi muộn</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Về sớm</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: '#ef4444' }}>Dự kiến Phạt</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'right' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px dashed #f1f5f9' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#0f172a' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{row.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.dep}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: row.lateCount > 0 ? '#ef4444' : '#cbd5e1' }}>{row.lateCount > 0 ? `${row.lateCount} lần` : '-'}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: row.earlyCount > 0 ? '#f59e0b' : '#cbd5e1' }}>{row.earlyCount > 0 ? `${row.earlyCount} lần` : '-'}</td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#ef4444' }}>{row.totalPenalty}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <span style={{ 
                        background: row.status === 'Đã xử lý' ? '#ecfdf5' : '#fffbeb', 
                        color: row.status === 'Đã xử lý' ? '#10b981' : '#f59e0b', 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' 
                      }}>
                        {row.status}
                      </span>
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

export default AttendanceViolations;

import React, { useState } from 'react';
import { Search, Filter, RefreshCw, CheckCircle, AlertTriangle, XCircle, ArrowRight, Download, Upload } from 'lucide-react';

const reconData = [
  { id: 'NV001', name: 'Nguyễn Văn A', dep: 'Kỹ thuật', expected: 22, actual: 21, leaves: 1, unexcused: 0, status: 'matched' },
  { id: 'NV002', name: 'Trần Thị B', dep: 'Marketing', expected: 22, actual: 20, leaves: 1, unexcused: 1, status: 'discrepancy' },
  { id: 'NV003', name: 'Lê Văn C', dep: 'Dự án', expected: 22, actual: 22, leaves: 0, unexcused: 0, status: 'matched' },
  { id: 'NV004', name: 'Phạm Thị D', dep: 'Kinh doanh', expected: 22, actual: 18, leaves: 2, unexcused: 2, status: 'discrepancy' },
  { id: 'NV005', name: 'Vũ Đức E', dep: 'Nhân sự', expected: 22, actual: 19, leaves: 3, unexcused: 0, status: 'matched' },
];

const AttendanceReconciliation = () => {
  const [data, setData] = useState(reconData);

  const getStatusColor = (status) => {
    switch(status) {
      case 'matched': return { bg: '#ecfdf5', text: '#10b981', label: 'Khớp dữ liệu', icon: <CheckCircle size={14} /> };
      case 'discrepancy': return { bg: '#fef2f2', text: '#ef4444', label: 'Có sai lệch', icon: <AlertTriangle size={14} /> };
      default: return { bg: '#f1f5f9', text: '#64748b', label: 'Chưa kiểm tra', icon: <XCircle size={14} /> };
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Top Warning Area */}
      <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '16px', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0f172a' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ padding: '12px', background: '#3b82f615', borderRadius: '12px', color: '#3b82f6' }}>
            <RefreshCw size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '4px' }}>Chốt Công Kì Lương Tháng 05/2026</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Hệ thống tự động đối chiếu số ngày đi làm thực tế từ máy chấm công, đơn xin nghỉ phép đã duyệt.</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
            <Download size={16} /> Tải báo cáo
          </button>
          <button style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px -2px #10b98160', transition: 'all 0.2s' }}>
            <Upload size={16} /> Chốt & Đồng bộ sang tính lương
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Table of Reconciliation */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#0f172a' }}>Bảng Đối chiếu Công - Phép</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" placeholder="Tìm nhân viên..." style={{ padding: '8px 16px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>
                <Filter size={16} /> Trạng thái
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto', padding: '0 1.5rem 1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px', fontWeight: '600' }}>Nhân viên</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Công chuẩn</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Thực tế check-in</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center', color: '#3b82f6' }}>Phép đã duyệt</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center', color: '#ef4444' }}>Vắng K.phép</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Tình trạng</th>
                  <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0', fontWeight: '600', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#0f172a' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{row.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.dep}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>{row.expected}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>{row.actual}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: row.leaves > 0 ? '#3b82f6' : '#cbd5e1' }}>{row.leaves > 0 ? `+${row.leaves}` : '-'}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: row.unexcused > 0 ? '#ef4444' : '#cbd5e1' }}>
                      {row.unexcused > 0 ? `-${row.unexcused}` : '-'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ 
                        background: getStatusColor(row.status).bg, 
                        color: getStatusColor(row.status).text, 
                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                        display: 'inline-flex', alignItems: 'center', gap: '6px'
                      }}>
                        {getStatusColor(row.status).icon}
                        {getStatusColor(row.status).label}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}>
                        Chi tiết <ArrowRight style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} size={16} />
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

export default AttendanceReconciliation;

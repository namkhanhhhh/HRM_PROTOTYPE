import React, { useState } from 'react';
import { 
  UserCircle, Save, Camera, Phone, Mail, MapPin, 
  Briefcase, Calendar, Award, GraduationCap, 
  Linkedin, Facebook, Globe, History
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'Nam Khánh',
    email: 'khanh.admin@tdsolution.vn',
    phone: '0987.654.321',
    dob: '1995-10-25',
    address: '123 Đường Cầu Giấy, Hà Nội',
    role: 'Quản trị viên Hệ thống',
    department: 'Ban Giám sát & Công nghệ',
    bio: 'Chuyên gia xây dựng hệ thống quản trị nhân sự với hơn 5 năm kinh nghiệm.',
    joinDate: '15/05/2021',
    status: 'Đang làm việc',
    social: { linkedin: '#', facebook: '#', website: '#' }
  });

  const [activeTab, setActiveTab] = useState('info'); // info, history

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* LEFT COLUMN: IDENTIFICATION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
              <img src="/tds_img.jpg" alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '30px', objectFit: 'cover', border: '5px solid #f8fafc' }} />
              <button style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#3b82f6', color: 'white', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>
                <Camera size={18} />
              </button>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>{profileData.fullName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
              <Briefcase size={16} /> {profileData.role}
            </div>
          </div>
          
          <div style={{ height: '1px', background: '#f1f5f9', margin: '1.5rem 0' }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={infoRowStyle}><Mail size={16} color="#94a3b8"/> <span>{profileData.email}</span></div>
            <div style={infoRowStyle}><Phone size={16} color="#94a3b8"/> <span>{profileData.phone}</span></div>
            <div style={infoRowStyle}><MapPin size={16} color="#94a3b8"/> <span>{profileData.address}</span></div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
            <button style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}><Linkedin size={18} color="#0077b5" /></button>
            <button style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}><Facebook size={18} color="#1877f2" /></button>
            <button style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}><Globe size={18} color="#10b981" /></button>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Kỹ năng chuyên môn</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1rem' }}>
            {['Management', 'ReactJS', 'HR Operations', 'Security', 'Database'].map(skill => (
              <span key={skill} style={{ padding: '6px 12px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', fontSize: '0.75rem', fontWeight: '700' }}>{skill}</span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: DETAILS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* TABS HEADER */}
        <div style={{ display: 'flex', gap: '1rem', padding: '4px', background: 'rgba(226, 232, 240, 0.4)', borderRadius: '14px', width: 'fit-content' }}>
          <button onClick={() => setActiveTab('info')} style={tabBtnStyle(activeTab === 'info')}>Chi tiết hồ sơ</button>
          <button onClick={() => setActiveTab('history')} style={tabBtnStyle(activeTab === 'history')}>Lịch sử thăng tiến</button>
        </div>

        {activeTab === 'info' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}><UserCircle size={20} color="#3b82f6" /> Thông tin công việc & Trình độ</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                <div style={fieldGroupStyle}>
                  <label>Phòng ban</label>
                  <div style={valueBoxStyle}>{profileData.department}</div>
                </div>
                <div style={fieldGroupStyle}>
                  <label>Ngày gia nhập</label>
                  <div style={valueBoxStyle}>{profileData.joinDate}</div>
                </div>
                <div style={fieldGroupStyle}>
                  <label>Trạng thái</label>
                  <div style={{ ...valueBoxStyle, color: '#10b981' }}>{profileData.status}</div>
                </div>
                <div style={fieldGroupStyle}>
                  <label>Địa điểm làm việc</label>
                  <div style={valueBoxStyle}>Trụ sở chính (Hà Nội)</div>
                </div>
              </div>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '2rem 0' }}></div>

              <h3 style={cardTitleStyle}><GraduationCap size={20} color="#3b82f6" /> Học vấn & Chứng chỉ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div style={academicRowStyle}>
                  <Calendar size={18} color="#94a3b8" />
                  <div>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>Đại học Bách Khoa Hà Nội</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Cử nhân Công nghệ thông tin (2013 - 2017)</div>
                  </div>
                </div>
                <div style={academicRowStyle}>
                  <Award size={18} color="#f59e0b" />
                  <div>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>Chứng chỉ Quản trị Nhân sự SHRM-CP</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Cấp bởi Hiệp hội Quản trị nhân sự Hoa Kỳ (2020)</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={cardTitleStyle}>Giới thiệu bản thân</h3>
                <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Chỉnh sửa</button>
              </div>
              <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '0.95rem' }}>{profileData.bio}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}><History size={20} color="#3b82f6" /> Nhật ký thay đổi vị trí</h3>
              <div style={{ position: 'relative', marginTop: '2rem', paddingLeft: '2rem' }}>
                <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0' }}></div>
                {[
                  { date: '01/01/2026', title: 'Thăng tiến: Quản trị viên Hệ thống', desc: 'Chuyển từ vị trí Engineer lên Quản trị viên điều hành dự án.' },
                  { date: '15/05/2021', title: 'Gia nhập TD Solutions', desc: 'Bắt đầu làm việc tại vị trí Senior Developer.' }
                ].map((item, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                    <div style={{ position: 'absolute', left: '-29px', top: '4px', width: '12px', height: '12px', background: i===0 ? '#3b82f6' : '#cbd5e1', borderRadius: '50%', border: '3px solid white' }}></div>
                    <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#3b82f6', marginBottom: '4px' }}>{item.date}</div>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{item.title}</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const cardStyle = { background: 'white', padding: '1.75rem', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' };
const cardTitleStyle = { fontSize: '1.1rem', fontWeight: '800', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' };
const infoRowStyle = { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#475569', fontWeight: '500' };
const tabBtnStyle = (active) => ({ 
  padding: '10px 24px', borderRadius: '12px', border: 'none', 
  background: active ? 'white' : 'transparent', color: active ? '#1e293b' : '#64748b', 
  fontWeight: active ? '800' : '600', fontSize: '0.9rem', cursor: 'pointer',
  boxShadow: active ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' 
});
const fieldGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const valueBoxStyle = { padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' };
const academicRowStyle = { display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', background: '#f8fafc', borderRadius: '16px' };

export default Profile;

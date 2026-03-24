import React, { useState } from 'react';
import { 
  Settings, Globe, Bell, Shield, Save, 
  Moon, Sun, Languages, Smartphone, Mail, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

const AccountSettings = () => {
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: true,
    smsNotif: false,
    darkMode: false,
    language: 'vi',
    twoFactor: true,
    autoLogout: '30m'
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '2.5rem', borderRadius: '30px', color: 'white' }}>
        <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}><Settings size={32} /></div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>Cài đặt hệ thống</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Quản lý tùy chọn cá nhân hóa, thông báo và trải nghiệm người dùng trên TD Solutions.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* LEFT COLUMN: MAIN SETTINGS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}><Globe size={20} color="#3b82f6" /> Giao diện & Ngôn ngữ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
              <SettingToggle 
                title="Chế độ Tối (Dark Mode)" 
                desc="Tối ưu giao diện cho môi trường làm việc ban đêm." 
                icon={settings.darkMode ? <Moon size={18}/> : <Sun size={18}/>}
                checked={settings.darkMode} 
                onChange={() => setSettings({...settings, darkMode: !settings.darkMode})} 
              />
              <div style={inlineFieldStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Languages size={18} color="#94a3b8" />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Ngôn ngữ hiển thị</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tiếng Việt (Mặc định)</div>
                  </div>
                </div>
                <select style={selectStyle} value={settings.language} onChange={e => setSettings({...settings, language: e.target.value})}>
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}><Bell size={20} color="#3b82f6" /> Cấu hình Thông báo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
              <SettingToggle title="Email" desc="Báo cáo lương & phê duyệt" icon={<Mail size={18}/>} checked={settings.emailNotif} onChange={() => setSettings({...settings, emailNotif: !settings.emailNotif})} />
              <SettingToggle title="Browser Push" desc="Thông báo trực tiếp màn hình" icon={<Smartphone size={18}/>} checked={settings.pushNotif} onChange={() => setSettings({...settings, pushNotif: !settings.pushNotif})} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SECURITY PREVIEW & SAVE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}><Shield size={20} color="#10b981" /> Bảo mật & Phiên làm việc</h3>
            <div style={{ padding: '1.25rem', background: '#f0fdf4', borderRadius: '16px', marginTop: '1.5rem', border: '1px solid #dcfce7' }}>
              <div style={{ color: '#166534', fontWeight: '800', fontSize: '0.9rem', marginBottom: '8px' }}>Trạng thái bảo vệ: CAO</div>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#166534', lineHeight: '1.8' }}>
                <li>Xác thực 2 bước: Đã bật</li>
                <li>Tự động đăng xuất: 30 phút</li>
                <li>Mật khẩu: Đã đổi 4 ngày trước</li>
              </ul>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <SettingToggle title="2FA" desc="Bảo mật qua Google Authenticator" icon={<Shield size={18}/>} checked={settings.twoFactor} onChange={() => setSettings({...settings, twoFactor: !settings.twoFactor})} />
            </div>
          </div>

          <div style={{ ...cardStyle, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.5rem' }}>
              <AlertTriangle size={24} color="#3b82f6" />
              <div style={{ fontWeight: '700', color: '#1e40af' }}>Lưu thay đổi cài đặt</div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.6', marginBottom: '1.5rem' }}>Cài đặt này sẽ được áp dụng ngay lập tức cho tài khoản của bạn trên tất cả các thiết bị đang đăng nhập.</p>
            <button style={primaryBtnStyle}><Save size={18} /> Lưu cấu hình ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({ title, desc, checked, onChange, icon }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{ color: '#94a3b8' }}>{icon}</div>
      <div>
        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem', marginBottom: '2px' }}>{title}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{desc}</div>
      </div>
    </div>
    <div onClick={onChange} style={{ width: '46px', height: '24px', background: checked ? '#10b981' : '#cbd5e1', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
      <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: checked ? '24px' : '2px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
    </div>
  </div>
);

const cardStyle = { background: 'white', padding: '1.75rem', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' };
const cardTitleStyle = { fontSize: '1.1rem', fontWeight: '800', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' };
const inlineFieldStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' };
const selectStyle = { padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '700', color: '#334155' };
const primaryBtnStyle = { 
  width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
  color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
};

export default AccountSettings;

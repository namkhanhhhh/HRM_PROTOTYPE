import React, { useState } from 'react';
import { 
  Key, ShieldCheck, Lock, AlertCircle, 
  CheckCircle2, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

const SecuritySettings = () => {
  const [form, setForm] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });
  const [showPass, setShowPass] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleVisibility = (field) => setShowPass({...showPass, [field]: !showPass[field]});

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      alert('Mật khẩu bảo mật đã được thay đổi thành công!');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
      
      {/* LEFT: FORM SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '14px', color: '#3b82f6' }}><Key size={24} /></div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>Đổi mật khẩu bảo mật</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Đảm bảo mật khẩu của bạn là duy nhất và an toàn.</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <PasswordField label="Mật khẩu hiện tại" value={form.current} onChange={e => setForm({...form, current: e.target.value})} show={showPass.current} onToggle={() => toggleVisibility('current')} />
            
            <div style={{ height: '1px', background: '#f1f5f9' }}></div>

            <PasswordField label="Mật khẩu mới" value={form.newPass} onChange={e => setForm({...form, newPass: e.target.value})} show={showPass.new} onToggle={() => toggleVisibility('new')} />
            <PasswordField label="Xác nhận mật khẩu mới" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} show={showPass.confirm} onToggle={() => toggleVisibility('confirm')} />

            <button type="submit" style={primaryBtnStyle}>
              {isUpdating ? <><RefreshCw size={18} className="animate-spin" /> Đang cập nhật...</> : <><Lock size={18} /> Cập nhật mật khẩu ngay</>}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: REQUIREMENTS & SESSION INFO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}><ShieldCheck size={20} color="#10b981" /> Quy tắc mật khẩu</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
            <RuleItem text="Ít nhất 8 ký tự độ dài" met={form.newPass.length >= 8} />
            <RuleItem text="Chứa ít nhất 1 chữ cái in hoa" met={/[A-Z]/.test(form.newPass)} />
            <RuleItem text="Chứa ít nhất 1 chữ cái thường" met={/[a-z]/.test(form.newPass)} />
            <RuleItem text="Chứa 1 số và 1 ký tự đặc biệt" met={/[0-9]/.test(form.newPass) && /[^a-zA-Z0-9]/.test(form.newPass)} />
          </div>
        </div>

        <div style={{ ...cardStyle, background: '#fefce8', border: '1px solid #fef08a' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1rem' }}>
            <AlertCircle size={20} color="#854d0e" />
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#854d0e' }}>Lưu ý bảo mật</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#713f12', lineHeight: '1.8' }}>
            Hệ thống sẽ yêu cầu bạn đăng nhập lại trên tất cả các thiết bị khác sau khi mật khẩu được thay đổi thành công.
          </p>
        </div>
      </div>

    </div>
  );
};

const PasswordField = ({ label, value, onChange, show, onToggle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#475569' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <input 
        type={show ? 'text' : 'password'} 
        value={value} 
        onChange={onChange}
        required
        style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', fontSize: '1rem', fontWeight: '700' }}
      />
      <button type="button" onClick={onToggle} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

const RuleItem = ({ text, met }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: met ? '#059669' : '#64748b', fontWeight: met ? '700' : '600' }}>
    {met ? <CheckCircle2 size={16} /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #cbd5e1' }}></div>}
    {text}
  </div>
);

const cardStyle = { background: 'white', padding: '1.75rem', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' };
const cardTitleStyle = { fontSize: '1.05rem', fontWeight: '800', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' };
const primaryBtnStyle = { 
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', borderRadius: '16px', border: 'none', 
  background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', transition: 'all 0.2s' 
};

export default SecuritySettings;

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus, Search, Edit2, Eye, X, Save, ArrowLeft,
  Users, Building2, ChevronDown, MoreVertical,
  FileText, Briefcase, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const EMPLOYEES = [
  { id: 'NV001', name: 'Nguyễn Nam Khánh', pos: 'Senior Fullstack Dev', dept: 'Kỹ thuật',    status: 'Đang làm', avatar: '/tds_img.jpg', email: 'khanh.nn@tdsolution.vn' },
  { id: 'NV004', name: 'Phạm Văn Đức',     pos: 'Junior Developer',    dept: 'Kỹ thuật',    status: 'Đang làm', avatar: '',            email: 'duc.pv@tdsolution.vn' },
  { id: 'NV005', name: 'Hoàng Linh Chi',   pos: 'UI/UX Designer',      dept: 'Kỹ thuật',    status: 'Thử việc', avatar: '',            email: 'chi.hl@tdsolution.vn' },
  { id: 'NV002', name: 'Trần Thị Mai',     pos: 'HR Manager',          dept: 'Nhân sự',     status: 'Đang làm', avatar: '',            email: 'mai.tt@tdsolution.vn' },
  { id: 'NV006', name: 'Lê Thị Hoa',      pos: 'HR Executive',        dept: 'Nhân sự',     status: 'Đang làm', avatar: '',            email: 'hoa.lt@tdsolution.vn' },
  { id: 'NV003', name: 'Lê Hoàng Tuấn',   pos: 'Business Development',dept: 'Kinh doanh',  status: 'Thử việc', avatar: '',            email: 'tuan.lh@tdsolution.vn' },
  { id: 'NV007', name: 'Ngô Quang Minh',  pos: 'Sales Executive',     dept: 'Kinh doanh',  status: 'Đang làm', avatar: '',            email: 'minh.nq@tdsolution.vn' },
  { id: 'NV008', name: 'Đỗ Thanh Hương',  pos: 'Content Creator',     dept: 'Marketing',   status: 'Đang làm', avatar: '',            email: 'huong.dt@tdsolution.vn' },
];

const initDepts = [
  { id: 'PB001', name: 'Kỹ thuật',   desc: 'Phòng phát triển sản phẩm và hạ tầng kỹ thuật',   color: '#6366f1' },
  { id: 'PB002', name: 'Nhân sự',    desc: 'Quản lý tuyển dụng, đào tạo và phúc lợi nhân viên', color: '#10b981' },
  { id: 'PB003', name: 'Kinh doanh', desc: 'Phát triển kinh doanh và quản lý khách hàng',       color: '#f59e0b' },
  { id: 'PB004', name: 'Marketing',  desc: 'Chiến lược thương hiệu và truyền thông số',          color: '#ec4899' },
];

const DEPT_COLORS = ['#6366f1','#10b981','#f59e0b','#ec4899','#0ea5e9','#8b5cf6','#ef4444','#14b8a6'];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const statusCfg = {
  'Đang làm':  { bg: '#ecfdf5', color: '#059669', dot: '#10b981' },
  'Thử việc':  { bg: '#eff6ff', color: '#3b82f6', dot: '#60a5fa' },
  'Nghỉ phép': { bg: '#fff7ed', color: '#f59e0b', dot: '#fbbf24' },
  'Nghỉ việc': { bg: '#fef2f2', color: '#ef4444', dot: '#f87171' },
};

const StatusBadge = ({ status }) => {
  const c = statusCfg[status] || { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:'0.75rem', fontWeight:'600', background:c.bg, color:c.color }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:c.dot }} />{status}
    </span>
  );
};

const MiniAvatar = ({ src, name, size = 34 }) => (
  <div style={{ width:size, height:size, borderRadius:9, overflow:'hidden', flexShrink:0, background:'linear-gradient(135deg,#e0e7ff,#dbeafe)', display:'flex', alignItems:'center', justifyContent:'center' }}>
    {src
      ? <img src={src} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
      : <span style={{ fontSize:size*0.38, fontWeight:'700', color:'#6366f1' }}>{name?.[0]||'?'}</span>}
  </div>
);

/* ─────────────────────────────────────────────
   DEPT COLOR ICON
───────────────────────────────────────────── */
const DeptIcon = ({ color, size = 42 }) => (
  <div style={{ width:size, height:size, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
    <Building2 size={size * 0.5} color={color} />
  </div>
);

/* ─────────────────────────────────────────────
   ACTION MENU
───────────────────────────────────────────── */
const ActionMenu = ({ onView, onEdit }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const Item = ({ icon, label, color, onClick }) => (
    <div onClick={() => { onClick(); setOpen(false); }}
      style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:8, cursor:'pointer', color, fontSize:'0.875rem', fontWeight:'500', transition:'background 0.12s' }}
      onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}
    >{icon} {label}</div>
  );

  return (
    <div ref={ref} style={{ position:'relative', display:'inline-flex', justifyContent:'center' }}>
      <button onClick={() => setOpen(!open)}
        style={{ background:open?'#f1f5f9':'transparent', border:'1px solid', borderColor:open?'#e2e8f0':'transparent', padding:'6px 8px', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', color:'#64748b', transition:'all 0.15s' }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.borderColor='#e2e8f0'; }}}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; }}}
      ><MoreVertical size={17} /></button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, scale:0.92, y:-4 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.92, y:-4 }} transition={{ duration:0.13 }}
            style={{ position:'absolute', top:'calc(100% + 6px)', right:0, width:180, background:'white', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', border:'1px solid #f1f5f9', zIndex:500, padding:6 }}>
            <Item icon={<Eye size={15}/>} label="Xem chi tiết" color="#6366f1" onClick={onView} />
            <Item icon={<Edit2 size={15}/>} label="Chỉnh sửa" color="#0ea5e9" onClick={onEdit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DETAIL DRAWER
───────────────────────────────────────────── */
const DetailDrawer = ({ dept, members, onClose, onEdit }) => {
  if (!dept) return null;
  return (
    <>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.3)', zIndex:200, backdropFilter:'blur(3px)' }} />
      <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
        transition={{ type:'spring', stiffness:340, damping:38 }}
        style={{ position:'fixed', top:0, right:0, bottom:0, width:520, background:'white', zIndex:201, boxShadow:'-12px 0 48px rgba(0,0,0,0.12)', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ padding:'1.25rem 1.75rem', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'white', zIndex:10 }}>
          <span style={{ fontWeight:'700', fontSize:'1.05rem', color:'#1e293b' }}>Chi tiết phòng ban</span>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            <button onClick={onEdit} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white', fontWeight:'600', fontSize:'0.875rem', cursor:'pointer' }}>
              <Edit2 size={15} /> Chỉnh sửa
            </button>
            <button onClick={onClose} style={{ border:'none', background:'#f1f5f9', padding:8, borderRadius:8, cursor:'pointer', display:'flex' }}><X size={18} color="#64748b" /></button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'1.5rem 1.75rem', flex:1, overflowY:'auto' }}>
          {/* Hero card */}
          <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', padding:'1.25rem', background:`linear-gradient(135deg, ${dept.color}10, ${dept.color}18)`, borderRadius:14, border:`1px solid ${dept.color}30`, marginBottom:'1.5rem' }}>
            <DeptIcon color={dept.color} size={56} />
            <div>
              <div style={{ fontWeight:'700', fontSize:'1.25rem', color:'#1e293b' }}>{dept.name}</div>
              <div style={{ fontSize:'0.875rem', color:'#64748b', marginTop:4, lineHeight:1.5 }}>{dept.desc}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:20, background:`${dept.color}18`, color:dept.color, fontSize:'0.8rem', fontWeight:'700' }}>
                  <Users size={13} /> {members.length} thành viên
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'1.5rem' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:3, padding:'1rem', background:'#f8fafc', borderRadius:10 }}>
              <span style={{ fontSize:'0.7rem', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Mã phòng ban</span>
              <span style={{ fontSize:'0.95rem', fontWeight:'600', color:'#1e293b' }}>{dept.id}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:3, padding:'1rem', background:'#f8fafc', borderRadius:10 }}>
              <span style={{ fontSize:'0.7rem', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Số lượng NV</span>
              <span style={{ fontSize:'0.95rem', fontWeight:'600', color:'#1e293b' }}>{members.length} người</span>
            </div>
          </div>

          {/* Members list */}
          <div style={{ fontWeight:'700', fontSize:'0.95rem', color:'#1e293b', marginBottom:'1rem', display:'flex', alignItems:'center', gap:8 }}>
            <Users size={16} color="#6366f1" /> Danh sách thành viên
          </div>

          {members.length === 0
            ? <div style={{ padding:'2rem', textAlign:'center', color:'#94a3b8', fontSize:'0.9rem', background:'#f8fafc', borderRadius:10 }}>Chưa có thành viên nào</div>
            : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
                {members.map(m => (
                  <div key={m.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'0.875rem 1rem', background:'#fafafa', borderRadius:12, border:'1px solid #f1f5f9', transition:'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background='#fafafa'}>
                    <MiniAvatar src={m.avatar || '/tds_img.jpg'} name={m.name} size={40} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:'600', color:'#1e293b', fontSize:'0.9rem' }}>{m.name}</div>
                      <div style={{ fontSize:'0.78rem', color:'#94a3b8', marginTop:1 }}>{m.pos} · {m.email}</div>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Footer */}
        <div style={{ padding:'1rem 1.75rem', borderTop:'1px solid #f1f5f9', background:'#fafafa', display:'flex', gap:'0.75rem' }}>
          <button onClick={onEdit} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:11, borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(99,102,241,0.25)' }}>
            <Edit2 size={16} /> Chỉnh sửa phòng ban
          </button>
          <button onClick={onClose} style={{ padding:'11px 20px', borderRadius:10, border:'1px solid #e2e8f0', background:'white', color:'#64748b', fontWeight:'600', cursor:'pointer' }}>Đóng</button>
        </div>
      </motion.div>
    </>
  );
};

/* ─────────────────────────────────────────────
   DEPT FORM (Add / Edit)
───────────────────────────────────────────── */
const DeptForm = ({ initial, onBack, onSave }) => {
  const isEdit = !!initial;
  const [formData, setFormData] = useState(initial || { id: '', name: '', desc: '', color: '#6366f1' });
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const inp = { padding:'10px 12px', borderRadius:9, border:'1.5px solid #e8edf4', fontSize:'0.9rem', outline:'none', width:'100%', background:'white', boxSizing:'border-box', transition:'border 0.2s' };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      style={{ background:'white', borderRadius:16, border:'1px solid #eef2f6', padding:'2rem', maxWidth:720, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <button onClick={onBack} style={{ padding:8, borderRadius:'50%', border:'none', background:'#f1f5f9', cursor:'pointer', display:'flex' }}><ArrowLeft size={20} color="#64748b" /></button>
          <h2 style={{ fontSize:'1.4rem', fontWeight:'700', color:'#1e293b' }}>{isEdit ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}</h2>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button onClick={onBack} style={{ padding:'10px 22px', borderRadius:10, border:'1px solid #e2e8f0', background:'white', fontWeight:'600', cursor:'pointer', color:'#475569' }}>Hủy</button>
          <button onClick={() => onSave(formData)}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(99,102,241,0.25)' }}>
            <Save size={17} /> Lưu thông tin
          </button>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
        {/* Preview */}
        <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', padding:'1.25rem', background:`${formData.color}10`, borderRadius:14, border:`1px solid ${formData.color}25` }}>
          <DeptIcon color={formData.color} size={52} />
          <div>
            <div style={{ fontWeight:'700', fontSize:'1.1rem', color:'#1e293b' }}>{formData.name || 'Tên phòng ban'}</div>
            <div style={{ fontSize:'0.85rem', color:'#64748b', marginTop:3 }}>{formData.desc || 'Mô tả phòng ban sẽ hiển thị ở đây'}</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <label style={{ fontSize:'0.82rem', fontWeight:'600', color:'#475569' }}>Mã phòng ban</label>
            <input value={formData.id} onChange={e => set('id', e.target.value)} placeholder="VD: PB005" style={inp} disabled={isEdit} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <label style={{ fontSize:'0.82rem', fontWeight:'600', color:'#475569' }}>Tên phòng ban <span style={{ color:'#ef4444' }}>*</span></label>
            <input value={formData.name} onChange={e => set('name', e.target.value)} placeholder="VD: Kỹ thuật" style={inp} />
          </div>
          <div style={{ gridColumn:'span 2', display:'flex', flexDirection:'column', gap:5 }}>
            <label style={{ fontSize:'0.82rem', fontWeight:'600', color:'#475569' }}>Mô tả</label>
            <textarea value={formData.desc} onChange={e => set('desc', e.target.value)} rows={3} placeholder="Mô tả ngắn về phòng ban..." style={{ ...inp, resize:'vertical', lineHeight:1.6 }} />
          </div>
          {/* Color picker */}
          <div style={{ gridColumn:'span 2', display:'flex', flexDirection:'column', gap:8 }}>
            <label style={{ fontSize:'0.82rem', fontWeight:'600', color:'#475569' }}>Màu sắc đại diện</label>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {DEPT_COLORS.map(c => (
                <button key={c} onClick={() => set('color', c)}
                  style={{ width:34, height:34, borderRadius:'50%', background:c, border:formData.color===c?`3px solid ${c}`:'3px solid transparent', outline:formData.color===c?`2px solid ${c}`:'none', outlineOffset:2, cursor:'pointer', transition:'all 0.15s', boxShadow:'0 2px 6px rgba(0,0,0,0.15)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const Departments = () => {
  const [depts, setDepts] = useState(initDepts);
  const [view, setView] = useState('list');       // 'list' | 'form'
  const [formInitial, setFormInitial] = useState(null);
  const [drawerDept, setDrawerDept] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getMembersOf = (deptName) => EMPLOYEES.filter(e => e.dept === deptName);

  const filtered = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return depts.filter(d => !t || d.name.toLowerCase().includes(t) || d.desc.toLowerCase().includes(t) || d.id.toLowerCase().includes(t));
  }, [depts, searchTerm]);

  const handleSave = (data) => {
    if (formInitial) {
      setDepts(prev => prev.map(d => d.id === data.id ? data : d));
    } else {
      setDepts(prev => [...prev, data]);
    }
    setView('list');
    setFormInitial(null);
  };

  if (view === 'form') {
    return <DeptForm initial={formInitial} onBack={() => { setView('list'); setFormInitial(null); }} onSave={handleSave} />;
  }

  return (
    <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

      {/* Top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ fontSize:'1.2rem', fontWeight:'700', color:'#1e293b' }}>
          Phòng ban <span style={{ fontSize:'0.875rem', color:'#94a3b8', fontWeight:'400' }}>({filtered.length} phòng ban)</span>
        </h2>
        <button onClick={() => { setFormInitial(null); setView('form'); }}
          style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white', fontWeight:'600', fontSize:'0.9rem', cursor:'pointer', boxShadow:'0 4px 14px rgba(99,102,241,0.3)' }}>
          <Plus size={18} /> Thêm phòng ban
        </button>
      </div>

      {/* Search bar */}
      <div style={{ background:'white', borderRadius:14, border:'1px solid #eef2f6', padding:'0.875rem 1.25rem', display:'flex', alignItems:'center', gap:'0.875rem', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ position:'relative', flex:1 }}>
          <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }} />
          <input type="text" placeholder="Tìm tên phòng ban, mô tả..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width:'100%', padding:'9px 12px 9px 36px', borderRadius:10, border:searchTerm?'1.5px solid #6366f1':'1.5px solid #e8edf4', fontSize:'0.875rem', outline:'none', background:searchTerm?'#eef2ff':'#fafbff', color:'#334155', boxSizing:'border-box', transition:'all 0.2s' }} />
        </div>
        {searchTerm && (
          <button onClick={() => setSearchTerm('')}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', borderRadius:9, border:'1px solid #fecaca', background:'#fff5f5', color:'#ef4444', fontWeight:'600', fontSize:'0.82rem', cursor:'pointer' }}>
            <X size={13} /> Xóa
          </button>
        )}
      </div>

      {/* Summary stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1rem' }}>
        {depts.map(d => {
          const count = getMembersOf(d.name).length;
          return (
            <div key={d.id}
              style={{ background:'white', borderRadius:12, border:`1px solid #eef2f6`, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:12, boxShadow:'0 1px 4px rgba(0,0,0,0.04)', cursor:'pointer', transition:'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 20px ${d.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'; }}
              onClick={() => setDrawerDept(d)}
            >
              <DeptIcon color={d.color} size={44} />
              <div>
                <div style={{ fontWeight:'700', color:'#1e293b', fontSize:'0.95rem' }}>{d.name}</div>
                <div style={{ fontSize:'0.8rem', color:'#94a3b8', marginTop:2 }}>{count} thành viên</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background:'white', borderRadius:14, border:'1px solid #eef2f6', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
          <thead style={{ background:'#f8fafc', borderBottom:'1px solid #eef2f6' }}>
            <tr>
              <th style={{ padding:'0.875rem 1rem', fontSize:'0.73rem', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em' }}>Phòng ban</th>
              <th style={{ padding:'0.875rem 1rem', fontSize:'0.73rem', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em' }}>Mã PB</th>
              <th style={{ padding:'0.875rem 1rem', fontSize:'0.73rem', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em', maxWidth:300 }}>Mô tả</th>
              <th style={{ padding:'0.875rem 1rem', fontSize:'0.73rem', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em', textAlign:'center' }}>Số thành viên</th>
              <th style={{ padding:'0.875rem 1rem', fontSize:'0.73rem', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em' }}>Thành viên</th>
              <th style={{ padding:'0.875rem 1rem', fontSize:'0.73rem', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em', textAlign:'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(dept => {
              const members = getMembersOf(dept.name);
              return (
                <tr key={dept.id} style={{ borderBottom:'1px solid #f8fafc', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#fbfcff'}
                  onMouseLeave={e => e.currentTarget.style.background='white'}>

                  {/* Dept name */}
                  <td style={{ padding:'0.875rem 1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <DeptIcon color={dept.color} size={40} />
                      <span style={{ fontWeight:'600', color:'#1e293b', fontSize:'0.9rem' }}>{dept.name}</span>
                    </div>
                  </td>

                  {/* Code */}
                  <td style={{ padding:'0.875rem 1rem', fontSize:'0.875rem', fontWeight:'600', color:'#6366f1' }}>{dept.id}</td>

                  {/* Desc */}
                  <td style={{ padding:'0.875rem 1rem', fontSize:'0.85rem', color:'#64748b', maxWidth:280 }}>
                    <span style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{dept.desc}</span>
                  </td>

                  {/* Count */}
                  <td style={{ padding:'0.875rem 1rem', textAlign:'center' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:20, background:`${dept.color}15`, color:dept.color, fontSize:'0.82rem', fontWeight:'700' }}>
                      <Users size={12} /> {members.length}
                    </span>
                  </td>

                  {/* Avatars preview */}
                  <td style={{ padding:'0.875rem 1rem' }}>
                    <div style={{ display:'flex', alignItems:'center' }}>
                      {members.slice(0, 4).map((m, i) => (
                        <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i }}>
                          <MiniAvatar src={m.avatar || '/tds_img.jpg'} name={m.name} size={30} />
                        </div>
                      ))}
                      {members.length > 4 && (
                        <div style={{ width:30, height:30, borderRadius:9, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:'700', color:'#64748b', marginLeft:-8 }}>
                          +{members.length - 4}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding:'0.875rem 1rem', textAlign:'center' }}>
                    <ActionMenu
                      onView={() => setDrawerDept(dept)}
                      onEdit={() => { setFormInitial(dept); setView('form'); }}
                    />
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={6} style={{ padding:'3rem', textAlign:'center', color:'#94a3b8', fontSize:'0.95rem' }}>Không tìm thấy phòng ban phù hợp</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {drawerDept && (
          <DetailDrawer
            key={drawerDept.id}
            dept={drawerDept}
            members={getMembersOf(drawerDept.name)}
            onClose={() => setDrawerDept(null)}
            onEdit={() => { setFormInitial(drawerDept); setDrawerDept(null); setView('form'); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Departments;

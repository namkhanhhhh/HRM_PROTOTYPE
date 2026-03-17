import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus, Search, Edit2, Eye, X, Save, ArrowLeft,
  Users, Briefcase, MoreVertical, ChevronRight,
  User, Building2, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   MOCK DATA – employees & positions
───────────────────────────────────────────── */
const EMPLOYEES = [
  { id:'NV001', name:'Nguyễn Nam Khánh', pos:'Senior Fullstack Dev', dept:'Kỹ thuật',  status:'Đang làm', avatar:'/tds_img.jpg', email:'khanh.nn@tdsolution.vn' },
  { id:'NV004', name:'Phạm Văn Đức',     pos:'Junior Developer',    dept:'Kỹ thuật',  status:'Đang làm', avatar:'',             email:'duc.pv@tdsolution.vn' },
  { id:'NV005', name:'Hoàng Linh Chi',   pos:'UI/UX Designer',      dept:'Kỹ thuật',  status:'Thử việc', avatar:'',             email:'chi.hl@tdsolution.vn' },
  { id:'NV002', name:'Trần Thị Mai',     pos:'HR Manager',          dept:'Nhân sự',   status:'Đang làm', avatar:'',             email:'mai.tt@tdsolution.vn' },
  { id:'NV006', name:'Lê Thị Hoa',      pos:'HR Executive',        dept:'Nhân sự',   status:'Đang làm', avatar:'',             email:'hoa.lt@tdsolution.vn' },
  { id:'NV003', name:'Lê Hoàng Tuấn',   pos:'Business Development',dept:'Kinh doanh',status:'Thử việc', avatar:'',             email:'tuan.lh@tdsolution.vn' },
  { id:'NV007', name:'Ngô Quang Minh',  pos:'Sales Executive',     dept:'Kinh doanh',status:'Đang làm', avatar:'',             email:'minh.nq@tdsolution.vn' },
  { id:'NV008', name:'Đỗ Thanh Hương',  pos:'Content Creator',     dept:'Marketing', status:'Đang làm', avatar:'',             email:'huong.dt@tdsolution.vn' },
];

const POS_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6'];

const initPositions = [
  { id:'CV001', name:'Senior Fullstack Dev', desc:'Phát triển và duy trì hệ thống phần mềm fullstack quy mô lớn', dept:'Kỹ thuật',   color:'#6366f1' },
  { id:'CV002', name:'Junior Developer',     desc:'Hỗ trợ phát triển tính năng và học hỏi trong môi trường kỹ thuật', dept:'Kỹ thuật', color:'#0ea5e9' },
  { id:'CV003', name:'UI/UX Designer',       desc:'Thiết kế giao diện người dùng và trải nghiệm sản phẩm',          dept:'Kỹ thuật',  color:'#ec4899' },
  { id:'CV004', name:'HR Manager',           desc:'Quản lý toàn bộ hoạt động nhân sự và phát triển tổ chức',         dept:'Nhân sự',   color:'#10b981' },
  { id:'CV005', name:'HR Executive',         desc:'Thực hiện các nghiệp vụ tuyển dụng, đào tạo và phúc lợi',         dept:'Nhân sự',   color:'#14b8a6' },
  { id:'CV006', name:'Business Development', desc:'Phát triển thị trường và tìm kiếm cơ hội hợp tác kinh doanh',    dept:'Kinh doanh',color:'#f59e0b' },
  { id:'CV007', name:'Sales Executive',      desc:'Triển khai các hoạt động bán hàng và chăm sóc khách hàng',        dept:'Kinh doanh',color:'#f59e0b' },
  { id:'CV008', name:'Content Creator',      desc:'Sản xuất nội dung sáng tạo cho các kênh truyền thông số',         dept:'Marketing', color:'#8b5cf6' },
];

/* ── STATUS ── */
const statusCfg = {
  'Đang làm':  { bg:'#ecfdf5', color:'#059669', dot:'#10b981' },
  'Thử việc':  { bg:'#eff6ff', color:'#3b82f6', dot:'#60a5fa' },
  'Nghỉ phép': { bg:'#fff7ed', color:'#f59e0b', dot:'#fbbf24' },
  'Nghỉ việc': { bg:'#fef2f2', color:'#ef4444', dot:'#f87171' },
};

const StatusBadge = ({ status }) => {
  const c = statusCfg[status] || { bg:'#f1f5f9', color:'#64748b', dot:'#94a3b8' };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:'0.75rem', fontWeight:'600', background:c.bg, color:c.color }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:c.dot }} />{status}
    </span>
  );
};

const MiniAvatar = ({ src, name, size=34 }) => (
  <div style={{ width:size, height:size, borderRadius:9, overflow:'hidden', flexShrink:0, background:'linear-gradient(135deg,#e0e7ff,#dbeafe)', display:'flex', alignItems:'center', justifyContent:'center' }}>
    {src
      ? <img src={src} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
      : <span style={{ fontSize:size*0.38, fontWeight:'700', color:'#6366f1' }}>{name?.[0]||'?'}</span>}
  </div>
);

const PosIcon = ({ color, size=40 }) => (
  <div style={{ width:size, height:size, borderRadius:11, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
    <Briefcase size={size*0.48} color={color} />
  </div>
);

/* ── ACTION MENU ── */
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
        onMouseEnter={e => { if(!open){e.currentTarget.style.background='#f8fafc';e.currentTarget.style.borderColor='#e2e8f0';}}}
        onMouseLeave={e => { if(!open){e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='transparent';}}}
      ><MoreVertical size={17}/></button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,scale:0.92,y:-4}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.92,y:-4}} transition={{duration:0.13}}
            style={{ position:'absolute', top:'calc(100% + 6px)', right:0, width:180, background:'white', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', border:'1px solid #f1f5f9', zIndex:500, padding:6 }}>
            <Item icon={<Eye size={15}/>} label="Xem chi tiết" color="#6366f1" onClick={onView}/>
            <Item icon={<Edit2 size={15}/>} label="Chỉnh sửa" color="#0ea5e9" onClick={onEdit}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── DETAIL DRAWER ── */
const DetailDrawer = ({ pos, holders, onClose, onEdit }) => {
  if (!pos) return null;
  return (
    <>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.3)', zIndex:200, backdropFilter:'blur(3px)' }}/>
      <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}}
        transition={{type:'spring',stiffness:340,damping:38}}
        style={{ position:'fixed', top:0, right:0, bottom:0, width:500, background:'white', zIndex:201, boxShadow:'-12px 0 48px rgba(0,0,0,0.12)', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ padding:'1.25rem 1.75rem', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'white', zIndex:10 }}>
          <span style={{ fontWeight:'700', fontSize:'1.05rem', color:'#1e293b' }}>Chi tiết chức vụ</span>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            <button onClick={onEdit} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white', fontWeight:'600', fontSize:'0.875rem', cursor:'pointer' }}>
              <Edit2 size={15}/> Chỉnh sửa
            </button>
            <button onClick={onClose} style={{ border:'none', background:'#f1f5f9', padding:8, borderRadius:8, cursor:'pointer', display:'flex' }}><X size={18} color="#64748b"/></button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'1.5rem 1.75rem', flex:1, overflowY:'auto' }}>

          {/* Hero */}
          <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', padding:'1.25rem', background:`linear-gradient(135deg,${pos.color}10,${pos.color}1e)`, borderRadius:14, border:`1px solid ${pos.color}30`, marginBottom:'1.5rem' }}>
            <PosIcon color={pos.color} size={56}/>
            <div>
              <div style={{ fontWeight:'700', fontSize:'1.2rem', color:'#1e293b' }}>{pos.name}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
                <Building2 size={13} color="#94a3b8"/>
                <span style={{ fontSize:'0.82rem', color:'#64748b' }}>{pos.dept}</span>
              </div>
              <div style={{ fontSize:'0.875rem', color:'#475569', marginTop:6, lineHeight:1.55 }}>{pos.desc}</div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
            {[
              { label:'Mã chức vụ', value:pos.id },
              { label:'Phòng ban',   value:pos.dept },
              { label:'Số người đảm nhiệm', value:`${holders.length} người` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display:'flex', flexDirection:'column', gap:3, padding:'0.875rem 1rem', background:'#f8fafc', borderRadius:10 }}>
                <span style={{ fontSize:'0.7rem', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</span>
                <span style={{ fontSize:'0.92rem', fontWeight:'600', color:'#1e293b' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Holders list */}
          <div style={{ fontWeight:'700', fontSize:'0.95rem', color:'#1e293b', marginBottom:'1rem', display:'flex', alignItems:'center', gap:8 }}>
            <Users size={16} color="#6366f1"/> Nhân viên đảm nhiệm
          </div>

          {holders.length === 0
            ? <div style={{ padding:'2rem', textAlign:'center', color:'#94a3b8', fontSize:'0.9rem', background:'#f8fafc', borderRadius:10 }}>Chưa có nhân viên nào đảm nhiệm chức vụ này</div>
            : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
                {holders.map((emp, i) => (
                  <div key={emp.id}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'0.875rem 1rem', background:'#fafafa', borderRadius:12, border:'1px solid #f1f5f9', transition:'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background='#fafafa'}>
                    {/* Number */}
                    <span style={{ fontSize:'0.75rem', fontWeight:'700', color:`${pos.color}`, width:22, textAlign:'center', flexShrink:0 }}>{i+1}.</span>
                    <MiniAvatar src={emp.avatar || '/tds_img.jpg'} name={emp.name} size={38}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:'600', color:'#1e293b', fontSize:'0.9rem' }}>{emp.name}</div>
                      <div style={{ fontSize:'0.78rem', color:'#94a3b8', marginTop:1 }}>
                        {emp.id} · {emp.dept} · {emp.email}
                      </div>
                    </div>
                    <StatusBadge status={emp.status}/>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Footer */}
        <div style={{ padding:'1rem 1.75rem', borderTop:'1px solid #f1f5f9', background:'#fafafa', display:'flex', gap:'0.75rem' }}>
          <button onClick={onEdit} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:11, borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(99,102,241,0.25)' }}>
            <Edit2 size={16}/> Chỉnh sửa chức vụ
          </button>
          <button onClick={onClose} style={{ padding:'11px 20px', borderRadius:10, border:'1px solid #e2e8f0', background:'white', color:'#64748b', fontWeight:'600', cursor:'pointer' }}>Đóng</button>
        </div>
      </motion.div>
    </>
  );
};

/* ── POSITION FORM ── */
const PositionForm = ({ initial, onBack, onSave }) => {
  const isEdit = !!initial;
  const [formData, setFormData] = useState(initial || { id:'', name:'', desc:'', dept:'Kỹ thuật', color:'#6366f1' });
  const set = (k, v) => setFormData(p => ({ ...p, [k]:v }));

  const inp = { padding:'10px 12px', borderRadius:9, border:'1.5px solid #e8edf4', fontSize:'0.9rem', outline:'none', width:'100%', background:'white', boxSizing:'border-box' };
  const FG = ({ label, req, children }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={{ fontSize:'0.82rem', fontWeight:'600', color:'#475569' }}>{label}{req && <span style={{ color:'#ef4444' }}> *</span>}</label>
      {children}
    </div>
  );

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      style={{ background:'white', borderRadius:16, border:'1px solid #eef2f6', padding:'2rem', maxWidth:700, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <button onClick={onBack} style={{ padding:8, borderRadius:'50%', border:'none', background:'#f1f5f9', cursor:'pointer', display:'flex' }}><ArrowLeft size={20} color="#64748b"/></button>
          <h2 style={{ fontSize:'1.4rem', fontWeight:'700', color:'#1e293b' }}>{isEdit?'Chỉnh sửa chức vụ':'Thêm chức vụ mới'}</h2>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button onClick={onBack} style={{ padding:'10px 22px', borderRadius:10, border:'1px solid #e2e8f0', background:'white', fontWeight:'600', cursor:'pointer', color:'#475569' }}>Hủy</button>
          <button onClick={() => onSave(formData)}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(99,102,241,0.25)' }}>
            <Save size={17}/> Lưu
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', padding:'1.25rem', background:`${formData.color}10`, borderRadius:14, border:`1px solid ${formData.color}25`, marginBottom:'2rem' }}>
        <PosIcon color={formData.color} size={52}/>
        <div>
          <div style={{ fontWeight:'700', fontSize:'1.1rem', color:'#1e293b' }}>{formData.name||'Tên chức vụ'}</div>
          <div style={{ fontSize:'0.82rem', color:'#64748b', marginTop:3 }}>{formData.dept}</div>
          <div style={{ fontSize:'0.85rem', color:'#475569', marginTop:4, lineHeight:1.5 }}>{formData.desc||'Mô tả chức vụ...'}</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        <FG label="Mã chức vụ">
          <input value={formData.id} onChange={e=>set('id',e.target.value)} placeholder="VD: CV009" style={inp} disabled={isEdit}/>
        </FG>
        <FG label="Tên chức vụ" req>
          <input value={formData.name} onChange={e=>set('name',e.target.value)} placeholder="VD: Senior Developer" style={inp}/>
        </FG>
        <FG label="Phòng ban">
          <select value={formData.dept} onChange={e=>set('dept',e.target.value)} style={inp}>
            <option>Kỹ thuật</option><option>Nhân sự</option><option>Kinh doanh</option><option>Marketing</option>
          </select>
        </FG>
        <div/>
        <div style={{ gridColumn:'span 2' }}>
          <FG label="Mô tả chức vụ">
            <textarea value={formData.desc} onChange={e=>set('desc',e.target.value)} rows={3} placeholder="Mô tả ngắn về vai trò và trách nhiệm..." style={{ ...inp, resize:'vertical', lineHeight:1.6 }}/>
          </FG>
        </div>
        {/* Color */}
        <div style={{ gridColumn:'span 2', display:'flex', flexDirection:'column', gap:8 }}>
          <label style={{ fontSize:'0.82rem', fontWeight:'600', color:'#475569' }}>Màu sắc đại diện</label>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {POS_COLORS.map(c => (
              <button key={c} onClick={()=>set('color',c)}
                style={{ width:32, height:32, borderRadius:'50%', background:c, border:formData.color===c?`3px solid ${c}`:'3px solid transparent', outline:formData.color===c?`2px solid ${c}`:'none', outlineOffset:2, cursor:'pointer', transition:'all 0.15s', boxShadow:'0 2px 6px rgba(0,0,0,0.15)' }}/>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
const Positions = () => {
  const [positions, setPositions] = useState(initPositions);
  const [view, setView]           = useState('list');
  const [formInitial, setFormInitial] = useState(null);
  const [drawerPos, setDrawerPos] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getHolders = (posName) => EMPLOYEES.filter(e => e.pos === posName);

  const filtered = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return positions.filter(p =>
      !t || p.name.toLowerCase().includes(t) || p.desc.toLowerCase().includes(t) || p.dept.toLowerCase().includes(t) || p.id.toLowerCase().includes(t)
    );
  }, [positions, searchTerm]);

  const handleSave = (data) => {
    if (formInitial) setPositions(prev => prev.map(p => p.id===data.id ? data : p));
    else setPositions(prev => [...prev, data]);
    setView('list'); setFormInitial(null);
  };

  if (view === 'form') {
    return <PositionForm initial={formInitial} onBack={()=>{ setView('list'); setFormInitial(null); }} onSave={handleSave}/>;
  }

  return (
    <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

      {/* Top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ fontSize:'1.2rem', fontWeight:'700', color:'#1e293b' }}>
          Chức vụ <span style={{ fontSize:'0.875rem', color:'#94a3b8', fontWeight:'400' }}>({filtered.length} chức vụ)</span>
        </h2>
        <button onClick={()=>{ setFormInitial(null); setView('form'); }}
          style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white', fontWeight:'600', fontSize:'0.9rem', cursor:'pointer', boxShadow:'0 4px 14px rgba(99,102,241,0.3)' }}>
          <Plus size={18}/> Thêm chức vụ
        </button>
      </div>

      {/* Search */}
      <div style={{ background:'white', borderRadius:14, border:'1px solid #eef2f6', padding:'0.875rem 1.25rem', display:'flex', alignItems:'center', gap:'0.875rem', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ position:'relative', flex:1 }}>
          <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
          <input type="text" placeholder="Tìm theo tên, mô tả, phòng ban..."
            value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
            style={{ width:'100%', padding:'9px 12px 9px 36px', borderRadius:10, border:searchTerm?'1.5px solid #6366f1':'1.5px solid #e8edf4', fontSize:'0.875rem', outline:'none', background:searchTerm?'#eef2ff':'#fafbff', color:'#334155', boxSizing:'border-box', transition:'all 0.2s' }}/>
        </div>
        {searchTerm && (
          <button onClick={()=>setSearchTerm('')}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', borderRadius:9, border:'1px solid #fecaca', background:'#fff5f5', color:'#ef4444', fontWeight:'600', fontSize:'0.82rem', cursor:'pointer' }}>
            <X size={13}/> Xóa
          </button>
        )}
      </div>

      {/* Summary stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(195px,1fr))', gap:'1rem' }}>
        {positions.map(p => {
          const cnt = getHolders(p.name).length;
          return (
            <div key={p.id}
              style={{ background:'white', borderRadius:12, border:'1px solid #eef2f6', padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:12, cursor:'pointer', transition:'transform 0.15s, box-shadow 0.15s', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 20px ${p.color}20`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'; }}
              onClick={()=>setDrawerPos(p)}
            >
              <PosIcon color={p.color} size={42}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:'700', color:'#1e293b', fontSize:'0.88rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize:'0.76rem', color:'#94a3b8', marginTop:2 }}>{p.dept}</div>
                <div style={{ fontSize:'0.76rem', color:p.color, fontWeight:'700', marginTop:3 }}>{cnt} nhân viên</div>
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
              <th style={thStyle}>Chức vụ</th>
              <th style={thStyle}>Mã CV</th>
              <th style={thStyle}>Phòng ban</th>
              <th style={thStyle}>Mô tả</th>
              <th style={{ ...thStyle, textAlign:'center' }}>Số NV</th>
              <th style={thStyle}>Nhân viên đảm nhiệm</th>
              <th style={{ ...thStyle, textAlign:'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(pos => {
              const holders = getHolders(pos.name);
              return (
                <tr key={pos.id} style={{ borderBottom:'1px solid #f8fafc', transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#fbfcff'}
                  onMouseLeave={e=>e.currentTarget.style.background='white'}>

                  <td style={{ padding:'0.875rem 1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <PosIcon color={pos.color} size={38}/>
                      <span style={{ fontWeight:'600', color:'#1e293b', fontSize:'0.9rem' }}>{pos.name}</span>
                    </div>
                  </td>

                  <td style={{ padding:'0.875rem 1rem', fontSize:'0.875rem', fontWeight:'600', color:'#6366f1' }}>{pos.id}</td>

                  <td style={{ padding:'0.875rem 1rem' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20, background:'#f1f5f9', color:'#475569', fontSize:'0.8rem', fontWeight:'600' }}>
                      <Building2 size={11}/> {pos.dept}
                    </span>
                  </td>

                  <td style={{ padding:'0.875rem 1rem', fontSize:'0.85rem', color:'#64748b', maxWidth:260 }}>
                    <span style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{pos.desc}</span>
                  </td>

                  <td style={{ padding:'0.875rem 1rem', textAlign:'center' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:20, background:`${pos.color}15`, color:pos.color, fontSize:'0.82rem', fontWeight:'700' }}>
                      <User size={11}/> {holders.length}
                    </span>
                  </td>

                  {/* Holders bullet list preview */}
                  <td style={{ padding:'0.875rem 1rem' }}>
                    {holders.length === 0
                      ? <span style={{ fontSize:'0.8rem', color:'#cbd5e1' }}>—</span>
                      : (
                        <ul style={{ margin:0, padding:'0 0 0 14px', display:'flex', flexDirection:'column', gap:3 }}>
                          {holders.slice(0,3).map(h => (
                            <li key={h.id} style={{ fontSize:'0.82rem', color:'#475569', fontWeight:'500' }}>{h.name}</li>
                          ))}
                          {holders.length > 3 && (
                            <li style={{ fontSize:'0.8rem', color:'#94a3b8', listStyle:'none' }}>+{holders.length-3} người khác</li>
                          )}
                        </ul>
                      )
                    }
                  </td>

                  <td style={{ padding:'0.875rem 1rem', textAlign:'center' }}>
                    <ActionMenu
                      onView={()=>setDrawerPos(pos)}
                      onEdit={()=>{ setFormInitial(pos); setView('form'); }}
                    />
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={7} style={{ padding:'3rem', textAlign:'center', color:'#94a3b8', fontSize:'0.95rem' }}>Không tìm thấy chức vụ phù hợp</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {drawerPos && (
          <DetailDrawer key={drawerPos.id}
            pos={drawerPos}
            holders={getHolders(drawerPos.name)}
            onClose={()=>setDrawerPos(null)}
            onEdit={()=>{ setFormInitial(drawerPos); setDrawerPos(null); setView('form'); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const thStyle = { padding:'0.875rem 1rem', fontSize:'0.73rem', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em' };

export default Positions;

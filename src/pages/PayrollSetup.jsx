import React, { useState } from 'react';
import {
  Banknote, Percent, Calculator, Briefcase,
  ShieldCheck, UserPlus, Save, RotateCcw,
  ChevronRight, Info, Plus, Trash2,
  TrendingUp, Scaling, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PayrollSetup = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  // --- STATE ---
  const [salaryConfig, setSalaryConfig] = useState({
    baseSalary: 2340000,
    probationRate: 85,
    maxInsuranceSalary: 46800000,
    standardWorkDays: 22,
    standardWorkHours: 8
  });

  const [allowanceConfig, setAllowanceConfig] = useState({
    lunch: 700000,
    gasoline: 500000,
    phone: 500000
  });

  const [customConfigs, setCustomConfigs] = useState([
    { id: 1, label: 'Phụ cấp thâm niên', value: 1000000, unit: 'VNĐ' },
  ]);

  const [modalData, setModalData] = useState({ label: '', value: 0, unit: 'VNĐ' });

  const [otRates, setOtRates] = useState({
    normal: 150,
    weekend: 200,
    holiday: 300,
    nightNormal: 200,
    nightWeekend: 270,
    nightHoliday: 390
  });

  const [insuranceRates, setInsuranceRates] = useState({
    company: { bhxh: 17.5, bhyt: 3, bhtn: 1 },
    employee: { bhxh: 8, bhyt: 1.5, bhtn: 1 }
  });

  const [pitConfig, setPitConfig] = useState({
    nonResident: 20,
    shortTermResident: 10,
    personalDeduction: 15500000,
    dependentDeduction: 6200000,
    progressiveTable: [
      { level: 1, limit: 10000000, rate: 5 },
      { level: 2, limit: 30000000, rate: 10 },
      { level: 3, limit: 60000000, rate: 20 },
      { level: 4, limit: 100000000, rate: 30 },
      { level: 5, limit: Infinity, rate: 35 }
    ]
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val).replace('₫', 'đ');
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Đã cập nhật thiết lập lương toàn hệ thống!');
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const openModal = (config = null) => {
    if (config) {
      setEditingConfig(config);
      setModalData({ label: config.label, value: config.value, unit: config.unit });
    } else {
      setEditingConfig(null);
      setModalData({ label: '', value: 0, unit: 'VNĐ' });
    }
    setShowModal(true);
  };

  const saveModalData = () => {
    if (editingConfig) {
      setCustomConfigs(customConfigs.map(c => c.id === editingConfig.id ? { ...c, ...modalData } : c));
    } else {
      setCustomConfigs([...customConfigs, { id: Date.now(), ...modalData }]);
    }
    setShowModal(false);
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục thiết lập về mặc định?')) {
      window.location.reload();
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <AnimatePresence>
        {showModal && (
          <div style={modalOverlayStyle}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={modalContentStyle}
            >
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
                {editingConfig ? 'Chỉnh sửa khoản phí' : 'Thêm tùy chỉnh mới'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Tên khoản phí</label>
                  <input
                    type="text"
                    value={modalData.label}
                    onChange={(e) => setModalData({ ...modalData, label: e.target.value })}
                    placeholder="Ví dụ: Phụ cấp trang phục"
                    style={modalInputStyle}
                  />
                </div>
                <InputGroup
                  label="Số tiền"
                  value={modalData.value}
                  onChange={(v) => setModalData({ ...modalData, value: v })}
                  unit={modalData.unit}
                />
                <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{ ...secondaryBtnStyle, flex: 1, justifyContent: 'center' }}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={saveModalData}
                    style={{ ...primaryBtnStyle, flex: 1, justifyContent: 'center' }}
                  >
                    Lưu lại
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- HEADER ACTIONS --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {['general', 'ot', 'insurance', 'tax'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s',
                background: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? '#6366f1' : '#94a3b8',
                boxShadow: activeTab === tab ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
                border: activeTab === tab ? '1px solid #e2e8f0' : '1px solid transparent'
              }}
            >
              {tab === 'general' && 'Lương & Công'}
              {tab === 'ot' && 'Tăng ca (OT)'}
              {tab === 'insurance' && 'Bảo hiểm'}
              {tab === 'tax' && 'Thuế TNCN'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleReset} style={secondaryBtnStyle}><RotateCcw size={18} /> Khôi phục mặc định</button>
          <button
            onClick={handleSave}
            style={{ ...primaryBtnStyle, opacity: isSaving ? 0.7 : 1, pointerEvents: isSaving ? 'none' : 'auto' }}
          >
            {isSaving ? 'Đang lưu...' : <><Save size={18} /> Áp dụng thay đổi</>}
          </button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={activeTab}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}
      >
        {/* --- LEFT SIDE: CONFIG CARDS --- */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {activeTab === 'general' && (
            <motion.div variants={cardVariants} className="card" style={{ padding: '2rem' }}>
              <div style={sectionHeaderStyle}>
                <div style={iconBoxStyle('#eff6ff', '#3b82f6')}><Briefcase size={20} /></div>
                <div>
                  <h3 style={sectionTitleStyle}>Quy định Lương & Ngày công</h3>
                  <p style={sectionDescStyle}>Thiết lập các chỉ số cơ bản áp dụng cho toàn bộ nhân viên.</p>
                </div>
              </div>

              <div style={gridInputStyle}>
                <InputGroup
                  label="Lương Cơ sở (Min)"
                  value={salaryConfig.baseSalary}
                  onChange={(v) => setSalaryConfig({ ...salaryConfig, baseSalary: v })}
                  unit="VNĐ"
                />
                <InputGroup
                  label="Tỷ lệ lương Thử việc"
                  value={salaryConfig.probationRate}
                  onChange={(v) => setSalaryConfig({ ...salaryConfig, probationRate: v })}
                  unit="%"
                />
                <InputGroup
                  label="Max lương đóng BHXH/BHTN"
                  value={salaryConfig.maxInsuranceSalary}
                  onChange={(v) => setSalaryConfig({ ...salaryConfig, maxInsuranceSalary: v })}
                  unit="VNĐ"
                />
                <InputGroup
                  label="Ngày công chuẩn tháng"
                  value={salaryConfig.standardWorkDays}
                  onChange={(v) => setSalaryConfig({ ...salaryConfig, standardWorkDays: v })}
                  unit="ngày"
                />
                <InputGroup
                  label="Giờ làm việc trong ngày"
                  value={salaryConfig.standardWorkHours}
                  onChange={(v) => setSalaryConfig({ ...salaryConfig, standardWorkHours: v })}
                  unit="giờ"
                />
              </div>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '2rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={subHeadingStyle}>Các khoản Phụ cấp chính</h4>
              </div>
              <div style={gridInputStyle}>
                <InputGroup
                  label="Phụ cấp ăn trưa"
                  value={allowanceConfig.lunch}
                  onChange={(v) => setAllowanceConfig({ ...allowanceConfig, lunch: v })}
                  unit="VNĐ"
                />
                <InputGroup
                  label="Phụ cấp xăng xe"
                  value={allowanceConfig.gasoline}
                  onChange={(v) => setAllowanceConfig({ ...allowanceConfig, gasoline: v })}
                  unit="VNĐ"
                />
                <div style={{ gridColumn: 'span 2' }}>
                  <InputGroup
                    label="Phụ cấp điện thoại"
                    value={allowanceConfig.phone}
                    onChange={(v) => setAllowanceConfig({ ...allowanceConfig, phone: v })}
                    unit="VNĐ"
                  />
                </div>
              </div>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '2rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={subHeadingStyle}>Các chỉ số tùy chỉnh thêm</h4>
                <button
                  onClick={() => openModal()}
                  style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={16} /> Thêm tùy chỉnh
                </button>
              </div>

              <div style={gridInputStyle}>
                {customConfigs.map((cfg) => (
                  <div key={cfg.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div onClick={() => openModal(cfg)} style={{ cursor: 'pointer' }}>
                      <InputGroup
                        label={cfg.label}
                        value={cfg.value}
                        unit={cfg.unit}
                        readOnly={true}
                      />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCustomConfigs(customConfigs.filter(c => c.id !== cfg.id)); }}
                      style={{ position: 'absolute', top: 0, right: 0, color: '#94a3b8', padding: '5px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ot' && (
            <motion.div variants={cardVariants} className="card" style={{ padding: '2rem' }}>
              <div style={sectionHeaderStyle}>
                <div style={iconBoxStyle('#f0f9ff', '#0ea5e9')}><Calculator size={20} /></div>
                <div>
                  <h3 style={sectionTitleStyle}>Hệ số lương làm thêm giờ (OT)</h3>
                  <p style={sectionDescStyle}>Xác định tỷ lệ trả lương cho các khoảng thời gian tăng ca khác nhau.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '1.5rem' }}>
                <div>
                  <h4 style={subHeadingStyle}>Làm thêm Ban ngày</h4>
                  <div style={stackInputStyle}>
                    <InputGroup label="Ngày thường" value={otRates.normal} onChange={(v) => setOtRates({ ...otRates, normal: v })} unit="%" />
                    <InputGroup label="Cuối tuần (T7, CN)" value={otRates.weekend} onChange={(v) => setOtRates({ ...otRates, weekend: v })} unit="%" />
                    <InputGroup label="Ngày Lễ, Tết" value={otRates.holiday} onChange={(v) => setOtRates({ ...otRates, holiday: v })} unit="%" />
                  </div>
                </div>
                <div>
                  <h4 style={subHeadingStyle}>Làm thêm Ban đêm</h4>
                  <div style={stackInputStyle}>
                    <InputGroup label="Đêm ngày thường" value={otRates.nightNormal} onChange={(v) => setOtRates({ ...otRates, nightNormal: v })} unit="%" />
                    <InputGroup label="Đêm cuối tuần" value={otRates.nightWeekend} onChange={(v) => setOtRates({ ...otRates, nightWeekend: v })} unit="%" />
                    <InputGroup label="Đêm Lễ, Tết" value={otRates.nightHoliday} onChange={(v) => setOtRates({ ...otRates, nightHoliday: v })} unit="%" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'insurance' && (
            <motion.div variants={cardVariants} className="card" style={{ padding: '2rem' }}>
              <div style={sectionHeaderStyle}>
                <div style={iconBoxStyle('#f5f3ff', '#8b5cf6')}><ShieldCheck size={20} /></div>
                <div>
                  <h3 style={sectionTitleStyle}>Tỷ lệ đóng Bảo hiểm</h3>
                  <p style={sectionDescStyle}>Mức trích đóng BHXH, BHYT, BHTN theo quy định hiện hành.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '1.5rem' }}>
                <div>
                  <h4 style={{ ...subHeadingStyle, color: '#3b82f6' }}>Phần Doanh nghiệp đóng</h4>
                  <div style={stackInputStyle}>
                    <InputGroup label="BH Xã hội (17.5%)" value={insuranceRates.company.bhxh} onChange={(v) => setInsuranceRates({ ...insuranceRates, company: { ...insuranceRates.company, bhxh: v } })} unit="%" />
                    <InputGroup label="BH Y tế (3%)" value={insuranceRates.company.bhyt} onChange={(v) => setInsuranceRates({ ...insuranceRates, company: { ...insuranceRates.company, bhyt: v } })} unit="%" />
                    <InputGroup label="BH Thất nghiệp (1%)" value={insuranceRates.company.bhtn} onChange={(v) => setInsuranceRates({ ...insuranceRates, company: { ...insuranceRates.company, bhtn: v } })} unit="%" />
                  </div>
                </div>
                <div>
                  <h4 style={{ ...subHeadingStyle, color: '#6366f1' }}>Phần Nhân viên đóng</h4>
                  <div style={stackInputStyle}>
                    <InputGroup label="BH Xã hội (8%)" value={insuranceRates.employee.bhxh} onChange={(v) => setInsuranceRates({ ...insuranceRates, employee: { ...insuranceRates.employee, bhxh: v } })} unit="%" />
                    <InputGroup label="BH Y tế (1.5%)" value={insuranceRates.employee.bhyt} onChange={(v) => setInsuranceRates({ ...insuranceRates, employee: { ...insuranceRates.employee, bhyt: v } })} unit="%" />
                    <InputGroup label="BH Thất nghiệp (1%)" value={insuranceRates.employee.bhtn} onChange={(v) => setInsuranceRates({ ...insuranceRates, employee: { ...insuranceRates.employee, bhtn: v } })} unit="%" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tax' && (
            <motion.div variants={cardVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <div style={sectionHeaderStyle}>
                  <div style={iconBoxStyle('#fff7ed', '#f97316')}><Banknote size={20} /></div>
                  <div>
                    <h3 style={sectionTitleStyle}>Biểu thuế TNCN & Giảm trừ</h3>
                    <p style={sectionDescStyle}>Quy định về thuế suất cho các đối tượng và mức giảm trừ gia cảnh.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                  <InputGroup label="Cá nhân không cư trú" value={pitConfig.nonResident} unit="%" />
                  <InputGroup label="Cá nhân < 3 tháng (10%)" value={pitConfig.shortTermResident} unit="%" />
                  <InputGroup label="Giảm trừ bản thân (15.5M)" value={pitConfig.personalDeduction} unit="VNĐ" />
                  <InputGroup label="Giảm trừ người phụ thuộc (6.2M)" value={pitConfig.dependentDeduction} unit="VNĐ" />
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ ...subHeadingStyle, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scaling size={18} /> Biểu thuế lũy tiến từng phần
                </h4>
                <table style={tableStyle}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <th style={thStyle}>Bậc thuế</th>
                      <th style={thStyle}>Thu nhập tính thuế / tháng</th>
                      <th style={thStyle}>Thuế suất</th>
                      <th style={thStyle}>Số thuế phải nộp (Ví dụ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pitConfig.progressiveTable.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={tdStyle}><span style={badgeStyle}>{row.level}</span></td>
                        <td style={tdStyle}>
                          {idx === 0 ? `Đến ${row.limit / 1000000} triệu` :
                            row.limit === Infinity ? `Trên ${pitConfig.progressiveTable[idx - 1].limit / 1000000} triệu` :
                              `Trên ${pitConfig.progressiveTable[idx - 1].limit / 1000000} triệu đến ${row.limit / 1000000} triệu`}
                        </td>
                        <td style={tdStyle}><span style={{ color: '#ef4444', fontWeight: '700' }}>{row.rate}%</span></td>
                        <td style={tdStyle}>{formatCurrency(row.limit === Infinity ? 50000000 * row.rate / 100 : row.limit * row.rate / 100)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </div>

        {/* --- RIGHT SIDE: PREVIEW / SUMMARY --- */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Tóm tắt cấu hình</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <SummaryRow label="Phụ cấp ăn trưa" value={formatCurrency(allowanceConfig.lunch)} />
              <SummaryRow label="Phụ cấp xăng xe" value={formatCurrency(allowanceConfig.gasoline)} />
              <SummaryRow label="Lương tối thiểu" value={formatCurrency(salaryConfig.baseSalary)} />
              <SummaryRow label="BHXH Nhân viên" value={`${insuranceRates.employee.bhxh}%`} />
              <SummaryRow label="Giảm trừ bản thân" value={formatCurrency(pitConfig.personalDeduction)} />
            </div>

            <div style={{ marginTop: '2rem', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.85rem' }}>
              <Info size={16} style={{ marginBottom: '8px' }} />
              <span>Các chỉ số này sẽ được áp dụng ngay lập tức cho các đợt tính lương mới trong tương lai.</span>
            </div>
          </div>

          <div className="card">
            <h4 style={{ ...subHeadingStyle, marginBottom: '1.25rem' }}>Nhật ký thay đổi</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <HistoryItem date="Hôm nay, 09:45" user="Nam Khánh" action="Cập nhật Biểu thuế TNCN 2026" />
              <HistoryItem date="20/03/2026" user="Trần Mai" action="Thay đổi Lương cơ sở lên 2,340,000đ" />
              <HistoryItem date="15/03/2026" user="System" action="Áp dụng tỷ lệ đóng BHXH mới" />
            </div>
            <button style={{ width: '100%', marginTop: '1rem', color: '#6366f1', fontSize: '0.85rem', fontWeight: '600' }}>Xem tất cả lịch sử</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#b91c1c' }}>
            <AlertCircle size={20} />
            <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
              <strong>Lưu ý quan trọng:</strong> Việc thay đổi các chỉ số này ảnh hưởng đến dữ liệu kế toán toàn công ty. Xin hãy kiểm tra kỹ trước khi nhấn <i>Áp dụng</i>.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const InputGroup = ({ label, value, onChange, unit, readOnly = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>{label}</label>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        style={{
          width: '100%',
          padding: '12px 14px',
          paddingRight: '45px',
          borderRadius: '12px',
          border: '1.5px solid #eef2f6',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#1e293b',
          outline: 'none',
          transition: 'all 0.2s',
          background: readOnly ? '#f1f5f9' : '#f8fafc',
          cursor: readOnly ? 'pointer' : 'text'
        }}
        onFocus={(e) => {
          if (!readOnly) {
            e.target.style.borderColor = '#6366f1';
            e.target.style.background = 'white';
          }
        }}
        onBlur={(e) => {
          if (!readOnly) {
            e.target.style.borderColor = '#eef2f6';
            e.target.style.background = '#f8fafc';
          }
        }}
      />
      <span style={{ position: 'absolute', right: '14px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>{unit}</span>
    </div>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{label}</span>
    <span style={{ fontWeight: '700' }}>{value}</span>
  </div>
);

const HistoryItem = ({ date, user, action }) => (
  <div style={{ display: 'flex', gap: '12px' }}>
    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1', marginTop: '6px' }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>{date} • <strong>{user}</strong></div>
      <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: '500' }}>{action}</div>
    </div>
  </div>
);

// --- STYLES ---

const sectionHeaderStyle = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2rem' };
const sectionTitleStyle = { fontSize: '1.4rem', fontWeight: '750', color: '#1e293b', marginBottom: '4px' };
const sectionDescStyle = { color: '#64748b', fontSize: '0.9rem' };

const iconBoxStyle = (bg, color) => ({
  background: bg,
  color: color,
  padding: '12px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const gridInputStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' };
const stackInputStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' };
const subHeadingStyle = { fontSize: '1rem', fontWeight: '700', color: '#475569', marginBottom: '8px' };

const primaryBtnStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)', transition: 'all 0.2s' };
const secondaryBtnStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '12px', border: '1.5px solid #eef2f6', background: 'white', color: '#475569', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' };

const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '8px' };
const thStyle = { padding: '12px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.05em' };
const tdStyle = { padding: '16px 12px', fontSize: '0.9rem', color: '#334155' };
const badgeStyle = { background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '0.8rem' };

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  background: 'white',
  padding: '2.5rem',
  borderRadius: '24px',
  width: '100%',
  maxWidth: '450px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
};

const modalInputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1.5px solid #eef2f6',
  fontSize: '1rem',
  fontWeight: '500',
  color: '#1e293b',
  outline: 'none',
  background: '#f8fafc'
};

export default PayrollSetup;

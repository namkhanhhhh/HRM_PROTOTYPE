import React, { useState } from 'react';
import { 
  Calendar, Calculator, Mail, History, 
  UserPlus, HelpCircle, Search, Edit3, Send, Download, 
  Eye, X, Plus
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const PayrollCalculation = () => {
  const [showFormula, setShowFormula] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Modal states
  const [detailModalEmp, setDetailModalEmp] = useState(null);
  const [adjModalEmp, setAdjModalEmp] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmp, setTestEmp] = useState({
    name: 'Ứng viên Test (Giả lập)',
    role: 'Mẫu thử nghiệm',
    dept: 'Hệ thống',
    contractType: 'Chính thức',
    gross: 20000000,
    workDays: 22,
    leaveDays: 0,
    otHours: 0,
    dependents: 0,
    manualWorkDays: 0,
    manualOtHours: 0,
    bonus: 0,
    deduction: 0,
    manualAdj: 0,
    otherAllowancesList: [],
  });

  // --- PERIODS STATE ---
  const [periods, setPeriods] = useState([
    { id: 'p2', name: 'Tháng 02/2026', startDate: '2026-02-01', endDate: '2026-02-28', status: 'Đã thanh toán', creator: 'Nam Khánh' },
    { id: 'p1', name: 'Tháng 01/2026', startDate: '2026-01-01', endDate: '2026-01-31', status: 'Đã thanh toán', creator: 'Nam Khánh' },
  ]);
  const [selectedPeriodId, setSelectedPeriodId] = useState('p2');
  const currentPeriod = periods.find(p => p.id === selectedPeriodId);

  // --- MOCK EMPLOYEES ---
  const [employees, setEmployees] = useState([
    { 
      id: 'EMP001', 
      name: 'Nguyễn Văn An', 
      dept: 'Phát triển Sản phẩm', 
      role: 'Fullstack Engineer', 
      gross: 35000000, 
      workDays: 21, 
      leaveDays: 1, 
      otHours: 5, 
      contractType: 'Chính thức', // Chính thức, Thử việc, Cộng tác viên
      dependents: 1,
      // Adjustments
      manualWorkDays: 0,
      manualOtHours: 0,
      bonus: 0,
      deduction: 0,
      manualAdj: 0, // Legacy/Other
    },
    { 
      id: 'EMP002', 
      name: 'Trần Thị Bình', 
      dept: 'Marketing', 
      role: 'Content Creator', 
      gross: 18000000, 
      workDays: 22, 
      leaveDays: 0, 
      otHours: 0, 
      contractType: 'Thử việc',
      dependents: 0,
      // Adjustments
      manualWorkDays: 1,
      manualOtHours: 0,
      bonus: 500000,
      deduction: 0,
      manualAdj: 0,
    },
    { 
      id: 'EMP003', 
      name: 'Lê Văn Chính', 
      dept: 'Kế toán', 
      role: 'Kế toán tổng hợp', 
      gross: 25000000, 
      workDays: 10, 
      leaveDays: 12, 
      otHours: 2, 
      contractType: 'Chính thức',
      dependents: 0,
      // Adjustments
      manualWorkDays: 0,
      manualOtHours: 0,
      bonus: 0,
      deduction: 0,
      manualAdj: 0,
    },
    { 
      id: 'EXT001', 
      name: 'Phạm Văn Dũng', 
      dept: 'Thiết kế', 
      role: 'Freelance Designer', 
      gross: 15000000, 
      workDays: 15, 
      leaveDays: 0, 
      otHours: 0, 
      contractType: 'Cộng tác viên',
      dependents: 0,
      manualWorkDays: 0,
      manualOtHours: 0,
      bonus: 1000000,
      deduction: 0,
      manualAdj: 0,
    }
  ]);

  const setupConfig = {
    lunch: 700000,
    gasoline: 500000,
    phone: 500000,
    standardDays: 22,
    insuranceRate: 10.5,
    personalDeduction: 15500000,
    dependentDeduction: 6200000,
  };

  // --- CALCULATION LOGIC ---
  const calculateResult = (emp) => {
    const extraAllowancesTotal = (emp.otherAllowancesList || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    // 1. LCB (Gross - Phụ cấp cố định - Phụ cấp khác) limit to contract type
    const fixedAllowances = (emp.contractType === 'Cộng tác viên') ? 0 : setupConfig.lunch + setupConfig.gasoline + setupConfig.phone;
    let baseSalary = emp.gross - fixedAllowances - extraAllowancesTotal;
    
    // (Diện thử việc sẽ tính 85% số lương vừa ra)
    if (emp.contractType === 'Thử việc') baseSalary = baseSalary * 0.85;

    // 2. Tiền mỗi ngày công
    const dailyRate = baseSalary / setupConfig.standardDays;

    // 3. Lương theo công 100% (Tính cả công thủ công thêm)
    const totalActualWorkDays = emp.workDays + emp.manualWorkDays;
    const actualWorkSalary = dailyRate * totalActualWorkDays;

    // 4. OT (Giờ * OT type * lương cơ bản theo giờ)
    const hourlyRate = (baseSalary / setupConfig.standardDays) / 8;
    const totalOtHours = emp.otHours + emp.manualOtHours;
    const otSalary = totalOtHours * hourlyRate * 3.0; // 300% for holiday/demo

    // 5. Phụ cấp nhận được dựa trên số công thực tế
    const allowanceRatio = Math.min(totalActualWorkDays, setupConfig.standardDays) / setupConfig.standardDays;
    const allowanceLunchActual = (emp.contractType === 'Cộng tác viên') ? 0 : setupConfig.lunch * allowanceRatio;
    const allowanceTaxableActual = (emp.contractType === 'Cộng tác viên') ? 0 : (setupConfig.gasoline + setupConfig.phone) * allowanceRatio; 
    
    // Tính phần taxable của phụ cấp khác (prorated items)
    const extraAllowancesTaxableTotal = (emp.otherAllowancesList || []).filter(i => i.isTaxable !== false).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const extraAllowancesTaxableActual = (emp.contractType === 'Cộng tác viên') ? 0 : extraAllowancesTaxableTotal * allowanceRatio;

    // Tính tổng thực nhận phụ cấp khác (cả taxable và non-taxable, theo tỷ lệ công)
    const extraAllowancesActual = (emp.contractType === 'Cộng tác viên') ? 0 : extraAllowancesTotal * allowanceRatio;

    const manualAdjustmentsStr = emp.bonus - emp.deduction + emp.manualAdj + extraAllowancesActual;

    // 6. Tổng nhận trước thuế
    const totalBeforeTax = actualWorkSalary + allowanceLunchActual + allowanceTaxableActual + otSalary + manualAdjustmentsStr;

    // 7. Bảo hiểm (Chỉ đóng nếu nghỉ < 14 ngày & Chính thức)
    const shouldPayInsurance = (emp.contractType === 'Chính thức') && (emp.leaveDays < 14);
    const insuranceAmt = shouldPayInsurance ? (baseSalary * setupConfig.insuranceRate / 100) : 0;

    // 8. Giảm trừ
    const totalDeduction = setupConfig.personalDeduction + (emp.dependents * setupConfig.dependentDeduction);

    // 9. Tổng TN Chịu thuế (Khấu trừ OT, PC Ăn trưa, PC không chịu thuế)
    const finalTaxableBasis = actualWorkSalary + allowanceTaxableActual + emp.bonus - emp.deduction + emp.manualAdj + extraAllowancesTaxableActual;

    // 10. TN Tính thuế
    const netTaxableIncome = Math.max(0, finalTaxableBasis - insuranceAmt - totalDeduction);

    // 11. Thuế TNCN
    let pitTax = 0;
    if (emp.contractType === 'Chính thức') {
      if (netTaxableIncome > 0) {
        if (netTaxableIncome <= 5000000) pitTax = netTaxableIncome * 0.05;
        else if (netTaxableIncome <= 10000000) pitTax = (netTaxableIncome * 0.1) - 250000;
        else if (netTaxableIncome <= 18000000) pitTax = (netTaxableIncome * 0.15) - 750000;
        else if (netTaxableIncome <= 32000000) pitTax = (netTaxableIncome * 0.2) - 1650000;
        else if (netTaxableIncome <= 52000000) pitTax = (netTaxableIncome * 0.25) - 3250000;
        else if (netTaxableIncome <= 80000000) pitTax = (netTaxableIncome * 0.3) - 5850000;
        else pitTax = (netTaxableIncome * 0.35) - 9850000;
      }
    } else {
      // Fix 10% for Probation/CTV
      pitTax = finalTaxableBasis * 0.1; 
    }

    // 12. Thực lĩnh (Số tiền nhận trước thuế - Bảo hiểm - Thuế TNCN)
    const netSalary = totalBeforeTax - insuranceAmt - pitTax;

    return {
      baseSalary,
      dailyRate,
      totalActualWorkDays,
      actualWorkSalary,
      totalOtHours,
      otSalary,
      allowanceLunch: allowanceLunchActual,
      allowanceTaxable: allowanceTaxableActual,
      extraAllowancesTotal,
      extraAllowancesActual,
      manualAdjustmentsStr,
      totalBeforeTax,
      shouldPayInsurance,
      insuranceAmt,
      totalDeduction,
      finalTaxableBasis,
      netTaxableIncome,
      pitTax,
      netSalary
    };
  };

  const handleRunCalculation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setPeriods(periods.map(p => p.id === selectedPeriodId ? { ...p, status: 'Đã tính toán' } : p));
      alert('Đã hoàn tất tính toán lương cho toàn bộ hệ thống!');
    }, 1500);
  };

  const handleRunSingleCalculation = (empName) => {
    alert(`Đã tính toán lại lương cho nhân viên: ${empName}`);
  };

  const createNewPeriod = () => {
    const latestPeriod = periods[0] || { startDate: '2026-01-01' };
    const latestDate = new Date(latestPeriod.startDate);
    const nextMonthDate = new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 1);
    const currentRealDate = new Date(); // It is currently March 23, 2026

    // If nextMonth to create is same as current real month (or future), block it.
    if (nextMonthDate.getFullYear() > currentRealDate.getFullYear() || 
       (nextMonthDate.getFullYear() === currentRealDate.getFullYear() && nextMonthDate.getMonth() >= currentRealDate.getMonth())) {
       alert(`Không thể khởi tạo! Tháng ${nextMonthDate.getMonth() + 1}/${nextMonthDate.getFullYear()} vẫn đang diễn ra, chưa kết thúc để tính lương.`);
       return;
    }

    const monthStr = (nextMonthDate.getMonth() + 1).toString().padStart(2, '0');
    const yearStr = nextMonthDate.getFullYear();
    const lastDay = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 0).getDate();

    const newP = { 
      id: `p${Date.now()}`, 
      name: `Tháng ${monthStr}/${yearStr}`, 
      startDate: `${yearStr}-${monthStr}-01`, 
      endDate: `${yearStr}-${monthStr}-${lastDay}`, 
      status: 'Đang khởi tạo', 
      creator: 'Nam Khánh' 
    };
    setPeriods([newP, ...periods]);
    setSelectedPeriodId(newP.id);
  };

  const saveAdjustments = (e) => {
    e.preventDefault();
    setEmployees(employees.map(emp => emp.id === adjModalEmp.id ? adjModalEmp : emp));
    setAdjModalEmp(null);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val).replace('₫', 'đ');
  };

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* --- FORMULA GUIDELINE --- */}
      <AnimatePresence>
        {showFormula && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={formulaCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={iconBoxStyle('#eff6ff', '#3b82f6')}><HelpCircle size={20} /></div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '750', color: '#1e293b' }}>Guideline Công thức Tính lương (Hệ thống)</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Logic tính toán lương được tự động áp dụng theo loại hợp đồng (Chính thức, Thử việc, Hợp đồng vụ việc/CTV).</p>
                  </div>
                </div>
                <button onClick={() => setShowFormula(false)} style={closeBtnStyle}>Đóng hướng dẫn</button>
              </div>
              
              <div style={formulaGridStyle}>
                {[
                  { step: 1, title: 'Lương cơ bản (LCB)', desc: 'Gross - Phụ cấp (Ăn trưa, Xăng xe, ĐT). Thử việc = 85% LCB. CTV = Gross nguyên bản.' },
                  { step: 2, title: 'Giá mỗi công', desc: 'LCB / 22 (số ngày công chuẩn của tháng).' },
                  { step: 3, title: 'Lương theo công', desc: 'Giá công * (Ngày công thực tế + Công thủ công).' },
                  { step: 4, title: 'Tiền OT & Tùy chỉnh', desc: 'Hệ số OT * LCB/Giờ. Thêm các khoản Thưởng/Phạt thủ công.' },
                  { step: 5, title: 'Phụ cấp', desc: 'Ăn trưa (Ko thuế), Xăng + ĐT (Có thuế). CTV không có khoản này.' },
                  { step: 6, title: 'Tổng thu nhập (Gross)', desc: 'Lương công + OT + Thưởng/Phạt + Các khoản phụ cấp.' },
                  { step: 7, title: 'Bảo hiểm', desc: '10.5% × LCB. Áp dụng: Chính thức đi làm > 14 ngày. Thử việc/CTV = 0.' },
                  { step: 8, title: 'Giảm trừ gia cảnh', desc: 'Bản thân (15.5M) + Người phụ thuộc (6.2M/ng).' },
                  { step: 9, title: 'TN Chịu thuế', desc: 'Lương công + Phụ cấp Xăng, ĐT theo thực tế + OT + Thưởng.' },
                  { step: 10, title: 'TN Tính thuế', desc: 'TN Chịu thuế - Bảo hiểm - Giảm trừ. Tối thiểu = 0.' },
                  { step: 11, title: 'Thuế TNCN', desc: 'Chính thức = Lũy tiến. Thử việc/CTV = 10% (Trích tại nguồn).' },
                  { step: 12, title: 'Số tiền lĩnh (Net)', desc: 'Tổng thu nhập (B6) - Bảo hiểm - Thuế TNCN.' },
                ].map((item) => (
                  <div key={item.step} style={formulaItemStyle}>
                    <div style={stepBadgeStyle}>{item.step}</div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#334155', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        
        {/* --- LEFT: PERIOD INIT & EMPS --- */}
        <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={pageHeaderStyle}>
             <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={periodCardStyle}>
                  <label style={labelStyle}>Kỳ lương</label>
                  <select 
                    style={selectStyle} 
                    value={selectedPeriodId} 
                    onChange={e => setSelectedPeriodId(e.target.value)}
                  >
                    {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                {currentPeriod && (
                  <>
                    <div style={periodCardStyle}>
                      <label style={labelStyle}>Phạm vi thời gian</label>
                      <div style={periodValStyle}><Calendar size={16} /> Từ {currentPeriod.startDate} - {currentPeriod.endDate}</div>
                    </div>
                    <div style={periodCardStyle}>
                      <label style={labelStyle}>Người phụ trách</label>
                      <div style={periodValStyle}><UserPlus size={16} /> {currentPeriod.creator}</div>
                    </div>
                    <div style={periodCardStyle}>
                      <label style={labelStyle}>Trạng thái</label>
                      <div style={statusBadgeStyle(currentPeriod.status)}>{currentPeriod.status}</div>
                    </div>
                  </>
                )}
             </div>
             <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={createNewPeriod} style={secondaryBtnStyle}><Plus size={18} /> Tạo kỳ lương mới</button>
                <button onClick={() => setShowTestModal(true)} style={{ ...secondaryBtnStyle, color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}><Calculator size={18} /> Giả lập tính lương</button>
                {!showFormula && <button onClick={() => setShowFormula(true)} style={secondaryBtnStyle}><HelpCircle size={18} /> Guideline</button>}
                <button 
                  onClick={handleRunCalculation} 
                  style={{ ...primaryBtnStyle, opacity: currentPeriod?.status === 'Đã thanh toán' ? 0.5 : 1 }}
                  disabled={currentPeriod?.status === 'Đã thanh toán'}
                >
                  {isCalculating ? 'Đang tính toán...' : <><Calculator size={18} /> Tính lượng toàn bộ</>}
                </button>
             </div>
          </div>

          <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
               <h3 style={{ fontWeight: '750', fontSize: '1.1rem', color: '#1e293b' }}>Danh sách Nhân viên tính lương ({currentPeriod?.name})</h3>
               <div style={searchBoxStyle}>
                 <Search size={18} color="#94a3b8" />
                 <input type="text" placeholder="Tìm kiếm nhân viên..." style={searchInputStyle} />
               </div>
            </div>
            
            <div style={{ overflowX: 'auto', background: 'white' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ ...thStyle, width: '250px' }}>Nhân viên / Phòng ban</th>
                    <th style={thStyle}>Lương Gross</th>
                    <th style={thStyle}>Công / Phép / OT</th>
                    <th style={{ ...thStyle, color: '#3b82f6' }}>Tùy chỉnh thêm</th>
                    <th style={thStyle}>Bảo hiểm</th>
                    <th style={thStyle}>Thuế TNCN</th>
                    <th style={thStyle}>Thực lĩnh</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const result = calculateResult(emp);
                    const hasAdjustment = emp.manualWorkDays !== 0 || emp.manualOtHours !== 0 || emp.bonus !== 0 || emp.deduction !== 0;

                    return (
                      <tr key={emp.id} style={{ ...trStyle, background: 'white' }}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>{emp.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              <span>{emp.id}</span>
                              <span style={{ margin: '0 4px', color: '#cbd5e1' }}>|</span>
                              <span>{emp.dept}</span>
                            </div>
                            <span style={typeBadgeStyle(emp.contractType)}>{emp.contractType}</span>
                          </div>
                        </td>
                        <td style={tdStyle}>
                           <div style={{ fontWeight: '700', color: '#475569', display: 'flex', justifyContent: 'center' }}>{formatCurrency(emp.gross)}</div>
                           <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>Cơ sở hợp đồng</div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <span style={statBadgeStyle('#f0fdf4', '#166534')}>{emp.workDays}{emp.manualWorkDays > 0 ? ` (+${emp.manualWorkDays})` : ''}C</span>
                            <span style={statBadgeStyle('#fef2f2', '#991b1b')}>{emp.leaveDays}P</span>
                            <span style={statBadgeStyle('#eff6ff', '#1e40af')}>{emp.otHours}{emp.manualOtHours > 0 ? ` (+${emp.manualOtHours})` : ''}h OT</span>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div 
                            onClick={() => setAdjModalEmp({...emp})}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: hasAdjustment ? '#10b981' : '#6366f1', fontWeight: '600', cursor: 'pointer', background: hasAdjustment ? '#ecfdf5' : '#eef2ff', padding: '6px 10px', borderRadius: '8px', fontSize: '0.85rem' }}
                          >
                             <Edit3 size={14} /> 
                             <span>{emp.bonus > 0 ? `+${formatCurrency(emp.bonus)} ` : ''}{emp.deduction > 0 ? `-${formatCurrency(emp.deduction)} ` : ''}{(!emp.bonus && !emp.deduction) ? 'Thiết lập' : ''}</span>
                          </div>
                        </td>
                        <td style={tdStyle}>{formatCurrency(result.insuranceAmt)}</td>
                        <td style={tdStyle}><span style={{ color: '#ef4444', fontWeight: '700' }}>{formatCurrency(result.pitTax)}</span></td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: '800', color: '#4f46e5', fontSize: '1.05rem' }}>{formatCurrency(result.netSalary)}</div>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                             <button onClick={() => setDetailModalEmp({ emp, result })} style={actionIconBtn} title="Xem chi tiết tính toán"><Eye size={16} /></button>
                             <button onClick={() => handleRunSingleCalculation(emp.name)} style={actionIconBtn} title="Tính lương KH cá nhân này"><Calculator size={16} /></button>
                             <button style={actionIconBtn} title="Gửi bảng lương"><Mail size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={footerActionStyle}>
               <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                 Tổng nhân viên: <strong style={{ color: '#334155' }}>{employees.length}</strong> • Lần tính gần nhất: Hôm nay, 10:45 AM
               </div>
               <div style={{ display: 'flex', gap: '1rem' }}>
                 <button style={secondaryBtnStyle}><Download size={18} /> Xuất Excel</button>
                 <button style={{ ...primaryBtnStyle, background: '#10b981' }}><Send size={18} /> Gửi Email phiếu lương</button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADJUSTMENT MODAL --- */}
      <AnimatePresence>
        {adjModalEmp && (
          <div style={modalOverlayStyle}>
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={modalContentStyle}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: '750' }}>Tùy chỉnh thủ công: {adjModalEmp.name}</h3>
                 <button onClick={() => setAdjModalEmp(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
               </div>
               <form onSubmit={saveAdjustments} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={modalLabelStyle}>Cộng thêm Ngày công (Thủ công)</label>
                      <input type="number" step="0.5" value={adjModalEmp.manualWorkDays} onChange={e => setAdjModalEmp({...adjModalEmp, manualWorkDays: parseFloat(e.target.value) || 0})} style={modalInputStyle} />
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Cộng thêm Giờ OT (Thủ công)</label>
                      <input type="number" step="1" value={adjModalEmp.manualOtHours} onChange={e => setAdjModalEmp({...adjModalEmp, manualOtHours: parseFloat(e.target.value) || 0})} style={modalInputStyle} />
                    </div>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={modalLabelStyle}>Khoản thưởng thêm (VNĐ)</label>
                      <input type="number" value={adjModalEmp.bonus} onChange={e => setAdjModalEmp({...adjModalEmp, bonus: parseInt(e.target.value) || 0})} style={{ ...modalInputStyle, borderColor: '#34d399' }} />
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Khoản phạt/khấu trừ (VNĐ)</label>
                      <input type="number" value={adjModalEmp.deduction} onChange={e => setAdjModalEmp({...adjModalEmp, deduction: parseInt(e.target.value) || 0})} style={{ ...modalInputStyle, borderColor: '#f87171' }} />
                    </div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setAdjModalEmp(null)} style={secondaryBtnStyle}>Hủy bỏ</button>
                    <button type="submit" style={primaryBtnStyle}>Lưu tùy chỉnh</button>
                 </div>
               </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TEST SIMULATION MODAL --- */}
      <AnimatePresence>
        {showTestModal && (
          <div style={modalOverlayStyle}>
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={modalContentStyle}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: '750' }}>Bộ Giả Lập Tính Lương</h3>
                 <button onClick={() => setShowTestModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
               </div>
               <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Công cụ giúp giả lập đầu vào để kiểm tra chuẩn xác công thức thuế, bảo hiểm, và phụ cấp của hệ thống.
               </p>
               <form onSubmit={(e) => { 
                 e.preventDefault(); 
                 const res = calculateResult(testEmp); 
                 setDetailModalEmp({ emp: testEmp, result: res }); 
                 setShowTestModal(false); 
               }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={modalLabelStyle}>Lương Gross (VNĐ)</label>
                      <input type="text" value={testEmp.gross ? new Intl.NumberFormat('vi-VN').format(testEmp.gross) : ''} onChange={e => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setTestEmp({...testEmp, gross: parseInt(raw) || 0});
                      }} style={modalInputStyle} required />
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Loại ứng viên/hợp đồng</label>
                      <select value={testEmp.contractType} onChange={e => setTestEmp({...testEmp, contractType: e.target.value})} style={modalInputStyle}>
                        <option value="Chính thức">Chính thức</option>
                        <option value="Thử việc">Thử việc (85%)</option>
                        <option value="Cộng tác viên">Cộng tác viên (Dịch vụ)</option>
                      </select>
                    </div>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={modalLabelStyle}>Số ngày công thực tế</label>
                      <input type="number" step="0.5" value={testEmp.workDays} onChange={e => setTestEmp({...testEmp, workDays: parseFloat(e.target.value) || 0})} style={modalInputStyle} required />
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Số giờ OT</label>
                      <input type="number" step="0.5" value={testEmp.otHours} onChange={e => setTestEmp({...testEmp, otHours: parseFloat(e.target.value) || 0})} style={modalInputStyle} required />
                    </div>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={modalLabelStyle}>Các khoản thưởng (VNĐ)</label>
                      <input type="text" value={testEmp.bonus ? new Intl.NumberFormat('vi-VN').format(testEmp.bonus) : ''} onChange={e => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setTestEmp({...testEmp, bonus: parseInt(raw) || 0});
                      }} style={modalInputStyle} />
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Số NPT (Giảm trừ gia cảnh)</label>
                      <input type="number" step="1" value={testEmp.dependents} onChange={e => setTestEmp({...testEmp, dependents: parseInt(e.target.value) || 0})} style={modalInputStyle} />
                    </div>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ ...modalLabelStyle, marginBottom: 0 }}>Các khoản phụ cấp khác</label>
                      <button type="button" onClick={() => setTestEmp({...testEmp, otherAllowancesList: [...(testEmp.otherAllowancesList || []), { id: Date.now(), name: '', amount: 0, isTaxable: true }]})} style={{ border: 'none', background: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>+ Thêm phụ cấp</button>
                    </div>
                    {(testEmp.otherAllowancesList || []).map((item, index) => (
                      <div key={item.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="text" placeholder="Tên PC (VD: Trách nhiệm)" value={item.name} onChange={e => {
                          const newList = [...testEmp.otherAllowancesList];
                          newList[index].name = e.target.value;
                          setTestEmp({...testEmp, otherAllowancesList: newList});
                        }} style={{ ...modalInputStyle, flex: 1, padding: '8px 10px', fontSize: '0.85rem' }} />
                        <input type="text" placeholder="Số tiền..." value={item.amount ? new Intl.NumberFormat('vi-VN').format(item.amount) : ''} onChange={e => {
                          const raw = e.target.value.replace(/\D/g, '');
                          const newList = [...testEmp.otherAllowancesList];
                          newList[index].amount = parseInt(raw) || 0;
                          setTestEmp({...testEmp, otherAllowancesList: newList});
                        }} style={{ ...modalInputStyle, width: '130px', padding: '8px 10px', fontSize: '0.85rem' }} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                          <input type="checkbox" checked={item.isTaxable !== false} onChange={e => {
                            const newList = [...testEmp.otherAllowancesList];
                            newList[index].isTaxable = e.target.checked;
                            setTestEmp({...testEmp, otherAllowancesList: newList});
                          }} style={{ width: '16px', height: '16px' }} /> Tính thuế
                        </label>
                        <button type="button" onClick={() => setTestEmp({...testEmp, otherAllowancesList: testEmp.otherAllowancesList.filter(x => x.id !== item.id)})} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={14} /></button>
                      </div>
                    ))}
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowTestModal(false)} style={secondaryBtnStyle}>Hủy bỏ</button>
                    <button type="submit" style={primaryBtnStyle}><Calculator size={18} /> Chạy giả lập & Xem kết quả</button>
                 </div>
               </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DETAILED CALCULATION MODAL --- */}
      <AnimatePresence>
        {detailModalEmp && (
          <div style={modalOverlayStyle}>
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ ...modalContentStyle, maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eef2f6' }}>
                 <div>
                   <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b' }}>Chi tiết Bảng lương</h3>
                   <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>{detailModalEmp.emp.name} • {detailModalEmp.emp.role} • <span style={{ color: '#3b82f6', fontWeight: '600' }}>Hợp đồng: {detailModalEmp.emp.contractType}</span></div>
                 </div>
                 <button onClick={() => setDetailModalEmp(null)} style={{ border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Step 1 & 2 */}
                  <DetailRow label="1. Lương Cơ bản (Gross - Phụ cấp cố định - Phụ cấp khác)">
                    <div>
                      Công thức: {formatCurrency(detailModalEmp.emp.gross)} - PC cố định - PC khác = <strong style={{ color: '#1e293b' }}>{formatCurrency(detailModalEmp.emp.gross - (detailModalEmp.emp.contractType==='Cộng tác viên'?0:(1700000 + (detailModalEmp.result.extraAllowancesTotal || 0))))}</strong>
                      {detailModalEmp.emp.contractType === 'Thử việc' && (
                        <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>* Nhân viên đang Thử việc, Lương cơ bản áp dụng 85% = <strong style={{color: '#1e293b'}}>{formatCurrency(detailModalEmp.result.baseSalary)}</strong></div>
                      )}
                      {detailModalEmp.emp.contractType === 'Cộng tác viên' && (
                        <div style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '4px' }}>* Cộng tác viên nhận 100% Gross không chia phụ cấp = <strong style={{color: '#1e293b'}}>{formatCurrency(detailModalEmp.result.baseSalary)}</strong></div>
                      )}
                    </div>
                  </DetailRow>

                  {/* Step 3 */}
                  <DetailRow label="2. Tính Lương theo công (Quy chuẩn 22 ngày)">
                    <div>
                       Giá 1 công: {formatCurrency(detailModalEmp.result.dailyRate)} x ({detailModalEmp.emp.workDays} công thực tế {detailModalEmp.emp.manualWorkDays > 0 ? `+ ${detailModalEmp.emp.manualWorkDays} công thêm` : ''}) <br/>
                       = <strong style={{ color: '#3b82f6', fontSize: '1.05rem' }}>{formatCurrency(detailModalEmp.result.actualWorkSalary)}</strong>
                    </div>
                  </DetailRow>

                  {/* Step 4 & 5 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <DetailRow label="3. Lương OT">
                      {detailModalEmp.result.totalOtHours} giờ x 300% = <strong>{formatCurrency(detailModalEmp.result.otSalary)}</strong>
                    </DetailRow>
                    <DetailRow label="4. Thưởng / Phụ cấp thêm">
                      Thưởng: {formatCurrency(detailModalEmp.emp.bonus)} <br/>
                      Phụ cấp hệ thống: {formatCurrency(detailModalEmp.result.allowanceLunch + detailModalEmp.result.allowanceTaxable)}
                      <div style={{color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px', fontWeight: '500'}}>* Phụ cấp mặc định (theo công): (1.7M / 22) x {detailModalEmp.result.totalActualWorkDays} công</div>
                      {(detailModalEmp.emp.otherAllowancesList?.length > 0) && (
                        <div style={{ marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                           Phụ cấp khác (thực nhận theo công): <strong>{formatCurrency(detailModalEmp.result.extraAllowancesActual || 0)}</strong>
                           <ul style={{ margin: '4px 0 0 0', paddingLeft: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                             {detailModalEmp.emp.otherAllowancesList.map(allowance => (
                               <li key={allowance.id}>{allowance.name || 'Phụ cấp khác'}: {formatCurrency(allowance.amount || 0)} {allowance.isTaxable === false ? '(Không tính thuế)' : '(Tính thuế)'}</li>
                             ))}
                           </ul>
                        </div>
                      )}
                    </DetailRow>
                  </div>

                  {/* Step 6 */}
                  <DetailRow label="5. Tổng Thu Nhập (Trước Thuế/Bảo hiểm)" highlight>
                    <div style={{ fontSize: '1.2rem', color: '#1e293b' }}>
                      {formatCurrency(detailModalEmp.result.totalBeforeTax)}
                    </div>
                  </DetailRow>

                  {/* Khấu trừ */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <DetailRow label="6. Khấu trừ: Trừ lương / Phạt">
                      {formatCurrency(detailModalEmp.emp.deduction)}
                    </DetailRow>
                    <DetailRow label="7. Khấu trừ: Bảo Hiểm">
                      {!detailModalEmp.result.shouldPayInsurance ? (
                        <span style={{ color: '#94a3b8' }}>Miễn đóng (Do là {detailModalEmp.emp.contractType} / Nghỉ &gt; 14 ngày)</span>
                      ) : (
                        <span>10.5% x LCB = <strong style={{ color: '#ef4444' }}>{formatCurrency(detailModalEmp.result.insuranceAmt)}</strong></span>
                      )}
                    </DetailRow>
                  </div>

                  {/* Step 9..11 Thuế */}
                  <DetailRow label="8. Thuế TNCN">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.85rem' }}>- TN Chịu thuế (Không bao gồm OT, PC Ăn trưa, PC Không tính thuế): {formatCurrency(detailModalEmp.result.finalTaxableBasis)}</div>
                      <div style={{ fontSize: '0.85rem' }}>- Giảm trừ (Bản thân + {detailModalEmp.emp.dependents} Người phụ thuộc): {formatCurrency(detailModalEmp.result.totalDeduction)}</div>
                      <div style={{ fontSize: '0.85rem' }}>- TN Tính thuế: {formatCurrency(detailModalEmp.result.netTaxableIncome)}</div>
                      <div style={{ padding: '8px', background: '#fef2f2', borderRadius: '8px', marginTop: '4px' }}>
                         {detailModalEmp.emp.contractType === 'Chính thức' ? (
                           <span>Thuế lũy tiến từng phần = <strong style={{ color: '#ef4444' }}>{formatCurrency(detailModalEmp.result.pitTax)}</strong></span>
                         ) : (
                           <span>Thuế trích tại nguồn 10% ({detailModalEmp.emp.contractType}) = <strong style={{ color: '#ef4444' }}>{formatCurrency(detailModalEmp.result.pitTax)}</strong></span>
                         )}
                      </div>
                    </div>
                  </DetailRow>

                  {/* Step 12 */}
                  <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #4f46e5, #4338ca)', borderRadius: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.4)' }}>
                     <div>
                       <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '4px' }}>Thực lĩnh cuối cùng (Net Salary)</div>
                       <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Tổng thu nhập - Khấu trừ - Bảo hiểm - Thuế</div>
                     </div>
                     <div style={{ fontSize: '2rem', fontWeight: '800' }}>
                       {formatCurrency(detailModalEmp.result.netSalary)}
                     </div>
                  </div>

               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// --- STYLES ---

const DetailRow = ({ label, children, highlight }) => (
  <div style={{ padding: '12px 16px', background: highlight ? '#f8fafc' : 'white', border: highlight ? '1px solid #cbd5e1' : '1px solid #e2e8f0', borderRadius: '12px' }}>
    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: highlight ? '#334155' : '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.02em' }}>{label}</div>
    <div style={{ fontSize: '0.95rem', color: '#334155' }}>{children}</div>
  </div>
);

const selectStyle = {
  padding: '8px 36px 8px 12px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  fontSize: '0.95rem',
  fontWeight: '700',
  color: '#334155',
  outline: 'none',
  background: 'white',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px top 50%',
  backgroundSize: '10px auto',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(15, 23, 42, 0.4)',
  backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  background: 'white',
  padding: '2.5rem',
  borderRadius: '24px',
  width: '100%',
  maxWidth: '550px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
};

const modalLabelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '8px', display: 'block' };

const modalInputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1.5px solid #cbd5e1',
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1e293b',
  outline: 'none',
  background: '#f8fafc'
};

const typeBadgeStyle = (type) => ({
  background: type === 'Chính thức' ? '#dcfce7' : type === 'Thử việc' ? '#ffedd5' : '#e0e7ff',
  color: type === 'Chính thức' ? '#166534' : type === 'Thử việc' ? '#9a3412' : '#3730a3',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '0.65rem',
  fontWeight: '700'
});

const formulaCardStyle = {
  background: 'linear-gradient(to right, #ffffff, #f8fafc)',
  padding: '2rem',
  borderRadius: '24px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
  marginBottom: '0.5rem'
};

const formulaGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem'
};

const formulaItemStyle = {
  display: 'flex',
  gap: '10px',
  padding: '12px',
  background: 'white',
  borderRadius: '16px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const stepBadgeStyle = {
  minWidth: '24px',
  height: '24px',
  background: '#6366f1',
  color: 'white',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: '800'
};

const pageHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'white',
  padding: '1.5rem 2.5rem',
  borderRadius: '24px',
  border: '1px solid #eef2f6',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
  flexWrap: 'wrap'
};

const periodCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = { fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };
const periodValStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' };

const statusBadgeStyle = (status) => ({
  padding: '4px 12px',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: '700',
  background: status === 'Đang khởi tạo' ? '#f8fafc' : status === 'Đã thanh toán' ? '#eff6ff' : '#f0fdf4',
  color: status === 'Đang khởi tạo' ? '#64748b' : status === 'Đã thanh toán' ? '#2563eb' : '#166534',
  border: `1px solid ${status === 'Đang khởi tạo' ? '#e2e8f0' : status === 'Đã thanh toán' ? '#bfdbfe' : '#dcfce7'}`
});

const searchBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: '#f8fafc',
  padding: '8px 16px',
  borderRadius: '12px',
  width: '320px',
  border: '1px solid #eef2f6'
};

const searchInputStyle = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  fontSize: '0.9rem',
  width: '100%',
  color: '#334155'
};

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { padding: '16px 24px', textAlign: 'center', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' };
const trStyle = { borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s', background: 'white' };
const tdStyle = { padding: '1.25rem 24px', fontSize: '0.9rem', color: '#475569', textAlign: 'center' };

const statBadgeStyle = (bg, color) => ({
  padding: '2px 8px',
  borderRadius: '6px',
  background: bg,
  color: color,
  fontWeight: '700',
  fontSize: '0.75rem'
});

const actionIconBtn = {
  width: '34px',
  height: '34px',
  borderRadius: '8px',
  border: '1px solid #eef2f6',
  background: 'white',
  color: '#64748b',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const footerActionStyle = {
  padding: '1.5rem 2.5rem',
  borderTop: '1px solid #f1f5f9',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#fcfcfd'
};

const iconBoxStyle = (bg, color) => ({
  background: bg,
  color: color,
  padding: '10px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const primaryBtnStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '10px', 
  padding: '10px 20px', 
  borderRadius: '10px', 
  border: 'none', 
  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
  color: 'white', 
  fontWeight: '700', 
  fontSize: '0.9rem', 
  cursor: 'pointer', 
  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)', 
  transition: 'all 0.2s' 
};

const secondaryBtnStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '10px', 
  padding: '10px 18px', 
  borderRadius: '10px', 
  border: '1.5px solid #eef2f6', 
  background: 'white', 
  color: '#475569', 
  fontWeight: '600', 
  fontSize: '0.9rem', 
  cursor: 'pointer', 
  transition: 'all 0.2s' 
};

const closeBtnStyle = {
  padding: '6px 14px',
  borderRadius: '10px',
  background: '#f1f5f9',
  border: 'none',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: '#64748b',
  cursor: 'pointer'
};

export default PayrollCalculation;

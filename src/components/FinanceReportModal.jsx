import React, { useState } from 'react';
import { 
  DollarSign, 
  ShieldAlert, 
  Network, 
  Terminal, 
  TrendingUp, 
  Zap, 
  ChevronRight,
  Skull,
  Coins,
  Briefcase,
  Ghost,
  RefreshCw,
  Fingerprint,
  Info,
  Activity
} from 'lucide-react';
import useGameState from '../hooks/useGameState';
import SuspicionChart from './SuspicionChart';

const INTEL_CONTENT = {
  base: {
    title: "TRỢ CẤP HẮC ĐẠO",
    desc: "Nguồn ngân sách cố định từ các hoạt động bảo kê và thu 'thuế thân' cơ bản của tổ chức Syndicate tại các khu vực đang kiểm soát.",
    tag: "Core Funding"
  },
  smurf: {
    title: "RỬA TIỀN CHÂN RẾT",
    desc: "Kỹ thuật 'Smurfing': Chia nhỏ dòng tiền bẩn khổng lồ qua mạng lưới cá nhân. Lưu ý: Cần dùng 'Định hướng (Orient)' để tách biệt tài khoản khỏi nguồn tiền, nếu không hệ thống sẽ coi đây là vòng lặp rủi ro cao.",
    tag: "Structuring"
  },
  layer: {
    title: "LÃI MẠNG LƯỚI MA",
    desc: "Lợi nhuận phát sinh khi dòng tiền được luân chuyển qua nhiều tầng lớp công ty vỏ bọc (Shell Companies) để xóa sạch dấu vết nguồn gốc tiền.",
    tag: "Layering"
  },
  loop: {
    title: "VÒNG LẶP SẠCH HÓA",
    desc: "Tiền được bơm vào các vòng lặp giao dịch khép kín (Fraud Rings), tạo ra vẻ ngoài của các hoạt động kinh doanh hợp pháp với hiệu suất rửa tiền tối đa.",
    tag: "High Efficiency"
  },
  upkeep: {
    title: "CHI PHÍ BÔI TRƠN",
    desc: "Khoản chi cần thiết để duy trì sự im lặng của giới chức và chi phí vận hành mạng lưới khi số lượng công ty ma vượt quá giới hạn an toàn tự nhiên.",
    tag: "Risk Mitigation"
  }
};

const FinanceReportModal = () => {
  const { 
    showFinanceReport, 
    financeReportData, 
    closeFinanceReport, 
    turn,
    moneyLaundered, 
    targetMoney,
    launderedHistory
  } = useGameState();

  const [activeIntel, setActiveIntel] = useState(null);

  if (!showFinanceReport || !financeReportData) return null;

  const { 
    base,
    smurf, 
    layer, 
    loop, 
    upkeep,
    netIncome, 
    launderedThisRound,
    totalNodes,
    currentBudgetBefore 
  } = financeReportData;

  const totalLaunderedPercent = Math.min(100, Math.floor(((moneyLaundered || 0) / (targetMoney || 150000)) * 100));

  const isProfit = netIncome >= 0;

  const toggleIntel = (key) => {
    if (activeIntel === key) setActiveIntel(null);
    else setActiveIntel(key);
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-[10005] flex items-center justify-center bg-black/98 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
      <div className="digital-noise" />
      
      <div className="ledger-modal relative w-full max-w-6xl overflow-hidden border-2 border-amber-500/50 bg-[#060401] p-8 shadow-[0_0_80px_rgba(245,158,11,0.2),inset_0_0_30px_rgba(245,158,11,0.1)] animate-gold-glow">
        
        {/* Header Section */}
        <div className="relative z-20 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-full border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-cyber-flicker">
                <Skull className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-amber-400 tracking-[0.25em] uppercase italic drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                  KẾT TOÁN PHI VỤ NGẦM
                </h2>
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-3 h-3 text-cyan-400/60" />
                  <p className="text-[10px] text-cyan-500/60 font-mono tracking-tighter uppercase">SYNDICATE_SECURE_R{turn}_ENC_{Date.now().toString(16)}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-amber-500/50 uppercase font-black tracking-widest">KIỂM SOÁT MẠNG LƯỚI</p>
              <p className="text-lg font-black text-[#39ff14] family-mono flex items-center justify-end gap-1">
                {totalNodes} <span className="text-xs text-amber-500/40">/ 5 VÙNG</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* LEFT COLUMN: DETAILED STATS */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center text-xs px-1 border-b border-amber-500/20 pb-2">
                <span className="text-amber-500 font-black uppercase tracking-widest">Chi tiết dòng tiền</span>
                <span className="text-amber-500/50 font-mono italic">TRANSACTION_LOGS</span>
              </div>
              
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { key: 'base', icon: TrendingUp, label: 'Trợ cấp hắc đạo', val: `+$${base}`, color: 'amber' },
                  { key: 'smurf', icon: Coins, label: 'Rửa tiền chân rết', val: `+$${smurf}`, color: 'amber' },
                  { key: 'layer', icon: Ghost, label: 'Lãi mạng lưới ma', val: `+$${layer}`, color: 'cyan' },
                  { key: 'loop', icon: RefreshCw, label: 'Vòng lặp sạch hóa', val: `+$${loop}`, color: 'amber', anim: 'animate-spin-slow' },
                  { key: 'upkeep', icon: ShieldAlert, label: 'Chi phí bôi trơn', val: `-$${upkeep}`, color: 'red', condition: upkeep > 0 }
                ].map((item, index) => (
                  <div key={item.key} className="space-y-1">
                    <button 
                      onClick={() => toggleIntel(item.key)}
                      className={`flex justify-between items-center w-full p-3 bg-black/40 border transition-all rounded-lg group
                        ${activeIntel === item.key ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-amber-500/10 hover:border-amber-500/30'}
                        ${item.key === 'upkeep' && !item.condition ? 'opacity-20 pointer-events-none' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-3.5 h-3.5 text-${item.color}-400 ${item.anim || ''}`} />
                        <span className="text-amber-100/60 text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                      </div>
                      <span className={`font-mono font-black ${item.color === 'red' ? 'text-red-500' : 'text-[#39ff14]'}`}>{item.val}</span>
                    </button>
                    {activeIntel === item.key && (
                      <div className="mx-2 p-3 bg-amber-500/5 border-l-2 border-amber-400/60 rounded-r animate-in slide-in-from-top-1 duration-200">
                        <p className="text-[10px] text-amber-200/70 leading-relaxed">{INTEL_CONTENT[item.key].desc}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* MIDDLE COLUMN: GROWTH CHART */}
            <div className="w-full md:w-[320px] flex flex-col justify-center">
              <div className="p-4 bg-black/60 rounded-2xl border border-amber-500/20 shadow-inner relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_70%)]" />
                <div className="mb-4 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 text-amber-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tăng trưởng dòng tiền</span>
                  </div>
                  <span className="text-[8px] font-mono text-amber-500/40">ANALYTICS_V2.1</span>
                </div>
                
                <div className="flex-1 min-h-[200px] flex items-center relative z-10">
                   <SuspicionChart 
                    data={launderedHistory || [0]} 
                    color="#f59e0b" 
                    height={180} 
                    max={targetMoney || 150000} 
                  />
                </div>
                
                <div className="mt-4 pt-4 border-t border-amber-500/10 relative z-10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] text-amber-500/40 uppercase font-black">Lượt hiện tại:</span>
                    <span className="text-[10px] text-amber-400 font-mono">#{turn}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-amber-500/40 uppercase font-black">Hiệu suất:</span>
                    <span className="text-[10px] text-[#39ff14] font-mono">+{(launderedThisRound / 1000).toFixed(1)}k/R</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SUMMARY & ACTION */}
            <div className="w-full md:w-[340px] flex flex-col space-y-6">
              {/* Net Profit Big Card */}
              <div className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center relative overflow-hidden
                ${isProfit ? 'border-amber-500/50 bg-amber-500/5' : 'border-red-500/50 bg-red-500/5'}
              `}>
                <div className={`absolute top-0 inset-x-0 h-1 ${isProfit ? 'bg-amber-500' : 'bg-red-500'}`} />
                <p className={`text-[10px] font-black tracking-[0.3em] uppercase mb-1 ${isProfit ? 'text-amber-500/70' : 'text-red-500/70'}`}>Lợi nhuận ròng</p>
                <h3 className={`text-4xl font-black font-mono mb-2 ${isProfit ? 'text-[#39ff14] drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'text-red-500'}`}>
                  {isProfit ? '+' : ''}${netIncome.toLocaleString()}
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5">
                  <DollarSign className={`w-3 h-3 ${isProfit ? 'text-[#39ff14]' : 'text-red-400'}`} />
                  <span className="text-[10px] font-mono text-white/50">Lợi nhuận lượt này</span>
                </div>
              </div>

              {/* Treasury & Progress */}
              <div className="space-y-4">
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/30 rounded-xl relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5" /> Ngân khố hiện có
                    </span>
                    <span className="text-xs text-[#39ff14] font-mono font-black">${(currentBudgetBefore + netIncome).toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-cyan-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-full animate-pulse-slow" />
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">Tiến độ thâu tóm</span>
                    <span className="text-xs text-amber-400 font-mono font-black">{totalLaunderedPercent}%</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden p-[1px]">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-yellow-300 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000"
                      style={{ width: `${totalLaunderedPercent}%` }}
                    />
                  </div>
                  <p className="text-[8px] text-amber-500/40 font-mono mt-2 text-right uppercase italic">Target: ${targetMoney.toLocaleString()}</p>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={closeFinanceReport}
                className="group relative w-full overflow-hidden border-2 border-amber-500 bg-amber-950/40 px-6 py-5 transition-all hover:bg-amber-400 active:scale-[0.98] rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="relative flex items-center justify-center space-x-3 text-amber-400 group-hover:text-black font-black tracking-[0.3em] uppercase text-xs">
                  <span>XÁC NHẬN PHI VỤ</span>
                  <ChevronRight className="w-5 h-5 animate-bounce-x" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button Mobile (Fallback) */}
        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 border-2 border-amber-500 rotate-45" />
        </div>
        
        <div className="absolute bottom-3 right-6 flex gap-6 text-[8px] text-amber-500/30 font-mono tracking-widest">
            <span className="flex items-center gap-1 uppercase">Secure Connection: Active</span>
            <span className="flex items-center gap-1 uppercase">Ledger: Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceReportModal;

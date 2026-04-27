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
    targetMoney 
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
      
      <div className="ledger-modal relative w-full max-w-lg overflow-hidden border-2 border-amber-500/50 bg-[#060401] p-8 shadow-[0_0_80px_rgba(245,158,11,0.2),inset_0_0_30px_rgba(245,158,11,0.1)] animate-gold-glow">
        
        {/* Interference Overlays */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_70%)] z-10" />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] z-10 opacity-20" />
        
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
              <p className="text-[10px] text-amber-500/50 uppercase font-black tracking-widest">KIỂM SOÁT</p>
              <p className="text-lg font-black text-[#39ff14] family-mono flex items-center justify-end gap-1">
                {totalNodes} <span className="text-xs text-amber-500/40">/ 5</span>
              </p>
            </div>
          </div>

          {/* Money Breakdown */}
          <div className="ledger-grid space-y-4 font-mono">
            <div className="ledger-line flex justify-between items-center text-sm px-1">
              <span className="text-amber-500/70 uppercase flex items-center gap-2 font-black">
                <Briefcase className="w-4 h-4 text-amber-400" /> TIỀN BẨN TRỮ KHO:
              </span>
              <span className="ledger-money text-[#39ff14] font-black text-xl drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">${currentBudgetBefore.toLocaleString()}</span>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent my-1" />

            <div className="grid grid-cols-1 gap-2">
              {[
                { key: 'base', icon: TrendingUp, label: 'Trợ cấp hắc đạo', val: `+$${base}`, color: 'amber' },
                { key: 'smurf', icon: Coins, label: 'Rửa tiền chân rết', val: `+$${smurf}`, color: 'amber' },
                { key: 'layer', icon: Ghost, label: 'Lãi mạng lưới ma', val: `+$${layer}`, color: 'cyan' },
                { key: 'loop', icon: RefreshCw, label: 'Vòng lặp sạch hóa', val: `+$${loop}`, color: 'amber', anim: 'animate-spin-slow' },
                { key: 'upkeep', icon: ShieldAlert, label: 'Chi phí bôi trơn', val: `-$${upkeep}`, color: 'red', condition: upkeep > 0 }
              ].map((item, index) => (
                <div key={item.key} className="space-y-1" style={{ animationDelay: `${index * 70}ms` }}>
                  <button 
                    onClick={() => toggleIntel(item.key)}
                    className={`ledger-line flex justify-between items-center w-full p-3 bg-[#0a0805] border transition-all rounded-lg group
                      ${activeIntel === item.key ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3),inset_0_0_10px_rgba(245,158,11,0.2)]' : 'border-amber-500/30 hover:border-amber-400/80 hover:shadow-[0_0_10px_rgba(245,158,11,0.15)]'}
                      ${item.key === 'upkeep' && !item.condition ? 'opacity-30 hover:opacity-50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20`}>
                        <item.icon className={`w-3.5 h-3.5 text-${item.color}-400 ${item.anim || ''}`} />
                      </div>
                      <span className="text-amber-100/70 text-xs font-bold uppercase tracking-tight flex items-center gap-2">
                        {item.label}
                        <Info className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                      </span>
                    </div>
                    <span className={`ledger-money font-black ${item.color === 'red' ? 'ledger-negative text-red-500' : 'text-[#39ff14]'}`}>{item.val}</span>
                  </button>

                  {/* Intel Content */}
                  {activeIntel === item.key && (
                    <div className="mx-2 p-3 bg-amber-500/5 border-l-2 border-amber-400/60 rounded-r animate-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black text-amber-500/60 tracking-widest flex items-center gap-1 uppercase">
                          <Activity className="w-2 h-2" /> SOURCE_INTEL: {INTEL_CONTENT[item.key].tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-200/80 leading-relaxed italic">
                        {INTEL_CONTENT[item.key].desc}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Profit */}
            <div className="pt-4 mt-4">
              <div className={`ledger-line flex justify-between items-center p-5 rounded-xl border-t-2 border-b-2 shadow-2xl ${isProfit ? 'border-amber-500/80 bg-amber-900/20' : 'border-red-500/80 bg-red-950/40'}`}>
                <span className={`text-lg font-black tracking-[0.2em] uppercase ${isProfit ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]' : 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.6)]'}`}>LỢI NHUẬN RÒNG:</span>
                <span className={`ledger-money text-3xl font-black drop-shadow-[0_0_15px_rgba(57,255,20,0.5)] ${isProfit ? 'text-[#39ff14]' : 'ledger-negative text-red-500'}`}>
                  {isProfit ? '+' : ''}${netIncome}
                </span>
              </div>
            </div>

            {/* Final Treasury */}
            <div className="ledger-line flex justify-between items-center p-4 bg-[#050b10] border border-cyan-500/40 rounded-lg mt-4 shadow-[inset_0_0_30px_rgba(6,182,212,0.1),0_0_15px_rgba(6,182,212,0.1)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-pulse-slow pointer-events-none" />
              <span className="relative z-10 text-cyan-400/90 uppercase font-black italic text-xs flex items-center gap-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                <Terminal className="w-4 h-4" /> NGÂN KHỐ HIỆN CÓ:
              </span>
              <span className="ledger-money text-2xl text-[#39ff14] font-black italic drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                ${(currentBudgetBefore + netIncome).toLocaleString()}
              </span>
            </div>

            <div className="h-px bg-amber-500/30 my-4" />

            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px] px-1">
                  <span className="text-amber-500/60 uppercase font-black tracking-widest italic">THU HOẠCH LƯỢT NÀY:</span>
                  <span className="text-[#39ff14] font-black text-sm">+{launderedThisRound.toLocaleString()} USD</span>
              </div>
              <div className="relative h-2.5 bg-black/50 rounded-full overflow-hidden border border-amber-500/20 p-[1px]">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 via-[#39ff14] to-yellow-400 shadow-[0_0_10px_rgba(57,255,20,0.5)] transition-all duration-1000"
                  style={{ width: `${totalLaunderedPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center px-1">
                  <span className="text-amber-400 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" /> TIẾN ĐỘ THÂU TÓM
                  </span>
                  <span className="text-amber-400 font-black text-sm tracking-[0.2em]">{totalLaunderedPercent}%</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={closeFinanceReport}
            className="group relative w-full overflow-hidden border-2 border-amber-500 bg-amber-950/40 px-6 py-5 transition-all hover:bg-amber-400 active:scale-[0.98] mt-4 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative flex items-center justify-center space-x-4 text-amber-400 group-hover:text-black font-black tracking-[0.4em] uppercase text-sm">
              <span>XÁC NHẬN PHI VỤ</span>
              <ChevronRight className="w-6 h-6 animate-bounce-x" />
            </div>
          </button>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-[-40px] right-[-40px] w-40 h-40 border-2 border-cyan-500 rotate-45" />
        </div>
        <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 border-2 border-red-500 rotate-45" />
        </div>
        
        <div className="absolute bottom-2 right-4 flex gap-6 text-[8px] text-cyan-500/40 font-mono tracking-widest">
            <span className="flex items-center gap-1 uppercase">Connection: Encrypted</span>
            <span className="flex items-center gap-1 uppercase">Stream: Active</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceReportModal;

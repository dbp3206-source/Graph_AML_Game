import React from 'react';
import { AlertTriangle, TrendingDown, DollarSign, HelpCircle, Skull, ChevronRight } from 'lucide-react';
import useGameState from '../hooks/useGameState';

const BankruptcyModal = () => {
  const { 
    showBankruptcyModal, 
    bankruptcyType, 
    executeBailout, 
    triggerBankruptcyLoss,
    moneyLaundered,
    targetMoney,
    budget
  } = useGameState();

  if (!showBankruptcyModal) return null;

  const launderedPercent = ((moneyLaundered / targetMoney) * 100).toFixed(1);
  const bailoutPenalty = (moneyLaundered * 0.05).toLocaleString();
  const isBailout = bankruptcyType === 'bailout';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden bg-[#1a0a0a] border-2 border-red-900/50 rounded-2xl shadow-[0_0_50px_rgba(153,27,27,0.3)]">
        
        {/* Gritty Header Decorations */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_10px_#dc2626]" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-600/10 blur-3xl rounded-full" />
        
        {/* Content */}
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${isBailout ? 'bg-amber-900/20 border border-amber-500/50' : 'bg-red-900/20 border border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.2)]'}`}>
              {isBailout ? (
                <AlertTriangle className="w-12 h-12 text-amber-500 animate-pulse" />
              ) : (
                <Skull className="w-12 h-12 text-red-500 mb-1" />
              )}
            </div>
          </div>

          <h2 className={`text-center text-3xl font-black tracking-tight uppercase mb-2 ${isBailout ? 'text-amber-500' : 'text-red-600'}`}>
            {isBailout ? 'Khủng Hoảng Vốn' : 'Sụp Đổ Hệ Thống'}
          </h2>
          
          <p className="text-gray-400 text-center text-sm mb-8 leading-relaxed">
            {isBailout 
              ? "Hoạt động ngầm đang thâm hụt nghiêm trọng. Hội đồng quyết định đưa ra một gói cứu trợ khẩn cấp."
              : "Quỹ đen cạn kiệt, các thành viên cốt cán đã đào tẩu. Syndicate chính thức sụp đổ."
            }
          </p>

          <div className="space-y-4 mb-8">
            {/* Status Item: Laundry Progress */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tiến độ rửa tiền</span>
                <span className="text-sm font-black text-syn-pink">{launderedPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-syn-pink transition-all duration-1000" 
                  style={{ width: `${launderedPercent}%` }} 
                />
              </div>
            </div>

            {isBailout ? (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <h4 className="text-xs font-black text-amber-500 uppercase mb-3 flex items-center gap-2">
                  <HelpCircle className="w-3 h-3" /> Điều khoản giải cứu
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Ngân sách bơm thêm</span>
                    <span className="text-sm font-bold text-green-500">+$100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Chi phí quỹ đen (-5%)</span>
                    <span className="text-sm font-bold text-red-500">-${bailoutPenalty}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <TrendingDown className="w-8 h-8 text-red-500" />
                <div>
                  <h4 className="text-xs font-black text-red-500 uppercase">Thâm hụt cực hạn</h4>
                  <p className="text-xs text-gray-500">Không đủ điều kiện để nhận cứu trợ từ tổ chức.</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {isBailout ? (
              <>
                <button
                  onClick={executeBailout}
                  className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest shadow-xl shadow-amber-900/20 transition-all flex items-center justify-center gap-2 group"
                >
                  Chấp nhận cứu trợ
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={triggerBankruptcyLoss}
                  className="w-full py-3 text-gray-500 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Chấp nhận thất bại
                </button>
              </>
            ) : (
              <button
                onClick={triggerBankruptcyLoss}
                className="w-full py-4 rounded-xl bg-red-700 hover:bg-red-600 text-white font-black uppercase tracking-widest transition-all"
              >
                Ký đơn đầu hàng
              </button>
            )}
          </div>
        </div>

        {/* Binary Overlay Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <div className="text-[8px] font-mono whitespace-pre leading-none animate-shimmer">
            {Array(50).fill(0).map(() => "011010011001010101110010101010101").join("\n")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankruptcyModal;

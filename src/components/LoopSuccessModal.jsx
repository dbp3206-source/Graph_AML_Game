import React from 'react';
import { CheckCircle2, ShieldCheck, Activity, X } from 'lucide-react';
import useGameState from '../hooks/useGameState';

const LoopSuccessModal = () => {
  const { showLoopSuccessModal, set } = useGameState();

  if (!showLoopSuccessModal) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden border-2 border-syn-pink bg-syn-darker p-8 shadow-[0_0_50px_rgba(244,114,182,0.3)]">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(var(--syn-pink) 1px, transparent 1px), linear-gradient(90deg, var(--syn-pink) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
        
        {/* Animated Scan Line */}
        <div className="absolute top-0 left-0 h-1 w-full bg-syn-pink shadow-[0_0_15px_var(--syn-pink)] animate-[scanline-slow_3s_linear_infinite]" />

        <div className="relative flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20 bg-syn-pink rounded-full" />
            <div className="relative bg-syn-dark p-4 rounded-full border-2 border-syn-pink">
              <CheckCircle2 className="w-12 h-12 text-syn-pink" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              PHÊ DUYỆT CHU TRÌNH
            </h2>
            <div className="flex items-center justify-center space-x-2 text-syn-pink/60 text-xs font-mono uppercase tracking-[0.2em]">
              <ShieldCheck className="w-4 h-4" />
              <span>Giao thức kết thúc ẩn danh</span>
            </div>
          </div>

          <div className="w-full bg-white/5 border border-white/10 p-4 rounded-lg space-y-3">
             <div className="flex justify-between items-center text-[10px] font-mono text-syn-pink">
                <span>TRẠNG THÁI:</span>
                <span className="animate-pulse">ĐANG MÃ HÓA...</span>
             </div>
             <div className="h-px bg-syn-pink/20 w-full" />
             <p className="text-sm text-gray-400 leading-relaxed italic">
                "Mạng lưới giao dịch đã được khép kín. Các thực thể trong chu trình hiện đã được đồng bộ hóa với giao thức tối mật của Syndicate."
             </p>
          </div>

          <button 
            onClick={() => set({ showLoopSuccessModal: false })}
            className="group relative w-full overflow-hidden border border-syn-pink bg-transparent px-6 py-3 transition-all hover:bg-syn-pink"
          >
            <div className="relative flex items-center justify-center space-x-2 text-syn-pink group-hover:text-syn-dark font-black tracking-widest uppercase text-sm">
              <Activity className="w-4 h-4" />
              <span>TIẾP TỤC THAO TÁC</span>
            </div>
          </button>
        </div>

        {/* Corner Decors */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-50">
            <div className="w-1 h-1 bg-syn-pink" />
            <div className="w-1 h-1 bg-syn-pink" />
            <div className="w-1 h-1 bg-syn-pink" />
        </div>
      </div>
    </div>
  );
};

export default LoopSuccessModal;

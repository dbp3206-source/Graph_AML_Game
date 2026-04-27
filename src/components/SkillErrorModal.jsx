import React from 'react';
import { AlertTriangle, X, Activity, Zap } from 'lucide-react';
import useGameState from '../hooks/useGameState';

const SkillErrorModal = () => {
  const { showSkillErrorModal, skillErrorData, closeSkillError } = useGameState();

  if (!showSkillErrorModal) return null;

  const { title, message, apLost } = skillErrorData;

  // Generate 20 sparkle positions
  const sparkles = Array.from({ length: 20 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
  }));

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm overflow-hidden border-2 border-red-500 bg-syn-darker p-8 animate-warning-premium">
        
        {/* Sparkling Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {sparkles.map((s, i) => (
            <div 
              key={i} 
              className="sparkle-particle"
              style={{ top: s.top, left: s.left, animationDelay: s.delay }}
            />
          ))}
          <div className="scanline-overlay" />
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(var(--syn-pink) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

        <div className="relative flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-40 bg-red-500 rounded-full" />
            <div className="relative bg-syn-dark p-5 rounded-xl border-2 border-red-500 animate-glitch">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-[0.2em] text-white uppercase italic">
              {title || 'CẢNH BÁO HỆ THỐNG'}
            </h2>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent" />
          </div>

          <div className="w-full bg-red-500/5 border border-red-500/20 p-5 rounded-lg">
            <p className="text-sm text-red-100/70 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          {apLost > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-full">
              <Zap className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">
                ĐÃ KHẤU TRỪ -{apLost} AP DO THAO TÁC
              </span>
            </div>
          )}

          <button 
            onClick={closeSkillError}
            className="group relative w-full overflow-hidden border-2 border-red-500 bg-red-500/10 px-6 py-3 transition-all hover:bg-red-500"
          >
            <div className="relative flex items-center justify-center space-x-2 text-red-500 group-hover:text-white font-black tracking-widest uppercase text-sm">
              <X className="w-4 h-4" />
              <span>ĐÓNG CẢNH BÁO</span>
            </div>
          </button>
        </div>

        {/* Corner Decors */}
        <div className="absolute bottom-2 left-2 flex space-x-1 opacity-40">
            <div className="w-2 h-0.5 bg-red-500" />
            <div className="w-0.5 h-2 bg-red-500" />
        </div>
        <div className="absolute top-2 right-2 flex space-x-1 opacity-40">
            <div className="w-2 h-0.5 bg-red-500" />
            <div className="w-0.5 h-2 bg-red-500" />
        </div>
      </div>
    </div>
  );
};

export default SkillErrorModal;

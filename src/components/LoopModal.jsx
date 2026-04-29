import React, { useState } from 'react';
import useGameState from '../hooks/useGameState';
import { X, RefreshCcw } from 'lucide-react';

const LoopModal = () => {
    const { showLoopModal, setShowLoopModal, startLoopPicking, loopSkillData, executeSkill } = useGameState();
    const [count, setCount] = useState(3);

    if (!showLoopModal) return null;

    const handleStart = () => {
        // startLoopPicking performs validation and consumes AP once.
        const started = startLoopPicking(count);
        // We also need to consume the cost if it wasn't already consumed
        // But executeSkill is normally called before showing modal. 
        // In our current setup, executeSkill('loop') just shows the modal.
        // So we might need to deduct AP/Funds here or let executeSkill handle it after modal.
        // Let's assume executeSkill handles the resource check but the deduction happens when picking starts.
        if (started && loopSkillData) {
            useGameState.getState().addNews({
                type: 'syndicate',
                title: '💰 ' + loopSkillData.name,
                message: loopSkillData.description
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-96 p-8 rounded-3xl bg-syn-dark border-2 border-syn-pink/50 shadow-[0_0_50px_rgba(255,0,255,0.2)] flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
                <button 
                    onClick={() => setShowLoopModal(false)}
                    className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-4 rounded-full bg-syn-pink/10 border border-syn-pink/30 mb-2">
                    <RefreshCcw className="w-12 h-12 text-syn-pink animate-spin-slow" />
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase italic mb-1">Mã hóa Vòng lặp</h2>
                    <p className="text-syn-pink text-[10px] font-bold tracking-[0.2em] uppercase">Security Protocol Initialized</p>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <div className="flex justify-between items-end mb-1">
                        <label className="text-xs font-bold text-white/70 uppercase">Số lượng đỉnh</label>
                        <span className="text-2xl font-black text-syn-pink">{count}</span>
                    </div>
                    
                    <input 
                        type="range" 
                        min="3" 
                        max="8" 
                        value={count} 
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-syn-pink"
                    />
                    
                    <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase">
                        <span>Min (3)</span>
                        <span>Max (8)</span>
                    </div>
                </div>

                <button 
                    onClick={handleStart}
                    className="w-full h-14 bg-syn-pink text-syn-dark font-black text-lg tracking-widest uppercase italic rounded-xl hover:bg-white hover:scale-[1.02] transform transition-all shadow-lg active:scale-95"
                >
                    BẮT ĐẦU CHỌN ĐỈNH
                </button>

                <div className="text-[9px] text-white/20 font-mono text-center">
                    [SYSTEM READY FOR NODE SELECTION]
                </div>
            </div>
        </div>
    );
};

export default LoopModal;

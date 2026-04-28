import React from 'react';
import { User, ShieldAlert, Activity, History, Building2, Ghost, Landmark, Wallet, X } from 'lucide-react';
import useGameState from '../hooks/useGameState';

const TYPE_CONFIG = {
  source: { label: 'NGUỒN TIỀN', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  personal: { label: 'TK CÁ NHÂN', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  shell: { label: 'CÔNG TY MA', icon: Ghost, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  bank: { label: 'NGÂN HÀNG', icon: Landmark, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  mixer: { label: 'TRẠM TRUNG CHUYỂN', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  target: { label: 'ĐIỂM ĐẾN', icon: Building2, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
};

const CustomerDossier = ({ nodeId, onClose }) => {
  const { graphData, faction } = useGameState();
  const isSyndicate = faction === 'syndicate';
  
  if (!graphData || !nodeId) return null;
  
  const node = graphData.vertices.find(v => v.id === nodeId);
  if (!node) return null;

  const config = TYPE_CONFIG[node.type] || TYPE_CONFIG.personal;
  const Icon = config.icon;

  // Use risk from node state
  const riskValue = node.risk || 10;
  const riskColor = riskValue > 70 ? 'bg-red-500' : riskValue > 40 ? 'bg-yellow-500' : 'bg-emerald-500';

  return (
    <div className="absolute top-4 right-4 w-72 glass-panel border-white/10 shadow-2xl z-[100] animate-in slide-in-from-right-4 fade-in duration-300 pointer-events-auto">
      {/* Header */}
      <div className={`p-4 border-b border-white/5 flex items-center justify-between ${config.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase leading-none mb-1">Dossier File</p>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">{config.label}</h3>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
          <X className="w-4 h-4 text-white/40" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="p-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-inner relative overflow-hidden group">
            {node.emoji || '👤'}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white leading-none mb-1">{node.displayName || node.id}</h4>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">ID: {node.id.split('_')[0]}</p>
          </div>
        </div>

        {/* Risk Meter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-white/40" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Mức độ rủi ro</span>
            </div>
            <span className={`text-xs font-black ${riskValue > 40 ? 'text-red-400' : 'text-emerald-400'}`}>{riskValue}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${riskColor} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
              style={{ width: `${riskValue}%` }}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-[9px] font-black text-white/30 uppercase mb-1">Trạng thái</p>
            <p className={`text-xs font-bold ${node.isFrozen ? 'text-red-400' : 'text-emerald-400'}`}>
              {node.isFrozen ? 'PHONG TỎA' : node.isInactive ? 'NGỪNG HOẠT ĐỘNG' : 'HOẠT ĐỘNG'}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-[9px] font-black text-white/30 uppercase mb-1">Tiếp cận</p>
            <p className="text-xs font-bold text-white">
              {node.isRevealed ? 'ĐÃ LỘ DIỆN' : 'BẢO MẬT'}
            </p>
          </div>
        </div>

        {/* History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-3 h-3 text-white/40" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Lịch sử tác động</span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
            {(node.skillHistory || []).length > 0 ? (
              node.skillHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-[11px] font-bold text-white/70">{h.skillName}</span>
                  <span className="text-[9px] font-mono text-white/30 italic">Lượt {h.turn}</span>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-white/20 italic text-center py-2">Chưa có lịch sử giao dịch</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20" />
    </div>
  );
};

export default CustomerDossier;

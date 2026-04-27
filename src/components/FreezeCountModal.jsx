import React, { useState, useEffect } from 'react'
import { Lock, X, AlertTriangle } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const FreezeCountModal = () => {
  const {
    showFreezeCountModal,
    invFreezeTargets,
    invFreezeStartSelection,
    closeFreezeCountModal,
    investigationBudget,
    investigatorAp
  } = useGameState()

  const [count, setCount] = useState(1)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (showFreezeCountModal) {
      setCount(1)
      setTimeout(() => setVisible(true), 30)
    } else {
      setVisible(false)
    }
  }, [showFreezeCountModal])

  if (!showFreezeCountModal || !invFreezeTargets) return null

  const maxCount = invFreezeTargets.nodes?.length || 0
  const totalCost = 10 + count * 15
  const apCost = count
  const bounty = count * 10
  const canAfford = investigationBudget >= totalCost && investigatorAp >= apCost
  const algo = invFreezeTargets.algo?.toUpperCase() || 'NETWORK'
  const type = invFreezeTargets.type

  const handleCountChange = (val) => {
    const v = Math.max(1, Math.min(maxCount, parseInt(val) || 1))
    setCount(v)
  }

  return (
    <div className={`fixed inset-0 z-[9998] flex items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={closeFreezeCountModal} />

      <div
        className={`relative z-10 w-[440px] rounded-2xl overflow-hidden transition-all duration-400 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        style={{
          background: 'linear-gradient(135deg, #030010, #0a001a, #05000f)',
          border: '2px solid rgba(168,85,247,0.6)',
          boxShadow: '0 0 60px rgba(168,85,247,0.35), inset 0 0 40px rgba(168,85,247,0.04)'
        }}
      >
        {/* Top glow */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

        {/* Grid BG */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(168,85,247,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-purple-400/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-400/15 border border-purple-400/30">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-[9px] text-purple-400/60 uppercase font-black tracking-widest">
                  {algo} — {type === 'scc' ? 'FRAUD RINGS' : 'HUB NODES'}
                </p>
                <h3 className="text-base font-black text-white uppercase tracking-wide">PHÂN TÍCH MẠNG LƯỚI</h3>
              </div>
            </div>
            <button onClick={closeFreezeCountModal}
              className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="relative p-6 space-y-5">
          {/* Target count info */}
          <div className="p-3 rounded-xl border border-purple-400/20 bg-purple-400/05">
            <p className="text-[10px] text-white/60 font-mono">
              ⚡ Phát hiện <span className="text-purple-400 font-black">{maxCount}</span> đối tượng khả nghi đang bị highlight trên đồ thị.
            </p>
          </div>

          {/* Number Input */}
          <div>
            <label className="block text-[9px] font-black text-purple-400/70 uppercase tracking-widest mb-2">
              Nhập số lượng đối tượng muốn phong tỏa (Max: {maxCount}):
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCountChange(count - 1)}
                className="w-10 h-10 rounded-lg font-black text-lg flex items-center justify-center transition-all"
                style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}
              >−</button>
              <input
                type="number"
                min={1}
                max={maxCount}
                value={count}
                onChange={e => handleCountChange(e.target.value)}
                className="flex-1 text-center text-2xl font-black font-mono bg-transparent outline-none"
                style={{
                  border: '2px solid rgba(168,85,247,0.4)',
                  borderRadius: '12px',
                  padding: '10px',
                  color: '#a855f7',
                  background: 'rgba(168,85,247,0.08)'
                }}
              />
              <button
                onClick={() => handleCountChange(count + 1)}
                className="w-10 h-10 rounded-lg font-black text-lg flex items-center justify-center transition-all"
                style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}
              >+</button>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
            <div className="text-center">
              <p className="text-[8px] text-purple-400/60 uppercase font-black">Chi phí</p>
              <p className="text-xl font-black font-mono" style={{ color: canAfford ? '#a855f7' : '#ef4444' }}>${totalCost}</p>
              <p className="text-[8px] text-white/30 font-mono">$10 + {count}×$15</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] text-purple-400/60 uppercase font-black">AP tiêu hao</p>
              <p className="text-xl font-black font-mono text-yellow-400">{apCost}</p>
              <p className="text-[8px] text-white/30 font-mono">còn {investigatorAp} AP</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] text-purple-400/60 uppercase font-black">Bounty</p>
              <p className="text-xl font-black font-mono text-[#39ff14]">+${bounty}</p>
              <p className="text-[8px] text-white/30 font-mono">${investigationBudget} có sẵn</p>
            </div>
          </div>

          {!canAfford && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-[10px] text-red-400/80 font-mono">
                {investigationBudget < totalCost ? `Thiếu $${totalCost - investigationBudget} ngân sách.` : `Thiếu ${apCost - investigatorAp} AP.`} Giảm số lượng phong tỏa.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => canAfford && invFreezeStartSelection(count)}
              disabled={!canAfford}
              className="flex-1 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider relative overflow-hidden group transition-all"
              style={{
                background: canAfford ? 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(168,85,247,0.15))' : 'rgba(168,85,247,0.05)',
                border: `2px solid ${canAfford ? 'rgba(168,85,247,0.7)' : 'rgba(168,85,247,0.2)'}`,
                color: canAfford ? '#a855f7' : 'rgba(168,85,247,0.3)',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                boxShadow: canAfford ? '0 0 20px rgba(168,85,247,0.25)' : 'none'
              }}
            >
              {canAfford && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />}
              <div className="flex items-center justify-center gap-2 relative">
                <Lock className="w-4 h-4" />
                <span>PHONG TỎA {count} ĐỐI TƯỢNG - ${totalCost}</span>
              </div>
            </button>
            <button
              onClick={closeFreezeCountModal}
              className="px-4 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}
            >
              Hủy
            </button>
          </div>

          <p className="text-[9px] text-white/30 font-mono text-center">
            Sau khi xác nhận → Click trực tiếp vào đỉnh đang nhấp nháy để phong tỏa
          </p>
        </div>
      </div>
    </div>
  )
}

export default FreezeCountModal

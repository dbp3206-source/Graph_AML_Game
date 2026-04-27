import React, { useState, useEffect } from 'react'
import { Lock, X, CheckSquare, Square, DollarSign, Zap } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const EMOJI_MAPS = {
  shell: '🏢', personal: '👤', bank: '🏦', source: '💰', mixer: '🔄', target: '🏦'
}

const FreezeSelectModal = () => {
  const { showFreezePopup, invFreezeTargets, invFreezeConfirm, closeFreezePopup, investigationBudget, investigatorAp } = useGameState()
  const [selectedIds, setSelectedIds] = useState([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (showFreezePopup) {
      setSelectedIds([])
      setTimeout(() => setVisible(true), 30)
    } else {
      setVisible(false)
    }
  }, [showFreezePopup])

  if (!showFreezePopup || !invFreezeTargets) return null

  const { nodes, type, algo } = invFreezeTargets

  const toggleNode = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Progressive cost: $20 first, $15 second, $10 each after
  const costPerNode = (i) => i === 0 ? 20 : i === 1 ? 15 : 10
  const totalCost = selectedIds.reduce((acc, _, i) => acc + costPerNode(i), 0)
  const apCost = 2
  const bounty = selectedIds.length * 10

  const canAfford = investigationBudget >= totalCost && investigatorAp >= apCost
  const noneSelected = selectedIds.length === 0

  return (
    <div className={`fixed inset-0 z-[9998] flex items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeFreezePopup} />

      <div className={`relative z-10 w-[460px] max-h-[85vh] rounded-2xl overflow-hidden transition-all duration-400 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        style={{
          background: 'linear-gradient(135deg, #030010, #0a001a)',
          border: '2px solid rgba(168,85,247,0.5)',
          boxShadow: '0 0 50px rgba(168,85,247,0.3), inset 0 0 30px rgba(168,85,247,0.03)'
        }}
      >
        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-purple-400/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-400/15 border border-purple-400/30">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-[9px] text-purple-400/60 uppercase font-black tracking-widest">
                  {algo?.toUpperCase()} — {type === 'scc' ? 'FRAUD RINGS' : 'HUB NODES'}
                </p>
                <h3 className="text-base font-black text-white uppercase tracking-wide">Chọn Đỉnh Phong Tỏa</h3>
              </div>
            </div>
            <button onClick={closeFreezePopup}
              className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-white/50 font-mono mt-3">
            Chọn các tài khoản cần phong tỏa. Phí tăng dần: $20 → $15 → $10 mỗi đỉnh thêm.
          </p>
        </div>

        {/* Node List */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[320px] custom-scrollbar">
          {nodes.map((node, idx) => {
            const isSelected = selectedIds.includes(node.id)
            const nodeIdx = selectedIds.indexOf(node.id)
            const nodeCost = nodeIdx >= 0 ? costPerNode(nodeIdx) : costPerNode(selectedIds.length)
            const emoji = node.emoji || EMOJI_MAPS[node.type] || '⚪'

            return (
              <button
                key={node.id}
                onClick={() => toggleNode(node.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group"
                style={{
                  background: isSelected ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                  border: isSelected ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isSelected ? '0 0 15px rgba(168,85,247,0.2)' : 'none'
                }}
              >
                {/* Checkbox */}
                <div style={{ color: isSelected ? '#a855f7' : 'rgba(255,255,255,0.2)' }}>
                  {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </div>

                {/* Node info */}
                <span className="text-xl">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white uppercase truncate">
                    {node.displayName || node.label || node.id}
                  </p>
                  <p className="text-[9px] font-mono" style={{ color: 'rgba(168,85,247,0.6)' }}>
                    {node.type} • ID: {node.id}
                  </p>
                </div>

                {/* Cost badge */}
                <div className="text-right flex-shrink-0">
                  {isSelected ? (
                    <div className="px-2 py-0.5 rounded-md text-[9px] font-black"
                      style={{ background: 'rgba(168,85,247,0.2)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.4)' }}>
                      ${costPerNode(nodeIdx)} ✓
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 rounded-md text-[9px] font-black opacity-50"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                      ${nodeCost}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Cost Summary */}
        <div className="px-4 pb-4">
          <div className="p-3 rounded-xl mb-3"
            style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}
          >
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[8px] text-purple-400/60 uppercase font-black">Phong tỏa</p>
                <p className="text-xl font-black text-white">{selectedIds.length}</p>
                <p className="text-[8px] text-white/30 font-mono">/ {nodes.length} đỉnh</p>
              </div>
              <div>
                <p className="text-[8px] text-purple-400/60 uppercase font-black">Chi phí</p>
                <p className="text-xl font-black font-mono" style={{ color: canAfford ? '#a855f7' : '#ef4444' }}>
                  ${totalCost}
                </p>
                <p className="text-[8px] text-white/30 font-mono">-{apCost} AP</p>
              </div>
              <div>
                <p className="text-[8px] text-purple-400/60 uppercase font-black">Bounty</p>
                <p className="text-xl font-black text-[#39ff14] font-mono">+${bounty}</p>
                <p className="text-[8px] text-white/30 font-mono">${investigationBudget} có sẵn</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => invFreezeConfirm(selectedIds)}
              disabled={noneSelected || !canAfford}
              className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all relative overflow-hidden group"
              style={{
                background: noneSelected || !canAfford
                  ? 'rgba(168,85,247,0.05)'
                  : 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(168,85,247,0.15))',
                border: `2px solid ${noneSelected || !canAfford ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.7)'}`,
                color: noneSelected || !canAfford ? 'rgba(168,85,247,0.4)' : '#a855f7',
                cursor: noneSelected || !canAfford ? 'not-allowed' : 'pointer',
                boxShadow: !noneSelected && canAfford ? '0 0 20px rgba(168,85,247,0.3)' : 'none'
              }}
            >
              {!noneSelected && canAfford && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              )}
              <div className="flex items-center justify-center gap-2 relative">
                <Lock className="w-4 h-4" />
                <span>PHONG TỎA {selectedIds.length > 0 ? `${selectedIds.length} ĐỈnh` : '(chọn ít nhất 1)'}</span>
              </div>
            </button>
            <button
              onClick={closeFreezePopup}
              className="px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}
            >
              Hủy
            </button>
          </div>

          {!canAfford && selectedIds.length > 0 && (
            <p className="text-[9px] text-red-400/80 font-mono text-center mt-2">
              ⚠️ Không đủ ${investigationBudget} để chi $${totalCost}. Bỏ chọn bớt đỉnh.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FreezeSelectModal

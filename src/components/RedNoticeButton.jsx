import React, { useState, useEffect } from 'react'
import useGameState from '../hooks/useGameState'
import { AlertTriangle, Zap } from 'lucide-react'

/**
 * RedNoticeButton — Full-screen Red Notice activation overlay
 * Appears as a corner button when budget < 10 or escapeRisk >= 70%
 * After clicking, shows a 2s flash then a free-skill selector
 */
const RedNoticeButton = () => {
  const {
    hasUsedRedNotice,
    investigationBudget,
    sitrepData,
    activateRedNotice,
    invRedNoticeFreeSkill,
    faction,
    showSitrep,
    invSelectedNetworkAlgo
  } = useGameState()

  const [phase, setPhase] = useState('idle') // 'idle' | 'flashing' | 'selectSkill'

  const escapeRisk = sitrepData?.escapeRisk ?? 0
  const shouldShow = faction === 'investigator' && !hasUsedRedNotice && !showSitrep &&
    (investigationBudget < 10 || escapeRisk >= 70)

  const handleActivate = () => {
    setPhase('flashing')
    activateRedNotice()
    setTimeout(() => setPhase('selectSkill'), 1800)
  }

  const handleFreeSkill = (skillId, algo) => {
    invRedNoticeFreeSkill(skillId, algo || invSelectedNetworkAlgo)
    setPhase('idle')
  }

  if (!shouldShow && phase === 'idle') return null

  return (
    <>
      {/* === FLASHING OVERLAY === */}
      {phase === 'flashing' && (
        <div className="fixed inset-0 z-[10001] pointer-events-none" style={{ animation: 'red-flash-in 1.8s ease-out forwards' }}>
          <div className="absolute inset-0 bg-red-600/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-8xl font-black text-red-400 font-mono tracking-[0.2em]"
                style={{ textShadow: '0 0 60px #ef4444, 0 0 120px #ef4444', animation: 'text-glitch 0.2s infinite alternate' }}>
                🚨
              </p>
              <p className="text-2xl font-black text-white tracking-[0.5em] uppercase mt-4"
                style={{ textShadow: '0 0 30px #ef4444' }}>RED NOTICE</p>
              <p className="text-sm text-red-400/80 font-mono mt-2 tracking-widest">INTERPOL EMERGENCY WARRANT</p>
            </div>
          </div>
        </div>
      )}

      {/* === SKILL SELECTOR === */}
      {phase === 'selectSkill' && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 w-[460px] rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #130005, #0a0010)',
              border: '2px solid rgba(239,68,68,0.7)',
              boxShadow: '0 0 60px rgba(239,68,68,0.4)'
            }}
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent" />

            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-400 animate-bounce" />
                <div>
                  <p className="text-[9px] text-red-400/60 uppercase font-black tracking-widest">Red Notice Activated</p>
                  <h3 className="text-lg font-black text-white tracking-widest uppercase">Chọn Kỹ Năng Miễn Phí</h3>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-mono mb-5">
                1 kỹ năng sẽ được thực thi HOÀN TOÀN MIỄN PHÍ (0$ + 0 AP). Sương mù chiến tranh đã bị xóa.
              </p>

              <div className="space-y-2">
                {[
                  { id: 'bridge', label: '[DÒ CẦU]', name: 'Bridge Hunter', icon: '🌉' },
                  { id: 'deorient', label: '[GIẢI ĐỊNH CHIỀU]', name: 'De-Orientation', icon: '🧭' },
                  { id: 'network_tarjan', label: '[TARJAN SCC]', name: 'Network Analyzer', icon: '🔵', algo: 'tarjan' },
                  { id: 'network_kosaraju', label: '[KOSARAJU]', name: 'Network Analyzer', icon: '🔵', algo: 'kosaraju' },
                ].map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleFreeSkill(skill.id.startsWith('network') ? 'network' : skill.id, skill.algo)}
                    className="w-full flex items-center justify-between p-4 rounded-xl transition-all group"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.3)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.18)'
                      e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(239,68,68,0.2)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{skill.icon}</span>
                      <div className="text-left">
                        <p className="text-[8px] text-red-400/70 font-black uppercase tracking-widest">{skill.label}</p>
                        <p className="text-sm font-black text-white uppercase">{skill.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-red-400 line-through opacity-50">$25 / -1AP</span>
                      <span className="text-[10px] font-black text-[#39ff14]">MIỄN PHÍ</span>
                      <Zap className="w-3.5 h-3.5 text-[#39ff14]" />
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPhase('idle')}
                className="w-full mt-4 py-2 rounded-lg text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Đóng (Dùng sau)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RedNoticeButton

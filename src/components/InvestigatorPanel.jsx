import React, { useState } from 'react'
import { Search, Network, Compass, RotateCcw, Zap, X, ChevronDown, Lock, AlertTriangle, Target, Shield, Activity, Circle } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const SKILL_INFO = {
  ring: {
    title: 'DÒ VÒNG',
    accent: '#ff007f',
    bullets: [
      'Phát hiện các vòng lặp tài chính đang che giấu vết.',
      'Đánh dấu những điểm và cạnh then chốt để phá vỡ cấu trúc vòng.',
      'Thích hợp khi cần cắt nhanh một Fraud Ring đang hoạt động.'
    ]
  },
  deorient: {
    title: 'GIẢI ĐỊNH CHIỀU',
    accent: '#0096ff',
    bullets: [
      'Vô hiệu hóa hướng ưu tiên của dòng tiền đang bị định tuyến.',
      'Làm mạng lưới trở nên dễ bị chặn hơn ở trục vận chuyển.',
      'Có lợi khi đối phương vừa đẩy mạnh lưu lượng về đích.'
    ]
  },
  tarjan: {
    title: 'PHÂN TÍCH TARJAN',
    accent: '#22c55e',
    bullets: [
      'Quét SCC để tìm cụm đỉnh có liên kết vòng bền chặt.',
      'Phù hợp cho các pha phong tỏa nhằm vào vùng có rủi ro cao.',
      'Dùng khi cần nhìn nhanh ring nào đang hoạt động bên trong.'
    ]
  },
  kosaraju: {
    title: 'PHÂN TÍCH KOSARAJU',
    accent: '#f59e0b',
    bullets: [
      'Truy vết các hub trung tâm trong mạng lưới dòng tiền.',
      'Hữu ích khi cần cắt nút trung chuyển có độ tập trung cao.',
      'Tốt cho giai đoạn sàng lọc và ưu tiên phong tỏa.'
    ]
  }
}

// --- Individual Skill Card with 2-Phase UX ---
const SkillCard = ({ skillId, icon: Icon, label, name, scanCost, execCost, execAp, accentColor, phase, scanResult, onScan, onExecute, onCancel, onFocus, disabled }) => {
  const isExecutePhase = phase === 'execute'
  const hasTargets = scanResult?.targets && (
    Array.isArray(scanResult.targets)
      ? scanResult.targets.length > 0
      : (scanResult.targets.cycleNodes?.length > 0 || scanResult.targets.hubs?.length > 0)
  )
  const targetCount = hasTargets
    ? (Array.isArray(scanResult.targets)
        ? scanResult.targets.length
        : (scanResult.targets.cycleNodes?.length || scanResult.targets.hubs?.length || 0))
    : 0

  return (
    <div
      className="rounded-xl relative overflow-hidden transition-all duration-300"
      style={{
        border: isExecutePhase ? `2px solid ${accentColor}80` : '2px solid rgba(0,255,255,0.15)',
        background: isExecutePhase ? `${accentColor}08` : 'rgba(0,255,255,0.03)',
        boxShadow: isExecutePhase ? `0 0 20px ${accentColor}20` : 'none'
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: isExecutePhase ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)` : 'rgba(0,255,255,0.1)' }}
      />

      <div className="p-4">
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg" style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}>
            <Icon className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: `${accentColor}80` }}>{label}</p>
            <p className="text-xs font-black text-white uppercase truncate">{name}</p>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
          <div className="min-w-0">
            <p className="resource-number text-base font-black text-[#39ff14] drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">-${scanCost}</p>
          </div>
          <div className="px-2 py-0.5 rounded bg-cyan-400/20 border border-cyan-400/40">
             <p className="text-cyan-400 font-black text-xs">-{execAp} AP</p>
          </div>
          {isExecutePhase && (
            <div className="min-w-0 text-right">
              <p className="resource-number text-base font-black text-red-500">-${execCost}</p>
            </div>
          )}
        </div>

        {/* Execute Phase summary */}
        {isExecutePhase && hasTargets && (
          <div className="mb-3 p-2 rounded-lg border" style={{ borderColor: `${accentColor}30`, background: `${accentColor}10` }}>
            <p className="text-[9px] font-black uppercase" style={{ color: accentColor }}>
              ⚡ {targetCount} MỤC TIÊU PHÁT HIỆN
            </p>
            <p className="text-[9px] text-white/50 font-mono mt-0.5">Sẵn sàng thực thi lệnh...</p>
          </div>
        )}

        {/* Phase 1: SCAN button */}
        {!isExecutePhase && (
          <button
            onClick={() => {
              onFocus?.(skillId)
              onScan()
            }}
            disabled={disabled}
            className="skill-button w-full py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden group"
            style={{
              border: `1px solid ${accentColor}40`,
              background: `${accentColor}10`,
              color: accentColor,
              opacity: disabled ? 0.4 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            <span className="relative">QUÉT</span>
          </button>
        )}

        {/* Phase 2: EXECUTE + CANCEL */}
        {isExecutePhase && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                onFocus?.(skillId)
                onExecute()
              }}
              disabled={disabled}
              className="skill-button flex-1 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-tight transition-all relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #ef444430, #ef444420)',
                border: '1px solid #ef444460',
                color: '#ef4444',
                boxShadow: '0 0 15px rgba(239,68,68,0.2)',
                opacity: disabled ? 0.4 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            >
              <div className="absolute inset-0 bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">LOẠI BỎ</span>
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-tight transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Network Analyzer Card (Tarjan/Kosaraju with dropdown) ---
const NetworkAnalyzerCard = ({ phase, scanResult, onScan, onExecute, onCancel, onFocus, disabled, selectedAlgo, setSelectedAlgo }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const isExecutePhase = phase === 'execute'
  const accentColor = '#a855f7'

  const algos = {
    tarjan: { label: 'TARJAN SCC', scanCost: 30, execAp: 'N', desc: 'Phát hiện vòng xoáy tài chính khép kín (SCC). Nhập số đỉnh muốn phong tỏa → Click trực tiếp lên đồ thị.' },
    kosaraju: { label: 'KOSARAJU', scanCost: 30, execAp: 'N', desc: 'Truy vết nút gom tiền trung tâm (inDegree ≥ 2). Nhập số lượng → Click lên đồ thị để phong tỏa.' }
  }
  const current = algos[selectedAlgo]

  const hasTargets = scanResult?.targets && (
    Array.isArray(scanResult.targets) ? scanResult.targets.length > 0 : (scanResult.targets.hubs?.length || 0) > 0
  )
  const targetCount = hasTargets
    ? (Array.isArray(scanResult.targets) ? scanResult.targets.length : (scanResult.targets.hubs?.length || 0))
    : 0

  return (
    <div
      className="rounded-xl relative overflow-hidden transition-all duration-300"
      style={{
        border: isExecutePhase ? `2px solid ${accentColor}80` : '2px solid rgba(168,85,247,0.15)',
        background: isExecutePhase ? `${accentColor}08` : 'rgba(168,85,247,0.03)',
        boxShadow: isExecutePhase ? `0 0 20px ${accentColor}30` : 'none'
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}${isExecutePhase ? 'ff' : '40'}, transparent)` }}
      />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg" style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}>
            <Network className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: `${accentColor}80` }}>[PHÂN TÍCH MẠNG LƯỚI]</p>
            <p className="text-xs font-black text-white uppercase">Network Analyzer</p>
          </div>
        </div>

        {/* Algo Selector (scan phase only) */}
        {!isExecutePhase && (
          <div className="relative mb-3">
            <button
              onClick={() => setShowDropdown(v => !v)}
            className="skill-button w-full flex items-center justify-between p-2.5 rounded-lg transition-all"
              style={{ border: `1px solid ${accentColor}40`, background: `${accentColor}15`, color: accentColor }}
            >
              <span className="text-[10px] font-black uppercase tracking-wide">PHÂN TÍCH: {current.label}</span>
              <ChevronDown className="w-3.5 h-3.5" style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50 shadow-2xl"
                style={{ border: `1px solid ${accentColor}40`, background: '#0a0015' }}>
                {Object.entries(algos).map(([key, algo]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedAlgo(key); setShowDropdown(false) }}
                    className="w-full text-left px-3 py-2.5 transition-all flex items-center justify-between"
                    style={{
                      background: selectedAlgo === key ? `${accentColor}20` : 'transparent',
                      borderLeft: selectedAlgo === key ? `3px solid ${accentColor}` : '3px solid transparent',
                      color: selectedAlgo === key ? accentColor : 'rgba(255,255,255,0.5)'
                    }}
                  >
                    <span className="text-[9px] font-black uppercase">{algo.label}</span>
                    <span className="text-[9px] font-mono opacity-60">${algo.scanCost}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
          <div className="min-w-0">
            <p className="resource-number text-base font-black text-[#39ff14] drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">-${current.scanCost}</p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[10px] font-black uppercase tracking-wide text-white/40">TRUY VẾT MẠNG LƯỚI</p>
          </div>
        </div>

        {isExecutePhase && hasTargets && (
          <div className="mb-3 p-2 rounded-lg border" style={{ borderColor: `${accentColor}30`, background: `${accentColor}10` }}>
            <p className="text-[9px] font-black uppercase" style={{ color: accentColor }}>
              ⚡ {targetCount} {scanResult?.type === 'scc' ? 'VÒNG LẶP' : 'NÚT TRUNG TÂM'} PHÁT HIỆN
            </p>
            <p className="text-[9px] text-white/50 font-mono mt-0.5">Nhấn PHONG TỎA → Click đỉnh trên đồ thị</p>
          </div>
        )}

        {!isExecutePhase && (
          <button
            onClick={() => {
              onFocus?.(selectedAlgo)
              onScan(selectedAlgo)
            }}
            disabled={disabled}
            className="skill-button w-full py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden group"
            style={{
              border: `1px solid ${accentColor}40`,
              background: `${accentColor}15`,
              color: accentColor,
              opacity: disabled ? 0.4 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            <span className="relative">QUÉT</span>
          </button>
        )}

        {isExecutePhase && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                onFocus?.(selectedAlgo)
                onExecute()
              }}
              disabled={disabled}
              className="skill-button flex-1 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-tight transition-all relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #ef444430, #ef444420)',
                border: '1px solid #ef444460',
                color: '#ef4444',
                boxShadow: '0 0 15px rgba(239,68,68,0.2)',
                opacity: disabled ? 0.4 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            >
              <div className="absolute inset-0 bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">PHONG TỎA MỤC TIÊU</span>
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-tight transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Main InvestigatorPanel ---
const InvestigatorPanel = ({ onSkillFocus }) => {
  const {
    investigationBudget,
    investigatorAp,
    maxInvestigatorAp,
    gameStatus,
    isAnimating,
    invSkillPhase,
    invScanResult,
    invScan,
    invExecute,
    invCancel,
    invSelectedNetworkAlgo,
    setInvSelectedNetworkAlgo,
    graphData,
    scenario,
    suspicionProgress,
    hasUsedRedNotice,
    activateRedNotice,
    sitrepData,
    showSitrep,
    invFreezeSelectionMode,
    invFreezeRemaining,
    invFreezeMax,
    animationSpeed,
    setAnimationSpeed
  } = useGameState()

  const disabled = gameStatus !== 'playing' || isAnimating || showSitrep || invFreezeSelectionMode

  const escapeRisk = sitrepData?.escapeRisk ?? 0
  const showRedNotice = !hasUsedRedNotice && (investigationBudget < 10 || escapeRisk >= 70)

  // Suspicion Progress color thresholds
  const progressColor = suspicionProgress >= 75
    ? '#ef4444'
    : suspicionProgress >= 50
    ? '#f59e0b'
    : '#39ff14'

  const isProgressBlinking = suspicionProgress >= 75

  const focusSkill = (skillId) => {
    const info = SKILL_INFO[skillId]
    if (!info || !onSkillFocus) return
    onSkillFocus({
      id: skillId,
      title: info.title,
      accent: info.accent,
      bullets: info.bullets
    })
  }

  return (
    <div className="flex flex-col h-full text-white/90 overflow-hidden">

      {/* Interactive Freeze Mode Banner */}
      {invFreezeSelectionMode && (
        <div className="mb-3 p-3 rounded-xl relative overflow-hidden"
          style={{
            background: 'rgba(168,85,247,0.15)',
            border: '2px solid rgba(168,85,247,0.6)',
            boxShadow: '0 0 20px rgba(168,85,247,0.3)',
            animation: 'pulse-purple 1.5s ease-in-out infinite'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">🔒 CHẾ ĐỘ PHONG TỎA ĐANG HOẠT ĐỘNG</p>
              <p className="text-[10px] text-white/70 font-mono mt-0.5">
                Click vào đỉnh nhấp nháy trên đồ thị
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-purple-400 font-mono">{invFreezeRemaining}</p>
              <p className="text-[8px] text-purple-400/60 uppercase">/ {invFreezeMax} còn lại</p>
            </div>
          </div>
        </div>
      )}

      {/* Agent Card */}
      <div className="p-4 mb-4 rounded-xl relative overflow-hidden"
        style={{ background: 'rgba(5,15,20,0.8)', border: '1px solid rgba(0,255,255,0.3)', boxShadow: '0 0 20px rgba(0,255,255,0.08)' }}
      >
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-xl bg-cyan-400/10 border-2 border-cyan-400/30 flex items-center justify-center relative overflow-hidden agent-scan flex-shrink-0">
            <Search className="w-7 h-7 text-cyan-400 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] text-cyan-400/50 uppercase font-black tracking-widest">INVESTIGATOR</p>
            <h2 className="text-base font-black text-white leading-tight truncate"
              style={{ textShadow: '0 0 15px rgba(0,255,255,0.4)' }}>Detective Conan</h2>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-[9px] text-red-400 font-black mt-0.5">
              <Shield className="w-2.5 h-2.5" /> TOP-CLASS
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg" style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.15)' }}>
            <p className="text-[8px] text-cyan-400/60 uppercase font-black">Ngân sách</p>
            <p className="resource-number text-lg font-black text-[#39ff14] font-mono">${investigationBudget.toLocaleString()}</p>
          </div>
          <div className="p-2 rounded-lg" style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.15)' }}>
            <p className="text-[8px] text-cyan-400/60 uppercase font-black">Hành động (AP)</p>
            <p className="resource-number text-lg font-black text-white font-mono">{investigatorAp}<span className="text-sm text-white/30">/{maxInvestigatorAp}</span></p>
          </div>
        </div>

        {/* AP bar */}
        <div className="mt-2 flex gap-1">
          {Array.from({ length: maxInvestigatorAp }).map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: i < investigatorAp ? '#00ffff' : 'rgba(255,255,255,0.08)',
                boxShadow: i < investigatorAp ? '0 0 6px #00ffff' : 'none'
              }}
            />
          ))}
        </div>

        {/* SUSPICION PROGRESS BAR (Tiến độ phá án) */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3" style={{ color: progressColor }} />
              <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: progressColor }}>
                TIẾN ĐỘ PHÁ ÁN
              </p>
            </div>
            <p className="text-[10px] font-black font-mono" style={{
              color: progressColor,
              animation: isProgressBlinking ? 'inv-blink 0.8s ease-in-out infinite' : 'none'
            }}>
              {Math.round(suspicionProgress)}%
            </p>
          </div>
          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${suspicionProgress}%`,
                background: suspicionProgress >= 75
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                  : suspicionProgress >= 50
                  ? 'linear-gradient(90deg, #39ff14, #f59e0b)'
                  : 'linear-gradient(90deg, #39ff14, #22d3ee)',
                boxShadow: `0 0 10px ${progressColor}`,
                animation: isProgressBlinking ? 'progress-glow-red 0.8s ease-in-out infinite' : 'none'
              }}
            />
            {/* Threshold markers */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-yellow-400/60" style={{ left: '50%' }} />
            <div className="absolute top-0 bottom-0 w-[1px] bg-red-400/80" style={{ left: '75%' }} />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-[7px] text-white/30 font-mono">0%</p>
            <p className="text-[7px] text-yellow-400/50 font-mono">50% ⚠</p>
            <p className="text-[7px] text-red-400/60 font-mono">75% 🔴</p>
            <p className="text-[7px] text-white/50 font-mono">100% 🏆WIN</p>
          </div>
        </div>
      </div>

      {/* Graph traversal speed */}
      <div className="mb-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-widest text-cyan-300/70">Tốc độ duyệt đồ thị</p>
          <p className="resource-number font-mono text-sm font-black text-cyan-200">{animationSpeed}ms</p>
        </div>
        <input
          type="range"
          min="350"
          max="1200"
          step="50"
          value={animationSpeed}
          onChange={(event) => setAnimationSpeed(Number.parseInt(event.target.value, 10))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-cyan-400/20 accent-cyan-300"
        />
        <div className="mt-1 flex justify-between font-mono text-xs font-black uppercase text-cyan-300/45">
          <span>Nhanh</span>
          <span>Chậm</span>
        </div>
      </div>

      {/* Skill Cards */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        <p className="text-[8px] font-black text-cyan-400/50 uppercase tracking-[0.3em] px-1">Kỹ năng điều tra</p>

        {/* Skill 1: Ring Detector (DÒ VÒNG) */}
        <SkillCard
          skillId="ring"
          icon={RotateCcw}
          label="[DÒ VÒNG]"
          name="Ring Detector"
          scanCost={15}
          execCost={10}
          execAp={1}
          accentColor="#ef4444"
          phase={invSkillPhase['ring'] || 'scan'}
          scanResult={invScanResult['ring']}
          onScan={() => invScan('ring')}
          onExecute={() => invExecute('ring')}
          onCancel={() => invCancel('ring')}
          onFocus={focusSkill}
          disabled={disabled}
        />

        {/* Skill 2: De-Orientation (GIẢI ĐỊNH CHIỀU) */}
        <SkillCard
          skillId="deorient"
          icon={Compass}
          label="[GIẢI ĐỊNH CHIỀU]"
          name="De-Orientation"
          scanCost={10}
          execCost={10}
          execAp={1}
          accentColor="#22d3ee"
          phase={invSkillPhase['deorient'] || 'scan'}
          scanResult={invScanResult['deorient']}
          onScan={() => invScan('deorient')}
          onExecute={() => invExecute('deorient')}
          onCancel={() => invCancel('deorient')}
          onFocus={focusSkill}
          disabled={disabled}
        />

        {/* Skill 3: Network Analyzer (Tarjan/Kosaraju) */}
        <NetworkAnalyzerCard
          phase={invSkillPhase['network'] || 'scan'}
          scanResult={invScanResult['network']}
          onScan={(algo) => invScan('network', algo)}
          onExecute={() => invExecute('network')}
          onCancel={() => invCancel('network')}
          onFocus={focusSkill}
          disabled={disabled}
          selectedAlgo={invSelectedNetworkAlgo}
          setSelectedAlgo={setInvSelectedNetworkAlgo}
        />
      </div>

      {/* Red Notice Button */}
      {showRedNotice && (
        <div className="mt-3 pt-3 border-t border-red-500/20">
          <button
            onClick={activateRedNotice}
            className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(239,68,68,0.1))',
              border: '2px solid rgba(239,68,68,0.7)',
              color: '#ef4444',
              boxShadow: '0 0 25px rgba(239,68,68,0.3)',
              animation: 'red-notice-throb 1.5s ease-in-out infinite'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="flex items-center justify-center gap-2 relative">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>🚨 RED NOTICE — MIỄN PHÍ</span>
            </div>
            <p className="text-[8px] text-red-400/60 font-mono mt-0.5">+$50 KHẨN CẤP | XÓA SƯƠNG MÙ | 1 KỸ NĂNG FREE</p>
          </button>
        </div>
      )}
    </div>
  )
}

export default InvestigatorPanel

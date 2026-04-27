import { useEffect, useRef } from 'react'
import useGameState from '../hooks/useGameState'
import { Terminal, Cpu, Play, Pause, SkipForward, SkipBack, Monitor, Binary } from 'lucide-react'

function AlgorithmMonitor() {
  const { 
    algorithmSteps, 
    currentStepIndex, 
    isAnimating, 
    setCurrentStepIndex, 
    nextStep, 
    prevStep,
    faction,
    graphData,
    togglePlaybackMode,
    playbackMode
  } = useGameState()
  
  const scrollRef = useRef(null)
  const activeItemRef = useRef(null)
  const isSyndicate = faction === 'syndicate'

  const getName = (id) => {
    if (!graphData) return id
    const node = graphData.vertices.find(v => v.id === String(id))
    return node?.displayName || id
  }

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentStepIndex])

  const step = algorithmSteps[currentStepIndex] || {}

  if (algorithmSteps.length === 0) {
    return (
      <div className={`h-full flex flex-col items-center justify-center p-4 text-center ${isSyndicate ? 'syndicate-theme text-red-400 opacity-30' : 'opacity-50'}`}>
        <Cpu className="mb-2 h-8 w-8" />
        <p className={`text-[10px] font-black uppercase tracking-widest ${isSyndicate ? 'text-red-400' : 'text-white/40'}`}>Hệ thống đang chờ</p>
        <p className="mt-1 text-[9px]">{isSyndicate ? 'Dữ liệu mã hóa' : 'Sử dụng kỹ năng để xem tiến trình'}</p>
        {isSyndicate && (
          <div className="mt-4 w-full border-t border-white/10 pt-4 text-left font-mono">
            <p className="text-[10px] text-red-500">KÊNH TRUYỀN: NGOẠI TUYẾN</p>
            <p className="text-[10px] text-cyan-400">GIÁM SÁT: ĐANG CHỜ</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`h-full flex flex-col ${isSyndicate ? 'syndicate-theme bg-transparent text-[var(--neon-cyan)] p-4 overflow-hidden font-mono' : 'flex-1 flex flex-col min-h-0 bg-black/20'}`}>
      <div className={`flex items-center justify-between ${isSyndicate ? 'border-b border-red-500/30 pb-2 mb-4' : 'px-4 py-2 bg-white/5 border-y border-white/10'}`}>
        <h3 className={`text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 ${isSyndicate ? 'text-red-300' : 'text-inv-cyan'}`}>
          <Monitor className="h-3 w-3" />
          {isSyndicate ? 'Bảng tin Telegram' : 'Theo dõi thuật toán'}
        </h3>
        <span className="font-mono text-[10px] text-white/20">LOG_v3.2</span>
      </div>

      <div className={`flex-1 overflow-y-auto space-y-4 custom-scrollbar ${isSyndicate ? '' : 'p-4'}`}>
        {/* Playback Controls */}
        <div className={`flex items-center justify-between ${isSyndicate ? 'border border-white/10 p-2' : 'bg-white/5 p-2 rounded-xl'}`}>
          <button 
            onClick={prevStep} 
            className="p-2 hover:bg-white/10 rounded-lg text-white/70 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button 
            onClick={togglePlaybackMode} 
            className={`px-4 py-1 rounded-full text-[10px] font-black uppercase transition-all ${isSyndicate ? 'border border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black' : (playbackMode === 'auto' ? 'bg-inv-cyan text-black' : 'bg-white/10 text-white')}`}
          >
            {playbackMode === 'auto' ? 'Auto' : 'Manual'}
          </button>

          <button 
            onClick={nextStep} 
            className="p-2 hover:bg-white/10 rounded-lg text-white/70 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Info Area */}
        <div className="space-y-3">
          <div className={`${isSyndicate ? 'flex items-center justify-between p-2 border border-white/10' : 'flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5'}`}>
            <span className={`text-[10px] uppercase font-black ${isSyndicate ? 'text-[var(--neon-cyan)]/50' : 'text-white/40'}`}>Node hiện tại</span>
            <span className={`text-xs font-bold ${isSyndicate ? 'text-[var(--neon-cyan)]' : (isSyndicate ? 'text-syn-pink' : 'text-inv-cyan')}`}>
              {step.node ? getName(step.node) : 'None'}
            </span>
          </div>

          {step.dist !== undefined && (
            <div className={`${isSyndicate ? 'flex items-center justify-between p-2 border border-white/10' : 'flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5'}`}>
              <span className={`text-[10px] uppercase font-black ${isSyndicate ? 'text-[var(--neon-cyan)]/50' : 'text-white/40'}`}>Khoảng cách</span>
              <span className={`text-xs font-mono font-bold ${isSyndicate ? 'text-[var(--neon-green)]' : 'text-inv-emerald'}`}>
                {step.dist === Infinity ? '∞' : step.dist}
              </span>
            </div>
          )}

          {step.neighbors && (
            <div className={`${isSyndicate ? 'p-2 border border-white/10 space-y-2' : 'p-3 bg-white/5 rounded-xl border border-white/5 space-y-2'}`}>
              <span className={`text-[10px] uppercase font-black ${isSyndicate ? 'text-[var(--neon-cyan)]/50' : 'text-white/40'}`}>Láng giềng</span>
              <div className="flex flex-wrap gap-2">
                {step.neighbors.map((n, i) => (
                  <span key={i} className={`px-2 py-1 rounded text-[10px] font-mono ${isSyndicate ? 'border border-[var(--neon-cyan)]/20 text-white/70' : 'bg-white/10 text-white/70'}`}>
                    {getName(n)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isSyndicate && (
            <div className="pt-4 border-t border-white/5 opacity-80">
               <p className="text-[10px] font-bold text-[var(--neon-red)]">TRACE: OFFLINE</p>
               <p className="text-[10px] text-[var(--neon-cyan)]">MONITOR: ACTIVE</p>
               <p className="text-[8px] text-white/20 mt-2">ENCRYPTION: ACTIVE</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlgorithmMonitor

import { useState } from 'react'
import useGameState from './hooks/useGameState'
import useSimulation from './hooks/useSimulation'
import { getScenario } from './utils/scenarios'
import TutorialModal from './components/TutorialModal'
import NPCDialogue from './components/NPCDialogue'
import RadarCanvas from './components/RadarCanvas'
import NewsTicker from './components/NewsTicker'
import HomePage from './components/HomePage'
import TracePanel from './components/TracePanel'
import HorizontalResizer from './components/HorizontalResizer'
import VerticalResizer from './components/VerticalResizer'
import AlgorithmMonitor from './components/AlgorithmMonitor'
import { Info, Shield } from 'lucide-react'
import ManualGuide from './components/ManualGuide'
import PreGameGuide from './components/PreGameGuide'
import useAutoPlay from './hooks/useAutoPlay'
import WinLossOverlay from './components/WinLossOverlay'
import FreezeCountModal from './components/FreezeCountModal'
import RedNoticeButton from './components/RedNoticeButton'
import SitrepModal from './components/SitrepModal'
import InvestigatorPanel from './components/InvestigatorPanel'
import LoopModal from './components/LoopModal'
import LoopSuccessModal from './components/LoopSuccessModal'
import FinanceReportModal from './components/FinanceReportModal'
import BankruptcyModal from './components/BankruptcyModal'
import SkillErrorModal from './components/SkillErrorModal'
import DeathDefianceModal from './components/DeathDefianceModal'
import SkillInfoModal from './components/SkillInfoModal'

function App() {
  const {
    currentScreen,
    faction,
    showTutorial,
    setShowTutorial,
    setGraphData,
    scenario,
    resetGame,
    gameStatus,
    showManualGuide,
    setShowManualGuide,
    showPreGameGuide,
    newsHeight,
    setNewsHeight,
    algorithmMonitorHeight,
    setAlgorithmMonitorHeight,
    nextTurn,
    isAnimating,
    suspicionProgress
  } = useGameState()

  const [leftPanelWidth, setLeftPanelWidth] = useState(340)
  const [rightPanelWidth, setRightPanelWidth] = useState(320)

  const handleResizeLeft = (clientX) => {
    const newWidth = clientX - 24
    if (newWidth > 200 && newWidth < 600) {
      setLeftPanelWidth(newWidth)
    }
  }

  const handleResizeRight = (clientX) => {
    const newWidth = window.innerWidth - clientX - 24
    if (newWidth > 200 && newWidth < 600) {
      setRightPanelWidth(newWidth)
    }
  }

  useAutoPlay()
  useSimulation()

  const handleResizeNews = (clientY) => {
    const heightPercent = (clientY / window.innerHeight) * 100
    if (heightPercent > 10 && heightPercent < (100 - algorithmMonitorHeight - 10)) {
      setNewsHeight(heightPercent)
    }
  }

  const handleResizeMonitor = (clientY) => {
    const heightPercent = 100 - (clientY / window.innerHeight) * 100
    if (heightPercent > 10 && heightPercent < (100 - newsHeight - 10)) {
      setAlgorithmMonitorHeight(heightPercent)
    }
  }

  const isSyndicate = faction === 'syndicate'
  const [selectedSkillInfo, setSelectedSkillInfo] = useState(null)
  const [isSkillInfoOpen, setIsSkillInfoOpen] = useState(false)

  const handleSkillFocus = (skillInfo) => {
    setSelectedSkillInfo(skillInfo)
  }

  return (
    <div className={`cyber-app h-screen w-screen relative ${isSyndicate ? 'syndicate-theme' : 'investigator-theme'} ${currentScreen === 'home' ? 'home-theme' : ''}`}>
      {currentScreen === 'home' ? (
        <HomePage />
      ) : (
        <>
          <div className="relative z-10 flex w-full h-full overflow-hidden">
            {isSyndicate ? (
              /* SYNDICATE 3-COLUMN LAYOUT */
              <div className="game-shell flex flex-col w-full h-full p-6 syndicate-theme">
                {/* Header Area */}
                <div className="mb-6 flex items-center gap-4 border-b border-red-500/25 pb-4">
                   <div className="rounded-sm border-2 border-red-400/80 bg-red-500/12 p-3 shadow-[0_0_28px_rgba(239,68,68,0.35)]">
                      <Shield className="h-8 w-8 text-red-300" />
                   </div>
                   <div>
                      <h1 className="text-3xl font-black uppercase italic tracking-[0.14em] text-white drop-shadow-[0_0_14px_rgba(239,68,68,0.35)]">Mastermind Hub</h1>
                      <p className="text-sm font-black uppercase tracking-[0.32em] text-red-300">Cảnh báo mạng ngầm</p>
                   </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                  {/* LEFT PANEL: Dossier & Skills */}
                  <div 
                    className="left-tactical-panel flex flex-col pt-4 overflow-hidden"
                    style={{ width: `${leftPanelWidth}px` }}
                  >
                    <NPCDialogue onSkillFocus={handleSkillFocus} />
                  </div>

                  <HorizontalResizer onResize={handleResizeLeft} isSyndicate={true} />

                  {/* CENTER: Board */}
                  <div className="flex-1 board-hacker relative rounded-2xl border border-white/10 flex flex-col overflow-hidden mx-3">
                    <div className="absolute right-[15.5rem] top-6 z-[120] max-lg:right-6 max-lg:top-24">
                      <button
                        type="button"
                        onClick={() => setIsSkillInfoOpen(true)}
                        className="skill-info-button group relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/65 text-white/90 backdrop-blur-xl"
                        aria-label="Thông tin Kỹ năng"
                      >
                        <Info className="h-5 w-5" />
                        <span className="skill-info-tooltip pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2 py-1 text-xs text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                          Thông tin Kỹ năng
                        </span>
                      </button>
                    </div>
                    <RadarCanvas />
                  </div>

                  <HorizontalResizer onResize={handleResizeRight} isSyndicate={true} />

                  {/* RIGHT PANEL: Evidence & Status */}
                  <div 
                    className="right-tactical-panel flex flex-col gap-4 pt-4 h-full overflow-hidden"
                    style={{ width: `${rightPanelWidth}px` }}
                  >
                    <div className="panel-hacker tactical-log-shell flex-[3] min-h-0 overflow-hidden p-4">
                      <NewsTicker />
                    </div>
                    <div className="panel-hacker tactical-log-shell flex-[1.5] min-h-0 overflow-hidden p-4">
                      <TracePanel />
                    </div>
                    
                    <div className="mt-auto pb-4">
                      <button
                        onClick={nextTurn}
                        disabled={isAnimating}
                        className={`end-turn-hacker h-20 transition-all ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isAnimating ? 'ĐANG XỬ LÝ...' : 'KẾT THÚC LƯỢT'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* INVESTIGATOR 3-COLUMN LAYOUT */
              <div className="game-shell flex flex-col w-full h-full p-6 investigator-theme relative">
                {/* Header Area */}
                 <div className="flex items-center justify-center mb-6">
                    <h1 className="text-xl font-black text-inv-cyan tracking-[0.5em] uppercase border-y-2 border-inv-cyan/30 py-2">
                      Trung tâm Điều phối Mạng lưới
                    </h1>
                 </div>

                <div className="flex flex-1 overflow-hidden relative z-10">
                  {/* LEFT PANEL: Profile & Skills */}
                  <div 
                    className="left-tactical-panel flex flex-col overflow-y-auto custom-scrollbar overflow-hidden"
                    style={{ width: `${leftPanelWidth}px` }}
                  >
                    <InvestigatorPanel onSkillFocus={handleSkillFocus} />
                  </div>

                  <HorizontalResizer onResize={handleResizeLeft} isSyndicate={false} />

                  {/* CENTER: Board Area */}
                  <div className="flex-1 flex flex-col overflow-hidden rounded-xl border border-inv-cyan/20 mx-3">
                     <div className="flex-1 board-inv relative overflow-hidden bg-black/40 flex flex-col">
                        <div className="absolute right-[15.5rem] top-6 z-[120] max-lg:right-6 max-lg:top-24">
                          <button
                            type="button"
                            onClick={() => setIsSkillInfoOpen(true)}
                            className="skill-info-button group relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/65 text-white/90 backdrop-blur-xl"
                            aria-label="Thông tin Kỹ năng"
                          >
                            <Info className="h-5 w-5" />
                            <span className="skill-info-tooltip pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2 py-1 text-xs text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                              Thông tin Kỹ năng
                            </span>
                          </button>
                        </div>
                        <RadarCanvas />
                     </div>
                  </div>

                  <HorizontalResizer onResize={handleResizeRight} isSyndicate={false} />

                  {/* RIGHT PANEL: News & Data */}
                  <div 
                    className="right-tactical-panel flex flex-col gap-6 h-full overflow-hidden"
                    style={{ width: `${rightPanelWidth}px` }}
                  >
                    <div className="panel-inv tactical-log-shell flex-[2] min-h-0 overflow-hidden p-5 border-t border-inv-cyan">
                      <NewsTicker />
                    </div>
                    <div className="panel-inv tactical-log-shell flex-[3] min-h-0 overflow-hidden p-5 border-t border-inv-cyan flex flex-col">
                      <div className="flex-1 overflow-hidden">
                        <TracePanel />
                      </div>
                      <div className="mt-6">
                        <button 
                          onClick={nextTurn}
                          disabled={isAnimating}
                          className="end-turn-inv w-full p-5 rounded-lg active:scale-95 transition-transform"
                        >
                          {isAnimating ? 'ĐANG XỬ LÝ...' : 'KẾT THÚC LƯỢT'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}

      {showManualGuide && (
        <ManualGuide onClose={() => setShowManualGuide(false)} />
      )}

      {showPreGameGuide && (
        <PreGameGuide />
      )}

      <WinLossOverlay />

      {suspicionProgress > 80 && (
        <div className="suspicion-critical" />
      )}

      <FreezeCountModal />
      <RedNoticeButton />
      <SitrepModal />

      <LoopModal />
      <LoopSuccessModal />
      <FinanceReportModal />
      <BankruptcyModal />
      <SkillErrorModal />
      <DeathDefianceModal />
      <SkillInfoModal
        isOpen={isSkillInfoOpen}
        selectedSkill={selectedSkillInfo}
        onClose={() => setIsSkillInfoOpen(false)}
      />
    </div>
  )
}

export default App

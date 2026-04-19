import { useEffect } from 'react'
import useGameState from './hooks/useGameState'
import useSimulation from './hooks/useSimulation'
import { getScenario } from './utils/scenarios'
import TutorialModal from './components/TutorialModal'
import NPCDialogue from './components/NPCDialogue'
import RadarCanvas from './components/RadarCanvas'
import NewsTicker from './components/NewsTicker'
import HomePage from './components/HomePage'
import TracePanel from './components/TracePanel'
import VerticalResizer from './components/VerticalResizer'
import AlgorithmMonitor from './components/AlgorithmMonitor'
import { Shield } from 'lucide-react'
import ManualGuide from './components/ManualGuide'
import PreGameGuide from './components/PreGameGuide'
import useAutoPlay from './hooks/useAutoPlay'
import WinLossOverlay from './components/WinLossOverlay'

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
    isAnimating
  } = useGameState()

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

  return (
    <div className={`h-screen w-screen relative ${currentScreen === 'home' ? 'bg-syn-bg' : (isSyndicate ? 'syndicate-theme' : 'investigator-theme')}`}>
      {currentScreen === 'home' ? (
        <HomePage />
      ) : (
        <>
          <div className="relative z-10 flex w-full h-full overflow-hidden">
            {isSyndicate ? (
              /* SYNDICATE 3-COLUMN LAYOUT (Matches Image 1) */
              <div className="flex flex-col w-full h-full p-6 syndicate-theme">
                {/* Header Area */}
                <div className="flex items-center gap-4 mb-6 border-b border-syn-pink/20 pb-4">
                   <div className="p-2 border-2 border-syn-pink rounded-lg bg-syn-pink/10">
                      <Shield className="w-8 h-8 text-syn-pink" />
                   </div>
                   <div>
                      <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Mastermind Hub</h1>
                      <p className="text-xs font-bold text-syn-pink tracking-widest uppercase">Network Cell</p>
                   </div>
                </div>

                <div className="flex flex-1 gap-6 overflow-hidden">
                  {/* LEFT PANEL: Dossier & Skills */}
                  <div className="w-[300px] flex flex-col pt-4">
                    <NPCDialogue />
                  </div>

                  {/* CENTER: Board */}
                  <div className="flex-1 board-hacker relative rounded-2xl border border-white/10 flex flex-col overflow-hidden">
                    <RadarCanvas />
                  </div>

                  {/* RIGHT PANEL: Evidence & Status */}
                  <div className="w-[300px] flex flex-col gap-6 pt-4 h-full">
                    <div className="panel-hacker flex-[2] min-h-0 overflow-hidden p-4">
                      <NewsTicker />
                    </div>
                    <div className="panel-hacker flex-[1] min-h-0 overflow-hidden p-4">
                      <TracePanel />
                    </div>
                    
                    <div className="mt-auto">
                      <button
                        onClick={nextTurn}
                        disabled={isAnimating}
                        className={`end-turn-hacker h-16 transition-all ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isAnimating ? 'DECRYPTING...' : 'END TURN'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* INVESTIGATOR 3-COLUMN LAYOUT (Matches Image 2) */
              <div className="flex flex-col w-full h-full p-6 investigator-theme relative">
                {/* Header Area */}
                <div className="flex items-center justify-center mb-6">
                   <h1 className="text-xl font-black text-inv-cyan tracking-[0.5em] uppercase border-y-2 border-inv-cyan/30 py-2">
                     Investigator's Turn End State
                   </h1>
                </div>

                <div className="flex flex-1 gap-6 overflow-hidden relative z-10">
                  {/* LEFT PANEL: Profile & Skills */}
                  <div className="w-[340px] flex flex-col">
                    <NPCDialogue />
                  </div>

                  {/* CENTER: Board Area */}
                  <div className="flex-1 flex flex-col overflow-hidden rounded-xl border border-inv-cyan/20">
                     <div className="flex-1 board-inv relative overflow-hidden bg-black/40 flex flex-col">
                        <RadarCanvas />
                     </div>
                  </div>

                  {/* RIGHT PANEL: News & Data */}
                  <div className="w-[320px] flex flex-col gap-6 h-full">
                    <div className="panel-inv flex-[2] min-h-0 overflow-hidden p-5 border-t border-inv-cyan">
                      <NewsTicker />
                    </div>
                    <div className="panel-inv flex-[3] min-h-0 overflow-hidden p-5 border-t border-inv-cyan flex flex-col">
                      <div className="flex-1 overflow-hidden">
                        <TracePanel />
                      </div>
                      <div className="mt-6">
                        <button 
                          onClick={nextTurn}
                          disabled={isAnimating}
                          className="end-turn-inv w-full p-5 rounded-lg active:scale-95 transition-transform"
                        >
                          {isAnimating ? 'Analyzing...' : 'Kết thúc lượt'}
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
    </div>
  )
}

export default App
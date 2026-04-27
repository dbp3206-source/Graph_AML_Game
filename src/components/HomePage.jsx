import { useState } from 'react'
import useGameState from '../hooks/useGameState'
import { Play, Bot, BookOpen, ArrowRight, Shield, DollarSign, Search, Network } from 'lucide-react'

function HomePage() {
  const { faction, setFaction, startGame, setShowTutorial, setShowManualGuide, setIsAutoPlaying, setAutoPlayMode, addNews, maxLevelUnlocked, currentLevelIndex, setCurrentLevelIndex, homeSection, setScenario, setIsSimulationMode, setShowPreGameGuide } = useGameState()
  const [showLore, setShowLore] = useState(false)
  const [showLevelSelect, setShowLevelSelect] = useState(homeSection === 'levels')

  const [isSimClick, setIsSimClick] = useState(false)

  const handleLevelSelect = (index) => {
    setCurrentLevelIndex(index)
  }

  const handleStartMatch = (isSim) => {
    setScenario(`level${currentLevelIndex + 1}`)
    setIsSimulationMode(isSim)
    setShowPreGameGuide(true)
    addNews({
      type: 'system',
      title: isSim ? '🤖 Khởi tạo mô phỏng' : '🚀 Khởi tạo chiến dịch',
      message: `Đang chuẩn bị kịch bản ${currentLevelIndex + 1}...`
    })
  }

  const handleAutoPlay = () => {
    setIsSimClick(true)
    setShowLevelSelect(true)
  }


  const levels = [
    { id: 'level1', title: 'Màn 1', name: 'Chiêu bài Lớp vỏ (DFS)', difficulty: 'Easy' },
    { id: 'level2', title: 'Màn 2', name: 'Mạng lưới Smurfing (Bridges)', difficulty: 'Medium' },
    { id: 'level3', title: 'Màn 3', name: 'Vòng xoáy Tích hợp (SCC)', difficulty: 'Hard' },
  ]

  return (
    <div className="home-screen fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      <div className="home-grid-bg absolute inset-0" style={{ pointerEvents: 'none' }} />
      
      <div className={`relative z-10 max-w-4xl w-full p-8 ${showLevelSelect ? 'campaign-page-wrapper' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-syn-crimson/20 border-4 border-syn-pink mb-6">
            <DollarSign className="w-12 h-12 text-syn-pink" />
          </div>
          
          <h1 className="aml-logo text-5xl font-bold text-white mb-4 neon-text-syn">
            AML ASYMMETRY
          </h1>
          <p className="text-2xl text-white/70 mb-2">
            Syndicate vs Investigator
          </p>
          <p className="text-lg text-white/50">
            Cuộc chiến giữa thế giới ngầm và công lý
          </p>
        </div>

        <div className="space-y-6">
          {!showLore && !showLevelSelect ? (
            <>
              <button
                onClick={() => setShowLore(true)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 transition-all border border-white/10"
              >
                <BookOpen className="w-6 h-6" />
                📖 Xem Cốt Truyện & Hướng Dẫn
              </button>

                <button
                  onClick={() => setShowManualGuide(true)}
                  className="w-full py-4 bg-inv-cyan/10 hover:bg-inv-cyan/20 text-inv-cyan text-xl font-bold rounded-2xl flex items-center justify-center gap-3 transition-all border border-inv-cyan/30"
                >
                  <Network className="w-6 h-6" />
                  📜 Cẩm Nang Chiến Thuật (Algorithms)
                </button>

                <button
                  onClick={handleAutoPlay}
                  className="w-full py-4 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-xl font-bold rounded-2xl flex items-center justify-center gap-3 transition-all border border-yellow-500/30"
                >
                  <Bot className="w-6 h-6" />
                  🤖 Xem Chơi Mẫu (Simulation)
                </button>


              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowLevelSelect(true)}
                  className="flex-1 py-4 bg-syn-crimson hover:bg-syn-crimson/80 text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-105"
                >
                  <Play className="w-6 h-6" />
                  CHỌN MÀN CHƠI
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>


            </>
          ) : showLevelSelect ? (
            <div className="campaign-selection-shell level-select-panel bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="text-syn-pink" />
                  Chọn Chiến Dịch
                </div>
              </h2>

              {/* ROLE SELECTION */}
              <div className="mb-8">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Chọn Vai Trò</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFaction('syndicate')}
                    className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                      faction === 'syndicate' 
                        ? 'bg-syn-crimson/20 border-syn-crimson shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20 opacity-60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${faction === 'syndicate' ? 'bg-syn-crimson text-white' : 'bg-white/10 text-white/40'}`}>
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className={`text-sm font-bold ${faction === 'syndicate' ? 'text-white' : 'text-white/40'}`}>SYNDICATE</div>
                      <div className="text-[10px] text-white/30">Kế hoạch Rửa tiền</div>
                    </div>
                    {faction === 'syndicate' && <div className="absolute top-2 right-2 w-2 h-2 bg-syn-pink rounded-full animate-pulse" />}
                  </button>

                  <button
                    onClick={() => setFaction('investigator')}
                    className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                      faction === 'investigator' 
                        ? 'bg-inv-cyan/20 border-inv-cyan shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20 opacity-60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${faction === 'investigator' ? 'bg-inv-cyan text-white' : 'bg-white/10 text-white/40'}`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className={`text-sm font-bold ${faction === 'investigator' ? 'text-white' : 'text-white/40'}`}>INVESTIGATOR</div>
                      <div className="text-[10px] text-white/30">Truy quét tội phạm</div>
                    </div>
                    {faction === 'investigator' && <div className="absolute top-2 right-2 w-2 h-2 bg-inv-cyan rounded-full animate-pulse" />}
                  </button>
                </div>
              </div>

              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Chọn Kịch Bản</p>
              <div className="grid grid-cols-1 gap-3 mb-8">
                {levels.map((lvl, index) => {
                  const isLocked = index + 1 > maxLevelUnlocked && !isSimClick
                  const isSelected = currentLevelIndex === index

                  return (
                    <button
                      key={lvl.id}
                      onClick={() => handleLevelSelect(index)}
                      className={`level-card relative p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                          : isLocked 
                            ? 'bg-white/5 border-white/5 opacity-40' // Keep visual lock but allow click for test
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{lvl.title}</span>
                          <h3 className="text-lg font-bold text-white">{lvl.name}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-md font-bold ${
                            lvl.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            lvl.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {lvl.difficulty}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowLevelSelect(false); setIsSimClick(false); }}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => handleStartMatch(isSimClick)}
                  className={`flex-1 py-3 ${isSimClick ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20' : 'bg-syn-crimson hover:bg-syn-crimson/80'} text-white rounded-xl font-bold transition-all shadow-lg active:scale-95`}
                >
                  {isSimClick ? 'XEM MÔ PHỎNG' : 'VÀO TRẬN'}
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-syn-pink mb-3">💰 Cốt Truyện</h3>
                <div className="text-white/70 space-y-2 text-sm leading-relaxed">
                  <p>Năm 2026, một tổ chức ngầm có tên <span className="text-syn-pink">SYNDICATE</span> điều khiển đường dây rửa tiền xuyên quốc tế. Tiền bẩn từ tội phạm được "sạch hóa" qua các công ty ma và tài khoản khắp thế giới.</p>
                  <p>Đối lập là <span className="text-inv-cyan">INVESTIGATOR</span> - đội điều tra tài chính quốc tế với công nghệ theo dõi tiên tiến. Nhiệm vụ của họ: truy vết và đóng băng tài sản trước khi tiền đến ngân hàng.</p>
                  <p>Cuộc chiến không dùng súng đạn - mà dùng <span className="text-yellow-400">THUẬT TOÁN ĐỒ THỊ</span>. Bạn sẽ chọn phe nào?</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-inv-cyan mb-3">🔍 Cơ Chế Game</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <Search className="w-8 h-8 text-inv-cyan mx-auto mb-2" />
                    <p className="text-sm text-white/70">BFS</p>
                    <p className="text-xs text-white/40">Quét rộng</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <Network className="w-8 h-8 text-inv-cyan mx-auto mb-2" />
                    <p className="text-sm text-white/70">DFS</p>
                    <p className="text-xs text-white/40">Truy sâu</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <Shield className="w-8 h-8 text-inv-cyan mx-auto mb-2" />
                    <p className="text-sm text-white/70">Tarjan</p>
                    <p className="text-xs text-white/40">Tìm vòng</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowLore(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                >
                  ← Quay lại
                </button>
                <button
                  onClick={() => setShowTutorial(true)}
                  className="flex-1 py-3 bg-inv-emerald/20 hover:bg-inv-emerald/30 text-inv-cyan border-2 border-inv-emerald/50 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  📖 Xem Chi Tiết
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage

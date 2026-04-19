import React, { useState, useMemo } from 'react'
import { Shield, Zap, Search, Network, Building2, Banknote, Radio, Cpu, ArrowRight, ArrowLeft, Play, Info } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const PreGameGuide = () => {
  const { faction, setShowPreGameGuide, startGame, scenario, isSimulationMode } = useGameState()
  const [step, setStep] = useState(0)

  const slides = useMemo(() => [
    {
      title: "Mục Tiêu Chiến Dịch",
      content: (
        <div className="space-y-4">
          <p className="text-white/80 leading-relaxed">
            Chào mừng bạn đến với <span className="text-syn-pink font-bold">AML Asymmetry</span>. Trận quyết đấu giữa thế giới ngầm và đội điều tra tài chính.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-syn-pink/10 border border-syn-pink/30 p-4 rounded-xl">
              <h4 className="text-syn-pink font-bold mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Syndicate
              </h4>
              <p className="text-xs text-white/60">Dùng kỹ thuật Layering & Smurfing để "sạch hóa" dòng tiền và đẩy về Ngân hàng.</p>
            </div>
            <div className="bg-inv-cyan/10 border border-inv-cyan/30 p-4 rounded-xl">
              <h4 className="text-inv-cyan font-bold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Investigator
              </h4>
              <p className="text-xs text-white/60">Sử dụng thuật toán DFS, Tarjan... để phát hiện các vòng xoáy tài chính bất thường.</p>
            </div>
          </div>
        </div>
      ),
      icon: <Info className="w-12 h-12 text-yellow-400" />
    },
    {
      title: "Thành Phần Mạng Lưới",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span className="text-2xl">💰</span>
            <div>
              <h5 className="text-xs font-bold text-purple-400 uppercase">Nguồn tiền</h5>
              <p className="text-[10px] text-white/60">Điểm khởi nguồn của các giao dịch bất chính.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span className="text-2xl">👦</span>
            <div>
              <h5 className="text-xs font-bold text-blue-400 uppercase">TK Cá nhân</h5>
              <p className="text-[10px] text-white/60">Tài khoản vệ tinh dùng để chia nhỏ tiền (Smurfing).</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span className="text-2xl">👻</span>
            <div>
              <h5 className="text-xs font-bold text-syn-pink uppercase">Công ty ma</h5>
              <p className="text-[10px] text-white/60">Các công ty ảo dùng để tạo các lớp giao dịch phức tạp (Layering).</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span className="text-2xl">🎭</span>
            <div>
              <h5 className="text-xs font-bold text-emerald-400 uppercase">Sàn chui</h5>
              <p className="text-[10px] text-white/60">Nút thắt để trộn và làm nhiễu loạn dấu vết dòng tiền.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span className="text-2xl">🏦</span>
            <div>
              <h5 className="text-xs font-bold text-inv-cyan uppercase">Ngân hàng</h5>
              <p className="text-[10px] text-white/60">Đích đến cuối cùng nơi tiền bẩn được "hợp pháp hóa".</p>
            </div>
          </div>
        </div>
      ),
      icon: <Network className="w-12 h-12 text-amber-400" />
    },
    {
      title: "Kỹ Năng: Syndicate",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-white/5 p-3 rounded-xl">
            <div className="p-2 bg-syn-pink/20 rounded-lg"><Banknote className="w-5 h-5 text-syn-pink" /></div>
            <div>
              <h5 className="text-sm font-bold text-white">Chia nhỏ (Smurfing)</h5>
              <p className="text-xs text-white/50">Phân tán tiền qua nhiều tài khoản cá nhân. Tạo ra cấu trúc phân nhánh.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/5 p-3 rounded-xl">
            <div className="p-2 bg-syn-pink/20 rounded-lg"><Building2 className="w-5 h-5 text-syn-pink" /></div>
            <div>
              <h5 className="text-sm font-bold text-white">Tạo lớp (Layering)</h5>
              <p className="text-xs text-white/50">Thêm các công ty ma (Shell Corp) để kéo dài chuỗi giao dịch.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/5 p-3 rounded-xl">
            <div className="p-2 bg-syn-pink/20 rounded-lg"><Search className="w-5 h-5 text-syn-pink" /></div>
            <div>
              <h5 className="text-sm font-bold text-white">Định chiều (Orient)</h5>
              <p className="text-xs text-white/50">Kích hoạt luồng tiền hướng về mục tiêu cuối cùng.</p>
            </div>
          </div>
        </div>
      ),
      icon: <Building2 className="w-12 h-12 text-syn-pink" />
    },
    {
      title: "Kỹ Năng: Investigator",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-white/5 p-3 rounded-xl">
            <div className="p-2 bg-inv-cyan/20 rounded-lg"><Zap className="w-5 h-5 text-inv-cyan" /></div>
            <div>
              <h5 className="text-sm font-bold text-white">Dò Cầu (Bridge)</h5>
              <p className="text-xs text-white/50">Tìm các "mắt xích yếu" - những giao dịch duy nhất nối các mạng lưới.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/5 p-3 rounded-xl">
            <div className="p-2 bg-inv-cyan/20 rounded-lg"><Radio className="w-5 h-5 text-inv-cyan" /></div>
            <div>
              <h5 className="text-sm font-bold text-white">SCC Scanner (Tarjan)</h5>
              <p className="text-xs text-white/50">Phát hiện các chu trình khép kín - dấu hiệu điển hình của việc rửa tiền.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/5 p-3 rounded-xl">
            <div className="p-2 bg-inv-cyan/20 rounded-lg"><Cpu className="w-5 h-5 text-inv-cyan" /></div>
            <div>
              <h5 className="text-sm font-bold text-white">Siêu Máy Tính (Kosaraju)</h5>
              <p className="text-xs text-white/50">Phân tích sâu đồ thị chuyển vị để lột trần toàn bộ mạng lưới ngầm.</p>
            </div>
          </div>
        </div>
      ),
      icon: <Shield className="w-12 h-12 text-inv-cyan" />
    },
    {
      title: "Hệ Thống Phân Tích",
      content: (
        <div className="space-y-4">
          <p className="text-white/70 text-sm">Trong suốt trận đấu, bạn cần chú ý các thành phần:</p>
          <ul className="space-y-2">
            <li className="flex gap-2 text-xs text-white/60">
              <span className="text-yellow-400 font-bold">●</span> 
              <span><b className="text-white">News Ticker:</b> Theo dõi diễn biến trận đấu và báo cáo tình báo.</span>
            </li>
            <li className="flex gap-2 text-xs text-white/60">
              <span className="text-inv-cyan font-bold">●</span> 
              <span><b className="text-white">Algo Monitor:</b> Xem chi tiết cách thuật toán hoạt động trên từng node.</span>
            </li>
            <li className="flex gap-2 text-xs text-white/60">
              <span className="text-syn-pink font-bold">●</span> 
              <span><b className="text-white">Radar:</b> Bản đồ mạng lưới tài chính thời gian thực.</span>
            </li>
          </ul>
        </div>
      ),
      icon: <Radio className="w-12 h-12 text-emerald-400" />
    },
    ...(isSimulationMode ? [{
      title: "Cấu Hình Mô Phỏng",
      content: (
        <div className="space-y-6">
          <p className="text-white/80 text-center text-sm">Chọn kết quả mà bạn muốn hệ thống mô phỏng:</p>
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => useGameState.getState().setAutoPlayMode('syndicate_win')}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                useGameState.getState().autoPlayMode === 'syndicate_win' 
                ? 'bg-syn-pink/20 border-syn-pink shadow-[0_0_20px_rgba(244,114,182,0.2)] scale-[1.02]' 
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-xl transition-transform duration-500 ${
                  useGameState.getState().autoPlayMode === 'syndicate_win' ? 'bg-syn-pink text-white rotate-12' : 'bg-syn-pink/20 text-syn-pink'
                }`}>
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-base font-bold text-white uppercase tracking-tight">Syndicate Thắng</div>
                  <div className="text-[11px] text-white/40 font-medium">Lớp phủ mạng lưới mở rộng, rửa tiền hành công</div>
                </div>
              </div>
              {useGameState.getState().autoPlayMode === 'syndicate_win' && (
                <div className="animate-pulse">
                  <Zap className="w-5 h-5 text-syn-pink fill-syn-pink" />
                </div>
              )}
            </button>

            <button 
              onClick={() => useGameState.getState().setAutoPlayMode('investigator_win')}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                useGameState.getState().autoPlayMode === 'investigator_win' 
                ? 'bg-inv-cyan/20 border-inv-cyan shadow-[0_0_20px_rgba(0,255,255,0.2)] scale-[1.02]' 
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-xl transition-transform duration-500 ${
                  useGameState.getState().autoPlayMode === 'investigator_win' ? 'bg-inv-cyan text-black' : 'bg-inv-cyan/20 text-inv-cyan'
                }`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-base font-bold text-white uppercase tracking-tight">Investigator Thắng</div>
                  <div className="text-[11px] text-white/40 font-medium">Truy quét dấu vết, phong tỏa tài khoản kịp thời</div>
                </div>
              </div>
              {useGameState.getState().autoPlayMode === 'investigator_win' && (
                <div className="animate-pulse">
                  <Zap className="w-5 h-5 text-inv-cyan fill-inv-cyan" />
                </div>
              )}
            </button>
          </div>
        </div>
      ),
      icon: <Cpu className="w-12 h-12 text-yellow-500" />
    }] : []),
  ].filter(slide => {
    if (slide.title.includes("Syndicate") && faction !== 'syndicate' && !isSimulationMode) return false
    if (slide.title.includes("Investigator") && faction !== 'investigator' && !isSimulationMode) return false
    return true
  }), [faction, isSimulationMode])

  const next = () => {
    if (step < slides.length - 1) setStep(step + 1)
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleStart = () => {
    setShowPreGameGuide(false)
    startGame(scenario)
  }

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative max-w-lg w-full glass-panel-heavy rounded-3xl overflow-hidden border border-white/10 shadow-3xl animate-in slide-in-from-bottom-8 duration-500">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-syn-pink/10 blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="p-6 text-center border-b border-white/5 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-4 border border-white/10">
            {slides[step].icon}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{slides[step].title}</h2>
          <div className="flex justify-center gap-1 mt-3">
            {slides.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-syn-pink' : 'w-2 bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[300px] flex flex-col justify-center">
          {slides[step].content}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 flex gap-3 border-t border-white/5">
          {step > 0 && (
            <button
              onClick={prev}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          {step < slides.length - 1 ? (
            <button
              onClick={next}
              className="flex-1 py-3 bg-syn-crimson hover:bg-syn-crimson/80 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              Tiếp theo <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex-1 py-4 bg-syn-pink hover:bg-syn-pink/80 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(244,114,182,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-6 h-6 fill-white" />
              {isSimulationMode ? 'BẮT ĐẦU MÔ PHỎNG' : 'VÀO TRẬN QUYẾT ĐỊNH'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PreGameGuide

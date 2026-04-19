import React from 'react'
import { Trophy, Skull, RefreshCw, ChevronLeft } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const WinLossOverlay = () => {
  const { gameStatus, resetGame, backToLevelSelect, faction } = useGameState()

  if (gameStatus === 'playing') return null

  const isWin = (faction === 'syndicate' && gameStatus === 'syndicate_win') || 
                (faction === 'investigator' && gameStatus === 'investigator_win')
  
  const isDraw = gameStatus === 'draw'
  const title = isWin ? 'CHIẾN THẮNG!' : 'THẤT BẠI!'
  const message = isWin ? 'Mạng lưới đã được kiểm soát hoàn toàn.' : 'Đối thủ đã vượt mặt bạn.'
  const Icon = isWin ? Trophy : Skull
  const themeColor = isWin ? '#39ff14' : '#ff4d4d'

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div 
        className="max-w-md w-full p-8 rounded-3xl border-2 flex flex-col items-center text-center shadow-2xl"
        style={{ borderColor: themeColor, backgroundColor: '#0a0a0a' }}
      >
        <div 
          className="p-6 rounded-full mb-6" 
          style={{ backgroundColor: `${themeColor}20` }}
        >
          <Icon className="w-16 h-16" style={{ color: themeColor }} />
        </div>

        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">{title}</h2>
        <p className="text-white/60 mb-8 font-medium">{message}</p>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            onClick={resetGame}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5" /> RESTART
          </button>
          <button
            onClick={backToLevelSelect}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all active:scale-95"
            style={{ backgroundColor: themeColor, color: '#000' }}
          >
            <ChevronLeft className="w-5 h-5" /> LEVELS
          </button>
        </div>
      </div>
    </div>
  )
}

export default WinLossOverlay

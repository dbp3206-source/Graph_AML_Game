import React from 'react'
import { Radio, AlertCircle, Info, MessageSquare } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const NewsTicker = () => {
  const { newsItems, faction } = useGameState()
  const isSyndicate = faction === 'syndicate'

  return (
    <div className="flex flex-col h-full text-white">
      {/* Role-Specific Header */}
      {isSyndicate ? (
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Evidence Feed</h3>
          <Radio className="w-4 h-4 text-syn-pink animate-pulse" />
        </div>
      ) : (
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
           <div className="flex items-center gap-2">
              <div className="p-1 bg-inv-cyan/20 rounded">
                <MessageSquare className="w-3 h-3 text-inv-cyan" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-inv-cyan">Telegram</span>
           </div>
           <span className="text-[10px] text-white/30 font-mono">11:10:40</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {newsItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20 py-8">
            <Radio className="w-8 h-8 mb-2" />
            <p className="text-[10px] uppercase tracking-widest">No incoming feed</p>
          </div>
        )}
        
        {newsItems.map((item, i) => (
          <div 
            key={i} 
            className={`p-3 rounded-lg border flex gap-3 animate-in slide-in-from-right-4 duration-300 ${
              item.type === 'alert' 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
              item.type === 'alert' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-inv-cyan'
            }`} />
            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${
                    item.type === 'alert' ? 'text-red-400' : 'text-inv-cyan'
                  }`}>
                    {item.type === 'alert' ? 'LIVE: Critical Event' : 'LIVE: Feed Update'}
                  </span>
                  <span className="text-[9px] text-white/30 font-mono">{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
               </div>
               <p className="text-xs font-bold text-white/90 leading-tight">
                 {item.title}
               </p>
               <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                 {item.message}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewsTicker
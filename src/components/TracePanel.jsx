import React from 'react'
import { Activity } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const TracePanel = () => {
  const { newsItems, faction } = useGameState()
  const isSyndicate = faction === 'syndicate'

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSyndicate ? 'text-syn-pink' : 'text-inv-cyan'}`}>Data Trace</h3>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto font-mono text-[10px] space-y-1 pr-2 custom-scrollbar`}>
        <div className="p-2 border border-white/5 bg-white/5 rounded mb-3">
          <p className="text-white/40 uppercase mb-1">Status: <span className={isSyndicate ? 'text-syn-pink' : 'text-inv-cyan'}>Offline</span></p>
          <p className="text-white/40 uppercase">Monitor Off</p>
        </div>
        
        {newsItems.map((log, i) => (
          <div key={i} className={`py-1 border-b border-white/5 group ${i === 0 ? 'bg-white/5' : ''}`}>
            <span className={`text-white/20 mr-2 ${i === 0 ? 'text-yellow-400/50' : ''}`}>[{log.time}]</span>
            <span className={i === 0 ? 'text-yellow-400 font-bold' : (log.type === 'error' ? 'text-red-400' : 'text-white/70')}>
              {log.message || log.title || 'SYSTEM_LOG_SIGNAL'}
            </span>
          </div>
        ))}
        {newsItems.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-8">
             <Activity className="w-8 h-8 mb-2" />
             <p className="uppercase tracking-widest text-[8px]">No active data stream</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TracePanel

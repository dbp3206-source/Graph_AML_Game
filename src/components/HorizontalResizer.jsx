import React, { useState, useCallback, useEffect } from 'react'
import { GripVertical } from 'lucide-react'

const HorizontalResizer = ({ onResize, position = 'left', isSyndicate = false }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId)
    setIsDragging(true)
    document.body.style.cursor = 'col-resize'
  }

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return
    onResize(e.clientX)
  }, [isDragging, onResize])

  const handlePointerUp = useCallback((e) => {
    setIsDragging(false)
    document.body.style.cursor = 'default'
    if (e.target.releasePointerCapture) {
      e.target.releasePointerCapture(e.pointerId)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  const accentColor = isSyndicate ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 255, 255, 0.4)'
  const glowColor = isSyndicate ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 255, 255, 0.2)'

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`w-1.5 h-full flex items-center justify-center cursor-col-resize hover:bg-white/5 transition-colors group relative z-[100]`}
    >
      <div 
        className={`w-[2px] h-32 rounded-full transition-all ${isDragging ? 'h-full bg-opacity-80 scale-x-150' : 'bg-opacity-20'}`}
        style={{ 
          background: isDragging ? (isSyndicate ? '#ff4d4d' : '#00ffff') : 'rgba(255,255,255,0.2)',
          boxShadow: isDragging ? `0 0 15px ${isSyndicate ? '#ff4d4d' : '#00ffff'}` : 'none'
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
         <GripVertical className={`w-4 h-4 ${isSyndicate ? 'text-red-400' : 'text-cyan-400'}`} />
      </div>
    </div>
  )
}

export default HorizontalResizer

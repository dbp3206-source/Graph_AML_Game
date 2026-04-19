import React, { useState, useCallback, useEffect } from 'react'
import { GripHorizontal } from 'lucide-react'

const VerticalResizer = ({ onResize, minHeight = 100, maxHeight = 600 }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId)
    setIsDragging(true)
    document.body.style.cursor = 'row-resize'
  }

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return
    onResize(e.clientY)
  }, [isDragging, onResize])

  const handlePointerUp = useCallback((e) => {
    setIsDragging(false)
    document.body.style.cursor = 'default'
    if (e.target.releasePointerCapture) {
      e.target.releasePointerCapture(e.pointerId)
    }
  }, [])

  useEffect(() => {
    // Pointer events handle dragging better than mouse events across iframe boundaries
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`h-2 w-full flex items-center justify-center cursor-row-resize hover:bg-white/10 transition-colors group relative z-50`}
    >
      <div className={`w-12 h-1 rounded-full bg-white/20 group-hover:bg-white/40 transition-all ${isDragging ? 'bg-inv-cyan/60 w-24' : ''}`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
         <GripHorizontal className="w-4 h-4 text-white/40" />
      </div>
    </div>
  )
}

export default VerticalResizer

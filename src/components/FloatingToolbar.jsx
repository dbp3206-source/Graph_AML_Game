import React, { useState, useEffect, useRef } from 'react'
import { 
  LayoutDashboard, 
  BookOpen, 
  ScrollText, 
  RotateCcw, 
  Home, 
  ChevronRight,
  GripVertical
} from 'lucide-react'
import useGameState from '../hooks/useGameState'

const FloatingToolbar = () => {
  const { 
    toolbarPos, 
    setToolbarPos, 
    setShowTutorial, 
    setShowManualGuide, 
    resetGame,
    backToLevelSelect,
    setShowPreGameGuide
  } = useGameState()

  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef(null)
  const offsetRef = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e) => {
    setIsDragging(true)
    const rect = dragRef.current.getBoundingClientRect()
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    dragRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!isDragging) return
    
    const xPercent = ((e.clientX - offsetRef.current.x) / window.innerWidth) * 100
    const yPercent = ((e.clientY - offsetRef.current.y) / window.innerHeight) * 100
    
    // Clamp values
    const clampedX = Math.max(2, Math.min(95, xPercent))
    const clampedY = Math.max(2, Math.min(95, yPercent))
    
    setToolbarPos({ x: clampedX, y: clampedY })
  }

  const handlePointerUp = (e) => {
    setIsDragging(false)
    if (dragRef.current) {
        dragRef.current.releasePointerCapture(e.pointerId)
    }
  }

  const toggleOpen = () => {
    if (!isDragging) setIsOpen(!isOpen)
  }

  return (
    <div 
      ref={dragRef}
      className="fixed z-[40] transition-shadow duration-300"
      style={{ 
        left: `${toolbarPos.x}%`, 
        top: `${toolbarPos.y}%`,
        touchAction: 'none'
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className={`
        flex items-center glass-panel rounded-2xl p-1.5 border-white/10 shadow-2xl backdrop-blur-2xl
        ${isOpen ? 'ring-2 ring-white/20' : ''}
        ${isDragging ? 'scale-105 cursor-grabbing shadow-white/10' : 'cursor-grab hover:scale-[1.02]'}
      `}>
        
        {/* Handle Icon */}
        <button 
          onPointerDown={handlePointerDown}
          onClick={(e) => { e.stopPropagation(); toggleOpen(); }}
          className={`
            p-3 rounded-xl transition-all duration-500 flex items-center justify-center
            ${isOpen ? 'bg-white/20 text-white rotate-90' : 'bg-white/5 text-white/60 hover:text-white'}
          `}
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>

        {/* Slide-out Menu */}
        <div className={`
          flex items-center gap-1 overflow-hidden transition-all duration-500 ease-out
          ${isOpen ? 'max-w-[500px] ml-2 opacity-100' : 'max-w-0 ml-0 opacity-0 pointer-events-none'}
        `}>
          <div className="w-[1px] h-6 bg-white/10 mx-1" />
          
          <MenuButton 
            icon={<BookOpen className="w-4 h-4" />} 
            label="HƯỚNG DẪN" 
            onClick={() => setShowTutorial(true)} 
            color="text-emerald-400"
          />
          <MenuButton 
            icon={<ScrollText className="w-4 h-4" />} 
            label="CẨM NANG" 
            onClick={() => setShowManualGuide(true)} 
            color="text-cyan-400"
          />
          <MenuButton 
            icon={<RotateCcw className="w-4 h-4" />} 
            label="MÔ PHỎNG" 
            onClick={() => setShowPreGameGuide(true)} 
            color="text-amber-400"
          />
          <MenuButton 
            icon={<Home className="w-4 h-4" />} 
            label="CHỦ" 
            onClick={resetGame} 
            color="text-white/60"
          />
        </div>

        {isOpen && (
           <div className="ml-2 pr-2 text-white/20">
             <GripVertical className="w-4 h-4" />
           </div>
        )}
      </div>
    </div>
  )
}

const MenuButton = ({ icon, label, onClick, color }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="group flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/10 transition-all whitespace-nowrap min-w-[60px]"
  >
    <div className={`${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-[8px] font-black tracking-tighter text-white/40 group-hover:text-white/80">
      {label}
    </span>
  </button>
)

export default FloatingToolbar

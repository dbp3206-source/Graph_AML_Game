import { useEffect, useRef, useCallback, useState } from 'react'
import cytoscape from 'cytoscape'
import useGameState from '../hooks/useGameState'
import ALGORITHMS from '../utils/algorithms'
import { Layers, Target, Zap, Eye, MousePointer2, Plus, GitCommit, Trash2, Wand2, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Shuffle, Wind, Home, ArrowLeft } from 'lucide-react'
import DeepMoneyRain from './DeepMoneyRain'

const EMOJI_MAPS = {
  source: '💰',
  personal: '👦',
  shell: '👻',
  mixer: '🎭',
  bank: '🏦',
  target: '🏦'
}

function RadarCanvas() {
  const cyRef = useRef(null)
  const containerRef = useRef(null)
  
  const {
    faction,
    graphData,
    dropTarget,
    setDropTarget,
    draggedItem,
    setDraggedItem,
    selectedNode,
    setSelectedNode,
    algorithmSteps,
    currentStepIndex,
    setCurrentStepIndex,
    playbackMode,
    togglePlaybackMode,
    nextStep,
    prevStep,
    isAnimating,
    setIsAnimating,
    isAutoPlaying,
    executeSkill,
    resetGame,
    backToLevelSelect,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
    randomizeGraph,
    suspicion,
    addNews,
    gameStatus,
    scenario,
    isOriented,
    pendingOutcome,
    setPendingOutcome,
    setGameStatus,
    setMaxLevelUnlocked,
    animationSpeed,
    loopPickingMode,
    loopOriginNodeId,
    loopDestNodeId,
    loopHighlightedEdges
  } = useGameState()

  const [simMode, setSimMode] = useState('select') // 'select', 'add_node', 'add_edge', 'delete'
  const [edgeSource, setEdgeSource] = useState(null)

  const isSyndicate = faction === 'syndicate'

  // --- Initial Cytoscape Mount ---
  useEffect(() => {
    if (!containerRef.current) return

    const isInvestigator = faction === 'investigator'

    const cy = cytoscape({
      container: containerRef.current,
      minZoom: 0.1,
      maxZoom: 5,
      wheelSensitivity: 0.2,
      boxSelectionEnabled: false,
      autounselectify: false,
      style: [
        {
          selector: 'node.polaroid',
          style: {
            'shape': 'circle',
            'width': 70,
            'height': 70,
            'border-width': 4,
            'border-color': 'data(tierColor)',
            'label': 'data(emoji)',
            'font-size': '28px',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'shadow-blur': 20,
            'shadow-color': '#ff4d4d',
            'shadow-opacity': 0.6,
            'transition-property': 'transform, shadow-blur, border-width',
            'transition-duration': '0.3s'
          }
        },
        {
          selector: 'node.glowing',
          style: {
            'shape': 'circle',
            'width': 70,
            'height': 70,
            'border-width': 4,
            'border-color': 'data(tierColor)',
            'shadow-blur': 25,
            'shadow-color': '#00ffff',
            'shadow-opacity': 0.8,
            'label': 'data(emoji)',
            'font-size': '28px',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 6,
            'line-color': isSyndicate ? '#ff4d4d' : '#39ff14',
            'target-arrow-color': isSyndicate ? '#ff4d4d' : '#39ff14',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.6,
            'curve-style': 'bezier',
            'opacity': 0.5,
            'line-style': (isSyndicate && isOriented) ? 'solid' : 'dashed', // Dashed by default for "tracing"
            'shadow-blur': 15,
            'shadow-color': isSyndicate ? '#ff4d4d' : '#39ff14',
            'shadow-opacity': 1.0,
            'ghost': 'yes',
            'ghost-offset-y': 1,
            'ghost-opacity': 0.1,
            'transition-property': 'width, shadow-blur, opacity',
            'transition-duration': '0.4s'
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            'width': 16,
            'line-color': '#fff',
            'line-style': 'solid',
            'opacity': 1,
            'shadow-blur': 40,
            'shadow-color': '#fff',
            'z-index': 999
          }
        },
        {
          selector: 'node.active',
          style: {
            'border-width': 12,
            'border-color': '#fff',
            'width': 100,
            'height': 100,
            'shadow-blur': 60,
            'shadow-color': '#fff',
            'z-index': 9999
          }
        },
        {
          selector: 'node.visited',
          style: {
            'background-color': isSyndicate ? '#ff4d4d' : '#39ff14',
            'border-color': '#fff',
            'border-width': 3,
            'shadow-blur': 30,
            'shadow-color': '#fff',
            'opacity': 1.0
          }
        },
        {
          selector: 'node.loop-origin',
          style: {
            'background-color': '#0088ff',
            'shadow-blur': 40,
            'shadow-color': '#0088ff',
            'border-color': '#fff',
            'border-width': 6
          }
        },
        {
          selector: 'node.loop-dest',
          style: {
            'background-color': '#00ff00',
            'shadow-blur': 40,
            'shadow-color': '#00ff00',
            'border-color': '#fff',
            'border-width': 6
          }
        },
        {
          selector: 'edge.loop-path',
          style: {
            'line-color': '#f0f',
            'target-arrow-color': '#f0f',
            'width': 10,
            'shadow-blur': 25,
            'shadow-color': '#f0f',
            'line-style': 'solid',
            'opacity': 1,
            'z-index': 998
          }
        }
      ]
    })

    cyRef.current = cy

    cy.on('tap', 'node', (evt) => {
      const nodeId = evt.target.id()
      setSelectedNode(nodeId)
    })

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy()
        cyRef.current = null
      }
    }
  }, [faction])

  // --- Update Graph Data (Smoothly) ---
  useEffect(() => {
    const cy = cyRef.current
    if (!cy || !graphData) return

    // Sync Nodes
    const currentNodes = cy.nodes().map(n => n.id())
    const nextNodes = graphData.vertices.map(v => v.id)

    // Remove old nodes
    currentNodes.forEach(id => {
      if (!nextNodes.includes(id)) cy.remove(`#${id}`)
    })

    // Calculate Tiers (Gold, Silver, Bronze)
    const tiers = {}
    const tiersColors = {}
    const sourceId = graphData.source || graphData.vertices.find(v => v.type === 'source')?.id
    
    if (sourceId) {
      const queue = [{ id: sourceId, level: 0 }]
      const visited = new Set([sourceId])
      
      while (queue.length > 0) {
        const { id, level } = queue.shift()
        tiers[id] = level
        
        // Colors: Tier 1 (0): Gold, Tier 2 (1): Silver, Tier 3+ (2+): Bronze
        if (level === 0) tiersColors[id] = '#FFD700'
        else if (level === 1) tiersColors[id] = '#C0C0C0'
        else tiersColors[id] = '#CD7F32'
        
        graphData.edges.forEach(e => {
          if (e.u === id && !visited.has(e.v)) {
            visited.add(e.v)
            queue.push({ id: e.v, level: level + 1 })
          }
        })
      }
    }

    // Add/Update nodes
    graphData.vertices.forEach(v => {
      const existing = cy.getElementById(v.id)
      const emoji = v.emoji || EMOJI_MAPS[v.type] || '⚪'
      const tierColor = tiersColors[v.id] || (isSyndicate ? '#ff4d4d' : '#00ffff')
      
      const isLoopOrigin = v.id === loopOriginNodeId
      const isLoopDest = v.id === loopDestNodeId
      
      let classes = isSyndicate ? 'node polaroid' : 'node glowing'
      if (isLoopOrigin && !loopDestNodeId) classes += ' loop-origin'
      if (isLoopDest || (isLoopOrigin && loopDestNodeId)) classes += ' loop-dest'

      if (existing.length === 0) {
        cy.add({
          group: 'nodes',
          data: { 
            id: v.id, 
            label: (v.displayName || v.label).toUpperCase(), 
            type: v.type, 
            emoji: emoji,
            tierColor: tierColor
          },
          position: { x: v.x || 0, y: v.y || 0 },
          classes: classes
        })
      } else {
        existing.classes(classes)
        existing.data('label', (v.displayName || v.label).toUpperCase())
        existing.data('emoji', emoji)
        existing.data('tierColor', tierColor)
      }
    })

    // Update Edges (Clear and rebuild is often smoother for small graphs than diffing)
    cy.edges().remove()
    graphData.edges.forEach((e, i) => {
      const sourceNode = cy.getElementById(e.u)
      const targetNode = cy.getElementById(e.v)
      if (sourceNode.length > 0 && targetNode.length > 0) {
        const isLoopEdge = loopHighlightedEdges.some(le => le.u === e.u && le.v === e.v)
        cy.add({
          group: 'edges',
          data: { id: `edge${i}`, source: e.u, target: e.v },
          classes: isLoopEdge ? 'loop-path' : ''
        })
      }
    })

    // Appearance (Fog of War)
    const color = isSyndicate ? '#ff4d4d' : '#06b6d4'
    const isInvestigator = faction === 'investigator'
    
    cy.edges().style({
      'line-color': color,
      'target-arrow-color': color,
      'target-arrow-shape': (!isInvestigator && isOriented) ? 'triangle' : 'none',
      'line-style': (!isInvestigator && isOriented) ? 'solid' : 'dashed'
    })

    // Run layout ONLY if nodes were added
    if (nextNodes.length !== currentNodes.length) {
      cy.layout({ 
        name: 'cose', 
        animate: true, 
        fit: true,
        padding: 80, // Slightly more padding to zoom out
        componentSpacing: 100,
        nodeOverlap: 20,
        refresh: 20,
        animationDuration: 800,
        randomize: false
      }).run()
      
      // Pushing down a bit to avoid top bar
      cy.panBy({ x: 0, y: 100 })
    } else {
      cy.resize()
    }

  }, [graphData, isSyndicate, isOriented, faction])


  // --- Algorithm Animation ---
  useEffect(() => {
    const cy = cyRef.current
    if (!cy || algorithmSteps.length === 0) return
    const step = algorithmSteps[currentStepIndex]
    if (!step) return

    cy.nodes().removeClass('active visited')
    cy.edges().removeClass('highlighted')

    Object.entries(step.nodeStatus || {}).forEach(([nodeId, status]) => {
      const node = cy.getElementById(nodeId)
      if (node.length > 0) node.addClass(status)
    })

    if (step.highlightEdge) {
      const edge = cy.edges(`[source="${step.highlightEdge.u}"][target="${step.highlightEdge.v}"]`)
      if (edge.length > 0) edge.addClass('highlighted')
    }
  }, [algorithmSteps, currentStepIndex])

  // --- Auto-play ---
  useEffect(() => {
    let interval = null
    if (isAnimating && playbackMode === 'auto') {
      interval = setInterval(() => {
        const canNext = nextStep()
        if (!canNext) {
          setIsAnimating(false)
          if (pendingOutcome) {
            setGameStatus(pendingOutcome.status)
            setMaxLevelUnlocked(pendingOutcome.maxUnlocked)
            addNews({ type: 'alert', title: '🏆 KẾT QUẢ', message: 'Trận đấu đã kết thúc.' })
            setPendingOutcome(null)
          }
          clearInterval(interval)
        }
      }, animationSpeed)
    }
    return () => clearInterval(interval)
  }, [isAnimating, playbackMode, nextStep, setIsAnimating, pendingOutcome, setGameStatus, setPendingOutcome, setMaxLevelUnlocked, addNews])


  const scenarioName = graphData?.name || 'Chọn kịch bản'

  return (
    <div className="flex-1 relative flex flex-col bg-[#050505]">
      {/* Simulator Toolbar (TOP RIGHT as requested) */}
      <div className="absolute top-6 right-8 z-[100] glass-panel-heavy p-2 rounded-2xl flex gap-1.5 border-white/10 shadow-3xl bg-black/60 backdrop-blur-2xl">
        <button onClick={resetGame} className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all" title="Trang Chủ"><Home className="w-5 h-5" /></button>
        <button onClick={backToLevelSelect} className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all" title="Quay lại"><ArrowLeft className="w-5 h-5" /></button>
        <div className="w-[1px] bg-white/10 mx-1.5" />
        <button onClick={randomizeGraph} className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all" title="Sinh đồ thị ngẫu nhiên"><Shuffle className="w-5 h-5" /></button>
        <button onClick={() => setGraphData({ vertices: [], edges: [] })} className="p-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Xóa toàn bộ đồ thị"><Trash2 className="w-5 h-5" /></button>
      </div>

      <div className="absolute inset-0 m-3 rounded-2xl overflow-hidden border border-white/5 bg-[#080808] simulator-grid">
        {/* Themed Background Overlays */}
        {isSyndicate ? (
          <>
            <div className="hacker-nexus" />
            <DeepMoneyRain />
          </>
        ) : (
          <div className="radar-sweep-inv intensive" />
        )}
        
        <div ref={containerRef} className="w-full h-full relative z-10" />
        <div className="absolute top-3 left-3 glass-panel px-3 py-1.5 rounded-lg flex items-center gap-2 border-white/5 z-20">
          <Target className={`w-4 h-4 ${isSyndicate ? 'text-syn-pink' : 'text-inv-cyan'}`} />
          <span className="text-sm font-medium tracking-tight text-white/80">{scenarioName}</span>
        </div>
        
        {selectedNode && (
          <div className="absolute top-3 right-3 glass-panel px-3 py-1.5 rounded-lg z-20">
            <p className="text-sm font-bold text-white">
              <span className="text-white/40 uppercase text-[10px] block">Target Selected</span>
              <span className="text-inv-cyan">{graphData.vertices.find(v => v.id === selectedNode)?.displayName || selectedNode}</span>
            </p>
          </div>
        )}

        {/* BOTTOM CONTROLS FOOTER */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 w-full max-w-md px-4">
          {algorithmSteps.length > 0 && (
            <div className="w-full glass-panel p-2 rounded-xl flex items-center gap-3 border-white/10 shadow-2xl">
               <input type="range" min="0" max={algorithmSteps.length - 1} value={currentStepIndex} onChange={(e) => setCurrentStepIndex(parseInt(e.target.value))} className="flex-1 accent-inv-cyan h-1.5 rounded-lg appearance-none bg-white/10 cursor-pointer" />
               <span className="text-[10px] font-black text-white/50 w-12 text-center">{currentStepIndex + 1}/{algorithmSteps.length}</span>
            </div>
          )}

          {isAnimating && (
            <div className="glass-panel p-1 rounded-xl flex items-center gap-1 border-white/10 shadow-2xl backdrop-blur-md">
              <button onClick={() => { setIsAnimating(false); setCurrentStepIndex(0) }} className="p-1.5 rounded-lg text-white/40 hover:text-white" title="Reset"><RotateCcw className="w-4 h-4" /></button>
              <button onClick={prevStep} className="p-1.5 rounded-lg text-white/40 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={togglePlaybackMode} className={`p-2.5 rounded-lg ${playbackMode === 'auto' ? 'bg-inv-cyan text-black' : 'bg-white/10 text-white shadow-inner'} transition-all`}>
                {playbackMode === 'auto' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={nextStep} className="p-1.5 rounded-lg text-white/40 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RadarCanvas
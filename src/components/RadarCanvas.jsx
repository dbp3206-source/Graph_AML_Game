import { useEffect, useRef, useCallback, useState } from 'react'
import cytoscape from 'cytoscape'
import useGameState from '../hooks/useGameState'
import ALGORITHMS from '../utils/algorithms'
import { EMOJI_MAPS } from '../utils/constants'
import { Layers, Target, Zap, Eye, MousePointer2, Plus, GitCommit, Trash2, Wand2, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Shuffle, Wind, Home, ArrowLeft } from 'lucide-react'
import DeepMoneyRain from './DeepMoneyRain'
import CustomerDossier from './CustomerDossier'

// Floating bounty text component
function FloatingBountyText({ x, y, text, color, onDone }) {
  const [opacity, setOpacity] = useState(1)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const duration = 1800
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = elapsed / duration
      setOpacity(1 - progress)
      setTranslateY(-progress * 60)
      if (progress < 1) requestAnimationFrame(tick)
      else onDone?.()
    }
    requestAnimationFrame(tick)
  }, [])

  return (
    <div
      className="absolute z-50 pointer-events-none font-black text-lg font-mono"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, calc(-50% + ${translateY}px))`,
        opacity,
        color,
        textShadow: `0 0 15px ${color}, 0 0 30px ${color}`,
        transition: 'none'
      }}
    >
      {text}
    </div>
  )
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
    loopHighlightedEdges,
    syndicateCustomStyles,
    loopSelectedNodes,
    loopFloatingTexts,
    clearLoopFloatingText,
    invFloatingTexts,
    clearInvFloatingText,
    redNoticeFogCleared,
    invFreezeSelectionMode,
    invFreezeRemaining,
    invFreezeSelectNode,
    setGraphData,
    deathDefianceSelectionMode,
    cancelDeathDefianceSelection
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
            'target-arrow-shape': 'none',
            'arrow-scale': 1.6,
            'curve-style': 'bezier',
            'opacity': 0.5,
            'line-style': 'dashed',
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
          selector: 'edge.oriented',
          style: {
            'line-style': 'solid',
            'target-arrow-shape': 'triangle'
          }
        },
        {
          selector: 'edge.fog-of-war',
          style: {
            'line-style': 'dashed',
            'target-arrow-shape': 'none'
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
            'line-color': '#f472b6',
            'target-arrow-color': '#f472b6',
            'width': 8,
            'shadow-blur': 25,
            'shadow-color': '#f472b6',
            'line-style': 'solid',
            'curve-style': 'bezier',
            'opacity': 1,
            'z-index': 998
          }
        },
        {
          selector: 'node.custom-colored',
          style: {
            'background-color': 'data(customColor)',
            'border-color': '#fde68a',
            'border-width': 8,
            'shadow-blur': 70,
            'shadow-color': 'data(customColor)',
            'shadow-opacity': 1,
            'z-index': 1001
          }
        },
        {
          selector: 'edge.custom-colored',
          style: {
            'line-color': 'data(customColor)',
            'target-arrow-color': 'data(customColor)',
            'shadow-color': 'data(customColor)',
            'transition-property': 'background-color, border-color, shadow-blur, line-color',
            'transition-duration': '0.5s'
          }
        },
        {
          selector: 'edge.loop-edge-solid',
          style: {
            'line-style': 'solid',
            'curve-style': 'bezier',
            'control-point-step-size': 100,
            'width': 7,
            'opacity': 1,
            'line-color': '#f59e0b',
            'target-arrow-color': '#f59e0b',
            'shadow-blur': 38,
            'shadow-color': '#f59e0b',
            'shadow-opacity': 1,
            'z-index': 2000,
            'ghost': 'no',
            'line-cap': 'round',
            'line-join': 'round',
            'transition-property': 'width, shadow-blur, opacity',
            'transition-duration': '0.4s'
          }
        },
        {
          selector: 'edge.loop-blink-off',
          style: {
            'opacity': 0.38,
            'shadow-blur': 12,
            'width': 4
          }
        },
        {
          selector: '.chain-link',
          style: {
            'line-style': 'dashed',
            'line-dash-pattern': [15, 8],
            'width': 8,
            'opacity': 0.9
          }
        },
        {
          selector: '.sharp-arrow',
          style: {
            'target-arrow-shape': 'triangle',
            'target-arrow-fill': 'filled',
            'arrow-scale': 1.8,
            'width': 5,
            'shadow-blur': 15,
            'shadow-color': '#000',
            'shadow-offset-y': 3,
            'opacity': 1
          }
        },
        {
          selector: '.loop-pending',
          style: {
            'background-color': '#3b82f6',
            'border-color': '#fff',
            'border-width': 10,
            'shadow-blur': 70,
            'shadow-color': '#3b82f6',
            'width': 95,
            'height': 95,
            'z-index': 9999
          }
        },
        {
          selector: 'node.revealed',
          style: {
            'border-width': 6,
            'border-color': '#ff0000',
            'shadow-blur': 40,
            'shadow-color': '#ff0000',
            'shadow-opacity': 0.8,
            'overlay-color': '#ff0000',
            'overlay-opacity': 0.2
          }
        },
        {
          selector: 'node.syn-frozen',
          style: {
            'background-color': '#171717',
            'border-color': '#737373',
            'border-width': 6,
            'border-style': 'dashed',
            'shadow-blur': 14,
            'shadow-color': '#a3a3a3',
            'shadow-opacity': 0.45,
            'opacity': 0.55,
            'z-index': 100,
            'overlay-color': '#000',
            'overlay-opacity': 0.35
          }
        },
        {
          selector: 'node.inv-frozen',
          style: {
            'background-color': '#111111',
            'border-color': '#737373',
            'border-width': 6,
            'border-style': 'dashed',
            'shadow-blur': 12,
            'shadow-color': '#a3a3a3',
            'shadow-opacity': 0.45,
            'opacity': 0.55,
            'z-index': 100,
            'overlay-color': '#000',
            'overlay-opacity': 0.4
          }
        },
        {
          selector: 'edge.inv-edge-highlight-red',
          style: {
            'line-color': '#ef4444',
            'target-arrow-color': '#ef4444',
            'width': 6,
            'line-style': 'dashed',
            'line-dash-pattern': [8, 4],
            'shadow-blur': 25,
            'shadow-color': '#ef4444',
            'opacity': 1,
            'z-index': 999
          }
        },
        {
          selector: 'edge.inv-edge-highlight-purple',
          style: {
            'line-color': '#a855f7',
            'target-arrow-color': '#a855f7',
            'width': 6,
            'line-style': 'dashed',
            'line-dash-pattern': [8, 4],
            'shadow-blur': 25,
            'shadow-color': '#a855f7',
            'opacity': 1,
            'z-index': 999
          }
        },
        {
          // Frozen chain edges — looks like a locked chain (dashed gray)
          selector: 'edge.frozen-chain',
          style: {
            'line-color': '#6b7280',
            'target-arrow-color': '#6b7280',
            'width': 5,
            'line-style': 'dashed',
            'line-dash-pattern': [3, 8],
            'shadow-blur': 4,
            'shadow-color': '#9ca3af',
            'shadow-opacity': 0.35,
            'opacity': 0.5,
            'z-index': 50
          }
        },
        {
          // Network Analyzer detected nodes — yellow blinking
          selector: 'node.inv-network-highlight',
          style: {
            'border-color': '#fcd34d',
            'border-width': 10,
            'shadow-blur': 50,
            'shadow-color': '#fcd34d',
            'shadow-opacity': 1,
            'z-index': 1001
          }
        },
        {
          selector: 'node.network-blink-off',
          style: {
            'opacity': 0.5,
            'shadow-blur': 15,
            'border-width': 4
          }
        },
        {
          // Ring-detected nodes — red blinking in Investigator view
          selector: 'node.inv-ring-highlight',
          style: {
            'border-color': '#ef4444',
            'border-width': 8,
            'shadow-blur': 40,
            'shadow-color': '#ef4444',
            'shadow-opacity': 1,
            'z-index': 1000
          }
        },
        {
          selector: 'node.ring-blink-off',
          style: {
            'opacity': 0.45,
            'shadow-blur': 12
          }
        },
        {
          selector: 'edge.ring-blink-off',
          style: {
            'opacity': 0.28,
            'shadow-blur': 10,
            'width': 3
          }
        },
        {
          // Freeze-selectable nodes — purple pulsing, clickable
          selector: 'node.freeze-selectable',
          style: {
            'border-color': '#a855f7',
            'border-width': 8,
            'shadow-blur': 50,
            'shadow-color': '#a855f7',
            'shadow-opacity': 1,
            'z-index': 1000
          }
        },
        {
          selector: 'node.inactive',
          style: {
            'opacity': 0.3,
            'filter': 'grayscale(100%)',
            'overlay-color': '#000',
            'overlay-opacity': 0.5,
            'border-style': 'double',
            'border-color': '#555'
          }
        },
        {
          selector: 'edge.high-volume',
          style: {
            'line-style': 'solid',
            'opacity': 1,
            'shadow-blur': 30,
            'shadow-opacity': 1
          }
        }
      ]
    })


    cyRef.current = cy

    cy.on('tap', 'node', (evt) => {
      const nodeId = evt.target.id()
      // If in freeze selection mode, route click to invFreezeSelectNode
      const state = useGameState.getState()
      if (state.invFreezeSelectionMode) {
        state.invFreezeSelectNode(nodeId)
        return
      }
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
      const baseEmoji = v.emoji || EMOJI_MAPS[v.type] || '⚪'
      // Frozen node shows ONLY lock icon
      let emoji = v.isFrozen ? '🔒' : baseEmoji
      if (v.isSAR && !v.isFrozen) emoji = `🚩${emoji}`
      const tierColor = tiersColors[v.id] || (isSyndicate ? '#ff4d4d' : '#00ffff')
      
      // Investigator Fog of War: grey everything unless specially flagged
      let bgColor = null
      let borderColor = tierColor
      
      if (!isSyndicate && !redNoticeFogCleared) {
        // FOG OF WAR: default grey
        bgColor = '#1a1a1a'
        borderColor = '#444444'
        // Exceptions:
        if (v.isFrozen) { bgColor = '#111111'; borderColor = '#737373' }
        if (v.isHighlighted) {
          if (v.highlightType === 'network') { bgColor = '#1a0030'; borderColor = '#a855f7' }
          else if (v.highlightType === 'ring') { bgColor = '#1a0000'; borderColor = '#ef4444' }
          else { bgColor = '#1a0000'; borderColor = '#ef4444' }
        }
      } else if (isSyndicate && v.isFrozen) {
        // Syndicate view: frozen nodes appear dimmed/indigo to indicate freeze
        bgColor = '#171717'
        borderColor = '#737373'
      }
      
      // Find the most relevant custom style (prioritize 'loop' over 'layer')
      const nodeStyles = isSyndicate ? syndicateCustomStyles.filter(s => s.nodes.includes(v.id)) : []
      const customStyle = nodeStyles.find(s => s.type === 'loop') || nodeStyles[nodeStyles.length - 1]
      
      const isLoop = customStyle?.type === 'loop'
      const inCurrentSelection = isSyndicate && loopSelectedNodes.includes(v.id)
      
      let classes = isSyndicate ? 'node polaroid' : 'node glowing'

      if (inCurrentSelection) classes += ' loop-pending'
      if (customStyle && isLoop && isSyndicate) classes += ' custom-colored'
      if (v.isRevealed && isSyndicate) classes += ' revealed'
      if (!isSyndicate && v.isFrozen) classes += ' inv-frozen'
      if (isSyndicate && v.isFrozen) classes += ' syn-frozen' // NEW: syndicate sees frozen too
      if (!isSyndicate && v.isHighlighted) {
        if (v.highlightType === 'network') classes += ' inv-network-highlight'
        else if (v.highlightType === 'ring') classes += ' inv-ring-highlight'
        else classes += ' inv-highlight-red'
      }
      if (isSyndicate && v.isHighlighted && v.highlightType === 'death_defiance') classes += ' freeze-selectable'
      if (v.isInactive) classes += ' inactive'
      
      // Freeze selection mode: highlight selectable nodes differently
      const { invFreezeSelectionMode: freezeMode } = useGameState.getState()
      if (!isSyndicate && freezeMode && v.isHighlighted && !v.isFrozen) classes += ' freeze-selectable'

      if (existing.length === 0) {
        cy.add({
          group: 'nodes',
          data: { 
            id: v.id, 
            label: (v.displayName || v.label).toUpperCase(), 
            type: v.type, 
            emoji: emoji,
            tierColor: (!isSyndicate && !redNoticeFogCleared) ? borderColor : tierColor,
            customColor: customStyle?.color,
            bgColor: bgColor
          },
          position: { x: v.x || 0, y: v.y || 0 },
          classes: classes
        })
      } else {
        existing.classes(classes)
        existing.data('label', (v.displayName || v.label).toUpperCase())
        existing.data('emoji', emoji)
        existing.data('tierColor', (!isSyndicate && !redNoticeFogCleared) ? borderColor : tierColor)
        existing.data('customColor', customStyle?.color)
        existing.data('bgColor', bgColor)
      }
    })

    // [BUG-06 FIX]: Edge Diffing to prevent full rebuild
    const currentEdgeIds = new Set(cy.edges().map(e => e.id()))
    const nextEdgeIds = new Set(graphData.edges.map(e => `edge-${e.u}-${e.v}`))

    // Remove old edges
    currentEdgeIds.forEach(id => {
      if (!nextEdgeIds.has(id)) cy.remove(`#${id}`)
    })

    graphData.edges.forEach((e) => {
      const edgeId = `edge-${e.u}-${e.v}`
      const sourceNode = cy.getElementById(e.u)
      const targetNode = cy.getElementById(e.v)
      if (sourceNode.length > 0 && targetNode.length > 0) {
        // Find if this edge belongs to a custom style group (prioritize 'loop')
        const edgeStyles = isSyndicate ? syndicateCustomStyles.filter(s => 
          s.edges?.some(se => se.u === e.u && se.v === e.v)
        ) : []
        const customStyle = edgeStyles.find(s => s.type === 'loop') || edgeStyles[edgeStyles.length - 1]
        
        const isLayerEdge = customStyle?.type === 'layer'
        const isLoopEdge = customStyle?.type === 'loop'
        const sourceData = graphData.vertices.find(v => v.id === e.u)
        const targetData = graphData.vertices.find(v => v.id === e.v)
        const hasFrozenEndpoint = sourceData?.isFrozen || targetData?.isFrozen

        let classes = ''
        if (isLayerEdge && isSyndicate) {
          classes = (e.isOriented || e.directed) ? 'sharp-arrow custom-colored' : 'chain-link custom-colored'
        } else if (isLoopEdge && isSyndicate) {
          classes = 'loop-edge-solid custom-colored'
        } else if (customStyle && isSyndicate) {
          classes = 'custom-colored'
        }

        // Investigator Fog of War edge styling
        if (hasFrozenEndpoint) {
          classes = 'frozen-chain'
        } else if (!isSyndicate) {
          if (e.isHighlighted) {
            classes = e.highlightSkill === 'network' ? 'inv-edge-highlight-purple' : 'inv-edge-highlight-red'
          } else {
            classes = 'fog-of-war'
          }
        } else {
          const isOrientedEdge = e.isOriented || e.directed
          if (!isLoopEdge && !isLayerEdge && !customStyle) {
            if (isOrientedEdge) classes += ' oriented'
            else classes += ' fog-of-war'
          }
        }

        const volume = e.volume || 0
        const volumeWidth = 6 + Math.min(20, volume / 500)
        if (volume > 2000) classes += ' high-volume'

        const edgeColor = isSyndicate
          ? (customStyle?.color || '#ff4d4d')
          : (e.isHighlighted ? (e.highlightSkill === 'network' ? '#a855f7' : '#ef4444') : '#39ff14')

        const existingEdge = cy.getElementById(edgeId)
        if (existingEdge.length === 0) {
          cy.add({
            group: 'edges',
            data: {
              id: edgeId,
              source: e.u,
              target: e.v,
              customColor: edgeColor
            },
            style: {
              'width': volumeWidth,
              'shadow-blur': 15 + Math.min(20, volume / 400)
            },
            classes: classes
          })
        } else {
          existingEdge.classes(classes)
          existingEdge.data('customColor', edgeColor)
          existingEdge.style({
            'width': volumeWidth,
            'shadow-blur': 15 + Math.min(20, volume / 400)
          })
        }
      }
    })

    // Layout management
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

  }, [graphData, isSyndicate, isOriented, faction, redNoticeFogCleared, loopSelectedNodes, syndicateCustomStyles])


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

  useEffect(() => {
    const cy = cyRef.current
    if (!cy || !isSyndicate) return

    let dim = false
    const tick = () => {
      dim = !dim
      cy.edges('.loop-edge-solid').toggleClass('loop-blink-off', dim)
    }

    tick()
    const interval = setInterval(tick, 430)
    return () => clearInterval(interval)
  }, [isSyndicate, graphData, syndicateCustomStyles])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy || isSyndicate) return

    let dim = false
    const tick = () => {
      dim = !dim
      cy.nodes('.inv-ring-highlight').toggleClass('ring-blink-off', dim)
      cy.nodes('.inv-network-highlight').toggleClass('network-blink-off', dim)
      cy.edges('.inv-edge-highlight-red').toggleClass('ring-blink-off', dim)
    }

    tick()
    const interval = setInterval(tick, 380)
    return () => clearInterval(interval)
  }, [isSyndicate, graphData])

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

  // Floating texts: get positions from cytoscape nodes
  const getNodeScreenPos = (nodeId) => {
    const cy = cyRef.current
    if (!cy) return null
    const node = cy.getElementById(nodeId)
    if (!node || node.length === 0) return null
    const pos = node.renderedPosition()
    return pos
  }

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



        {/* Floating bounty texts (Investigator only) */}
        {!isSyndicate && invFloatingTexts && invFloatingTexts.map(ft => {
          const pos = getNodeScreenPos(ft.nodeId)
          if (!pos) return null
          return (
            <FloatingBountyText
              key={ft.id}
              x={pos.x}
              y={pos.y}
              text={ft.text}
              color={ft.color}
              onDone={() => clearInvFloatingText(ft.id)}
            />
          )
        })}

        {isSyndicate && loopFloatingTexts && loopFloatingTexts.map(ft => {
          const pos = getNodeScreenPos(ft.nodeId)
          if (!pos) return null
          return (
            <FloatingBountyText
              key={ft.id}
              x={pos.x}
              y={pos.y}
              text={ft.text}
              color={ft.color}
              onDone={() => clearLoopFloatingText(ft.id)}
            />
          )
        })}

        <div className="absolute top-3 left-3 glass-panel px-3 py-1.5 rounded-lg flex items-center gap-2 border-white/5 z-20">
          <Target className={`w-4 h-4 ${isSyndicate ? 'text-syn-pink' : 'text-inv-cyan'}`} />
          <span className="text-sm font-medium tracking-tight text-white/80">{scenarioName}</span>
        </div>
        
        {selectedNode && !invFreezeSelectionMode && !deathDefianceSelectionMode && (
          <CustomerDossier 
            nodeId={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        )}

        {/* Freeze Selection Mode Overlay */}
        {!isSyndicate && invFreezeSelectionMode && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <div
              className="px-5 py-3 rounded-2xl flex items-center gap-4"
              style={{
                background: 'rgba(10,0,30,0.9)',
                border: '2px solid rgba(168,85,247,0.7)',
                boxShadow: '0 0 30px rgba(168,85,247,0.4)',
                backdropFilter: 'blur(12px)'
              }}
            >
              <div className="text-center">
                <p className="text-[9px] font-black text-purple-400/70 uppercase tracking-widest">Còn lại</p>
                <p className="text-3xl font-black text-purple-400 font-mono" style={{ textShadow: '0 0 20px #a855f7' }}>
                  {invFreezeRemaining}
                </p>
                <p className="text-[8px] text-white/40 font-mono">đối tượng</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase">🔒 Click vào đỉnh nhấp nháy</p>
                <p className="text-[9px] text-white/50 font-mono">để phong tỏa từng mục tiêu</p>
                <button
                  onClick={() => {
                    const s = useGameState.getState()
                    s.closeFreezeCountModal?.() || s.closeFreezePopup?.()
                  }}
                  className="mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-red-400/70 hover:text-red-400 transition-colors"
                  style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}
                >
                  ✕ HỦY CHỌN
                </button>
              </div>
            </div>
          </div>
        )}

        {isSyndicate && deathDefianceSelectionMode && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <div className="border-2 border-fuchsia-400/70 bg-black/85 px-5 py-3 shadow-[0_0_28px_rgba(217,70,239,0.35)] backdrop-blur-xl">
              <p className="font-mono text-sm font-black uppercase tracking-widest text-fuchsia-200">
                Chọn đỉnh mộ đủ 2 lượt để hồi sinh
              </p>
              <button
                onClick={cancelDeathDefianceSelection}
                className="mt-2 border border-red-400/30 px-3 py-1 font-mono text-xs font-black uppercase text-red-300/80 hover:bg-red-500/10"
              >
                Hủy chọn
              </button>
            </div>
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

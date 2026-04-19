import { useEffect, useRef, useCallback } from 'react'
import useGameState from './useGameState'
import ALGORITHMS from '../utils/algorithms'

function useAutoPlay() {
  const { 
    isAutoPlaying, 
    setIsAutoPlaying, 
    faction, 
    ap, 
    budget, 
    graphData, 
    selectedNode,
    addNews, 
    nextTurn, 
    setSelectedNode, 
    setAlgorithmSteps, 
    setCurrentStep, 
    setIsAnimating,
    useBudget,
    investigatorScan,
    gameStatus,
    autoPlayMode,
    addNode,
    addEdge,
    addNodeWithEdge,
    executeSkill
  } = useGameState()
  
  const stepRef = useRef(0)
  const intervalRef = useRef(null)

  const runAlgorithm = (algorithmId, targetNodeId) => {
    if (!graphData) return null
    const startNode = targetNodeId || selectedNode || graphData.source
    if (algorithmId === 'bfs') return ALGORITHMS.bfs(graphData.vertices, graphData.edges, startNode)
    if (algorithmId === 'dfs') return ALGORITHMS.dfs(graphData.vertices, graphData.edges, startNode)
    if (algorithmId === 'tarjan') return ALGORITHMS.tarjan(graphData.vertices, graphData.edges)
    if (algorithmId === 'kosaraju') return ALGORITHMS.kosaraju(graphData.vertices, graphData.edges)
    if (algorithmId === 'bridge') return ALGORITHMS.findBridges(graphData.vertices, graphData.edges)
    return null
  }

  const animateSteps = useCallback((steps, delay = 800) => {
    if (!steps || steps.length === 0) return
    
    setIsAnimating(true)
    let index = 0
    
    const interval = setInterval(() => {
      if (index >= steps.length) {
        clearInterval(interval)
        setIsAnimating(false)
        setCurrentStep(0)
        return
      }
      setCurrentStep(index)
      index++
    }, delay)
    
    return interval
  }, [])

  const executeStep = useCallback(() => {
    const state = useGameState.getState()
    const step = state.autoPlayStep
    const mode = state.autoPlayMode
    
    if (state.gameStatus !== 'playing') {
      setIsAutoPlaying(false)
      return
    }

    // --- Scenario: Syndicate Win ---
    if (mode === 'syndicate_win') {
      if (step === 0) {
        addNews({ type: 'syndicate', title: '🤖 Auto', message: 'Syndicate bắt đầu xây dựng mạng lưới...' })
      } else if (step === 1) {
        addNews({ type: 'system', title: '📜 Mô phỏng', message: 'Đang cuộn danh sách Network Skills để tìm kỹ năng phù hợp...' })
        setTimeout(() => {
          const newNodeId = `auto_shell_${Date.now()}`
          addNodeWithEdge({ id: newNodeId, x: 300, y: 150, label: 'Công ty ma A', type: 'shell' }, useGameState.getState().graphData.source)
          addNews({ type: 'syndicate', title: '🏗️ Tạo lớp', message: 'Đã chọn: Layering. Thêm node công ty ma để kéo dài đường đi.' })
        }, 1000)
      } else if (step === 2) {
        addNews({ type: 'system', title: '📜 Mô phỏng', message: 'Đang cuộn xuống để chọn thêm Công ty ma...' })
        setTimeout(() => {
          const currentState = useGameState.getState()
          const newNodeId = `auto_shell_${Date.now() + 1}`
          const lastNodeId = currentState.graphData.vertices[currentState.graphData.vertices.length - 1].id
          addNodeWithEdge({ id: newNodeId, x: 450, y: 150, label: 'Công ty ma B', type: 'shell' }, lastNodeId)
          
          setTimeout(() => {
            addEdge(newNodeId, useGameState.getState().graphData.target)
            addNews({ type: 'syndicate', title: '🏗️ Tạo lớp', message: 'Kết nối node cuối cùng vào Ngân hàng.' })
          }, 500)
        }, 1000)
      } else if (step === 3) {
        addNews({ type: 'system', title: '📜 Mô phỏng', message: 'Cuộn xuống cuối danh sách: Kích hoạt Định chiều dòng tiền...' })
        setTimeout(() => {
          const skill = { id: 'orient', name: 'Định chiều', cost: 2 }
          executeSkill(skill)
        }, 1000)
      } else {
        addNews({ type: 'system', title: '🔄 Auto', message: 'Cho phép Syndicate rửa tiền hoàn tất...' })
        setIsAutoPlaying(false)
      }
    } 
    // --- Scenario: Investigator Win ---
    else {
      if (step === 0) {
        addNews({ type: 'investigator', title: '🤖 Auto', message: 'Investigator bắt đầu truy vết...' })
      } else if (step === 1) {
        const result = runAlgorithm('bridge', state.graphData.source)
        setAlgorithmSteps(result.steps)
        setIsAnimating(true)
        addNews({ type: 'investigator', title: '🔍 Dò cầu', message: 'Sử dụng DFS Low-link để tìm điểm yếu mạng lưới.' })
      } else if (step === 2) {
        const result = runAlgorithm('tarjan', state.graphData.source)
        setAlgorithmSteps(result.steps)
        setIsAnimating(true)
        addNews({ type: 'investigator', title: '🔍 SCC Scan', message: 'Sử dụng Kosaraju để phát hiện vòng xoay tiền.' })
      } else {
        setIsAutoPlaying(false)
      }
    }
    
    useGameState.getState().setAutoPlayStep(step + 1)
  }, [selectedNode, addNode, addEdge, executeSkill])

  useEffect(() => {
    if (!isAutoPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    addNews({ type: 'system', title: '🤖 AUTO-PLAY', message: `Đang chạy kịch bản: ${autoPlayMode === 'syndicate_win' ? 'Syndicate Thắng' : 'Investigator Thắng'}` })

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        const state = useGameState.getState()
        if (state.gameStatus !== 'playing') {
          setIsAutoPlaying(false)
          if (intervalRef.current) clearInterval(intervalRef.current)
          return
        }
        executeStep()
      }, 3000) // Slower for readability
    }

    setTimeout(startInterval, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return null
}

export default useAutoPlay
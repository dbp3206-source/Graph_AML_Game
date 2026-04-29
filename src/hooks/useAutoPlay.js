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

  const executeStep = useCallback(() => {
    const state = useGameState.getState()
    const step = state.autoPlayStep
    const mode = state.autoPlayMode
    const addNews = state.addNews
    const setIsAutoPlaying = state.setIsAutoPlaying
    const executeSkill = state.executeSkill
    const addNodeWithEdge = state.addNodeWithEdge
    const addEdge = state.addEdge
    const runAlgorithm = (algorithmId, targetNodeId) => {
      if (!state.graphData) return null
      const startNode = targetNodeId || state.selectedNode || state.graphData.source
      if (algorithmId === 'bfs') return ALGORITHMS.bfs(state.graphData.vertices, state.graphData.edges, startNode)
      if (algorithmId === 'dfs') return ALGORITHMS.dfs(state.graphData.vertices, state.graphData.edges, startNode)
      if (algorithmId === 'tarjan') return ALGORITHMS.tarjan(state.graphData.vertices, state.graphData.edges)
      if (algorithmId === 'kosaraju') return ALGORITHMS.kosaraju(state.graphData.vertices, state.graphData.edges)
      if (algorithmId === 'bridge') return ALGORITHMS.findBridges(state.graphData.vertices, state.graphData.edges)
      return null
    }
    
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
          useGameState.getState().addNews({ type: 'syndicate', title: '🏗️ Tạo lớp', message: 'Đã chọn: Layering. Thêm node công ty ma để kéo dài đường đi.' })
        }, 1000)
      } else if (step === 2) {
        addNews({ type: 'system', title: '📜 Mô phỏng', message: 'Đang cuộn xuống để chọn thêm Công ty ma...' })
        setTimeout(() => {
          const currentState = useGameState.getState()
          const newNodeId = `auto_shell_${Date.now() + 1}`
          const lastNodeId = currentState.graphData.vertices[currentState.graphData.vertices.length - 1].id
          currentState.addNodeWithEdge({ id: newNodeId, x: 450, y: 150, label: 'Công ty ma B', type: 'shell' }, lastNodeId)
          
          setTimeout(() => {
            useGameState.getState().addEdge(newNodeId, useGameState.getState().graphData.target)
            useGameState.getState().addNews({ type: 'syndicate', title: '🏗️ Tạo lớp', message: 'Kết nối node cuối cùng vào Ngân hàng.' })
          }, 500)
        }, 1000)
      } else if (step === 3) {
        addNews({ type: 'system', title: '📜 Mô phỏng', message: 'Cuộn xuống cuối danh sách: Kích hoạt Định chiều dòng tiền...' })
        setTimeout(() => {
          const skill = { id: 'orient', name: 'Định chiều', cost: 2 }
          useGameState.getState().executeSkill(skill)
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
        state.setAlgorithmSteps(result.steps)
        state.setIsAnimating(true)
        addNews({ type: 'investigator', title: '🔍 Dò cầu', message: 'Sử dụng DFS Low-link để tìm điểm yếu mạng lưới.' })
      } else if (step === 2) {
        const result = runAlgorithm('tarjan', state.graphData.source)
        state.setAlgorithmSteps(result.steps)
        state.setIsAnimating(true)
        addNews({ type: 'investigator', title: '🔍 SCC Scan', message: 'Sử dụng Kosaraju để phát hiện vòng xoay tiền.' })
      } else {
        setIsAutoPlaying(false)
      }
    }
    
    useGameState.getState().setAutoPlayStep(step + 1)
  }, []) // Empty dependency array, always use latest state via getState()

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
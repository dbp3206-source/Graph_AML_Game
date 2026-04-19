import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getScenario } from '../utils/scenarios'
import ALGORITHMS from '../utils/algorithms'
import { generateRandomNetwork } from '../utils/graphGenerator'
 
const EMOJI_MAPS = {
  source: '💰',
  personal: '👦',
  shell: '👻',
  mixer: '🎭',
  bank: '🏦',
  target: '🏦'
}
const useGameState = create(
  persist(
    (set, get) => ({
      faction: 'syndicate',
      turn: 1,
      ap: 6,
      maxAp: 6,
      budget: 70,
      maxBudget: 70,
      suspicion: 0,
      moneyLaundered: 0,
      targetMoney: 500000,
      scenario: 'chain',
      graphData: null,
      showTutorial: false,
      gameStatus: 'playing',
      currentStep: 0,
      isAnimating: false,
      newsItems: [],
      dropTarget: null,
      draggedItem: null,
      selectedNode: null,
      algorithmSteps: [],
      currentStepIndex: 0,
      playbackMode: 'auto',
      isAutoPlaying: false,
      autoPlayStep: 0,
      autoPlayMode: 'investigator_win', 
      homeSection: 'main', // 'main' | 'levels'
      isOriented: false, 
      showManualGuide: false,
      currentLevelIndex: 0,
      maxLevelUnlocked: 1,
      currentScreen: 'home',
      isSimulationMode: false,
      showPreGameGuide: false,
      toolbarPos: { x: 85, y: 40 }, // Moved to middle-right side to avoid overlapping left skills
      pendingOutcome: null, // Holds win/loss state until animation ends
      newsHeight: 40, // Increased default
      algorithmMonitorHeight: 30, // New state for second resize
      animationSpeed: 800, // Speed control for animations (500-1000ms)
      lastWashedAmount: 0,
      showWashNotification: false,
      turnFees: 0,
      loopPickingMode: false,
      loopOriginNodeId: null,
      loopDestNodeId: null,
      loopHighlightedEdges: [],


      setFaction: (faction) => set({ faction }),
      setTurn: (turn) => set({ turn }),
      setAp: (ap) => set({ ap }),
      setBudget: (budget) => set({ budget }),
      setSuspicion: (suspicion) => set({ suspicion }),
      setMoneyLaundered: (moneyLaundered) => set({ moneyLaundered }),
      setScenario: (scenario) => set({ scenario }),
      setGraphData: (graphData) => set({ graphData }),
      setShowTutorial: (showTutorial) => set({ showTutorial }),
      setGameStatus: (gameStatus) => set({ gameStatus }),
      setCurrentStep: (currentStep) => set({ currentStep }),
      setIsAnimating: (isAnimating) => set({ isAnimating }),
      setDropTarget: (dropTarget) => set({ dropTarget }),
      setDraggedItem: (draggedItem) => set({ draggedItem }),
      setSelectedNode: (selectedNode) => {
        const { loopPickingMode, loopOriginNodeId, addEdge, useAp, addNews, graphData, setIsAnimating } = get()
        
        if (loopPickingMode && loopOriginNodeId) {
          const destId = selectedNode
          if (destId === loopOriginNodeId) {
            addNews({ type: 'alert', title: '⚠️ Lỗi tạo vòng', message: 'Không thể tạo vòng lặp trên cùng một đối tượng. Hãy chọn đối tượng khác!' })
            return
          }
          
          // Execute the loop creation (TH3)
          addEdge(loopOriginNodeId, destId)
          useAp(2) // Cost for loop
          set(state => ({ turnFees: state.turnFees + 3000 }))
          
          // Find the loop/cycle to highlight
          // We use Tarjan to find if origin and dest are in the same SCC now
          const result = ALGORITHMS.tarjan(graphData.vertices, [...graphData.edges, { u: loopOriginNodeId, v: destId }])
          const scc = result.comps.find(c => c.includes(loopOriginNodeId) && c.includes(destId))
          
          const loopEdges = []
          if (scc && scc.length > 1) {
            graphData.edges.forEach(e => {
              if (scc.includes(e.u) && scc.includes(e.v)) loopEdges.push(e)
            })
            // Also add the new edge
            loopEdges.push({ u: loopOriginNodeId, v: destId })
          }

          set({ 
            loopDestNodeId: destId,
            loopHighlightedEdges: loopEdges,
            loopPickingMode: false,
            selectedNode: destId // Focus on the dest node
          })

          addNews({ 
            type: 'syndicate', 
            title: '✅ Vòng lặp xác lập', 
            message: `Đã thiết lập chu trình khép giữa ${loopOriginNodeId} và ${destId}. Dòng tiền đã được làm nhiễu!` 
          })
          
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 2000)
          return
        }

        set({ selectedNode })
      },
      setShowManualGuide: (showManualGuide) => set({ showManualGuide }),
      setAlgorithmSteps: (algorithmSteps) => set({ algorithmSteps, currentStepIndex: 0 }),
      setIsOriented: (isOriented) => set({ isOriented }),
      setCurrentStepIndex: (currentStepIndex) => set({ currentStepIndex }),
      setPlaybackMode: (playbackMode) => set({ playbackMode }),
      setCurrentLevelIndex: (currentLevelIndex) => set({ currentLevelIndex }),
      setMaxLevelUnlocked: (maxLevelUnlocked) => set({ maxLevelUnlocked }),
      setCurrentScreen: (currentScreen) => set({ currentScreen }),
      setIsAutoPlaying: (isAutoPlaying) => set({ isAutoPlaying }),
      setAutoPlayMode: (autoPlayMode) => set({ autoPlayMode }),
      setAutoPlayStep: (autoPlayStep) => set({ autoPlayStep }),
      setIsSimulationMode: (isSimulationMode) => set({ isSimulationMode }),
      setShowPreGameGuide: (showPreGameGuide) => set({ showPreGameGuide }),
      setNewsHeight: (newsHeight) => set({ newsHeight }),
      setAlgorithmMonitorHeight: (algorithmMonitorHeight) => set({ algorithmMonitorHeight }),
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
      setToolbarPos: (toolbarPos) => set({ toolbarPos }),
      setPendingOutcome: (pendingOutcome) => set({ pendingOutcome }),
      setShowWashNotification: (showWashNotification) => set({ showWashNotification }),


      nextStep: () => {
        const { currentStepIndex, algorithmSteps } = get()
        if (currentStepIndex < algorithmSteps.length - 1) {
          set({ currentStepIndex: currentStepIndex + 1 })
          return true
        }
        return false
      },

      prevStep: () => {
        const { currentStepIndex } = get()
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1 })
          return true
        }
        return false
      },

      togglePlaybackMode: () => {
        const { playbackMode } = get()
        set({ playbackMode: playbackMode === 'auto' ? 'manual' : 'auto' })
      },

      // --- Graph Mutations (Simulator Mode) ---
      addNode: (node) => set((state) => {
        const typeCounts = state.graphData.vertices.reduce((acc, v) => {
          acc[v.type] = (acc[v.type] || 0) + 1
          return acc
        }, {})
        
        const typeLabels = {
          shell: 'Công ty ma',
          personal: 'TK Cá nhân',
          bank: 'Ngân hàng',
          source: 'Nguồn tiền',
          mixer: 'Sàn chui'
        }

        const count = typeCounts[node.type] || 0
        const displayName = node.label && !node.id.includes('_') ? node.label : `${typeLabels[node.type] || 'Node'}`
        
        // Gender randomization for personal
        let emoji = '⚪'
        if (node.type === 'personal') {
          emoji = Math.random() > 0.5 ? '👦' : '👧'
        } else if (EMOJI_MAPS[node.type]) {
          emoji = EMOJI_MAPS[node.type]
        }

        const constructionCost = 15 // Deduct from budget
        if (state.budget < constructionCost) {
           get().addNews({ type: 'alert', title: '⚠️ Cạn kiệt vốn', message: 'Không đủ ngân sách để thiết lập điểm mới.' })
           return state
        }

        return {
          budget: state.budget - constructionCost,
          graphData: {
            ...state.graphData,
            vertices: [...state.graphData.vertices, { ...node, displayName, emoji }]
          }
        }
      }),
      addNodeWithEdge: (node, u) => set((state) => {
        // First logic similar to addNode
        const typeLabels = { shell: 'Công ty ma', personal: 'TK Cá nhân', bank: 'Ngân hàng', source: 'Nguồn tiền', mixer: 'Sàn chui' }
        const constructionCost = 15
        if (state.budget < constructionCost) return state

        let emoji = '⚪'
        if (node.type === 'personal') emoji = Math.random() > 0.5 ? '👦' : '👧'
        else if (EMOJI_MAPS[node.type]) emoji = EMOJI_MAPS[node.type]

        const displayName = node.label || `${typeLabels[node.type] || 'Node'}`
        const newNode = { ...node, displayName, emoji }
        
        return {
          budget: state.budget - constructionCost,
          graphData: {
            ...state.graphData,
            vertices: [...state.graphData.vertices, newNode],
            edges: [...state.graphData.edges, { u, v: node.id }]
          }
        }
      }),
      removeNode: (nodeId) => set((state) => ({
        graphData: {
          ...state.graphData,
          vertices: state.graphData.vertices.filter(v => v.id !== nodeId),
          edges: state.graphData.edges.filter(e => e.u !== nodeId && e.v !== nodeId)
        },
        selectedNode: state.selectedNode === nodeId ? null : state.selectedNode
      })),
      addEdge: (u, v) => set((state) => {
        if (!u || !v) return state
        const nodeU = state.graphData.vertices.find(vv => vv.id === u)
        const nodeV = state.graphData.vertices.find(vv => vv.id === v)
        if (!nodeU || !nodeV) {
          console.warn(`Attempted to add edge with non-existent nodes: ${u} -> ${v}`)
          return state
        }
        return {
          graphData: {
            ...state.graphData,
            edges: [...state.graphData.edges, { u, v }]
          }
        }
      }),
      removeEdge: (u, v) => set((state) => ({
        graphData: {
          ...state.graphData,
          edges: state.graphData.edges.filter(e => !(e.u === u && e.v === v))
        }
      })),
      randomizeGraph: () => {
        const newGraph = generateRandomNetwork(10)
        set({ graphData: newGraph, selectedNode: null })
        get().addNews({ type: 'system', title: '🎲 Mạng lưới mới', message: 'Hệ thống đã tự sinh một mạng lưới tài chính ngẫu nhiên.' })
      },

      addNews: (news) => set((state) => ({
        newsItems: [{ 
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
          time: new Date().toLocaleTimeString('vi-VN'), 
          ...news 
        }, ...state.newsItems].slice(0, 20)
      })),

      useAp: (amount) => {
        const { ap } = get()
        if (ap >= amount) {
          set({ ap: ap - amount })
          return true
        }
        return false
      },

      useBudget: (amount) => {
        const { budget } = get()
        if (budget >= amount) {
          set({ budget: budget - amount })
          return true
        }
        return false
      },

      nextTurn: () => {
        const { faction, turn, ap, maxAp, budget, maxBudget, moneyLaundered, targetMoney, gameStatus, addNews, isAnimating, turnFees } = get()
        if (gameStatus !== 'playing' || isAnimating) return

        if (faction === 'syndicate') {
          const washSpeed = 35000 
          // New dynamic logic: Final wash = base - operation fees
          const netWash = Math.max(5000, washSpeed - turnFees)
          const newMoney = Math.min(moneyLaundered + netWash, targetMoney)
          
          const isWinning = newMoney >= targetMoney

          set({
            faction: 'investigator',
            ap: maxAp,
            moneyLaundered: newMoney,
            lastWashedAmount: netWash,
            // Only show immediately if they win, otherwise wait for next turn
            showWashNotification: isWinning
          })
          
          addNews({
            type: 'syndicate',
            title: '💰 Tiến độ rửa tiền',
            message: `Tiền sạch thu về: $${netWash.toLocaleString()} (Phụ phí vận hành: -$${turnFees.toLocaleString()})`
          })

          if (isWinning) {
            set({ gameStatus: 'syndicate_win' })
            addNews({
              type: 'alert',
              title: '🏆 GAME OVER',
              message: 'SYNDICATE THẮNG! Đã rửa đủ tiền!'
            })
          }
        } else {
          // Switching back to Syndicate
          set({
            faction: 'syndicate',
            turn: turn + 1,
            budget: maxBudget,
            ap: maxAp,
            turnFees: 0, // Reset fees for new turn
            showWashNotification: true // Pop-up appears now at the start of Syndicate turn
          })
          addNews({
            type: 'system',
            title: '🔄 Lượt mới',
            message: `Lượt ${turn + 1} - SYNDICATE lượt đi`
          })
        }
      },

      investigatorScan: (nodesFound, cost) => {
        const { budget, suspicion, addNews, gameStatus, isAnimating } = get()
        if (gameStatus !== 'playing') return

        const suspicionGain = 1.5 // Decreased from 3.0 to make Investigator task harder
        const newSuspicion = Math.min(100, suspicion + nodesFound * suspicionGain)
        set({ suspicion: newSuspicion })
        addNews({
          type: 'investigator',
          title: '🔍 Phát hiện dấu vết',
          message: `Xác minh ${nodesFound} điểm khả nghi! Mức độ rủi ro hệ thống: +${nodesFound * suspicionGain}%`
        })
        
        if (newSuspicion >= 80) {
          const { currentLevelIndex, maxLevelUnlocked } = get()
          const outcome = { 
            status: 'investigator_win',
            maxUnlocked: Math.max(maxLevelUnlocked, currentLevelIndex + 2) 
          }
          
          if (isAnimating) {
            set({ pendingOutcome: outcome })
          } else {
            set({ 
              gameStatus: 'investigator_win',
              maxLevelUnlocked: outcome.maxUnlocked 
            })
            addNews({
              type: 'alert',
              title: '🏆 CHIẾN THẮNG!',
              message: `INVESTIGATOR ĐÃ PHÁ VỠ MẠNG LƯỚI!`
            })
          }
        }
      },

      startGame: (levelId) => {
        const { currentLevelIndex, maxLevelUnlocked } = get()
        const selectedLevel = levelId || `level${currentLevelIndex + 1}`
        const sc = { ...getScenario(selectedLevel) }
        
        // Ensure static nodes have display names
        sc.vertices = sc.vertices.map(v => {
          const typeLabels = {
            shell: 'Công ty ma',
            personal: 'TK Cá nhân',
            bank: 'Ngân hàng',
            source: 'Nguồn tiền',
            mixer: 'Sàn chui'
          }
          return {
            ...v,
            displayName: v.label || typeLabels[v.type] || v.id,
            emoji: v.emoji || (v.type === 'personal' ? (Math.random() > 0.5 ? '👦' : '👧') : EMOJI_MAPS[v.type] || '⚪')
          }
        })

        const initialCost = 50 // Scenario starts with some spent
        set({
          currentScreen: 'game',
          scenario: selectedLevel,
          graphData: sc,
          gameStatus: 'playing',
          pendingOutcome: null,
          turn: 1,
          ap: 6,
          maxAp: 6,
          budget: 100, // Starting funds for all levels
          suspicion: 5,
          moneyLaundered: 0,
          turnFees: 0,
          targetMoney: 150000, // Win goal
          algorithmSteps: [],
          currentStepIndex: 0,
          isOriented: false,
          isAutoPlaying: get().isSimulationMode 
        })

        
        get().addNews({
          type: 'system',
          title: `🚀 BẮT ĐẦU: ${sc.name}`,
          message: sc.description
        })
      },

      resetGame: () => set({
        faction: 'syndicate',
        turn: 1,
        ap: 5,
        budget: 70,
        suspicion: 0,
        moneyLaundered: 0,
        gameStatus: 'playing',
        currentStep: 0,
        isAnimating: false,
        newsItems: [],
        selectedNode: null,
        algorithmSteps: [],
        currentScreen: 'home',
        showPreGameGuide: false,
        isSimulationMode: false,
        isAutoPlaying: false,
        autoPlayStep: 0,
        autoPlayMode: 'investigator_win',
        homeSection: 'main',
        isOriented: false,
        algorithmSteps: [],
        currentStepIndex: 0,
        turnFees: 0,
        loopPickingMode: false,
        loopOriginNodeId: null,
        loopDestNodeId: null,
        loopHighlightedEdges: []
      }),


      backToLevelSelect: () => set({
        currentScreen: 'home',
        homeSection: 'levels',
        autoPlayStep: 0,
        isAutoPlaying: false,
        isSimulationMode: false,
        showPreGameGuide: false
      }),


      resetLevel: () => {
        const { scenario } = get()
        get().startGame(scenario)
      },

      executeSkill: (skill, targetNodeId) => {
        const { faction, ap, budget, graphData, gameStatus, addNews, useAp, useBudget, setAlgorithmSteps, setIsAnimating, investigatorScan, selectedNode } = get()
        
        if (gameStatus !== 'playing') return false

        const isSyndicate = faction === 'syndicate'
        const costType = skill.costType || (isSyndicate ? 'ap' : 'budget')
        const currentRes = costType === 'ap' ? ap : budget

        // 1. Check Resources
        if (currentRes < skill.cost) {
          addNews({
            type: 'alert',
            title: '⚠️ Không đủ tài nguyên',
            message: `Cần ${skill.cost} ${costType.toUpperCase()} nhưng chỉ có ${currentRes}`
          })
          return false
        }

        // 2. Validate Target for Investigator BFS/DFS
        if (!isSyndicate && (skill.id === 'bfs' || skill.id === 'dfs')) {
          if (!targetNodeId) {
            addNews({
              type: 'alert',
              title: '⚠️ Chọn mục tiêu',
              message: `Hãy chọn (click) một node trên bản đồ trước khi dùng ${skill.name}.`
            })
            return false
          }
        }

        // 3. Consume Resources
        if (isSyndicate) {
          useAp(skill.cost)
          // Incrementfees for Syndicate actions
          set(state => ({ turnFees: state.turnFees + 3000 }))
          
          // 3a. Syndicate Side Effects (Dynamic Graph)
          if (skill.id === 'layer') {
            const newNodeId = `shell_${Date.now()}`
            const source = targetNodeId || graphData?.source || '0'
            get().addNode({
              id: newNodeId,
              x: 400 + (Math.random() - 0.5) * 200,
              y: 250 + (Math.random() - 0.5) * 200,
              type: 'shell'
            })
            get().addEdge(source, newNodeId)
            addNews({ type: 'syndicate', title: '🏗️ Tạo lớp', message: `Mở rộng mạng lưới từ ${source}` })
          } else if (skill.id === 'smurf') {
            const source = targetNodeId || graphData?.source || '0'
            for (let i = 0; i < 2; i++) {
              const newNodeId = `smurf_${Date.now()}_${i}`
              get().addNode({
                id: newNodeId,
                x: 300 + (Math.random() - 0.5) * 150,
                y: 150 + i * 200,
                type: 'personal'
              })
              get().addEdge(source, newNodeId)
            }
            addNews({ type: 'syndicate', title: '💸 Chia nhỏ', message: `Tiền từ ${source} đã được rải ra các tài khoản ảo.` })
          }
          else if (skill.id === 'loop') {
            if (!selectedNode) {
              addNews({ 
                type: 'alert', 
                title: '⚠️ Chưa chọn mục tiêu', 
                message: 'Phải chọn một điểm khởi đầu trên radar trước khi thực hiện tạo vòng!' 
              })
              return false
            }
            
            // Enter picking mode (TH2)
            set({ 
              loopPickingMode: true, 
              loopOriginNodeId: selectedNode,
              loopDestNodeId: null,
              loopHighlightedEdges: [] 
            })
            
            addNews({ 
              type: 'system', 
              title: '🔄 Chế độ tạo vòng', 
              message: 'Hãy chọn tiếp một đỉnh (đối tượng) đích trên radar để hoàn tất vòng lặp.' 
            })
            return true 
          }
        } else {
          useBudget(skill.cost)
        }

        // 4. Calculate Results
        let algorithmResult = null
        if (!isSyndicate) {
          const startNode = targetNodeId || graphData?.source || '0'
          if (skill.id === 'bfs') {
            algorithmResult = ALGORITHMS.bfs(graphData.vertices, graphData.edges, startNode)
          } else if (skill.id === 'dfs') {
            algorithmResult = ALGORITHMS.dfs(graphData.vertices, graphData.edges, startNode)
          } else if (skill.id === 'tarjan') {
            algorithmResult = ALGORITHMS.tarjan(graphData.vertices, graphData.edges)
          } else if (skill.id === 'kosaraju') {
            algorithmResult = ALGORITHMS.kosaraju(graphData.vertices, graphData.edges)
          } else if (skill.id === 'bridge') {
            algorithmResult = ALGORITHMS.findBridges(graphData.vertices, graphData.edges)
          } else if (skill.id === 'disorient') {
            set({ isOriented: false })
            addNews({ type: 'investigator', title: '🌀 Giải định chiều', message: 'Hệ thống đã làm nhiễu loạn các hướng đi của dòng tiền!' })
            return true
          }

          if (algorithmResult && algorithmResult.steps) {
            set({ algorithmSteps: algorithmResult.steps, currentStepIndex: 0, isAnimating: true })
            if (skill.id !== 'bridge') {
              const nodesFound = algorithmResult.visited?.length || algorithmResult.comps?.flat().length || 0
              investigatorScan(nodesFound, skill.cost)
            }
          }
        } else {
          // Syndicate Skills
          if (skill.id === 'orient') {
            const result = ALGORITHMS.strongOrientation(graphData.vertices, graphData.edges)
            set({ 
              graphData: { ...graphData, edges: result.orientedEdges },
              isOriented: true,
              algorithmSteps: result.steps,
              isAnimating: true 
            })
            addNews({ type: 'syndicate', title: '➡️ Định chiều', message: 'Mạng lưới đã được kích hoạt hướng đi!' })
          }
          // (Other syndicate skills like smurf/layer remain but can be updated to create undirected edges)
        }

        // 5. News Feedback
        addNews({
          type: isSyndicate ? 'syndicate' : 'investigator',
          title: `${isSyndicate ? '💰' : '🔍'} ${skill.name}`,
          message: skill.description
        })

        if (gameStatus === 'playing' && faction === 'investigator') {
          // Level completion logic could go here
        }

        return true
      }
    }),
    {
      name: 'aml-game-storage',
      partialize: (state) => ({ 
        showTutorial: state.showTutorial,
        maxLevelUnlocked: state.maxLevelUnlocked 
      })
    }
  )
)

export default useGameState
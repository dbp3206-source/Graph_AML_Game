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
      budget: 100,
      maxBudget: 100,
      suspicion: 0,
      moneyLaundered: 0,
      targetMoney: 150000, // Mục tiêu mặc định mới
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
      loopTargetCount: 0,
      loopSelectedNodes: [],
      syndicateCustomStyles: [], // [{ nodes: [], edges: [], color: '', type: 'loop' | 'layer' }]
      showLoopModal: false,
      showLoopSuccessModal: false,
      loopSkillData: null,
      loopFloatingTexts: [],
      showSkillErrorModal: false,
      skillErrorData: { title: '', message: '', apLost: 0 },
      showFinanceReport: false,
      financeReportData: null,
      bailoutUsed: false,
      showBankruptcyModal: false,
      bankruptcyType: null, // 'bailout' | 'gameover'
      showDeathDefianceModal: false,
      deathDefianceSelectionMode: false,
      deathDefianceTargetCount: 0,
      deathDefianceSelectedNodes: [],
      deathDefiancePendingCost: 0,
      deathDefiancePendingAp: 0,

      // ===== INVESTIGATOR STATE (NEW - DO NOT TOUCH SYNDICATE) =====
      investigationBudget: 100,
      investigatorAp: 6,
      maxInvestigatorAp: 6,
      hasUsedRedNotice: false,
      redNoticeFogCleared: false,
      showSitrep: false,
      sitrepData: null,
      invSkillPhase: {},
      invScanResult: {},
      invSelectedNetworkAlgo: 'tarjan',
      removedEdgeCount: 0,
      invFloatingTexts: [],
      invFreezeTargets: null,
      showFreezePopup: false,
      // NEW Investigator state
      suspicionProgress: 0,         // 0-100: Tiến độ phá án (Investigator win = 100)
      invFreezeSelectionMode: false, // Interactive click-to-freeze mode
      invFreezeRemaining: 0,         // Còn bao nhiêu node cần click
      invFreezeMax: 0,               // Tổng số node được phép phong tỏa
      invFreezePendingCost: 0,       // Chi phí đã tính trước
      invFreezePendingAp: 0,         // AP đã tính trước
      showFreezeCountModal: false,   // Pop-up nhập số lượng phong tỏa
      setSkillError: (data) => set({ skillErrorData: data, showSkillErrorModal: true }),
      closeSkillError: () => set({ showSkillErrorModal: false }),
      closeFinanceReport: () => set({ showFinanceReport: false }),
      closeDeathDefianceModal: () => set({ showDeathDefianceModal: false }),
      clearLoopFloatingText: (id) => set(state => ({
        loopFloatingTexts: state.loopFloatingTexts.filter(t => t.id !== id)
      })),

      executeBailout: () => {
        const { budget, moneyLaundered, addNews, targetMoney, turn, maxAp, financeReportData } = get()
        const nextBudget = budget + (financeReportData?.netIncome || 0) + 100
        const newMoneyLaundered = (moneyLaundered + (financeReportData?.launderedThisRound || 0)) * 0.95

        set({
          faction: 'syndicate',
          turn: turn + 1,
          budget: nextBudget,
          moneyLaundered: newMoneyLaundered,
          ap: maxAp,
          turnFees: 0,
          showFinanceReport: true,
          showWashNotification: false,
          bailoutUsed: true,
          showBankruptcyModal: false,
          gameStatus: 'playing'
        })

        addNews({
          type: 'syndicate',
          title: '🆘 CỨU TRỢ KHẨN CẤP',
          summary: 'Tổ chức mẹ bơm vốn khẩn cấp',
          message: 'Tổ chức => Rút 5% quỹ đen => +$100 Ngân sách.'
        })
        
        addNews({
          type: 'system',
          title: '🔄 Lượt mới (Giải cứu)',
          summary: `Khởi động lượt ${turn + 1}`,
          message: `Lượt ${turn + 1} => Bắt đầu chu kỳ kinh tế mới sau gói cứu trợ.`
        })
      },

      triggerBankruptcyLoss: () => {
        set({ gameStatus: 'syndicate_lost', showBankruptcyModal: false })
        get().addNews({
          type: 'alert',
          title: '💀 PHÁ SẢN',
          summary: 'Mạng lưới tan rã hoàn toàn',
          message: 'Ngân sách cạn kiệt => Mạng lưới tan rã => THẤT BẠI.'
        })
      },


      setFaction: (faction) => set({ faction }),
      setTurn: (turn) => set({ turn }),
      setAp: (ap) => set({ ap }),
      setBudget: (budget) => set({ budget }),
      setSuspicion: (suspicion) => set({ suspicion }),
      setMoneyLaundered: (moneyLaundered) => set({ moneyLaundered }),
      set: (vals) => set(vals),
      setScenario: (scenario) => set({ scenario }),
      setGraphData: (graphData) => set({ graphData }),
      setShowTutorial: (showTutorial) => set({ showTutorial }),
      setGameStatus: (gameStatus) => set({ gameStatus }),
      setCurrentStep: (currentStep) => set({ currentStep }),
      setIsAnimating: (isAnimating) => set({ isAnimating }),
      setDropTarget: (dropTarget) => set({ dropTarget }),
      setDraggedItem: (draggedItem) => set({ draggedItem }),
      setSelectedNode: (selectedNode) => {
        const { 
          loopPickingMode, 
          loopTargetCount, 
          loopSelectedNodes, 
          addNews, 
          addEdge, 
          syndicateCustomStyles,
          deathDefianceSelectionMode,
          deathDefianceTargetCount,
          deathDefianceSelectedNodes,
          deathDefiancePendingCost,
          deathDefiancePendingAp
        } = get()

        if (deathDefianceSelectionMode) {
          const node = get().graphData?.vertices.find(v => v.id === selectedNode)
          if (!node?.isFrozen || (node.lockedTurnCount || 0) < 2) {
            addNews({
              type: 'alert',
              title: 'Từ chối tử thần thất bại',
              message: 'Chỉ hồi sinh được đỉnh đã bị phong tỏa ít nhất 2 lượt.'
            })
            return
          }
          if (deathDefianceSelectedNodes.includes(selectedNode)) {
            addNews({ type: 'alert', title: 'Trùng mục tiêu', message: 'Đỉnh này đã nằm trong danh sách hồi sinh.' })
            return
          }

          const selected = [...deathDefianceSelectedNodes, selectedNode]
          const remaining = deathDefianceTargetCount - selected.length

          set(state => ({
            deathDefianceSelectedNodes: selected,
            deathDefianceSelectionMode: remaining > 0,
            deathDefianceTargetCount: remaining === 0 ? 0 : state.deathDefianceTargetCount,
            deathDefiancePendingCost: remaining === 0 ? 0 : state.deathDefiancePendingCost,
            deathDefiancePendingAp: remaining === 0 ? 0 : state.deathDefiancePendingAp,
            budget: remaining === 0 ? state.budget - deathDefiancePendingCost : state.budget,
            ap: remaining === 0 ? state.ap - deathDefiancePendingAp : state.ap,
            graphData: remaining === 0 ? {
              ...state.graphData,
              vertices: state.graphData.vertices.map(v =>
                selected.includes(v.id)
                  ? { ...v, isFrozen: false, lockedTurnCount: 0, isHighlighted: false, highlightType: null }
                  : v.highlightType === 'death_defiance'
                  ? { ...v, isHighlighted: false, highlightType: null }
                  : v
              )
            } : state.graphData
          }))

          if (remaining > 0) {
            addNews({
              type: 'syndicate',
              title: 'Từ chối tử thần',
              summary: `Đang hồi sinh ${selected.length} đỉnh`,
              message: `Đã chọn ${selectedNode} => Còn lại: {${remaining}} đỉnh.`
            })
          } else {
            addNews({
              type: 'syndicate',
              title: 'TỪ CHỐI TỬ THẦN',
              summary: 'Hồi sinh thành công',
              message: `Hồi sinh => {${selected.length}} đỉnh => -$${deathDefiancePendingCost} | -${deathDefiancePendingAp} AP.`
            })
          }
          return
        }
        
        if (loopPickingMode) {
          if (loopSelectedNodes.includes(selectedNode)) {
            addNews({ type: 'alert', title: '⚠️ Trùng lặp', message: 'Bạn đã chọn đỉnh này rồi!' })
            return
          }

          const newSelected = [...loopSelectedNodes, selectedNode]
          const remaining = loopTargetCount - newSelected.length

          if (remaining > 0) {
            set({ loopSelectedNodes: newSelected })
            addNews({ 
              type: 'system', 
              title: '🔄 Tạo vòng', 
              summary: 'Đang thiết lập chu trình',
              message: `Đã chọn ${selectedNode} => Còn lại: {${remaining}} đỉnh.` 
            })
          } else {
            // --- Finalize Loop Overhaul ---
            const signatureColor = '#f59e0b'
            const nodesInLoop = newSelected
            const internalEdges = []
            
            if (get().isOriented) {
              // Find existing edges between pick nodes to follow the chain
              const existingDirEdges = get().graphData.edges.filter(e => 
                nodesInLoop.includes(e.u) && nodesInLoop.includes(e.v)
              )
              
              // Map connections
              const conn = nodesInLoop.reduce((acc, n) => { acc[n] = { in: 0, out: 0 }; return acc; }, {})
              existingDirEdges.forEach(e => {
                conn[e.v].in++
                conn[e.u].out++
                internalEdges.push({ u: e.u, v: e.v })
              })

              // Find Sink (end of chain) and Source (start of chain)
              const sink = nodesInLoop.find(n => conn[n].out === 0) || nodesInLoop[nodesInLoop.length - 1]
              const source = nodesInLoop.find(n => conn[n].in === 0) || nodesInLoop[0]
              
              if (sink !== source) {
                get().addEdge(sink, source)
                internalEdges.push({ u: sink, v: source })
              }
            } else {
              // Standard circular closure
              for (let i = 0; i < nodesInLoop.length; i++) {
                const u = nodesInLoop[i]
                const v = nodesInLoop[(i + 1) % nodesInLoop.length]
                get().addEdge(u, v)
                internalEdges.push({ u, v })
              }
            }

            set(state => ({
              budget: state.budget - 60, // Khấu trừ chi phí tạo vòng (giảm từ 80 xuống 60)
              loopPickingMode: false,
              loopSelectedNodes: [],
              loopTargetCount: 0,
              showLoopSuccessModal: true,
              loopFloatingTexts: [
                ...state.loopFloatingTexts,
                { id: `loop-yield-${Date.now()}`, nodeId: nodesInLoop[0], text: '+$30 Yield', color: '#d946ef' }
              ],
              syndicateCustomStyles: [
                ...state.syndicateCustomStyles, 
                { nodes: nodesInLoop, edges: internalEdges, color: signatureColor, type: 'loop' }
              ]
            }))
          }
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
           get().addNews({ 
             type: 'alert', 
             title: '⚠️ Cạn kiệt vốn', 
             summary: 'Không đủ ngân sách thiết lập',
             message: 'Ngân sách < $15 => Từ chối truy cập.' 
           })
           return state
        }

        return {
          budget: state.budget - constructionCost,
          graphData: {
            ...state.graphData,
            vertices: [...state.graphData.vertices, { ...node, displayName, emoji, isRevealed: false }]
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
            vertices: [...state.graphData.vertices, { ...newNode, isRevealed: false }],
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
        // FROZEN NODE BLOCK: Cannot create edges involving frozen nodes
        if (nodeU.isFrozen || nodeV.isFrozen) {
          console.warn(`Blocked edge creation: node ${nodeU.isFrozen ? u : v} is frozen.`)
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
        get().addNews({ 
          type: 'system', 
          title: '🎲 Mạng lưới mới', 
          summary: 'Khởi tạo cấu trúc ngẫu nhiên',
          message: 'Hệ thống => Tái cấu trúc đồ thị => Hoàn tất.' 
        })
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
        const { faction, turn, maxAp, budget, targetMoney, gameStatus, addNews, isAnimating, bailoutUsed, investigationBudget, maxInvestigatorAp } = get()
        if (gameStatus !== 'playing' || isAnimating) return

        if (faction === 'syndicate') {
          // Tính SITREP data khi chuyển sang Investigator
          const graphData = get().graphData
          const vertices = graphData?.vertices || []
          const edges = graphData?.edges || []
          const frozenCount = vertices.filter(v => v.isFrozen).length
          const removedEdges = get().removedEdgeCount
          const escapeRisk = vertices.length > 0
            ? Math.round(((vertices.length - frozenCount) / vertices.length) * 100)
            : 0
          const newInvBudget = investigationBudget + 25

          set({
            faction: 'investigator',
            ap: maxAp,
            investigatorAp: maxInvestigatorAp,
            investigationBudget: newInvBudget,
            showWashNotification: false,
            showSitrep: true,
            redNoticeFogCleared: false,
            invSkillPhase: {},
            invScanResult: {},
            invFloatingTexts: [],
            algorithmSteps: [],
            currentStepIndex: 0,
            sitrepData: {
              budget: newInvBudget,
              frozenCount,
              removedEdges,
              escapeRisk,
              totalNodes: vertices.length,
            }
          })
          
          addNews({
            type: 'investigator',
            title: '🕵️ Lượt Investigator',
            summary: 'Hệ thống đã sẵn sàng điều tra',
            message: 'SITREP => Dữ liệu hiện trường đã cập nhật => Sẵn sàng quét.'
          })
        } else {
          // Quay lại lượt Syndicate - Tính toán kinh tế
          const economyResults = get().processEconomy()
          
          let nextBudget = budget + economyResults.netIncome
          const newMoneyLaundered = (get().moneyLaundered || 0) + economyResults.launderedThisRound
          const launderedPercent = (newMoneyLaundered / targetMoney) * 100
          
          // --- Bankruptcy Logic ---
          if (nextBudget < 0) {
            if (turn <= 5) {
              // Grace period: Force budget to 0
              nextBudget = 0
              addNews({ 
                type: 'alert', 
                title: '⚠️ Khủng hoảng', 
                summary: 'Gói cứu trợ lượt ân hạn',
                message: 'Ngân sách < 0 => Trợ cấp tổ chức mẹ => $0.' 
              })
            } else {
              // Post-grace bankruptcy check
              const canBailout = launderedPercent >= 30 && !bailoutUsed
              if (canBailout) {
                set({ 
                  showBankruptcyModal: true, 
                  bankruptcyType: 'bailout',
                  financeReportData: economyResults // Still show report
                })
                // We stop advancing turn here until choice is made
                return
              } else {
                set({ 
                  gameStatus: 'syndicate_lost',
                  showBankruptcyModal: true,
                  bankruptcyType: 'gameover'
                })
                return
              }
            }
          }

          const isWinning = newMoneyLaundered >= targetMoney
          
          set({
            faction: 'syndicate',
            turn: turn + 1,
            budget: nextBudget,
            moneyLaundered: newMoneyLaundered,
            ap: maxAp,
            turnFees: 0, 
            showFinanceReport: true, 
            financeReportData: economyResults,
            showWashNotification: false,
            gameStatus: isWinning ? 'syndicate_win' : 'playing',
            graphData: get().graphData ? {
              ...get().graphData,
              vertices: get().graphData.vertices.map(v =>
                v.isFrozen ? { ...v, lockedTurnCount: (v.lockedTurnCount || 0) + 1 } : v
              )
            } : get().graphData
          })

          if (isWinning) {
            addNews({
              type: 'alert',
              title: '🏆 MISSION ACCOMPLISHED',
              summary: 'Mục tiêu hoàn tất tuyệt đối',
              message: 'Syndicate => Rửa tiền > $150,000 => CHIẾN THẮNG.'
            })
          }
          addNews({
            type: 'system',
            title: '🔄 Lượt mới',
            summary: `Khởi động lượt ${turn + 1}`,
            message: `Lượt ${turn + 1} => Bắt đầu chu kỳ kinh tế mới.`
          })
        }
      },

      processEconomy: () => {
        const { graphData, syndicateCustomStyles } = get()
        if (!graphData) return { base: 15, smurf: 0, layer: 0, loop: 0, upkeep: 0, netIncome: 15, totalNodes: 0 }

        const vertices = graphData.vertices
        const edges = graphData.edges
        const safeNodes = vertices.filter(v => !v.isRevealed && !v.isFrozen)
        const safeNodeIds = new Set(safeNodes.map(v => v.id))

        // 1. Base Income
        const base = 20 // Tăng từ 15 -> 20

        // 2. Loop Yield (SCCs)
        // Chỉ tính SCC "An toàn" (tất cả node chưa bị lộ)
        const sccResult = ALGORITHMS.tarjan(vertices, edges)
        let loopYield = 30 // Giữ nguyên mức thu nhập mặt từ Loop
        let totalLoopYield = 0
        sccResult.comps.forEach(comp => {
          if (comp.length > 1) {
            const isSafe = comp.every(id => safeNodeIds.has(id))
            if (isSafe) totalLoopYield += loopYield
          }
        })

        // 3. Layer Yield (Chains)
        let layerYield = 0
        syndicateCustomStyles.forEach(style => {
          if (style.type === 'layer') {
            const isSafe = style.nodes.every(id => safeNodeIds.has(id))
            if (isSafe) layerYield += 15
          }
        })

        // 4. Smurf Yield (Nodes lẻ - Type personal và không thuộc Loop/Layer)
        // Để đơn giản: Node personal "An toàn" không thuộc bất kỳ style nào là Smurf
        const nodesInStyles = new Set(syndicateCustomStyles.flatMap(s => s.nodes))
        const nodesInSCCs = new Set(sccResult.comps.filter(c => c.length > 1).flat())
        
        let smurfYield = 0
        safeNodes.forEach(v => {
          if (v.type === 'personal' && !nodesInStyles.has(v.id) && !nodesInSCCs.has(v.id)) {
            smurfYield += 15 // Giữ nguyên thu nhập mặt từ Smurf
          }
        })

        // 5. Upkeep Cost
        const totalNodes = vertices.length
        const upkeep = totalNodes > 5 ? (totalNodes - 5) * 5 : 0

        // 6. Laundered Money Calculation (New Logic)
        let launderedThisRound = 0
        
        // Smurfs: $400 each (Giảm từ 500)
        safeNodes.forEach(v => {
          if (v.type === 'personal' && !nodesInStyles.has(v.id) && !nodesInSCCs.has(v.id)) {
            launderedThisRound += 400
          }
        })
        
        // Layers: $1500 each chain (Giảm từ 2000)
        syndicateCustomStyles.forEach(style => {
          if (style.type === 'layer') {
            const isSafe = style.nodes.every(id => safeNodeIds.has(id))
            if (isSafe) launderedThisRound += 1500
          }
        })
        
        // Loops: $4000 each SCC (Giảm từ 5000)
        sccResult.comps.forEach(comp => {
          if (comp.length > 1) {
            const isSafe = comp.every(id => safeNodeIds.has(id))
            if (isSafe) launderedThisRound += 4000
          }
        })

        const netIncome = base + smurfYield + layerYield + totalLoopYield - upkeep

        return {
          base,
          smurf: smurfYield,
          layer: layerYield,
          loop: totalLoopYield,
          upkeep,
          netIncome,
          launderedThisRound, // Kết quả rửa tiền lượt này
          totalNodes,
          currentBudgetBefore: get().budget
        }
      },

      investigatorScan: (nodesFound, cost) => {
        const { budget, suspicion, addNews, gameStatus, isAnimating } = get()
        if (gameStatus !== 'playing') return

        const suspicionGain = 1.5 
        const newSuspicion = Math.min(100, suspicion + nodesFound * suspicionGain)

        // Đánh dấu các node trong algorithmSteps là bị lộ (nếu có)
        // Lưu ý: investigatorScan thường được gọi kèm với algorithmResult
        // Chúng ta sẽ đánh dấu visited nodes là Revealed
        const { algorithmSteps, currentStepIndex } = get()
        const currentStep = algorithmSteps[currentStepIndex]
        if (currentStep && currentStep.nodeStatus) {
           const newlyRevealed = Object.keys(currentStep.nodeStatus).filter(id => currentStep.nodeStatus[id] === 'active' || currentStep.nodeStatus[id] === 'visited')
           set(state => ({
             graphData: {
               ...state.graphData,
               vertices: state.graphData.vertices.map(v => 
                 newlyRevealed.includes(v.id) ? { ...v, isRevealed: true } : v
               )
             }
           }))
        }

        set({ suspicion: newSuspicion })
        addNews({
          type: 'investigator',
          title: '🔍 Phát hiện dấu vết',
          summary: `Xác minh ${nodesFound} điểm khả nghi`,
          message: `Truy vết => {${nodesFound}} đối tượng => Rủi ro: {+${nodesFound * suspicionGain}%}`
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
              summary: 'Mạng lưới đã bị phá vỡ',
              message: 'Investigator => Thu thập đủ chứng cứ => CHIẾN THẮNG.'
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
            emoji: v.emoji || (v.type === 'personal' ? (Math.random() > 0.5 ? '👦' : '👧') : EMOJI_MAPS[v.type] || '⚪'),
            isRevealed: false,
            isFrozen: false,
            lockedTurnCount: 0
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
          budget: 100, 
          suspicion: 5,
          moneyLaundered: 0,
          targetMoney: 150000, // Đặt mục tiêu thắng là 150k
          algorithmSteps: [],
          currentStepIndex: 0,
          isOriented: false,
          isAutoPlaying: get().isSimulationMode,
          syndicateCustomStyles: [],
          loopPickingMode: false,
          loopSelectedNodes: [],
          loopFloatingTexts: [],
          showLoopModal: false,
          showLoopSuccessModal: false,
          showFinanceReport: false,
          financeReportData: null,
          showBankruptcyModal: false,
          showSkillErrorModal: false,
          showDeathDefianceModal: false,
          deathDefianceSelectionMode: false,
          deathDefianceTargetCount: 0,
          deathDefianceSelectedNodes: [],
          deathDefiancePendingCost: 0,
          deathDefiancePendingAp: 0,
          investigationBudget: 100,
          investigatorAp: 6,
          suspicionProgress: 0,
          removedEdgeCount: 0,
          showSitrep: false,
          sitrepData: null,
          invSkillPhase: {},
          invScanResult: {},
          invFreezeSelectionMode: false,
          invFreezeTargets: null,
          showFreezeCountModal: false
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
        ap: 6,
        budget: 100,
        suspicion: 5,
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
        currentStepIndex: 0,
        turnFees: 0,
        loopPickingMode: false,
        loopOriginNodeId: null,
        loopDestNodeId: null,
        loopHighlightedEdges: [],
        loopTargetCount: 0,
        loopSelectedNodes: [],
        loopFloatingTexts: [],
        syndicateCustomStyles: [],
        bailoutUsed: false,
        showBankruptcyModal: false,
        bankruptcyType: null,
        showDeathDefianceModal: false,
        deathDefianceSelectionMode: false,
        deathDefianceTargetCount: 0,
        deathDefianceSelectedNodes: [],
        deathDefiancePendingCost: 0,
        deathDefiancePendingAp: 0,
        // Reset Investigator state
        investigationBudget: 100,
        investigatorAp: 6,
        hasUsedRedNotice: false,
        redNoticeFogCleared: false,
        showSitrep: false,
        sitrepData: null,
        invSkillPhase: {},
        invScanResult: {},
        removedEdgeCount: 0,
        invFloatingTexts: [],
        suspicionProgress: 0,
        invFreezeSelectionMode: false,
        invFreezeRemaining: 0,
        invFreezeMax: 0,
        invFreezePendingCost: 0,
        invFreezePendingAp: 0,
        showFreezeCountModal: false
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
        
        // 1. Check Resources (Both AP and Budget for Syndicate if applicable)
        if (isSyndicate) {
          if (ap < skill.cost || (skill.budgetCost && budget < skill.budgetCost)) {
            const missingType = ap < skill.cost ? 'AP' : 'VỐN ($)'
            get().setSkillError({
              title: 'TÀI NGUYÊN KHÔNG ĐỦ',
              message: `Hệ thống từ chối truy cập. Cần ${skill.cost} AP và $${skill.budgetCost || 0} để thực thi ${skill.name}.`,
              apLost: 0
            })
            return false
          }
        } else {
          // Investigator logic
          if (budget < skill.cost) {
            addNews({ type: 'alert', title: '⚠️ Không đủ vốn', message: `Cần ít nhất $${skill.cost} để thực hiện.` })
            return false
          }
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

        if (isSyndicate && skill.id === 'loop') {
          set({ showLoopModal: true, loopSkillData: skill })
          return true
        }

        if (isSyndicate && skill.id === 'death_defiance') {
          set({ showDeathDefianceModal: true })
          return true
        }

        // 3. Consume Resources
        if (isSyndicate) {
          useAp(skill.cost)
          // Incrementfees for Syndicate actions
          set(state => ({ turnFees: state.turnFees + 3000 }))
          
          // 3a. Syndicate Side Effects (Dynamic Graph)
          if (skill.id === 'layer') {
            const chainLength = 3
            const totalFundsCost = chainLength * 15
            if (budget < totalFundsCost) {
              get().setSkillError({
                title: 'THIẾT LẬP THẤT BẠI',
                message: `Không đủ $${totalFundsCost} để xây dựng chuỗi công ty ma. Tiến trình bị gián đoạn giữa chừng.`,
                apLost: 1
              })
              addNews({ 
                type: 'alert', 
                title: '⚠️ Thao tác thất bại', 
                message: `Cần $${totalFundsCost} nhưng ngân sách chỉ có $${budget}. Bạn bị mất 1 AP.` 
              })
              return false
            }

            const source = targetNodeId || selectedNode || graphData?.source || '0'
            let lastNodeId = source
            const chainNodes = [source]
            const chainEdges = []
            
            // Calculate a direction from current source
            const baseAngle = Math.random() * Math.PI * 2
            
            for (let i = 0; i < chainLength; i++) {
              const newNodeId = `shell_${Date.now()}_${i}`
              const dist = 100 + i * 80
              get().addNode({
                id: newNodeId,
                x: 400 + Math.cos(baseAngle) * dist + (Math.random() - 0.5) * 40,
                y: 300 + Math.sin(baseAngle) * dist + (Math.random() - 0.5) * 40,
                type: 'shell'
              })
              get().addEdge(lastNodeId, newNodeId)
              chainNodes.push(newNodeId)
              chainEdges.push({ u: lastNodeId, v: newNodeId })
              lastNodeId = newNodeId
            }

            const color = '#ff4d4d' 
            set(state => ({
              syndicateCustomStyles: [
                ...state.syndicateCustomStyles,
                { nodes: chainNodes, edges: chainEdges, color, type: 'layer' }
              ]
            }))

            addNews({ 
              type: 'syndicate', 
              title: '🏗️ Tạo lớp', 
              summary: 'Thiết lập chuỗi ẩn danh',
              message: `Thiết lập chuỗi => {3} điểm ma => Từ nguồn: ${source}` 
            })
          } else if (skill.id === 'smurf') {
            const totalFundsCost = 2 * 15
            if (budget < totalFundsCost) {
              addNews({ type: 'alert', title: '⚠️ Không đủ vốn', message: `Rải tiền cần ít nhất $${totalFundsCost}.` })
              return false
            }

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
            addNews({ 
              type: 'syndicate', 
              title: '💸 Chia nhỏ', 
              summary: 'Phân tách dòng tiền',
              message: `Phân tách => {Tài khoản cá nhân} x2 => Từ nguồn: ${source}` 
            })
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
            addNews({ 
              type: 'investigator', 
              title: '🌀 Giải định chiều', 
              summary: 'Vô hiệu hóa hướng dòng tiền',
              message: 'Hệ thống => Gỡ bỏ hướng đi => Vô hướng hóa.' 
            })
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
            // Mark each edge as isOriented individually so Investigator can detect them
            const newEdges = graphData.edges.map(e => ({

              ...e,
              isOriented: true,
              directed: true
            }))
            set({ 
              graphData: { ...graphData, edges: newEdges },
              isOriented: true,
              algorithmSteps: result.steps,
              isAnimating: true 
            })
            addNews({ 
              type: 'syndicate', 
              title: '➡️ Định chiều', 
              summary: 'Kích hoạt luồng tiền',
              message: 'Mạng lưới => Kích hoạt định hướng => Hoàn tất.' 
            })
          }
          // (Other syndicate skills like smurf/layer remain but can be updated to create undirected edges)
        }

        // 5. News Feedback
        addNews({
          type: isSyndicate ? 'syndicate' : 'investigator',
          title: `${isSyndicate ? '💰' : '🔍'} ${skill.name}`,
          summary: `Thực thi kỹ năng ${skill.name}`,
          message: `${skill.name} => ${skill.description}`
        })

        if (gameStatus === 'playing' && faction === 'investigator') {
          // Level completion logic could go here
        }

        return true
      },

      startLoopPicking: (count) => {
        const { ap, budget, addNews, loopSkillData } = get()
        const apCost = loopSkillData?.cost || 2
        const fundsCost = 60
        if (ap < apCost) {
          get().setSkillError({
            title: 'KHÔNG THỂ TẠO VÒNG',
            message: `Cần ${apCost} AP để bắt đầu thiết lập chu trình kín.`,
            apLost: 0
          })
          return false
        }
        if (budget < fundsCost) {
          get().setSkillError({
            title: 'KHÔNG THỂ TẠO VÒNG',
            message: `Hệ thống yêu cầu $${fundsCost} để thiết lập chu trình kín.`,
            apLost: 0
          })
          addNews({ type: 'alert', title: 'Không đủ ngân sách', message: `Bạn cần ít nhất $${fundsCost} để thiết lập chu trình.` })
          return false
        }
        set({ 
          showLoopModal: false,
          loopPickingMode: true, 
          loopTargetCount: count,
          loopSelectedNodes: [],
          ap: ap - apCost,
          loopSettingColor: '#3b82f6' // Vibrant Blue for picking
        })
        get().addNews({ 
          type: 'system', 
          title: '🔄 Chế độ tạo vòng', 
          summary: 'Bắt đầu thiết lập chu trình',
          message: `Khởi tạo => {${count}} đỉnh => Chờ xác nhận.` 
        })
      },

      // ===== INVESTIGATOR ACTIONS (NEW) =====

      closeSitrep: () => set({ showSitrep: false }),

      startDeathDefianceSelection: (count) => {
        const { ap, budget, graphData, addNews } = get()
        const eligible = (graphData?.vertices || []).filter(v => v.isFrozen && (v.lockedTurnCount || 0) >= 2)
        const safeCount = Math.max(1, Math.min(count, eligible.length))
        const totalCost = safeCount * 35 + Math.max(0, safeCount - 1) * 15
        const apCost = 2

        if (eligible.length === 0) {
          addNews({ type: 'alert', title: 'Không có mục tiêu hợp lệ', message: 'Chưa có đỉnh nào bị khóa đủ 2 lượt để hồi sinh.' })
          return false
        }
        if (ap < apCost || budget < totalCost) {
          get().setSkillError({
            title: 'TỪ CHỐI TỬ THẦN BỊ CHẶN',
            message: `Cần ${apCost} AP và $${totalCost} để hồi sinh ${safeCount} đỉnh.`,
            apLost: 0
          })
          return false
        }

        set({
          showDeathDefianceModal: false,
          deathDefianceSelectionMode: true,
          deathDefianceTargetCount: safeCount,
          deathDefianceSelectedNodes: [],
          deathDefiancePendingCost: totalCost,
          deathDefiancePendingAp: apCost,
          graphData: {
            ...graphData,
            vertices: graphData.vertices.map(v =>
              v.isFrozen && (v.lockedTurnCount || 0) >= 2
                ? { ...v, isHighlighted: true, highlightType: 'death_defiance' }
                : v
            )
          }
        })
        addNews({
          type: 'syndicate',
          title: 'Từ chối tử thần',
          summary: 'Chờ chọn mục tiêu hồi sinh',
          message: `Yêu cầu => {${safeCount}} đối tượng => Chờ Click.`
        })
        return true
      },

      cancelDeathDefianceSelection: () => set(state => ({
        showDeathDefianceModal: false,
        deathDefianceSelectionMode: false,
        deathDefianceTargetCount: 0,
        deathDefianceSelectedNodes: [],
        deathDefiancePendingCost: 0,
        deathDefiancePendingAp: 0,
        graphData: state.graphData ? {
          ...state.graphData,
          vertices: state.graphData.vertices.map(v =>
            v.highlightType === 'death_defiance' ? { ...v, isHighlighted: false, highlightType: null } : v
          )
        } : state.graphData
      })),

      // Investigator Scan Phase
      invScan: (skillId, algoOverride) => {
        const { graphData, investigationBudget, addNews, invSelectedNetworkAlgo } = get()
        if (!graphData) return

        const vertices = graphData.vertices
        const edges = graphData.edges
        const liveVertices = vertices.filter(v => !v.isFrozen)
        const liveNodeIds = new Set(liveVertices.map(v => v.id))
        const liveEdges = edges.filter(e => liveNodeIds.has(e.u) && liveNodeIds.has(e.v))

        // Scan costs per spec
        const scanCosts = { ring: 15, deorient: 10, network: algoOverride === 'kosaraju' ? 30 : 30, bridge: 15 }
        const cost = scanCosts[skillId] ?? 15

        if (investigationBudget < cost) {
          addNews({ type: 'alert', title: '⚠️ Thiếu ngân sách', message: `Cần $${cost} để quét. Hiện có: $${investigationBudget}` })
          return
        }

        let scanTargets = []
        let scanType = 'edge'
        const scanAlgo = algoOverride || invSelectedNetworkAlgo

        if (skillId === 'ring') {
          // Skill 1: DÒ VÒNG — tìm chu trình (cycles) do Syndicate tạo
          const loopStyles = (get().syndicateCustomStyles || []).filter(style => style.type === 'loop')
          const result = loopStyles.length > 0
            ? {
                cycleNodes: [...new Set(loopStyles.flatMap(style => style.nodes || []))],
                cycleEdges: [...new Map(
                  loopStyles
                    .flatMap(style => style.edges || [])
                    .map(edge => [`${edge.u}-${edge.v}`, edge])
                ).values()]
              }
            : ALGORITHMS.findCycles(vertices, edges)
          if (!result.cycleNodes || result.cycleNodes.length === 0) {
            addNews({ 
              type: 'system', 
              title: '🔴 Dò Vòng', 
              summary: 'Không có kết quả',
              message: 'Quét vòng => {0} phát hiện => Sạch.' 
            })
            return
          }
          scanTargets = { cycleNodes: result.cycleNodes, cycleEdges: result.cycleEdges }
          scanType = 'ring'
        } else if (skillId === 'deorient') {
          const orientedEdges = edges.filter(e => e.isOriented)
          if (orientedEdges.length === 0) {
            addNews({ 
              type: 'system', 
              title: '🌀 Giải định chiều', 
              summary: 'Không có kết quả',
              message: 'Quét hướng => {0} phát hiện => Sạch.' 
            })
            return
          }
          scanTargets = orientedEdges
          scanType = 'edge'
        } else if (skillId === 'bridge') {
          const result = ALGORITHMS.findBridges(vertices, edges)
          scanTargets = result.bridges || []
          scanType = 'edge'
          if (scanTargets.length === 0) {
            addNews({ 
              type: 'system', 
              title: '🔍 Bridge Hunter', 
              summary: 'Không có kết quả',
              message: 'Dò cầu => {0} phát hiện => Sạch.' 
            })
            return
          }
        } else if (skillId === 'network') {
          if (scanAlgo === 'tarjan') {
            const result = ALGORITHMS.tarjan(liveVertices, liveEdges)
            const sccs = (result.comps || []).filter(c => c.length > 1)
            if (sccs.length === 0) {
              addNews({ 
                type: 'system', 
                title: '🔵 Tarjan SCC', 
                summary: 'Không có kết quả',
                message: 'Quét Tarjan => {0} phát hiện => Sạch.' 
              })
              return
            }
            scanTargets = sccs
            scanType = 'scc'
          } else {
            const inDeg = {}
            liveVertices.forEach(v => inDeg[v.id] = 0)
            liveEdges.forEach(e => { if (inDeg[e.v] !== undefined) inDeg[e.v]++ })
            const hubNodes = liveVertices.filter(v => inDeg[v.id] >= 2)
            if (hubNodes.length === 0) {
              addNews({ 
                type: 'system', 
                title: '🔵 Kosaraju', 
                summary: 'Không có kết quả',
                message: 'Quét Kosaraju => {0} phát hiện => Sạch.' 
              })
              return
            }
            const sourceNodes = new Set()
            hubNodes.forEach(hub => liveEdges.forEach(e => { if (e.v === hub.id) sourceNodes.add(e.u) }))
            scanTargets = { hubs: hubNodes.map(v => v.id), sources: Array.from(sourceNodes) }
            scanType = 'sink'
          }
        }

        // Highlight on graphData
        set(state => ({
          investigationBudget: state.investigationBudget - cost,
          invSkillPhase: { ...state.invSkillPhase, [skillId]: 'execute' },
          invScanResult: { ...state.invScanResult, [skillId]: { targets: scanTargets, type: scanType, algo: scanAlgo } },
          graphData: {
            ...state.graphData,
            vertices: state.graphData.vertices.map(v => {
              let highlighted = false
              if (scanType === 'ring') highlighted = scanTargets.cycleNodes?.includes(v.id)
              else if (scanType === 'scc') highlighted = scanTargets.some(comp => comp.includes(v.id))
              else if (scanType === 'sink') highlighted = scanTargets.hubs?.includes(v.id) || scanTargets.sources?.includes(v.id)
              return highlighted
                ? { ...v, isHighlighted: true, highlightType: skillId }
                : { ...v, isHighlighted: v.highlightType !== skillId ? v.isHighlighted : false }
            }),
            edges: state.graphData.edges.map(e => {
              let highlighted = false
              if (scanType === 'edge') highlighted = scanTargets.some(t => (t.u === e.u && t.v === e.v) || (t.u === e.v && t.v === e.u))
              else if (scanType === 'ring') highlighted = scanTargets.cycleEdges?.some(t => (t.u === e.u && t.v === e.v) || (t.u === e.v && t.v === e.u))
              return highlighted ? { ...e, isHighlighted: true, highlightSkill: skillId } : e
            })
          }
        }))

        const names = { ring: 'DÒ VÒNG', deorient: 'GIẢI ĐỊNH CHIỀU', network: scanAlgo?.toUpperCase(), bridge: 'DÒ CẦU' }
        const targetCount = scanType === 'ring' ? scanTargets.cycleNodes?.length : scanType === 'sink' ? (scanTargets.hubs?.length || 0) : (Array.isArray(scanTargets) ? scanTargets.length : 0)
        addNews({ 
          type: 'investigator', 
          title: `🔍 [${names[skillId]}] Quét xong`, 
          summary: `Phát hiện ${targetCount} mục tiêu`,
          message: `Kết quả quét => {${targetCount}} mục tiêu => Chi $${cost}.` 
        })
      },

      // Investigator Execute Phase
      invExecute: (skillId) => {
        const { invScanResult, investigationBudget, investigatorAp, addNews, graphData, removedEdgeCount } = get()
        const result = invScanResult[skillId]
        if (!result) return

        const { targets, type, algo } = result
        const time = new Date().toLocaleTimeString('vi-VN')

        // Execute costs per spec
        const executeCosts = { ring: 10, deorient: 10, network: 0, bridge: 20 }
        const apCosts = { ring: 1, deorient: 1, network: 0, bridge: 1 }
        const cost = executeCosts[skillId] ?? 10
        const apCost = apCosts[skillId] ?? 1

        // Network Analyzer: show FreezeCountModal (interactive click flow)
        if (skillId === 'network') {
          const allTargets = type === 'scc'
            ? targets.flat()
            : [...(targets.hubs || []), ...(targets.sources || [])]
          const graphVertices = get().graphData?.vertices || []
          const targetNodes = graphVertices.filter(v => allTargets.includes(v.id))
          set({
            invFreezeTargets: { nodes: targetNodes, type, algo },
            showFreezeCountModal: true
          })
          return // FreezeCountModal will call invFreezeStartSelection
        }

        if (investigationBudget < cost) {
          addNews({ type: 'alert', title: '⚠️ Thiếu ngân sách', message: `Cần $${cost} để thực thi.` })
          return
        }
        if (investigatorAp < apCost) {
          addNews({ type: 'alert', title: '⚠️ Thiếu AP', message: `Cần ${apCost} AP để thực thi.` })
          return
        }

        let bounty = 0
        let newRemovedCount = removedEdgeCount
        let floatingTexts = []
        let suspicionGain = 0

        set(state => {
          let newVertices = state.graphData.vertices
          let newEdges = state.graphData.edges
          let localBounty = 0
          let localRemovedCount = removedEdgeCount
          let localFloatingTexts = []
          let localSuspicionGain = 0

          if (skillId === 'ring' && type === 'ring') {
            // Xóa các cạnh cốt lõi tạo vòng (cycleEdges)
            const cycleEdges = targets.cycleEdges || []
            cycleEdges.forEach(ce => {
              const key = `${ce.u}-${ce.v}`
              const keyRev = `${ce.v}-${ce.u}`
              newEdges = newEdges.filter(e => `${e.u}-${e.v}` !== key && `${e.u}-${e.v}` !== keyRev)
            })
            localRemovedCount += cycleEdges.length
            localSuspicionGain = 20
            localBounty = cycleEdges.length * 5
            if (targets.cycleNodes?.[0]) {
              localFloatingTexts.push({ id: `ft-ring-${Date.now()}`, nodeId: targets.cycleNodes[0], text: `+$${localBounty}`, color: '#ef4444' })
            }
          } else if (skillId === 'deorient' && type === 'edge') {
            // Đưa tất cả cạnh có hướng về vô hướng
            newEdges = newEdges.map(e =>
              e.isHighlighted && e.highlightSkill === 'deorient'
                ? { ...e, isOriented: false, directed: false, isHighlighted: false, highlightSkill: null }
                : e
            )
            localSuspicionGain = 10
            localBounty = 0
          } else if (skillId === 'bridge' && type === 'edge') {
            if (targets.length === 0) return state
            const firstBridge = targets[0]
            const bridgeKey = `${firstBridge.u}-${firstBridge.v}`
            const bridgeKeyRev = `${firstBridge.v}-${firstBridge.u}`
            const wasRemoved = newEdges.some(e => `${e.u}-${e.v}` === bridgeKey || `${e.u}-${e.v}` === bridgeKeyRev)
            newEdges = newEdges.filter(e => `${e.u}-${e.v}` !== bridgeKey && `${e.u}-${e.v}` !== bridgeKeyRev)
            if (wasRemoved) {
              localBounty = 15
              localRemovedCount += 1
              localFloatingTexts.push({ id: `ft-${Date.now()}-${firstBridge.u}`, nodeId: firstBridge.u, text: '+$15', color: '#39ff14' })
            }
          }

          // Clear highlights for this skill
          newVertices = newVertices.map(v => v.highlightType === skillId ? { ...v, isHighlighted: false, highlightType: null } : v)
          newEdges = newEdges.map(e => e.highlightSkill === skillId ? { ...e, isHighlighted: false, highlightSkill: null } : e)

          bounty = localBounty
          newRemovedCount = localRemovedCount
          floatingTexts = localFloatingTexts
          suspicionGain = localSuspicionGain

          return {
            investigationBudget: state.investigationBudget - cost + localBounty,
            investigatorAp: state.investigatorAp - apCost,
            removedEdgeCount: newRemovedCount,
            suspicionProgress: Math.min(100, state.suspicionProgress + localSuspicionGain),
            invSkillPhase: { ...state.invSkillPhase, [skillId]: 'scan' },
            invScanResult: { ...state.invScanResult, [skillId]: null },
            invFloatingTexts: [...state.invFloatingTexts, ...floatingTexts],
            syndicateCustomStyles: skillId === 'ring'
              ? state.syndicateCustomStyles.filter(style => {
                  if (style.type !== 'loop') return true
                  return !(style.edges || []).some(se =>
                    (targets.cycleEdges || []).some(ce =>
                      (ce.u === se.u && ce.v === se.v) || (ce.u === se.v && ce.v === se.u)
                    )
                  )
                })
              : state.syndicateCustomStyles,
            graphData: { ...state.graphData, vertices: newVertices, edges: newEdges }
          }
        })

        // Check Investigator win
        const newProgress = get().suspicionProgress
        if (newProgress >= 100) {
          const { currentLevelIndex, maxLevelUnlocked } = get()
          set({ gameStatus: 'investigator_win', maxLevelUnlocked: Math.max(maxLevelUnlocked, currentLevelIndex + 2) })
          addNews({ 
            type: 'alert', 
            title: '🏆 CHIẾN THẮNG!', 
            summary: 'Chuyên án kết thúc thành công',
            message: 'Investigator => Triệt phá toàn bộ mạng lưới => CHIẾN THẮNG.' 
          })
        }

        const summaryMsg = skillId === 'ring' ? 'Phá vỡ liên kết vòng' : skillId === 'deorient' ? 'Giải định chiều' : 'Thực thi thành công'
        const logMsg = skillId === 'ring'
          ? `Liên kết vòng => Phá vỡ => Bounty: +$${bounty} | Tiến độ: {+${suspicionGain}%}`
          : skillId === 'deorient'
          ? `Định hướng => Gỡ bỏ => Bounty: +$0 | Tiến độ: {+${suspicionGain}%}`
          : `Thực thi => Chi $${cost} | AP: -${apCost} => Bounty: +$${bounty}`
        addNews({ type: 'investigator', title: `⚡ [${skillLabels[skillId]}] Thực thi`, summary: summaryMsg, message: logMsg })
      },

      // Investigator Cancel Scan
      invCancel: (skillId) => {
        set(state => ({
          invSkillPhase: { ...state.invSkillPhase, [skillId]: 'scan' },
          invScanResult: { ...state.invScanResult, [skillId]: null },
          graphData: {
            ...state.graphData,
            vertices: state.graphData.vertices.map(v => v.highlightType === skillId ? { ...v, isHighlighted: false, highlightType: null } : v),
            edges: state.graphData.edges.map(e => e.highlightSkill === skillId ? { ...e, isHighlighted: false, highlightSkill: null } : e)
          }
        }))
        get().addNews({ 
          type: 'system', 
          title: '❌ Hủy quét', 
          summary: 'Hành động bị hủy',
          message: `Hủy kỹ năng => {${skillId}} => Hoàn trả thao tác.` 
        })
      },

      setInvSelectedNetworkAlgo: (algo) => set({ invSelectedNetworkAlgo: algo }),

      // FreezeCountModal confirm: enter interactive selection mode
      invFreezeStartSelection: (count) => {
        const { investigationBudget, investigatorAp, addNews, invFreezeTargets } = get()
        if (!invFreezeTargets) return

        const totalCost = 10 + count * 15
        const apCost = count

        if (investigationBudget < totalCost) {
          addNews({ type: 'alert', title: '⚠️ Thiếu ngân sách', message: `Cần $${totalCost} để phong tỏa ${count} đỉnh.` })
          return
        }
        if (investigatorAp < apCost) {
          addNews({ type: 'alert', title: '⚠️ Thiếu AP', message: `Cần ${apCost} AP.` })
          return
        }

        set({
          showFreezeCountModal: false,
          invFreezeSelectionMode: true,
          invFreezeRemaining: count,
          invFreezeMax: count,
          invFreezePendingCost: totalCost,
          invFreezePendingAp: apCost
        })
        addNews({ 
          type: 'investigator', 
          title: '🔒 Phong tỏa', 
          summary: 'Chế độ phong tỏa kích hoạt',
          message: `Mục tiêu => {${count}} đối tượng => Chờ Click.` 
        })
      },

      // Called when player clicks a highlighted node in interactive freeze mode
      invFreezeSelectNode: (nodeId) => {
        const { invFreezeRemaining, invFreezeMax, invFreezePendingCost, invFreezePendingAp, addNews } = get()
        if (!get().invFreezeSelectionMode) return

        const state = get()
        const node = state.graphData?.vertices.find(v => v.id === nodeId)
        if (!node || !node.isHighlighted) return // Only click highlighted nodes
        if (node.isFrozen) return

        const newRemaining = invFreezeRemaining - 1
        const time = new Date().toLocaleTimeString('vi-VN')
        const bountyPerNode = 10

        set(s => ({
          invFreezeRemaining: newRemaining,
          invFreezeSelectionMode: newRemaining > 0,
          // Deduct cost + AP only when last node is selected
          investigationBudget: newRemaining === 0
            ? s.investigationBudget - invFreezePendingCost + invFreezeMax * bountyPerNode
            : s.investigationBudget,
          investigatorAp: newRemaining === 0 ? s.investigatorAp - invFreezePendingAp : s.investigatorAp,
          suspicionProgress: newRemaining === 0 ? Math.min(100, s.suspicionProgress + invFreezeMax * 15) : s.suspicionProgress,
          invSkillPhase: newRemaining === 0 ? { ...s.invSkillPhase, network: 'scan' } : s.invSkillPhase,
          invScanResult: newRemaining === 0 ? { ...s.invScanResult, network: null } : s.invScanResult,
          invFreezeTargets: newRemaining === 0 ? null : s.invFreezeTargets,
          invFloatingTexts: [...s.invFloatingTexts, { id: `ft-freeze-${nodeId}-${Date.now()}`, nodeId, text: `+$${bountyPerNode}`, color: '#a855f7' }],
          graphData: {
            ...s.graphData,
            vertices: s.graphData.vertices.map(v =>
              v.id === nodeId ? { ...v, isFrozen: true, lockedTurnCount: 0, isHighlighted: false, highlightType: null } : v
            ),
            edges: newRemaining === 0
              ? s.graphData.edges.map(e => e.highlightSkill === 'network' ? { ...e, isHighlighted: false, highlightSkill: null } : e)
              : s.graphData.edges
          }
        }))

        if (newRemaining > 0) {
          addNews({ 
            type: 'investigator', 
            title: `🔒 Phong tỏa ${nodeId}`, 
            summary: `Đã khóa ${nodeId}`,
            message: `Phong tỏa => ${nodeId} => Còn lại: {${newRemaining}} đối tượng.` 
          })
        } else {
          addNews({ 
            type: 'investigator', 
            title: '🔒 PHONG TỎA THÀNH CÔNG', 
            summary: 'Hoàn tất phong tỏa mục tiêu',
            message: `Hoàn tất => Bounty: +$${invFreezeMax * bountyPerNode} | Tiến độ: {+${invFreezeMax * 15}%}` 
          })
          // Check win
          const prog = get().suspicionProgress
          if (prog >= 100) {
            const { currentLevelIndex, maxLevelUnlocked } = get()
            set({ gameStatus: 'investigator_win', maxLevelUnlocked: Math.max(maxLevelUnlocked, currentLevelIndex + 2) })
            addNews({ 
              type: 'alert', 
              title: '🏆 CHIẾN THẮNG!', 
              summary: 'Mạng lưới sụp đổ hoàn toàn',
              message: 'Investigator => Chuyên án hoàn tất => CHIẾN THẮNG.' 
            })
          }
        }
      },

      closeFreezeCountModal: () => set({ showFreezeCountModal: false, invFreezeTargets: null }),

      // Legacy: kept for backward compat
      invFreezeConfirm: (selectedNodeIds) => {
        get().addNews({ type: 'system', title: 'ℹ️', message: 'Sử dụng flow mới: click trực tiếp vào đỉnh.' })
      },

      closeFreezePopup: () => set({ showFreezePopup: false, invFreezeTargets: null, showFreezeCountModal: false }),

      clearInvFloatingText: (id) => set(state => ({
        invFloatingTexts: state.invFloatingTexts.filter(t => t.id !== id)
      })),

      // Red Notice Emergency Ability
      activateRedNotice: () => {
        const { hasUsedRedNotice, addNews, investigationBudget } = get()
        if (hasUsedRedNotice) return

        set({
          hasUsedRedNotice: true,
          redNoticeFogCleared: true,
          investigationBudget: investigationBudget + 50
        })

        addNews({
          type: 'alert',
          title: '🚨 TRUY NÃ ĐỎ',
          summary: 'Kích hoạt Red Notice',
          message: 'Lệnh Red Notice => +$50 | Xóa sương mù => 1 Kỹ năng miễn phí.'
        })
      },

      // Red Notice Free Skill: Run scan + execute for free
      invRedNoticeFreeSkill: (skillId, algoOverride) => {
        const { addNews } = get()
        // Temporarily override costs by giving budget/AP to cover, then execute
        const scanCosts = { bridge: 15, deorient: 10, network: algoOverride === 'kosaraju' ? 25 : 40 }
        const execCosts = { bridge: 10, deorient: 10, network: 20 }
        const apCosts = { bridge: 1, deorient: 1, network: 2 }
        // Add enough budget/AP temporarily to cover costs, execute, then deduct difference
        set(state => ({
          investigationBudget: state.investigationBudget + scanCosts[skillId] + execCosts[skillId],
          investigatorAp: state.investigatorAp + apCosts[skillId]
        }))
        get().invScan(skillId, algoOverride)
        // Check scan found targets, then execute
        const afterScan = get().invScanResult[skillId]
        if (afterScan?.targets && (Array.isArray(afterScan.targets) ? afterScan.targets.length > 0 : afterScan.targets.hubs?.length > 0)) {
          get().invExecute(skillId)
        }
        addNews({ type: 'alert', title: '🚨 RED NOTICE', message: `Kỹ năng ${skillId.toUpperCase()} đã được thực thi MIỄN PHÍ!` })
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

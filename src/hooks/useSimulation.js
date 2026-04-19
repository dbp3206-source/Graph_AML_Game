import { useEffect, useRef } from 'react'
import useGameState from './useGameState'
import { SCENARIOS, SYNDICATE_SKILLS, INVESTIGATOR_SKILLS } from '../utils/scenarios'

const useSimulation = () => {
  const {
    isSimulationMode,
    faction,
    ap,
    budget,
    graphData,
    gameStatus,
    executeSkill,
    nextTurn,
    isAnimating,
    addNews
  } = useGameState()

  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isSimulationMode || gameStatus !== 'playing' || isAnimating) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      const { faction, ap, budget, graphData, isAnimating, gameStatus } = useGameState.getState()
      
      if (isAnimating || gameStatus !== 'playing') return

      if (faction === 'syndicate') {
        // Syndicate AI Logic
        if (ap >= 3 && Math.random() > 0.7) {
          const orientSkill = SYNDICATE_SKILLS.find(s => s.id === 'orient')
          executeSkill(orientSkill)
        } else if (ap >= 2 && Math.random() > 0.4) {
          const layerSkill = SYNDICATE_SKILLS.find(s => s.id === 'layer')
          const randomNode = graphData.vertices[Math.floor(Math.random() * graphData.vertices.length)].id
          executeSkill(layerSkill, randomNode)
        } else if (ap >= 1) {
          const smurfSkill = SYNDICATE_SKILLS.find(s => s.id === 'smurf')
          const randomNode = graphData.vertices[Math.floor(Math.random() * graphData.vertices.length)].id
          executeSkill(smurfSkill, randomNode)
        } else {
          addNews({ type: 'system', title: '🤖 Auto', message: 'Syndicate kết thúc lượt.' })
          nextTurn()
        }
      } else {
        // Investigator AI Logic
        if (budget >= 60 && Math.random() > 0.8) {
          const kosaSkill = INVESTIGATOR_SKILLS.find(s => s.id === 'kosaraju')
          executeSkill(kosaSkill)
        } else if (budget >= 45 && Math.random() > 0.5) {
          const tarjanSkill = INVESTIGATOR_SKILLS.find(s => s.id === 'tarjan')
          executeSkill(tarjanSkill)
        } else if (budget >= 20 && Math.random() > 0.3) {
          const bridgeSkill = INVESTIGATOR_SKILLS.find(s => s.id === 'bridge')
          executeSkill(bridgeSkill)
        } else if (budget >= 10) {
          const bfsSkill = { id: 'bfs', name: 'Quét BFS', cost: 10, costType: 'budget' }
          const randomNode = graphData.vertices[Math.floor(Math.random() * graphData.vertices.length)].id
          executeSkill(bfsSkill, randomNode)
        } else {
          addNews({ type: 'system', title: '🤖 Auto', message: 'Investigator kết thúc lượt.' })
          nextTurn()
        }
      }
    }, 2500) // 2.5s per action to allow animation to breathe

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isSimulationMode, faction, gameStatus, isAnimating])
}

export default useSimulation

/**
 * Random financial network generator.
 * [ARCH-03 FIX]: Bidirectional duplicate check when adding random edges.
 */
import { EMOJI_MAPS, NODE_TYPE_LABELS } from './constants'

const TYPES = ['personal', 'shell', 'bank', 'mixer']

export const generateRandomNetwork = (nodeCount = 8) => {
  const vertices = []
  const edges = []

  vertices.push({ id: 'source', x: 50, y: 250, label: '💰 Source', type: 'source' })
  vertices.push({ id: 'sink', x: 750, y: 250, label: '🏦 Final Bank', type: 'bank' })

  for (let i = 1; i < nodeCount; i++) {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)]
    vertices.push({
      id: `node_${i}`,
      x: 150 + Math.random() * 500,
      y: 50 + Math.random() * 400,
      label: `${i}`,
      type,
    })
  }

  // Guaranteed path
  edges.push({ u: 'source', v: 'node_1' })
  for (let i = 1; i < nodeCount - 1; i++) {
    edges.push({ u: `node_${i}`, v: `node_${i + 1}` })
  }
  edges.push({ u: `node_${nodeCount - 1}`, v: 'sink' })

  // Random complexity — [ARCH-03 FIX]: check both directions
  const hasEdge = (u, v) =>
    edges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))

  for (let i = 0; i < Math.floor(nodeCount / 2); i++) {
    const u = vertices[Math.floor(Math.random() * vertices.length)].id
    const v = vertices[Math.floor(Math.random() * vertices.length)].id
    if (u !== v && !hasEdge(u, v)) {
      edges.push({ u, v })
    }
  }

  return {
    id: `random_${Date.now()}`,
    name: 'Mạng lưới Ngẫu nhiên',
    vertices,
    edges,
    source: 'source',
    target: 'sink',
  }
}

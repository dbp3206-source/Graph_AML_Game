/**
 * Graph Algorithms for AML Asymmetry.
 *
 * CHANGELOG:
 * - [BUG-01] tarjan() now uses buildDirectedAdj so SCCs are detected correctly
 *   on directed graphs (money flows have direction).
 * - [BUG-04] findCycles() normalises adjacency to avoid false positives from
 *   parallel/multi-edges between the same pair of nodes.
 * - Added depth-limit to BFS/DFS to prevent stack overflow on large graphs.
 */

const MAX_TRAVERSAL_DEPTH = 200

const ALGORITHMS = {
  // ── Adjacency helpers ─────────────────────────────────────────────────────

  /** Undirected adjacency list */
  buildAdj(vertices, edges) {
    const adj = {}
    vertices.forEach(v => { adj[v.id] = [] })
    edges.forEach(e => {
      if (!adj[e.u]) adj[e.u] = []
      if (!adj[e.v]) adj[e.v] = []
      adj[e.u].push(e.v)
      adj[e.v].push(e.u)
    })
    return adj
  },

  /** Directed adjacency list (u → v only) */
  buildDirectedAdj(vertices, edges) {
    const adj = {}
    vertices.forEach(v => { adj[v.id] = [] })
    edges.forEach(e => {
      if (!adj[e.u]) adj[e.u] = []
      adj[e.u].push(e.v)
    })
    return adj
  },

  /** Reversed directed adjacency (v → u) for Kosaraju step-2 */
  buildTransposeAdj(vertices, edges) {
    const adj = {}
    vertices.forEach(v => { adj[v.id] = [] })
    edges.forEach(e => {
      if (!adj[e.v]) adj[e.v] = []
      adj[e.v].push(e.u)
    })
    return adj
  },

  // ── BFS ───────────────────────────────────────────────────────────────────

  bfs(vertices, edges, start) {
    const adj = this.buildAdj(vertices, edges)
    const dist = {}
    const parent = {}
    const visited = new Set()
    vertices.forEach(v => { dist[v.id] = -1 })
    const q = [start]
    dist[start] = 0
    const steps = []

    const pushStep = (u, msg, highlightEdge, currentQueue) => {
      const nodeStatus = {}
      vertices.forEach(v => {
        if (visited.has(v.id)) nodeStatus[v.id] = 'visited'
        else if (v.id === u) nodeStatus[v.id] = 'active'
        else nodeStatus[v.id] = 'unvisited'
      })
      steps.push({ msg, nodeStatus, highlightEdge, dist: { ...dist }, parent: { ...parent }, queue: [...currentQueue], type: 'queue' })
    }

    pushStep(start, `📡 Bắt đầu truy vết dòng tiền từ điểm xuất phát ${start}`, null, q)
    visited.add(start)

    while (q.length > 0) {
      const u = q.shift()
      pushStep(u, `🔍 Đang phân tích tài khoản ${u}`, null, q)
      ;(adj[u] || []).forEach(v => {
        if (!visited.has(v)) {
          visited.add(v)
          dist[v] = dist[u] + 1
          parent[v] = u
          q.push(v)
          pushStep(v, `➕ Phát hiện giao dịch nghi vấn tới ${v}`, { u, v }, q)
        }
      })
    }

    return { steps, dist, parent, visited: Array.from(visited) }
  },

  // ── DFS ───────────────────────────────────────────────────────────────────

  dfs(vertices, edges, start) {
    const adj = this.buildAdj(vertices, edges)
    const visited = new Set()
    const parent = {}
    const steps = []
    const stack = []
    let depth = 0

    const pushStep = (u, msg, highlightEdge) => {
      const nodeStatus = {}
      vertices.forEach(v => {
        if (visited.has(v.id)) nodeStatus[v.id] = 'visited'
        else if (v.id === u) nodeStatus[v.id] = 'active'
        else nodeStatus[v.id] = 'unvisited'
      })
      steps.push({ msg, nodeStatus, highlightEdge, visited: new Set(visited), parent: { ...parent }, stack: [...stack], type: 'stack' })
    }

    const dfsRec = (u) => {
      if (depth > MAX_TRAVERSAL_DEPTH) return
      depth++
      visited.add(u)
      stack.push(u)
      pushStep(u, `📥 Điều tra chuyên sâu mạng lưới của ${u}`)
      ;(adj[u] || []).forEach(v => {
        if (!visited.has(v)) {
          parent[v] = u
          pushStep(v, `→ Lần theo đầu mối: ${u} ➔ ${v}`, { u, v })
          dfsRec(v)
        }
      })
      stack.pop()
      pushStep(u, `📤 Hoàn tất phân tích các nhánh liên quan tới ${u}`)
      depth--
    }

    dfsRec(start)
    return { steps, visited: Array.from(visited), parent }
  },

  // ── Tarjan SCC ────────────────────────────────────────────────────────────
  // [BUG-01 FIX]: Now uses buildDirectedAdj — SCCs require directed edges.
  // Previously used buildAdj (undirected), making every pair of connected
  // nodes a trivial SCC and inflating economy yields.

  tarjan(vertices, edges) {
    const adj = this.buildDirectedAdj(vertices, edges) // ← FIX: directed
    let idx = 0
    const index = {}
    const low = {}
    const stack = []
    const onStack = new Set()
    const comps = []
    const steps = []

    const pushStep = (u, msg, currentStack) => {
      const nodeStatus = {}
      vertices.forEach(v => {
        if (index[v.id] == null) nodeStatus[v.id] = 'unvisited'
        else if (onStack.has(v.id)) nodeStatus[v.id] = v.id === u ? 'active' : 'visited'
        else nodeStatus[v.id] = 'processed'
      })
      steps.push({ msg, nodeStatus, stack: [...currentStack], comps: comps.map(c => [...c]), type: 'stack' })
    }

    const strongConnect = (u) => {
      index[u] = low[u] = idx++
      stack.push(u)
      onStack.add(u)
      pushStep(u, `🔵 Thiết lập hồ sơ theo dõi cho ${u}`, stack)
      ;(adj[u] || []).forEach(v => {
        if (index[v] == null) {
          strongConnect(v)
          low[u] = Math.min(low[u], low[v])
          pushStep(u, `🔄 Phát hiện liên kết vòng tại ${u}`, stack)
        } else if (onStack.has(v)) {
          low[u] = Math.min(low[u], index[v])
          pushStep(u, `⬅️ Phát hiện giao dịch quay đầu tới ${v}: Nghi vấn chu trình rửa tiền!`, stack)
        }
      })
      if (low[u] === index[u]) {
        const comp = []
        let w
        do {
          w = stack.pop()
          onStack.delete(w)
          comp.push(w)
        } while (w !== u)
        comps.push(comp)
        pushStep(u, `🎯 XÁC MINH MẠNG LƯỚI PHỨC TẠP: Bóc tách nhóm tài khoản khép kín.`, stack)
      }
    }

    vertices.forEach(v => {
      if (index[v.id] == null) strongConnect(v.id)
    })

    return { steps, comps }
  },

  // ── Find Bridges ──────────────────────────────────────────────────────────

  findBridges(vertices, edges) {
    const adj = this.buildAdj(vertices, edges)
    const discoveryTime = {}
    const lowLink = {}
    const visited = new Set()
    let time = 0
    const bridges = []
    const steps = []

    const pushStep = (u, v, msg, isBridge = false) => {
      steps.push({
        u, v, msg,
        nodeStatus: Array.from(visited).reduce((acc, nid) => ({ ...acc, [nid]: 'visited' }), { [u]: 'active' }),
        isBridge,
        type: 'bridge'
      })
    }

    const dfs = (u, p = null) => {
      visited.add(u)
      discoveryTime[u] = lowLink[u] = time++
      ;(adj[u] || []).forEach(v => {
        if (v === p) return
        if (visited.has(v)) {
          lowLink[u] = Math.min(lowLink[u], discoveryTime[v])
        } else {
          pushStep(u, v, `🔍 Kiểm tra cạnh (${u}, ${v})`)
          dfs(v, u)
          lowLink[u] = Math.min(lowLink[u], lowLink[v])
          if (lowLink[v] > discoveryTime[u]) {
            bridges.push({ u, v })
            pushStep(u, v, `⚠️ PHÁT HIỆN ĐIỂM NGHẼN: Phong tỏa ${v} sẽ cô lập dòng tiền từ ${u}!`, true)
          }
        }
      })
    }

    vertices.forEach(v => {
      if (!visited.has(v.id)) dfs(v.id)
    })

    return { steps, bridges }
  },

  // ── Strong Orientation ────────────────────────────────────────────────────

  strongOrientation(vertices, edges) {
    const adj = this.buildAdj(vertices, edges)
    const visited = new Set()
    const orientedEdges = []
    const steps = []

    const dfs = (u, p = null) => {
      visited.add(u)
      ;(adj[u] || []).forEach(v => {
        if (v === p) return
        const exists = orientedEdges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))
        if (!exists) {
          orientedEdges.push({ u, v })
          steps.push({ msg: `➡️ Định chiều: ${u} → ${v}`, highlightEdge: { u, v }, nodeStatus: { [u]: 'active', [v]: 'visited' } })
          if (!visited.has(v)) dfs(v, u)
        }
      })
    }

    vertices.forEach(v => {
      if (!visited.has(v.id)) dfs(v.id)
    })

    return { steps, orientedEdges }
  },

  // ── Kosaraju SCC ──────────────────────────────────────────────────────────

  kosaraju(vertices, edges) {
    const adj = this.buildDirectedAdj(vertices, edges) // directed
    const visited = new Set()
    const stack = []
    const steps = []

    const pushStep = (u, msg, status = {}, opts = {}) => {
      const nodeStatus = {}
      vertices.forEach(v => {
        if (status[v.id]) nodeStatus[v.id] = status[v.id]
        else if (visited.has(v.id)) nodeStatus[v.id] = 'visited'
        else nodeStatus[v.id] = 'unvisited'
      })
      steps.push({ msg, nodeStatus, stack: [...stack], type: 'stack', isTranspose: opts.isTranspose || false, highlightEdge: opts.highlightEdge || null })
    }

    steps.push({ msg: '🕵️ Bắt đầu bóc tách mạng lưới rửa tiền đa quốc gia (Kosaraju)', nodeStatus: {}, stack: [], type: 'stack' })

    const dfs1 = (u) => {
      visited.add(u)
      pushStep(u, `1️⃣ Phân tích lượt đi: Giám sát luồng tiền từ ${u}`)
      ;(adj[u] || []).forEach(v => {
        if (!visited.has(v)) {
          pushStep(u, `➔ Theo dấu dòng tiền tới ${v}`, {}, { highlightEdge: { u, v } })
          dfs1(v)
        }
      })
      stack.push(u)
      pushStep(u, `✅ Hoàn tất đăng ký hồ sơ cho ${u}`)
    }

    vertices.forEach(v => { if (!visited.has(v.id)) dfs1(v.id) })

    const transpose = this.buildTransposeAdj(vertices, edges)
    steps.push({ msg: '🔄 Giai đoạn 2: Tạo đồ thị chuyển vị', nodeStatus: {}, stack: [...stack], type: 'stack', isTranspose: true })

    visited.clear()
    const comps = []

    const dfs2 = (u, currentComp) => {
      visited.add(u)
      currentComp.push(u)
      pushStep(u, `2️⃣ DFS lượt về: Xét ${u} trong đồ thị chuyển vị`, {}, { isTranspose: true })
      ;(transpose[u] || []).forEach(v => {
        if (!visited.has(v)) {
          pushStep(u, `→ Duyệt ngược (${v}, ${u})`, {}, { isTranspose: true, highlightEdge: { u, v } })
          dfs2(v, currentComp)
        }
      })
    }

    while (stack.length > 0) {
      const u = stack.pop()
      if (u !== undefined && !visited.has(u)) {
        const comp = []
        pushStep(u, `📢 Truy vết ngược: Bắt đầu từ ${u}`, {}, { isTranspose: true })
        dfs2(u, comp)
        comps.push(comp)
        pushStep(u, `🎯 PHÁT HIỆN MẠNG LƯỚI KHÉP KÍN!`, {}, { isTranspose: true })
      } else if (u !== undefined) {
        pushStep(u, `⏭️ Bỏ qua ${u} (đã xác định)`, {}, { isTranspose: true })
      }
    }

    return { steps, comps }
  },

  // ── Find Cycles (undirected) ──────────────────────────────────────────────
  // [BUG-04 FIX]: Deduplicate edges before building adjacency to prevent
  // parallel/multi-edges from generating false back-edge detections.

  findCycles(vertices, edges) {
    // Deduplicate edges: keep only one (u,v) or (v,u) per pair
    const seen = new Set()
    const uniqueEdges = []
    edges.forEach(e => {
      const key = e.u < e.v ? `${e.u}||${e.v}` : `${e.v}||${e.u}`
      if (!seen.has(key)) { seen.add(key); uniqueEdges.push(e) }
    })

    const adj = {}
    vertices.forEach(v => { adj[v.id] = [] })
    uniqueEdges.forEach(e => {
      if (!adj[e.u]) adj[e.u] = []
      if (!adj[e.v]) adj[e.v] = []
      adj[e.u].push(e.v)
      adj[e.v].push(e.u)
    })

    const visited = new Set()
    const parent = {}
    const cycleNodes = new Set()
    const cycleEdges = []
    const steps = []

    const pushStep = (u, msg) => {
      const nodeStatus = {}
      vertices.forEach(v => {
        if (cycleNodes.has(v.id)) nodeStatus[v.id] = 'active'
        else if (visited.has(v.id)) nodeStatus[v.id] = 'visited'
        else nodeStatus[v.id] = 'unvisited'
      })
      steps.push({ msg, nodeStatus, type: 'ring' })
    }

    const dfs = (u, par) => {
      visited.add(u)
      pushStep(u, `🔴 Duyệt nút ${u} — tìm vòng lặp rửa tiền`)
      for (const v of (adj[u] || [])) {
        if (v === par) continue
        if (visited.has(v)) {
          pushStep(u, `⚡ PHÁT HIỆN VÒNG: ${u} → ${v} là cạnh ngược!`)
          cycleNodes.add(u)
          cycleNodes.add(v)
          const backEdgeKey = `${u}||${v}`
          if (!cycleEdges.some(ce => `${ce.u}||${ce.v}` === backEdgeKey || `${ce.v}||${ce.u}` === backEdgeKey)) {
            cycleEdges.push({ u, v })
          }
          let cur = u
          while (cur !== v && parent[cur] != null) {
            const p = parent[cur]
            cycleNodes.add(p)
            const pathKey = `${cur}||${p}`
            if (!cycleEdges.some(ce => `${ce.u}||${ce.v}` === pathKey || `${ce.v}||${ce.u}` === pathKey)) {
              cycleEdges.push({ u: p, v: cur })
            }
            cur = p
          }
        } else {
          parent[v] = u
          dfs(v, u)
        }
      }
    }

    vertices.forEach(v => {
      if (!visited.has(v.id)) dfs(v.id, null)
    })

    if (cycleNodes.size > 0) {
      pushStep(null, `🎯 HOÀN TẤT: Phát hiện ${cycleEdges.length} cạnh khép vòng!`)
    }

    return { steps, cycleNodes: Array.from(cycleNodes), cycleEdges }
  }
}

export default ALGORITHMS
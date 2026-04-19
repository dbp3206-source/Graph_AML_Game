const ALGORITHMS = {
  buildAdj: function(vertices, edges, directed = false) {
    const adj = {}
    vertices.forEach(v => { adj[v.id] = [] })
    edges.forEach(e => {
      if (!adj[e.u]) adj[e.u] = []
      if (!adj[e.v]) adj[e.v] = []
      adj[e.u].push(e.v)
      if (!directed) adj[e.v].push(e.u)
    })
    return adj
  },

  buildDirectedAdj: function(vertices, edges) {
    return this.buildAdj(vertices, edges, true)
  },

  bfs: function(vertices, edges, start) {
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
      steps.push({ 
        msg, 
        nodeStatus, 
        highlightEdge, 
        dist: { ...dist }, 
        parent: { ...parent },
        queue: [...currentQueue], // Tracking Queue for TracePanel
        type: 'queue'
      })
    }

    pushStep(start, `📡 Bắt đầu truy vết dòng tiền từ điểm xuất phát ${start}`, null, q)
    visited.add(start)

    while (q.length > 0) {
      const u = q.shift()
      pushStep(u, `🔍 Đang phân tích kỹ thuật tài khoản ${u}`, null, q)
      ;(adj[u] || []).forEach(v => {
        if (!visited.has(v)) {
          visited.add(v)
          dist[v] = dist[u] + 1
          parent[v] = u
          q.push(v)
          pushStep(v, `➕ Phát hiện giao dịch nghi vấn tới ${v}, đưa vào danh sách theo dõi mở rộng`, { u, v }, q)
        }
      })
    }

    return { steps, dist, parent, visited: Array.from(visited) }
  },

  dfs: function(vertices, edges, start) {
    const adj = this.buildAdj(vertices, edges)
    const visited = new Set()
    const parent = {}
    const steps = []
    const stack = [] // For tracing

    const pushStep = (u, msg, highlightEdge) => {
      const nodeStatus = {}
      vertices.forEach(v => {
        if (visited.has(v.id)) nodeStatus[v.id] = 'visited'
        else if (v.id === u) nodeStatus[v.id] = 'active'
        else nodeStatus[v.id] = 'unvisited'
      })
      steps.push({ 
        msg, 
        nodeStatus, 
        highlightEdge, 
        visited: new Set(visited), 
        parent: { ...parent },
        stack: [...stack], // Tracking Stack for TracePanel
        type: 'stack' 
      })
    }

    function dfsRec(u) {
      visited.add(u)
      stack.push(u)
      pushStep(u, `📥 Bắt đầu cuộc điều tra chuyên sâu vào mạng lưới của ${u}`)
      ;(adj[u] || []).forEach(v => {
        if (!visited.has(v)) {
          parent[v] = u
          pushStep(v, `→ Lần theo đầu mối giao dịch: ${u} ➔ ${v}`, { u, v })
          dfsRec(v)
        }
      })
      stack.pop()
      pushStep(u, `📤 Hoàn tất phân tích các nhánh liên quan tới ${u}`)
    }

    dfsRec(start)
    return { steps, visited: Array.from(visited), parent }
  },

  tarjan: function(vertices, edges) {
    const adj = this.buildAdj(vertices, edges)
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
      steps.push({ 
        msg, 
        nodeStatus, 
        stack: [...currentStack], 
        comps: comps.map(c => [...c]),
        type: 'stack'
      })
    }

    function strongConnect(u) {
      index[u] = low[u] = idx++
      stack.push(u)
      onStack.add(u)
      pushStep(u, `🔵 Thiết lập hồ sơ theo dõi cho ${u} và đưa vào bộ lọc SCC`, stack)
      ;(adj[u] || []).forEach(v => {
        if (index[v] == null) {
          strongConnect(v)
          low[u] = Math.min(low[u], low[v])
          pushStep(u, `🔄 Phát hiện mối liên kết vòng luân chuyển tiền tại ${u}`, stack)
        } else if (onStack.has(v)) {
          low[u] = Math.min(low[u], index[v])
          pushStep(u, `⬅️ Phát hiện giao dịch quay đầu tới ${v}: Nghi vấn chu trình rửa tiền khép kín`, stack)
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
        pushStep(u, `🎯 XÁC MINH MẠNG LƯỚI PHỨC TẠP: Đã bóc tách được nhóm tài khoản liên đới khép kín.`, stack)
      }
    }

    vertices.forEach(v => {
      if (index[v.id] == null) strongConnect(v.id)
    })

    return { steps, comps }
  },

  findBridges: function(vertices, edges) {
    const adj = this.buildAdj(vertices, edges, false) 
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
            pushStep(u, v, `⚠️ PHÁT HIỆN ĐIỂM NGHẼN TRÌ TRỆ: Nếu đóng băng tài khoản ${v}, toàn bộ dòng tiền từ ${u} sẽ bị tê liệt hoàn toàn!`, true)
          }
        }
      })
    }

    vertices.forEach(v => {
      if (!visited.has(v.id)) dfs(v.id)
    })

    return { steps, bridges }
  },

  strongOrientation: function(vertices, edges) {
    const adj = this.buildAdj(vertices, edges, false) 
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
          steps.push({ 
            msg: `➡️ Định chiều: ${u} → ${v}`, 
            highlightEdge: { u, v },
            nodeStatus: { [u]: 'active', [v]: 'visited' }
          })
          if (!visited.has(v)) {
            dfs(v, u)
          }
        }
      })
    }

    vertices.forEach(v => {
      if (!visited.has(v.id)) dfs(v.id)
    })

    return { steps, orientedEdges }
  },

  buildTransposeAdj: function(vertices, edges) {
    const adj = {}
    vertices.forEach(v => { adj[v.id] = [] })
    edges.forEach(e => {
      if (!adj[e.v]) adj[e.v] = []
      adj[e.v].push(e.u)
    })
    return adj
  },

  kosaraju: function(vertices, edges) {
    const adj = this.buildDirectedAdj(vertices, edges)
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
      steps.push({ 
        msg, 
        nodeStatus, 
        stack: [...stack], 
        type: 'stack',
        isTranspose: opts.isTranspose || false,
        highlightEdge: opts.highlightEdge || null
      })
    }

    // Step 0: Initial
    steps.push({ msg: "🕵️ Bắt đầu chiến dịch bóc tách mạng lưới rửa tiền đa quốc gia (Kosaraju)", nodeStatus: {}, stack: [], type: 'stack' })

    // Step 1: Fill stack with finishing times
    const dfs1 = (u) => {
      visited.add(u)
      pushStep(u, `1️⃣ Phân tích lượt đi: Giám sát luồng tiền xuất phát từ ${u}`)
      ;(adj[u] || []).forEach(v => {
        if (!visited.has(v)) {
          pushStep(u, `➔ Theo dấu dòng tiền tới ${v}`, {}, { highlightEdge: {u, v} })
          dfs1(v)
        }
      })
      stack.push(u)
      pushStep(u, `✅ Hoàn tất đăng ký hồ sơ giao dịch cho ${u}`)
    }

    vertices.forEach(v => {
      if (!visited.has(v.id)) dfs1(v.id)
    })

    // Step 2: Reverse graph
    const transpose = this.buildTransposeAdj(vertices, edges)
    steps.push({ 
      msg: "🔄 Giai đoạn 2: Tạo đồ thị chuyển vị (Đảo ngược tất cả các cạnh)", 
      nodeStatus: {}, 
      stack: [...stack], 
      type: 'stack',
      isTranspose: true 
    })
    
    visited.clear()
    const comps = []

    // Step 3: Process stack in reversed order
    const dfs2 = (u, currentComp) => {
      visited.add(u)
      currentComp.push(u)
      pushStep(u, `2️⃣ DFS lượt về: Đang xét ${u} trong đồ thị chuyển vị`, {}, { isTranspose: true })
      ;(transpose[u] || []).forEach(v => {
        if (!visited.has(v)) {
          pushStep(u, `→ Duyệt ngược cạnh (${v}, ${u})`, {}, { isTranspose: true, highlightEdge: {u, v} })
          dfs2(v, currentComp)
        }
      })
    }

    while (stack.length > 0) {
      const u = stack.pop()
      if (u !== undefined && !visited.has(u)) {
        const comp = []
        pushStep(u, `📢 Truy vết ngược: Bắt đầu từ tài khoản đầu nòng ${u} trong đồ thị chuyển vị`, {}, { isTranspose: true })
        dfs2(u, comp)
        comps.push(comp)
        pushStep(u, `🎯 PHÁT HIỆN MẠNG LƯỚI KHÉP KÍN: Một nhóm rửa tiền chuyên nghiệp đã bị lộ diện!`, {}, { isTranspose: true })
      } else if (u !== undefined) {
        pushStep(u, `⏭️ Bỏ qua ${u} (Đã xác định thuộc mạng lưới khác)`, {}, { isTranspose: true })
      }
    }

    return { steps, comps }
  }

}

export default ALGORITHMS
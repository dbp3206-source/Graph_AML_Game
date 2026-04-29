/**
 * Game Scenarios (Levels) and Skill Definitions.
 * Added Level 4 (Offshore Network) and Level 5 (Crypto Mixer).
 */

export const SCENARIOS = {
  level1: {
    id: 'level1',
    level: 1,
    name: 'Màn 1: Chiêu bài Công ty ma (Layering)',
    description: 'Sử dụng các pháp nhân Công ty ma để che giấu dòng tiền.',
    difficulty: 'Dễ',
    maxTurns: 15,
    vertices: [
      { id: '0', x: 100, y: 250, label: 'Nguồn tiền bẩn', type: 'source' },
      { id: '1', x: 300, y: 250, label: 'Công ty ma A', type: 'shell' },
      { id: '2', x: 500, y: 250, label: 'Ngân hàng TW', type: 'bank' }
    ],
    edges: [
      { u: '0', v: '1' },
      { u: '1', v: '2' }
    ],
    source: '0',
    target: '2'
  },

  level2: {
    id: 'level2',
    level: 2,
    name: 'Màn 2: Mạng lưới Smurfing',
    description: 'Chia nhỏ tiền qua hàng loạt tài khoản ảo để né tránh hệ thống giám sát.',
    difficulty: 'Trung bình',
    maxTurns: 15,
    vertices: [
      { id: '0', x: 100, y: 250, label: 'Nguồn tiền bẩn', type: 'source' },
      { id: '1', x: 250, y: 150, label: 'TK ảo 1', type: 'personal' },
      { id: '2', x: 250, y: 350, label: 'TK ảo 2', type: 'personal' },
      { id: '3', x: 400, y: 250, label: 'Sàn chui (Broker)', type: 'mixer' },
      { id: '4', x: 550, y: 250, label: 'Ngân hàng TW', type: 'bank' }
    ],
    edges: [
      { u: '0', v: '1' },
      { u: '0', v: '2' },
      { u: '1', v: '3' },
      { u: '2', v: '3' },
      { u: '3', v: '4' }
    ],
    source: '0',
    target: '4'
  },

  level3: {
    id: 'level3',
    level: 3,
    name: 'Màn 3: Vòng xoáy Tích hợp (SCC)',
    description: 'Tiền chạy qua các chu trình khép kín phức tạp. Cần quét siêu máy tính để bóc tách.',
    difficulty: 'Khó',
    maxTurns: 14,
    vertices: [
      { id: '0', x: 100, y: 250, label: 'Nguồn bẩn', type: 'source' },
      { id: '1', x: 250, y: 150, label: 'Công ty Alpha', type: 'shell' },
      { id: '2', x: 400, y: 150, label: 'Công ty Beta', type: 'shell' },
      { id: '3', x: 400, y: 350, label: 'Đại lý trung gian', type: 'shell' },
      { id: '4', x: 550, y: 250, label: 'Ngân hàng TW', type: 'bank' }
    ],
    edges: [
      { u: '0', v: '1' },
      { u: '1', v: '2' },
      { u: '2', v: '3' },
      { u: '3', v: '1' },
      { u: '2', v: '4' }
    ],
    source: '0',
    target: '4'
  },

  level4: {
    id: 'level4',
    level: 4,
    name: 'Màn 4: Mạng lưới Offshore (Đa quốc gia)',
    description: 'Tiền chảy qua nhiều khu vực pháp lý khác nhau — Cayman, BVI, Singapore. Investigator phải phân tích hub nodes trung tâm trước khi phong tỏa.',
    difficulty: 'Rất Khó',
    maxTurns: 12,
    vertices: [
      { id: 'src',    x: 80,  y: 300, label: 'Nguồn gốc',    type: 'source'   },
      { id: 'p1',    x: 200, y: 150, label: 'TK Cá nhân 1', type: 'personal' },
      { id: 'p2',    x: 200, y: 450, label: 'TK Cá nhân 2', type: 'personal' },
      { id: 'cayman',x: 350, y: 100, label: 'Cayman Trust',  type: 'shell'    },
      { id: 'bvi',   x: 350, y: 300, label: 'BVI Holdings',  type: 'shell'    },
      { id: 'sg',    x: 350, y: 500, label: 'SG Broker',     type: 'mixer'    },
      { id: 'hub1',  x: 500, y: 200, label: 'Hub Trung gian A', type: 'shell' },
      { id: 'hub2',  x: 500, y: 400, label: 'Hub Trung gian B', type: 'shell' },
      { id: 'mx1',   x: 620, y: 150, label: 'Sàn giao dịch X', type: 'mixer' },
      { id: 'mx2',   x: 620, y: 450, label: 'Sàn giao dịch Y', type: 'mixer' },
      { id: 'bank',  x: 760, y: 300, label: 'Ngân hàng TW',  type: 'bank'    }
    ],
    edges: [
      { u: 'src',    v: 'p1'    },
      { u: 'src',    v: 'p2'    },
      { u: 'p1',    v: 'cayman' },
      { u: 'p1',    v: 'bvi'   },
      { u: 'p2',    v: 'bvi'   },
      { u: 'p2',    v: 'sg'    },
      { u: 'cayman', v: 'hub1'  },
      { u: 'bvi',   v: 'hub1'  },
      { u: 'bvi',   v: 'hub2'  },
      { u: 'sg',    v: 'hub2'  },
      { u: 'hub1',  v: 'mx1'   },
      { u: 'hub2',  v: 'mx2'   },
      { u: 'mx1',   v: 'bank'  },
      { u: 'mx2',   v: 'bank'  },
      // Cycles between hubs
      { u: 'hub1',  v: 'hub2'  },
      { u: 'hub2',  v: 'hub1'  }
    ],
    source: 'src',
    target: 'bank'
  },

  level5: {
    id: 'level5',
    level: 5,
    name: 'Màn 5: Crypto Mixer Syndicate',
    description: 'Mạng lưới phức tạp nhất — tiền được shuffle qua nhiều lớp mixer, tạo nhiều vòng khép kín. Investigator cần phối hợp cả Tarjan và Ring Detector.',
    difficulty: 'Ác mộng',
    maxTurns: 10,
    vertices: [
      { id: 's0',  x: 60,  y: 300, label: 'Nguồn gốc',     type: 'source'   },
      { id: 'p1',  x: 160, y: 150, label: 'TK ảo A1',      type: 'personal' },
      { id: 'p2',  x: 160, y: 300, label: 'TK ảo A2',      type: 'personal' },
      { id: 'p3',  x: 160, y: 450, label: 'TK ảo A3',      type: 'personal' },
      { id: 'mx1', x: 280, y: 100, label: 'Mixer #1',       type: 'mixer'    },
      { id: 'mx2', x: 280, y: 300, label: 'Mixer #2',       type: 'mixer'    },
      { id: 'mx3', x: 280, y: 500, label: 'Mixer #3',       type: 'mixer'    },
      { id: 'sh1', x: 400, y: 150, label: 'Shell Corp X',   type: 'shell'    },
      { id: 'sh2', x: 400, y: 300, label: 'Shell Corp Y',   type: 'shell'    },
      { id: 'sh3', x: 400, y: 450, label: 'Shell Corp Z',   type: 'shell'    },
      { id: 'hub', x: 520, y: 300, label: 'Central Hub',    type: 'shell'    },
      { id: 'mx4', x: 640, y: 150, label: 'Exit Mixer A',   type: 'mixer'    },
      { id: 'mx5', x: 640, y: 450, label: 'Exit Mixer B',   type: 'mixer'    },
      { id: 'bnk', x: 760, y: 300, label: 'Ngân hàng TW',  type: 'bank'     }
    ],
    edges: [
      // Source to smurfs
      { u: 's0',  v: 'p1'  }, { u: 's0',  v: 'p2'  }, { u: 's0',  v: 'p3'  },
      // Smurfs to mixers
      { u: 'p1',  v: 'mx1' }, { u: 'p2',  v: 'mx2' }, { u: 'p3',  v: 'mx3' },
      { u: 'p1',  v: 'mx2' }, { u: 'p3',  v: 'mx2' },
      // Mixers to shells
      { u: 'mx1', v: 'sh1' }, { u: 'mx2', v: 'sh2' }, { u: 'mx3', v: 'sh3' },
      { u: 'mx1', v: 'sh2' }, { u: 'mx3', v: 'sh1' },
      // Shells to hub
      { u: 'sh1', v: 'hub' }, { u: 'sh2', v: 'hub' }, { u: 'sh3', v: 'hub' },
      // Internal loops (SCC)
      { u: 'sh1', v: 'sh2' }, { u: 'sh2', v: 'sh3' }, { u: 'sh3', v: 'sh1' },
      // Hub to exits
      { u: 'hub', v: 'mx4' }, { u: 'hub', v: 'mx5' },
      // Exits to bank
      { u: 'mx4', v: 'bnk' }, { u: 'mx5', v: 'bnk' }
    ],
    source: 's0',
    target: 'bnk'
  }
}

export const getScenario = (id) => SCENARIOS[id] || SCENARIOS.level1

// ── Skill Definitions ─────────────────────────────────────────────────────

export const SYNDICATE_SKILLS = [
  {
    id: 'smurf',
    name: 'Chia nhỏ (Smurfing)',
    icon: 'Banknote',
    cost: 1,
    costType: 'ap',
    description: 'Phân tách tiền bẩn => {Tài khoản cá nhân}.',
    action: 'smurf'
  },
  {
    id: 'layer',
    name: 'Tạo lớp (Layering)',
    icon: 'Building2',
    cost: 1,
    costType: 'ap',
    description: 'Thiết lập chuỗi ẩn danh => {Công ty ma}.',
    action: 'layer'
  },
  {
    id: 'orient',
    name: 'Định chiều (Orientation)',
    icon: 'Shuffle',
    cost: 2,
    costType: 'ap',
    description: 'Kích hoạt luồng tiền => {Định hướng}.',
    action: 'orient'
  },
  {
    id: 'loop',
    name: 'Tạo vòng (Looping)',
    icon: 'RotateCcw',
    cost: 2,
    costType: 'ap',
    description: 'Khép kín dòng tiền => {Chu trình}.',
    action: 'loop'
  }
]

export const INVESTIGATOR_SKILLS = [
  {
    id: 'bridge',
    name: 'Dò Cầu (Bridge Hunter)',
    icon: 'Zap',
    cost: 20,
    costType: 'budget',
    description: 'Truy tìm điểm yếu => {Cầu nối}.',
    action: 'bridge'
  },
  {
    id: 'disorient',
    name: 'Giải định chiều',
    icon: 'Wind',
    cost: 15,
    costType: 'budget',
    description: 'Vô hiệu hóa luồng tiền => {Nhiễu loạn}.',
    action: 'disorient'
  },
  {
    id: 'tarjan',
    name: 'SCC Scanner (Tarjan)',
    icon: 'Radio',
    cost: 45,
    costType: 'budget',
    description: 'Quét vòng lặp tài chính => {Tarjan}.',
    action: 'tarjan'
  },
  {
    id: 'kosaraju',
    name: 'SCC Pro (Kosaraju)',
    icon: 'Cpu',
    cost: 70,
    costType: 'budget',
    description: 'Siêu máy tính quét vòng lặp => {Kosaraju}.',
    action: 'kosaraju'
  }
]
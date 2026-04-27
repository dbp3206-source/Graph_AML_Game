export const SCENARIOS = {
  level1: {
    id: 'level1',
    level: 1,
    name: 'Màn 1: Chiêu bài Công ty ma (Layering)',
    description: 'Sử dụng các pháp nhân Công ty ma để che giấu dòng tiền.',
    difficulty: 'Easy',
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
    difficulty: 'Medium',
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
    difficulty: 'Hard',
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
  }
}

export const getScenario = (id) => SCENARIOS[id] || SCENARIOS.level1

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
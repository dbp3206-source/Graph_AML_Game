import React, { useEffect } from 'react'
import { Shield, Zap, Target, Search, Network, FileText, User, Cpu, ChevronRight, Activity, Coins, Building2, MoveRight, RotateCcw, DollarSign, CheckCircle2, TrendingUp, Skull } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const SKILL_INFO = {
  smurf: {
    title: 'RẢI TIỀN',
    accent: '#22c55e',
    bullets: [
      'Tách dòng tiền lớn thành nhiều nhánh nhỏ để phân tán dấu vết.',
      'Mở rộng mạng lưới node cá nhân để tạo lớp ngụy trang giao dịch.',
      'Phù hợp khi cần đẩy nhanh lưu lượng trước khi bị phân tán.'
    ]
  },
  layer: {
    title: 'TẠO LỚP',
    accent: '#f59e0b',
    bullets: [
      'Bổ sung công ty ma để kéo dài đường đi của dòng tiền.',
      'Tăng độ phức tạp điều tra bằng các lớp trung gian.',
      'Hiệu quả nhất khi cần giãn cách nguồn tiền và đích đến.'
    ]
  },
  orient: {
    title: 'ĐỊNH HƯỚNG',
    accent: '#0ea5e9',
    bullets: [
      'Đặt hướng cho dòng tiền để đẩy nhanh về mục tiêu.',
      'Làm rõ đường dây ưu tiên trong mạng lưới hiện tại.',
      'Nên kết hợp sau khi đã rải tiền hoặc tạo lớp.'
    ]
  },
  loop: {
    title: 'TẠO VÒNG',
    accent: '#ff007f',
    bullets: [
      'Tạo chu trình giao dịch khép kín để đánh lạc hướng điều tra.',
      'Gia tăng độ nhiễu của mạng lưới và tạo lớp che phủ bổ sung.',
      'Phát huy tác dụng khi cần phân tán sự chú ý khỏi trục chính.'
    ]
  },
  death_defiance: {
    title: 'TỪ CHỐI TỬ THẦN',
    accent: '#a855f7',
    bullets: [
      'Khôi phục lại node đã bị khóa đủ điều kiện lượt.',
      'Mở lại một mắt xích quan trọng để tiếp tục luân chuyển.',
      'Chỉ có giá trị khi mạng lưới đã bị tổn thất thực sự.'
    ]
  },
  high_speed_wash: {
    title: 'RỬA SIÊU TỐC',
    accent: '#ef4444',
    bullets: [
      'Thu hồi tiền bẩn ngay lập tức mà không cần đợi kết thúc lượt.',
      'Gây áp lực cực lớn lên hệ thống Suspicion (+20%).',
      'Toàn bộ mạng lưới giao dịch hiện tại sẽ bị lộ diện vĩnh viễn.'
    ]
  },
  bribe_official: {
    title: 'HỐI LỘ QUAN CHỨC',
    accent: '#39ff14',
    bullets: [
      'Dùng ngân sách thâu tóm để "bôi trơn" hệ thống.',
      'Giảm trực tiếp 15% chỉ số Suspicion.',
      'Chi phí: $10,000 (Không tốn AP).'
    ]
  }
}

const NPCDialogue = ({ onSkillFocus }) => {
  const { 
    faction, 
    scenario, 
    ap, 
    budget, 
    nextTurn, 
    gameStatus, 
    isAnimating, 
    executeSkill,
    moneyLaundered,
    targetMoney,
    suspicion,
    animationSpeed,
    setAnimationSpeed,
    lastWashedAmount,
    showWashNotification,
    setShowWashNotification,
    loopPickingMode,
    deathDefianceSelectionMode,
    graphData
  } = useGameState()
  const isSyndicate = faction === 'syndicate'
  const eligibleReviveCount = (graphData?.vertices || []).filter(v => v.isFrozen && (v.lockedTurnCount || 0) >= 2).length
  
  useEffect(() => {
    if (showWashNotification) {
      // Play a "ting ting" success sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3')
        audio.volume = 0.4
        audio.play().catch(() => {}) // Ignore autoplay blocks
      } catch (e) {}

      const timer = setTimeout(() => {
        setShowWashNotification(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showWashNotification, setShowWashNotification])

  const skills = isSyndicate ? [
    { id: 'smurf', name: 'Chia nhỏ (Smurfing)', cost: 1, color: '#ff4d4d', icon: Coins, description: 'Phân tách tiền bẩn => {Tài khoản cá nhân}.' },
    { id: 'layer', name: 'Tạo lớp (Layering)', cost: 1, color: '#ff4d4d', icon: Building2, description: 'Thiết lập chuỗi ẩn danh => {Công ty ma}.' },
    { id: 'orient', name: 'Định hướng (Orientation)', cost: 2, color: '#ff4d4d', icon: MoveRight, description: 'Kích hoạt luồng tiền => {Định hướng}.' },
    { id: 'loop', name: 'Tạo vòng (Looping)', cost: 2, color: '#ff4d4d', icon: RotateCcw, description: 'Khép kín dòng tiền => {Chu trình}.' },
    { id: 'high_speed_wash', name: 'Rửa siêu tốc', cost: 2, color: '#ef4444', icon: Zap, description: 'Rửa tiền ngay lập tức => {Rủi ro cao}.' },
    { id: 'bribe_official', name: 'Hối lộ quan chức', cost: 0, budgetCost: 10000, color: '#39ff14', icon: Shield, description: 'Giảm Suspicion => {Bôi trơn}.' },
  ] : [
    { id: 'bridge', name: 'Dò Cầu (Bridge Hunter)', cost: 20, color: '#00ffff', label: '[DÒ CẦU]', description: 'Truy tìm điểm yếu => {Cầu nối}.' },
    { id: 'disorient', name: 'Giải định chiều', cost: 15, color: '#00ffff', label: '[GIẢI ĐỊNH CHIỀU]', description: 'Vô hiệu hóa luồng tiền => {Nhiễu loạn}.' },
    { id: 'tarjan', name: 'Quét vòng lặp (Tarjan)', cost: 45, color: '#00ffff', label: '[QUÉT SCC]', description: 'Quét vòng lặp tài chính => {Tarjan}.' },
    { id: 'kosaraju', name: 'Siêu máy tính (Kosaraju)', cost: 70, color: '#00ffff', label: '[SIÊU MÁY TÍNH]', description: 'Siêu máy tính quét vòng lặp => {Kosaraju}.' },
  ]

  const displaySkills = isSyndicate
    ? [
        { ...skills[0], budgetCost: 30 },
        { ...skills[1], budgetCost: 45 },
        skills[2],
        { ...skills[3], budgetCost: 60 },
        {
          id: 'death_defiance',
          name: 'Từ chối Tử Thần',
          cost: 2,
          budgetCost: eligibleReviveCount > 0 ? 35 : 0,
          color: '#d946ef',
          icon: Skull,
          description: 'Hồi sinh đỉnh bị khóa đủ 2 lượt.',
          requiresEligible: true
        }
      ]
    : skills

  const focusSkill = (skill) => {
    const info = SKILL_INFO[skill.id]
    if (!info || !onSkillFocus) return
    onSkillFocus({
      id: skill.id,
      title: info.title,
      accent: info.accent,
      bullets: info.bullets
    })
  }

  const syndicateContent = (
    <div className="flex flex-col h-full text-white/90">
      {/* MISSION DETAILS - COMPACT VERSION */}
      <div className="panel-hacker tactical-card p-4 mb-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-syn-pink" />
            <h3 className="text-xs font-black text-syn-pink uppercase tracking-widest">Nhiệm vụ</h3>
          </div>
          <p className="text-[10px] font-bold text-syn-pink/60 uppercase">Cell {scenario}</p>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed mt-2 italic border-l border-syn-pink/20 pl-3">
          Mở rộng mạng lưới. Xử lý dòng tiền.
        </p>
      </div>

      {/* CASE PROGRESS */}
      <div className="panel-hacker tactical-card p-5 mb-4 rounded-xl">
        <h3 className="text-sm font-black text-white mb-4 uppercase">Chỉ số mạng lưới</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-syn-pink/5 border border-syn-pink/10 p-2 rounded">
            <p className="text-[9px] text-syn-pink uppercase font-bold">Năng lượng (AP)</p>
            <p className="resource-number text-xl font-black">{ap || 0}/6</p>
          </div>
          <div className="bg-syn-pink/5 border border-syn-pink/10 p-2 rounded">
            <p className="text-[9px] text-syn-pink uppercase font-bold">Vốn khả dụng</p>
            <p className="resource-number text-xl font-black text-[#39ff14] drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">${(budget || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-syn-pink/10">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[8px] text-syn-pink/60 uppercase font-black">Số tiền đã rửa</p>
            <p className="resource-number text-sm font-black text-[#39ff14]">{Math.floor(((moneyLaundered || 0) / (targetMoney || 1)) * 100)}%</p>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-syn-pink h-full transition-all duration-500 shadow-[0_0_10px_rgba(255,77,77,0.5)]" 
              style={{ width: `${((moneyLaundered || 0) / (targetMoney || 1)) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-white/40 font-bold mt-1 text-center">${(moneyLaundered || 0).toLocaleString()} / ${(targetMoney || 1).toLocaleString()}</p>
        </div>
      </div>

      {/* SYNDICATE SKILLS - PREMIUM TALL VERSION */}
      <div className="flex-1 panel-hacker-premium tactical-card p-5 rounded-xl flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-white uppercase tracking-tighter">Kỹ năng mạng lưới</h3>
          <Zap className="w-4 h-4 text-syn-pink animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {displaySkills.map(s => (
            <button
              key={s.id}
              onClick={() => {
                focusSkill(s)
                executeSkill(s)
              }}
              disabled={gameStatus !== 'playing' || isAnimating || ap < s.cost || budget < (s.budgetCost || 0) || loopPickingMode || deathDefianceSelectionMode || (s.requiresEligible && eligibleReviveCount === 0)}
              className={`skill-button group w-full flex items-center justify-between p-3.5 rounded-xl border border-syn-pink/20 bg-syn-pink/5 hover:border-syn-pink/60 hover:bg-syn-pink/10 transition-all text-left ${(ap < s.cost || budget < (s.budgetCost || 0) || gameStatus !== 'playing' || isAnimating || loopPickingMode || deathDefianceSelectionMode || (s.requiresEligible && eligibleReviveCount === 0)) ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/5' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-syn-pink/10 rounded-lg group-hover:scale-110 transition-transform">
                  {s.icon && <s.icon className="w-4 h-4 text-syn-pink" />}
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight leading-none">{s.name}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                <div className="px-2 py-0.5 rounded bg-syn-pink/20 border border-syn-pink/40">
                  <p className="text-syn-pink font-black text-[11px] whitespace-nowrap">-{s.cost} AP</p>
                </div>
                {(s.budgetCost || 0) > 0 && (
                  <div className="px-2 py-0.5 rounded bg-[#39ff14]/10 border border-[#39ff14]/30">
                    <p className="text-[#39ff14] font-black text-[11px] whitespace-nowrap drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">
                      -${s.budgetCost}
                    </p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const investigatorContent = (
    <div className="flex flex-col h-full">
      {/* Agent Card */}
      <div className="panel-inv p-6 rounded-2xl mb-6 flex items-start gap-4 bg-[#0a1e24]/40">
        <div className="w-24 h-24 bg-inv-cyan/10 border-2 border-inv-cyan/40 rounded-xl relative overflow-hidden agent-scan flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Search className="w-10 h-10 text-inv-cyan animate-pulse" />
            <p className="text-[10px] font-black text-inv-cyan/60 mt-1 uppercase tracking-tighter">DETECTIVE</p>
          </div>
        </div>
        <div className="flex-1 pt-2">
          <h2 className="text-xl font-black text-white leading-none mb-1 text-inv-cyan shadow-[#00ffff]">Detective Conan</h2>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-[10px] text-red-400 font-bold mb-3">
            <Shield className="w-3 h-3 fill-red-400" /> TOP-CLASS
          </div>
          <p className="text-[10px] text-inv-cyan/60 uppercase font-black">Chiến dịch {scenario}:</p>
          <p className="text-sm font-black text-white uppercase italic tracking-tight">Vụ án Công ty ma</p>
          <div className="mt-3 bg-inv-cyan/10 border border-inv-cyan/20 p-2 rounded">
            <p className="text-[8px] text-inv-cyan uppercase font-bold">Investigation Budget</p>
            <p className="resource-number text-sm font-black text-[#39ff14]">${budget.toLocaleString()}</p>
          </div>
          <div className="mt-3">
             <p className="text-[9px] text-inv-cyan/60 uppercase font-black">Suspicion Level (Độ rủi ro)</p>
             <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-1 shadow-[0_0_5px_rgba(0,255,255,0.2)]">
                <div 
                  className="bg-inv-cyan h-full transition-all duration-500 shadow-[0_0_10px_#00ffff]" 
                  style={{ width: `${suspicion}%` }}
                />
             </div>
             <p className="text-sm font-black text-inv-cyan mt-1">{suspicion}%</p>
          </div>
        </div>
      </div>

      {/* SPEED CONTROL (Replaced Icon Row) */}
      <div className="flex flex-col gap-2 mb-6 p-4 border border-inv-cyan/20 bg-inv-cyan/5 rounded-xl">
        <div className="flex justify-between items-center mb-1">
          <p className="text-[10px] font-black text-inv-cyan/60 uppercase tracking-widest leading-none">Tốc độ duyệt đồ thị</p>
          <p className="text-xs font-bold text-inv-cyan tracking-tighter">{animationSpeed}ms</p>
        </div>
        <input 
          type="range" 
          min="500" 
          max="1000" 
          step="50"
          value={animationSpeed} 
          onChange={(e) => setAnimationSpeed(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-inv-cyan/20 rounded-lg appearance-none cursor-pointer accent-inv-cyan"
        />
        <div className="flex justify-between text-[8px] text-inv-cyan/40 font-bold uppercase mt-1">
          <span>Nhanh</span>
          <span>Chậm</span>
        </div>
      </div>

      {/* Skills List */}
      <div className="flex-1 min-h-0 flex flex-col pt-4 border-t border-inv-cyan/10">
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {skills.map(s => (
            <button
              key={s.id}
              onClick={() => executeSkill(s)}
              disabled={gameStatus !== 'playing' || isAnimating || budget < s.cost}
              className={`skill-button group w-full flex items-center justify-between p-4 rounded-xl border border-inv-cyan/20 bg-inv-cyan/5 hover:border-inv-cyan/60 hover:bg-inv-cyan/10 transition-all text-left ${(budget < s.cost || gameStatus !== 'playing' || isAnimating) ? 'disabled-skill' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-inv-cyan/10 rounded-lg group-hover:scale-110 transition-transform">
                  {s.id === 'bridge' && <Network className="w-4 h-4 text-inv-cyan" />}
                  {s.id === 'orient_detect' && <Cpu className="w-4 h-4 text-inv-cyan" />}
                  {s.id === 'tarjan' && <Search className="w-4 h-4 text-inv-cyan" />}
                  {s.id === 'kosaraju' && <Shield className="w-4 h-4 text-inv-cyan" />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-inv-cyan/60 tracking-tighter">{s.label}</p>
                  <p className="text-xs font-bold text-white uppercase">{s.name}</p>
                </div>
              </div>
              <p className="resource-number text-inv-cyan font-black text-sm">${s.cost}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full relative overflow-hidden">
      {isSyndicate ? syndicateContent : investigatorContent}
      
      {/* GLOBAL WASH NOTIFICATION POPUP */}
      {showWashNotification && (
        <div className="absolute inset-x-4 bottom-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div 
            className="bg-syn-pink p-4 rounded-xl shadow-[0_0_30px_rgba(255,77,77,0.6)] border border-white/20 flex items-center gap-4 cursor-pointer"
            onClick={() => setShowWashNotification(false)}
          >
            <div className="bg-white/20 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-white/60 uppercase">Dòng tiền đã xử lý</p>
              <p className="text-lg font-black text-white">+$ {(lastWashedAmount || 0).toLocaleString()}</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-white/50" />
          </div>
        </div>
      )}
    </div>
  )
}

export default NPCDialogue

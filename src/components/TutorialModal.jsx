import { X, BookOpen, Target, Zap, Shield } from 'lucide-react'
import { useState } from 'react'
import useGameState from '../hooks/useGameState'

function TutorialModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('rules')
  const { setShowTutorial } = useGameState()
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      setShowTutorial(false)
    }
    onClose()
  }

  const tabs = [
    { id: 'rules', label: 'Luật Cơ Bản', icon: BookOpen },
    { id: 'syndicate', label: 'Syndicate', icon: Zap },
    { id: 'investigator', label: 'Investigator', icon: Shield },
    { id: 'strategy', label: 'Chiến Thuật', icon: Target }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[900px] max-h-[80vh] bg-syn-dark/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Hướng Dẫn Chơi - AML Asymmetry</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="flex">
          <div className="w-48 p-4 border-r border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 ${
                  activeTab === tab.id
                    ? 'bg-syn-crimson/20 text-syn-pink border border-syn-crimson/50'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'rules' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-syn-pink mb-3">🎯 Mục Tiêu Game</h3>
                  <div className="space-y-2 text-white/80 text-sm">
                    <p><span className="text-syn-pink font-bold">Syndicate:</span> Rửa $500,000 trước khi bị Investigator phát hiện</p>
                    <p><span className="text-inv-cyan font-bold"> Investigator:</span> Tăng mức nghi ngờ đến 80% để bắt Syndicate</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-syn-pink mb-3">⚔️ Hệ Thống Turn-Based</h3>
                  <div className="space-y-2 text-white/80 text-sm">
                    <p>Game đánh theo lượt luân phiên giữa 2 phe:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><span className="text-syn-pink">Lượt Syndicate:</span> Dùng AP (Điểm Hành Động) để thực hiện các hành vi rửa tiền</li>
                      <li><span className="text-inv-cyan">Lượt Investigator:</span> Dùng Budget để điều tra và tăng nghi ngờ</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-syn-pink mb-3">💰 AP vs Budget</h3>
                  <div className="space-y-2 text-white/80 text-sm">
                    <p><span className="text-syn-pink font-bold">AP (Điểm Hành Động):</span> Mỗi lượt Syndicate có 5 AP. Dùng để:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Chia nhỏ (Smurfing) - 1 AP</li>
                      <li>Tạo lớp (Layering) - 2 AP</li>
                      <li>Tạo vòng (Looping) - 1 AP</li>
                    </ul>
                    <p className="mt-2"><span className="text-inv-cyan font-bold">Budget:</span> Mỗi lượt Investigator có $100. Dùng để:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Quét BFS (Ping) - $10</li>
                      <li>Quét DFS (Trace) - $15</li>
                      <li>Loop Scanner (Tarjan) - $30</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-syn-pink mb-3">🏆 Điều Kiện Thắng</h3>
                  <div className="space-y-2 text-white/80 text-sm">
                    <p><span className="text-syn-pink font-bold">Syndicate thắng:</span> Rửa đủ $500,000</p>
                    <p><span className="text-inv-cyan font-bold">Investigator thắng:</span> Mức nghi ngờ đạt 80%</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'syndicate' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-syn-pink mb-3">💰 Chiến Thuật Syndicate</h3>
                  <p className="text-white/70 text-sm mb-4">Vai trò của bạn: Điều hành đường dây rửa tiền</p>
                </div>

                <div className="p-4 bg-syn-crimson/10 border border-syn-crimson/30 rounded-xl">
                  <h4 className="font-bold text-syn-pink mb-2">🎭 Playbook: Chuỗi Bóng Ma</h4>
                  <p className="text-white/70 text-sm mb-2">Chiến thuật tạo chuỗi công ty ma để che dấu tiền</p>
                  <div className="text-white/60 text-xs space-y-1">
                    <p><span className="text-syn-pink">Bước 1:</span> Dùng Tạo lớp (Layering) - 2 AP để thêm 2 Công ty Ma</p>
                    <p><span className="text-syn-pink">Bước 2:</span> Dùng Tạo vòng (Looping) - 1 AP để tạo chu trình</p>
                    <p><span className="text-syn-pink">Bước 3:</span> Chuyển tiền qua lại giữa các công ty trong vòng</p>
                    <p className="text-white/50 mt-2">Mục đích: Tạo đường dây phức tạp khiến Investigator tốn nhiều Budget để truy vết</p>
                  </div>
                </div>

                <div className="p-4 bg-syn-crimson/10 border border-syn-crimson/30 rounded-xl">
                  <h4 className="font-bold text-syn-pink mb-2">🐺 Playbook: Bầy Đàn</h4>
                  <p className="text-white/70 text-sm mb-2">Chia nhỏ tiền thành nhiều tài khoản để gây nhiễu</p>
                  <div className="text-white/60 text-xs space-y-1">
                    <p><span className="text-syn-pink">Bước 1:</span> Dùng Chia nhỏ (Smurfing) - 1 AP để rải tiền ra 5 tài khoản</p>
                    <p><span className="text-syn-pink">Bước 2:</span> Lặp lại ở các lượt để tạo nhiều nhánh</p>
                    <p className="text-white/50 mt-2">Mục đích: Khiến Investigator phải tốn quá nhiều Budget để Ping tất cả các node</p>
                  </div>
                </div>

                <div className="p-4 bg-syn-purple/10 border border-syn-purple/30 rounded-xl">
                  <h4 className="font-bold text-syn-purple mb-2">💡 Mẹo</h4>
                  <ul className="text-white/60 text-xs space-y-1">
                    <li>• Luôn tạo ít nhất 1 vòng lặp để che dấu đường đi</li>
                    <li>• Đừng tập trung tiền vào 1 node quá lâu</li>
                    <li>• Theo dõi Budget của Investigator để biết khi nào chúng có thể dùng Tarjan</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'investigator' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-inv-cyan mb-3">🔍 Chiến Thuật Investigator</h3>
                  <p className="text-white/70 text-sm mb-4">Vai trò của bạn: Điều tra và ngăn chặn rửa tiền</p>
                </div>

                <div className="p-4 bg-inv-emerald/10 border border-inv-emerald/30 rounded-xl">
                  <h4 className="font-bold text-inv-cyan mb-2">🔭 Playbook: Lần Theo Dấu Vết</h4>
                  <p className="text-white/70 text-sm mb-2">Đợi Syndicate di chuyển tiền rồi truy vết ngược</p>
                  <div className="text-white/60 text-xs space-y-1">
                    <p><span className="text-inv-cyan">Bước 1:</span> Quan sát các nước đi của Syndicate</p>
                    <p><span className="text-inv-cyan">Bước 2:</span> Dùng Ping (BFS) - $10 vào một node khả nghi</p>
                    <p><span className="text-inv-cyan">Bước 3:</span> Lập tức dùng DFS để truy ngược đường đi</p>
                    <p><span className="text-inv-cyan">Bước 4:</span> Freeze (Đóng băng) điểm thắt nút trước khi tiền đến Bank</p>
                    <p className="text-white/50 mt-2">Mục đích: Phát hiện sớm và ngăn chặn kịp thời</p>
                  </div>
                </div>

                <div className="p-4 bg-inv-emerald/10 border border-inv-emerald/30 rounded-xl">
                  <h4 className="font-bold text-inv-cyan mb-2">🕸️ Playbook: Bủa Lưới</h4>
                  <p className="text-white/70 text-sm mb-2">Tiết kiệm budget rồi quét toàn bộ một lần</p>
                  <div className="text-white/60 text-xs space-y-1">
                    <p><span className="text-inv-cyan">Bước 1:</span> Tiết kiệm Budget ở lượt 1, không dùng gì cả</p>
                    <p><span className="text-inv-cyan">Bước 2:</span> Tích lũy đến $30+ ở lượt 2</p>
                    <p><span className="text-inv-cyan">Bước 3:</span> Kích hoạt Loop Scanner (Tarjan SCC)</p>
                    <p className="text-white/50 mt-2">Mục đích: Ngay lập tức lật tẩy toàn bộ đường dây rửa tiền, phát hiện cả các vòng lặp ẩn</p>
                  </div>
                </div>

                <div className="p-4 bg-inv-blue/10 border border-inv-blue/30 rounded-xl">
                  <h4 className="font-bold text-inv-blue mb-2">💡 Mẹo</h4>
                  <ul className="text-white/60 text-xs space-y-1">
                    <li>• Theo dõi AP của Syndicate - nếu chúng dùng Layering liên tục, có thể đang xây dựng mạng lưới</li>
                    <li>• Tarjan là vũ khí mạnh nhất nhưng tốn $30 - hãy đợi đến khi chắc chắn</li>
                    <li>• BFS tốn ít hơn DFS nhưng DFS đi sâu hơn - chọn wisely!</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">🎯 Tổng Hợp Chiến Thuật</h3>
                  <p className="text-white/70 text-sm">Các chiến thuật mẫu được đúc kết từ các ca chơi thực tế</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-syn-crimson/10 border border-syn-crimson/30 rounded-xl">
                    <h4 className="font-bold text-syn-pink mb-2">💰 Syn: Chuỗi Bóng Ma</h4>
                    <p className="text-white/60 text-xs">Layering → Layering → Looping tạo vòng khép</p>
                  </div>
                  <div className="p-4 bg-syn-crimson/10 border border-syn-crimson/30 rounded-xl">
                    <h4 className="font-bold text-syn-pink mb-2">🐺 Syn: Bầy Đàn</h4>
                    <p className="text-white/60 text-xs">Smurfing liên tục để rải tiền ra nhiều nhánh</p>
                  </div>
                  <div className="p-4 bg-inv-emerald/10 border border-inv-emerald/30 rounded-xl">
                    <h4 className="font-bold text-inv-cyan mb-2">🔭 Inv: Lần Theo Dấu Vết</h4>
                    <p className="text-white/60 text-xs">Đợi → BFS → DFS → Freeze</p>
                  </div>
                  <div className="p-4 bg-inv-emerald/10 border border-inv-emerald/30 rounded-xl">
                    <h4 className="font-bold text-inv-cyan mb-2">🕸️ Inv: Bủa Lưới</h4>
                    <p className="text-white/60 text-xs">Tiết kiệm → Tarjan (quét toàn bộ)</p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <h4 className="font-bold text-white mb-2">⚡ Nguyên Tắc Vàng</h4>
                  <ul className="text-white/60 text-xs space-y-2">
                    <li>1. <span className="text-syn-pink">Syndicate:</span> Luôn giữ ít nhất 1 AP dự phòng</li>
                    <li>2. <span className="text-syn-pink">Syndicate:</span> Tạo vòng lặp càng sớm càng tốt</li>
                    <li>3. <span className="text-inv-cyan">Investigator:</span> Đừng vội dùng Tarjan, hãy quan sát trước</li>
                    <li>4. <span className="text-inv-cyan">Investigator:</span> BFS cho tìm nhanh, DFS cho tìm sâu</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-transparent"
            />
            Không hiện lại
          </label>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-syn-crimson hover:bg-syn-crimson/80 text-white rounded-lg font-medium transition-colors"
          >
            Bắt Đầu Chơi
          </button>
        </div>
      </div>
    </div>
  )
}

export default TutorialModal
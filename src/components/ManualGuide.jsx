import { BookOpen, X, Hexagon, Zap, Shuffle, Radio } from 'lucide-react'

function ManualGuide({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0f1115] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-inv-cyan/20 border border-inv-cyan/50">
              <BookOpen className="w-8 h-8 text-inv-cyan" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Cẩm Nang Chiến Thuật</h2>
              <p className="text-white/40 text-sm">Hướng dẫn vận hành mạng lưới AML & Đồ thị</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold text-syn-pink mb-4 flex items-center gap-2">
                💰 PHE SYNDICATE: Kẻ Chủ Mưu
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Hexagon className="w-5 h-5 text-syn-pink" />
                    <span className="font-bold text-white">Xây dựng Mạng lưới (Build-up)</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    Sử dụng các kỹ năng <span className="text-syn-pink">Chia nhỏ (Smurfing)</span> và <span className="text-syn-pink">Tạo lớp (Layering)</span> để tạo các kết nối nét đứt. 
                    Lưu ý: Dòng tiền chỉ bắt đầu chảy khi bạn thực hiện bước Định chiều.
                  </p>
                  <div className="bg-white/5 px-3 py-2 rounded-lg text-[10px] text-white/40 font-mono">
                    Simulator Equiv: Add Node + Connect (Undirected)
                  </div>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-syn-pink/20 ring-1 ring-syn-pink/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Shuffle className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-white">Định Chiều Lịch Sử (Orientation)</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-2">
                    Nút thắt quyết định. Hệ thống dùng <span className="text-yellow-400 font-bold">Thuật toán Robbins</span> gán hướng cho toàn bộ cạnh.
                  </p>
                  <p className="text-xs text-white/40 italic">
                    Ghi nhớ: Nếu mạng lưới không có "Cạnh Cầu", bạn sẽ tạo được một khối liên thông mạnh (SCC) khổng lồ - tiền sẽ chảy vô tận mà không bị chặn đứng.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-inv-cyan mb-4 flex items-center gap-2">
                🛡️ PHE INVESTIGATOR: Lực Lượng Đặc Nhiệm
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-red-400" />
                    <span className="font-bold text-white">Săn Cạnh Cầu (Bridge Hunter)</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Dùng thuật toán <span className="text-red-400">DFS Low-link</span> để tìm các cạnh trọng yếu. 
                    Nếu Syndicate chưa định chiều, hãy cắt các cạnh này để phá tan âm mưu tạo SCC.
                  </p>
                  <div className="mt-2 text-[10px] text-white/40 font-mono">
                    Tip: Cạnh Cầu sẽ nhấp nháy ĐỎ khi bị phát hiện.
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Radio className="w-5 h-5 text-inv-cyan" />
                    <span className="font-bold text-white">Quét Vòng Xoáy (Tarjan SCC)</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Siêu máy tính tìm các cụm tài khoản luân chuyển nội bộ. 
                    Giá thành cực cao (60 Budget) nên hãy dùng cẩn trọng khi đã xác định được vùng nghi vấn.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-inv-cyan/10 p-6 rounded-3xl border border-inv-cyan/20">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">💡 Mẹo Cân Bằng</h4>
              <ul className="text-xs text-white/60 space-y-2 list-disc pl-4">
                <li>Investigator hãy dùng <span className="text-white">Giải định chiều</span> để phá vỡ cấu trúc dòng di chuyển của Syndicate.</li>
                <li>Syndicate nên tạo nhiều "SCC giả" bằng cách nối các node cá nhân thành vòng nhỏ để đánh lạc hướng Investigator khỏi dòng tiền chính.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManualGuide

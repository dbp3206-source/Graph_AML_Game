import React, { useMemo } from 'react'
import { ArrowRightLeft, BadgeInfo, Lock, ScanSearch } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const TYPE_LABELS = {
  personal: 'Tài khoản cá nhân',
  bank: 'Ngân hàng',
  shell: 'Công ty ma',
  source: 'Nguồn tiền',
  mixer: 'Trạm trung chuyển'
}

function normalizeText(text, vertices) {
  if (!text) return ''
  let formatted = text
  vertices.forEach((vertex) => {
    const label = `${TYPE_LABELS[vertex.type] || 'Đối tượng'} ${vertex.displayName || vertex.label || vertex.id}`
    formatted = formatted.replaceAll(vertex.id, label)
  })
  return formatted
}

const TracePanel = () => {
  const { newsItems, faction, graphData } = useGameState()
  const isSyndicate = faction === 'syndicate'
  const vertices = graphData?.vertices || []

  const logs = useMemo(
    () =>
      newsItems.map((entry) => ({
        ...entry,
        safeTitle: normalizeText(entry.title, vertices),
        safeMessage: normalizeText(entry.message, vertices)
      })),
    [newsItems, vertices]
  )

  return (
    <div className="trace-panel flex h-full flex-col text-white">
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className={`border px-2 py-1 ${isSyndicate ? 'border-red-500/40 bg-red-500/10' : 'border-cyan-400/40 bg-cyan-400/10'}`}>
            <ScanSearch className={`h-4 w-4 ${isSyndicate ? 'text-red-200' : 'text-cyan-200'}`} />
          </div>
          <div>
            <p className={`font-black uppercase tracking-[0.22em] text-lg ${isSyndicate ? 'text-red-200' : 'text-cyan-100'}`}>Theo dõi thao tác</p>
          </div>
        </div>
      </div>

      <div className="log-list flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {logs.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center">
            <BadgeInfo className="mb-3 h-8 w-8 text-white/30" />
            <p className="font-black uppercase tracking-[0.2em] text-white/45">Chưa có dữ liệu theo dõi</p>
          </div>
        )}

        {logs.map((log, index) => (
          <div key={log.id || index} className={`log-entry border px-3 py-2 mb-2 ${index === 0 ? 'border-[#39ff14]/30 bg-[#39ff14]/5' : 'border-white/5 bg-white/5'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-1 items-start gap-3 min-w-0">
                <div className="mt-1 flex-shrink-0">
                  {log.title?.toLowerCase().includes('phong toa') ? (
                    <Lock className="h-4 w-4 text-cyan-200" />
                  ) : (
                    <ArrowRightLeft className="h-4 w-4 text-[#39ff14]" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="log-title font-black uppercase tracking-[0.12em] text-white/90 text-sm">
                    {log.safeTitle || 'Cập nhật hệ thống'}
                  </p>
                  <p className="log-content mt-1 font-mono text-xs leading-relaxed text-white/65">
                    {log.safeMessage}
                  </p>
                </div>
              </div>
              <p className="time-badge mt-1 flex-shrink-0 font-mono text-[10px] text-white/35 tabular-nums">
                {log.time || '--:--:--'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TracePanel

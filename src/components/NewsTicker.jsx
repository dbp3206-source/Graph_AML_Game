import React, { useMemo } from 'react'
import { AlertTriangle, BadgeInfo, Radio, ShieldAlert, Terminal } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const TYPE_LABELS = {
  personal: 'Tài khoản cá nhân',
  bank: 'Ngân hàng',
  shell: 'Công ty ma',
  source: 'Nguồn tiền',
  mixer: 'Trạm trung chuyển'
}

function formatNodeText(text, vertices) {
  if (!text) return ''
  let formatted = text
  // Replace IDs inside brackets first to avoid partial matching issues
  vertices.forEach((vertex) => {
    const label = `${TYPE_LABELS[vertex.type] || 'Đối tượng'} ${vertex.displayName || vertex.label || vertex.id}`
    // Replace {id} with {label}
    formatted = formatted.split(`{${vertex.id}}`).join(`{${label}}`)
  })
  return formatted
}

const NewsTicker = () => {
  const { newsItems, faction, graphData } = useGameState()
  const isSyndicate = faction === 'syndicate'
  const vertices = graphData?.vertices || []

  const news = useMemo(
    () =>
      newsItems.map((item) => ({
        ...item,
        safeTitle: formatNodeText(item.title, vertices),
        safeMessage: formatNodeText(item.message, vertices),
        safeSummary: formatNodeText(item.summary, vertices)
      })),
    [newsItems, vertices]
  )

  return (
    <div className="news-ticker flex h-full flex-col text-white">
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className={`border px-2 py-1 ${isSyndicate ? 'border-red-500/40 bg-red-500/10' : 'border-cyan-400/40 bg-cyan-400/10'}`}>
            <Radio className={`h-4 w-4 ${isSyndicate ? 'text-red-200' : 'text-cyan-200'}`} />
          </div>
          <div>
            <p className={`font-black uppercase tracking-[0.22em] text-lg ${isSyndicate ? 'text-red-200' : 'text-cyan-100'}`}>Bảng tin hiện trường</p>
          </div>
        </div>
      </div>

      <div className="log-list flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {news.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center">
            <BadgeInfo className="mb-3 h-8 w-8 text-white/30" />
            <p className="font-black uppercase tracking-[0.2em] text-white/45">Đang chờ tín hiệu...</p>
          </div>
        )}

        {news.map((item, index) => (
          <div key={item.id || index} className={`log-entry border px-3 py-2 mb-2 ${index === 0 ? 'border-cyan-400/30 bg-cyan-400/5' : 'border-white/5 bg-white/5'}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 min-w-0">
                <div className="flex-shrink-0">
                  {item.type === 'alert' ? (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  ) : item.type === 'syndicate' ? (
                    <ShieldAlert className="h-4 w-4 text-red-300" />
                  ) : (
                    <Terminal className="h-4 w-4 text-cyan-300" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="log-title font-black uppercase tracking-[0.12em] text-white/90 text-sm truncate">
                    {item.safeTitle || 'Thông báo hệ thống'}
                  </p>
                  <p className="log-content font-mono text-xs leading-relaxed text-white/70 truncate">
                    {item.safeSummary || item.safeMessage}
                  </p>
                </div>
              </div>
              <p className={`time-badge flex-shrink-0 font-mono text-[10px] tabular-nums px-2 py-0.5 rounded transition-all ${index === 0 ? 'text-yellow-400 border border-yellow-400/50 bg-yellow-400/10' : 'text-white'}`}>
                {item.time || '--:--:--'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewsTicker

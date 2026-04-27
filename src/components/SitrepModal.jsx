import React, { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ChevronRight, DollarSign, Lock, Scissors, Shield } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const LINE_DELAY = 18

const SitrepModal = () => {
  const { showSitrep, sitrepData, closeSitrep } = useGameState()
  const [visible, setVisible] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)
  const [typedLines, setTypedLines] = useState([])

  const lines = useMemo(() => {
    if (!sitrepData) return []
    return [
      `[+] Cấp vốn chính phủ: +$25 -> Ngân sách hiện tại: $${sitrepData.budget.toLocaleString()}.`,
      `[!] Đối tượng đã phong tỏa: ${sitrepData.frozenCount} / ${sitrepData.totalNodes}.`,
      `[!] Chuỗi giao dịch bị bẻ gãy: ${sitrepData.removedEdges}.`,
      `NGUY CƠ TỘI PHẠM TẨU TÁN: ${sitrepData.escapeRisk}%.`
    ]
  }, [sitrepData])

  useEffect(() => {
    if (!showSitrep) {
      setVisible(false)
      setTypedLines([])
      setLineIndex(0)
      return
    }

    setVisible(true)
    setTypedLines([])
    setLineIndex(0)

    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContextCtor()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 920
      gain.gain.value = 0.03
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.06)
      setTimeout(() => ctx.close(), 120)
    } catch (error) {}
  }, [showSitrep])

  useEffect(() => {
    if (!showSitrep || lines.length === 0 || lineIndex >= lines.length) return

    const fullLine = lines[lineIndex]
    let charIndex = 0
    setTypedLines((prev) => {
      const next = [...prev]
      next[lineIndex] = ''
      return next
    })

    const timer = setInterval(() => {
      charIndex += 1
      setTypedLines((prev) => {
        const next = [...prev]
        next[lineIndex] = fullLine.slice(0, charIndex)
        return next
      })
      if (charIndex >= fullLine.length) {
        clearInterval(timer)
        setTimeout(() => setLineIndex((current) => current + 1), 180)
      }
    }, LINE_DELAY)

    return () => clearInterval(timer)
  }, [showSitrep, lines, lineIndex])

  if (!showSitrep || !sitrepData) return null

  const riskClass =
    sitrepData.escapeRisk < 50
      ? 'text-cyan-300'
      : sitrepData.escapeRisk <= 75
      ? 'text-yellow-300 animate-pulse'
      : 'text-red-400 animate-pulse'

  return (
    <div className={`modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(2,10,18,0.86)] backdrop-blur-[5px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="sitrep-modal sitrep-frame relative w-full max-w-3xl overflow-hidden border border-cyan-300/45 bg-[#04131d]/95 shadow-[0_0_60px_rgba(34,211,238,0.16)]">
        <span className="corner-bracket corner-tl" />
        <span className="corner-bracket corner-tr" />
        <span className="corner-bracket corner-bl" />
        <span className="corner-bracket corner-br" />
        <div className="crt-scanlines pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-pulse" />

        <div className="relative px-8 pt-8 pb-6">
          <p className="font-black uppercase tracking-[0.24em] text-cyan-300">ĐANG KHỞI ĐỘNG HỆ THỐNG ĐIỀU TRA...</p>
          <h2 className="mt-3 text-3xl font-black uppercase text-white">&gt;&gt; BÁO CÁO TÌNH HÌNH MẠNG LƯỚI &lt;&lt;</h2>
          <div className="mt-4 h-px w-full border-t border-dashed border-cyan-300/45 animate-pulse" />

          <div className="mt-7 grid gap-4">
            <div className="sitrep-card border border-cyan-300/18 bg-cyan-300/6 px-4 py-3">
              <p className="mb-2 flex items-center gap-2 font-black uppercase tracking-[0.16em] text-cyan-200">
                <DollarSign className="h-4 w-4" />
                Dữ liệu điều tra
              </p>
              <div className="space-y-2 font-mono text-sm leading-relaxed text-white/86">
                {lines.slice(0, 3).map((line, index) => (
                  <p key={index}>
                    {typedLines[index] || ''}
                    {lineIndex === index && <span className="animate-pulse text-cyan-200">█</span>}
                  </p>
                ))}
              </div>
            </div>

            <div className="sitrep-card border border-cyan-300/18 bg-cyan-300/6 px-4 py-3">
              <p className="mb-2 flex items-center gap-2 font-black uppercase tracking-[0.16em] text-cyan-200">
                <AlertTriangle className="h-4 w-4" />
                Đánh giá mức độ rủi ro
              </p>
              <p className="font-mono text-sm leading-relaxed text-white/86">
                {typedLines[3] || ''}
                {lineIndex === 3 && <span className="animate-pulse text-cyan-200">█</span>}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-dashed border-cyan-300/20 pt-3">
                <div className="font-mono text-sm text-white/70">
                  Chưa bị khóa: {sitrepData.totalNodes - sitrepData.frozenCount} / {sitrepData.totalNodes}
                </div>
                <div className={`text-2xl font-black ${riskClass}`}>{sitrepData.escapeRisk}%</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="sitrep-card border border-cyan-300/18 bg-black/24 px-4 py-3">
                <p className="flex items-center gap-2 font-black uppercase tracking-[0.16em] text-white/75">
                  <DollarSign className="h-4 w-4 text-[#39ff14]" />
                  Ngân sách
                </p>
                <p className="mt-2 text-2xl font-black text-[#39ff14]">${sitrepData.budget.toLocaleString()}</p>
              </div>
              <div className="sitrep-card border border-cyan-300/18 bg-black/24 px-4 py-3">
                <p className="flex items-center gap-2 font-black uppercase tracking-[0.16em] text-white/75">
                  <Lock className="h-4 w-4 text-cyan-300" />
                  Đã phong tỏa
                </p>
                <p className="mt-2 text-2xl font-black text-white">{sitrepData.frozenCount}</p>
              </div>
              <div className="sitrep-card border border-cyan-300/18 bg-black/24 px-4 py-3">
                <p className="flex items-center gap-2 font-black uppercase tracking-[0.16em] text-white/75">
                  <Scissors className="h-4 w-4 text-red-400" />
                  Chuỗi gãy
                </p>
                <p className="mt-2 text-2xl font-black text-white">{sitrepData.removedEdges}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={closeSitrep}
              className="sitrep-confirm flex items-center justify-center gap-3 border border-cyan-300/55 bg-cyan-300/10 px-8 py-4 font-black uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-300 hover:text-[#031018]"
            >
              <Shield className="h-4 w-4" />
              XÁC NHẬN & BẮT ĐẦU ĐIỀU TRA
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SitrepModal

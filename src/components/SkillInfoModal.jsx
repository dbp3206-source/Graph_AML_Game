import React from 'react'
import { X, Info, ShieldCheck, Zap, Crosshair } from 'lucide-react'

function SkillInfoModal({ isOpen, selectedSkill, onClose }) {
  if (!isOpen) return null

  const accent = selectedSkill?.accent || '#00ffff'
  const accentSoft = `${accent}22`
  const accentStrong = `${accent}44`

  return (
    <div className="skill-info-modal-backdrop fixed inset-0 z-[10030] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-[12px]" onClick={onClose} />

      <div
        className="skill-info-modal relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border bg-[#050912]/98 p-0"
        style={{
          borderColor: `${accent}66`,
          boxShadow: `0 0 40px ${accentSoft}, inset 0 0 30px ${accentSoft}`
        }}
      >
        {/* Header Glow */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-white/5 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="p-3 rounded-xl border" style={{ borderColor: accentStrong, background: accentSoft }}>
              <Zap className="h-6 w-6" style={{ color: accent }} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>
                HỒ SƠ KỸ NĂNG & CHIẾN THUẬT
              </p>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight drop-shadow-md">
                {selectedSkill?.title || 'DỮ LIỆU GIẢI MẬT'}
              </h2>
            </div>
          </div>

          {!selectedSkill ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center">
              <Info className="mx-auto mb-3 h-8 w-8 text-white/20" />
              <p className="text-sm font-medium text-white/40">Vui lòng chọn một kỹ năng để xem phân tích chi tiết.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <ShieldCheck className="w-24 h-24" style={{ color: accent }} />
                </div>
                <h3 className="text-[11px] font-black uppercase text-white/30 tracking-widest mb-4 flex items-center gap-2">
                  <Crosshair className="w-3 h-3" /> PHÂN TÍCH ĐIỀU HÀNH
                </h3>
                <ul className="space-y-4">
                  {selectedSkill.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                      <p className="text-sm leading-relaxed text-white/85 font-medium">
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 px-1">
                <div className="h-[1px] flex-1 bg-white/10" />
                <p className="text-[10px] font-mono text-white/20 uppercase">End of Encrypted File</p>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="group relative px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all overflow-hidden"
              style={{
                border: `1px solid ${accent}44`,
                color: accent,
                background: `${accent}11`
              }}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">XÁC NHẬN & ĐÓNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillInfoModal

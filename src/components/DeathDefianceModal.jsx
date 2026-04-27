import React, { useMemo, useState } from 'react'
import { Skull, X, Zap, DollarSign, LockKeyhole, ChevronRight } from 'lucide-react'
import useGameState from '../hooks/useGameState'

const getReviveCost = (count) => count * 35 + Math.max(0, count - 1) * 15

const DeathDefianceModal = () => {
  const {
    showDeathDefianceModal,
    closeDeathDefianceModal,
    startDeathDefianceSelection,
    graphData,
    budget,
    ap
  } = useGameState()
  const [count, setCount] = useState(1)

  const eligibleNodes = useMemo(
    () => (graphData?.vertices || []).filter(v => v.isFrozen && (v.lockedTurnCount || 0) >= 2),
    [graphData]
  )

  if (!showDeathDefianceModal) return null

  const maxCount = Math.max(1, eligibleNodes.length)
  const safeCount = Math.max(1, Math.min(count, maxCount))
  const totalCost = getReviveCost(safeCount)
  const apCost = 2
  const canExecute = eligibleNodes.length > 0 && budget >= totalCost && ap >= apCost

  const setSafeCount = (value) => {
    const next = Math.max(1, Math.min(maxCount, Number.parseInt(value, 10) || 1))
    setCount(next)
  }

  return (
    <div className="fixed inset-0 z-[10004] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.08)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="relative w-full max-w-md overflow-hidden border-2 border-fuchsia-400/70 bg-[#120014] p-7 shadow-[0_0_70px_rgba(217,70,239,0.35)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />
        <button
          onClick={closeDeathDefianceModal}
          className="absolute right-4 top-4 rounded-lg p-2 text-white/45 transition hover:bg-white/10 hover:text-white"
          title="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-xl border border-fuchsia-400/40 bg-fuchsia-400/10 p-3 shadow-[0_0_24px_rgba(217,70,239,0.25)]">
            <Skull className="h-8 w-8 text-fuchsia-300" />
          </div>
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-fuchsia-300/70">Syndicate Recovery</p>
            <h2 className="text-2xl font-black uppercase italic text-white">Từ chối tử thần</h2>
          </div>
        </div>

        <div className="mb-5 rounded-lg border border-fuchsia-400/20 bg-fuchsia-400/5 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-black uppercase text-fuchsia-200">
              <LockKeyhole className="h-4 w-4" />
              Đủ điều kiện hồi sinh
            </span>
            <span className="font-mono text-3xl font-black text-[#39ff14] drop-shadow-[0_0_14px_rgba(57,255,20,0.65)]">
              {eligibleNodes.length}
            </span>
          </div>
          <p className="mt-2 font-mono text-xs leading-relaxed text-white/60">
            Chỉ các đỉnh đã bị khóa tối thiểu 2 lượt mới có thể được chọn trên đồ thị.
          </p>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-fuchsia-300/80">
            Số đỉnh muốn hồi sinh
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSafeCount(safeCount - 1)}
              className="h-11 w-11 border border-fuchsia-400/40 bg-fuchsia-400/10 text-xl font-black text-fuchsia-200"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={maxCount}
              value={safeCount}
              onChange={(event) => setSafeCount(event.target.value)}
              className="h-11 flex-1 border-2 border-fuchsia-400/50 bg-black/40 text-center font-mono text-2xl font-black text-fuchsia-200 outline-none"
            />
            <button
              onClick={() => setSafeCount(safeCount + 1)}
              className="h-11 w-11 border border-fuchsia-400/40 bg-fuchsia-400/10 text-xl font-black text-fuchsia-200"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="border border-fuchsia-400/20 bg-black/30 p-3">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-fuchsia-300/70">
              <DollarSign className="h-4 w-4" />
              Tổng giá
            </p>
            <p className={`font-mono text-2xl font-black ${budget >= totalCost ? 'text-[#39ff14]' : 'text-red-400'}`}>
              ${totalCost}
            </p>
          </div>
          <div className="border border-fuchsia-400/20 bg-black/30 p-3">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-fuchsia-300/70">
              <Zap className="h-4 w-4" />
              AP
            </p>
            <p className={`font-mono text-2xl font-black ${ap >= apCost ? 'text-white' : 'text-red-400'}`}>
              -{apCost}
            </p>
          </div>
        </div>

        <button
          onClick={() => canExecute && startDeathDefianceSelection(safeCount)}
          disabled={!canExecute}
          className="group flex w-full items-center justify-center gap-3 border-2 border-fuchsia-400 bg-fuchsia-400/15 px-5 py-4 text-sm font-black uppercase tracking-widest text-fuchsia-200 transition hover:bg-fuchsia-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Chọn đỉnh hồi sinh
          <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

export default DeathDefianceModal

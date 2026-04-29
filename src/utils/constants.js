/**
 * Shared constants for AML Asymmetry.
 * Single source of truth — import from here, not re-define in components.
 */

export const EMOJI_MAPS = {
  source: '💰',
  personal: '👦',
  shell: '👻',
  mixer: '🎭',
  bank: '🏦',
  target: '🏦',
}

export const NODE_TYPE_LABELS = {
  shell: 'Công ty ma',
  personal: 'TK Cá nhân',
  bank: 'Ngân hàng',
  source: 'Nguồn tiền',
  mixer: 'Sàn chui',
}

/** Maximum number of turns before Investigator wins by default */
export const MAX_TURNS = 15

/** Investigator win threshold (suspicionProgress %) */
export const INV_WIN_THRESHOLD = 100

/** Syndicate win amount ($) */
export const SYN_WIN_AMOUNT = 150000

/** Syndicate starting budget */
export const SYN_START_BUDGET = 100

/** Cost per node construction */
export const NODE_CONSTRUCTION_COST = 15

/** Loop creation cost */
export const LOOP_CREATION_COST = 60

/** Starting AP for both factions */
export const STARTING_AP = 6

/** Grace period: turns before bankruptcy check kicks in */
export const GRACE_PERIOD_TURNS = 6

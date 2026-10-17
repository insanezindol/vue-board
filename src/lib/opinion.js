// 한국 시장 관례: 매수 = 빨강, 매도 = 파랑
export const OPINIONS = {
  buy: { label: '매수', icon: '▲', text: 'text-up', badge: 'border-up/50 bg-up/15 text-up', color: 'var(--color-up)' },
  sell: { label: '매도', icon: '▼', text: 'text-down', badge: 'border-down/50 bg-down/15 text-down', color: 'var(--color-down)' },
  hold: { label: '관망', icon: '■', text: 'text-hold', badge: 'border-hold/50 bg-hold/15 text-hold', color: 'var(--color-hold)' }
}

export function opinionOf(key) {
  return OPINIONS[key] || OPINIONS.hold
}

import { reactive } from 'vue'

// 화면 연출용 가상 시세 (실제 시세 아님)
const seeds = [
  { name: '삼성전자', code: '005930', price: 71200, currency: 'KRW' },
  { name: 'SK하이닉스', code: '000660', price: 198500, currency: 'KRW' },
  { name: 'LG에너지솔루션', code: '373220', price: 384000, currency: 'KRW' },
  { name: '현대차', code: '005380', price: 241500, currency: 'KRW' },
  { name: 'NAVER', code: '035420', price: 187300, currency: 'KRW' },
  { name: '카카오', code: '035720', price: 41850, currency: 'KRW' },
  { name: '셀트리온', code: '068270', price: 176900, currency: 'KRW' },
  { name: 'NVIDIA', code: 'NVDA', price: 132.45, currency: 'USD' },
  { name: 'Tesla', code: 'TSLA', price: 248.12, currency: 'USD' },
  { name: 'Apple', code: 'AAPL', price: 227.63, currency: 'USD' },
  { name: 'Microsoft', code: 'MSFT', price: 418.9, currency: 'USD' }
]

const HISTORY = 48

function step(price, currency) {
  const next = price * (1 + (Math.random() - 0.49) * 0.012)
  return currency === 'KRW' ? Math.max(50, Math.round(next / 50) * 50) : Math.round(next * 100) / 100
}

export const stocks = reactive(seeds.map(s => {
  const history = [s.price]
  for (let i = 1; i < HISTORY; i++) history.unshift(step(history[0], s.currency))
  return { ...s, open: history[0], prev: s.price, tick: 0, history }
}))

export function findStock(name) {
  if (!name) return undefined
  const key = String(name).trim().toLowerCase()
  return stocks.find(s => s.name.toLowerCase() === key || s.code.toLowerCase() === key)
}

export function changeRate(stock) {
  return ((stock.price - stock.open) / stock.open) * 100
}

export function formatPrice(stock) {
  return stock.currency === 'KRW'
    ? stock.price.toLocaleString('ko-KR')
    : '$' + stock.price.toFixed(2)
}

export function formatRate(rate) {
  return (rate > 0 ? '+' : '') + rate.toFixed(2) + '%'
}

// 등락률 색상 (상승 빨강 / 하락 파랑)
export function rateClass(stock) {
  const r = changeRate(stock)
  return r > 0 ? 'text-up' : r < 0 ? 'text-down' : 'text-slate-400'
}

// 시세가 바뀔 때마다(tick 키 변경 시) 가격 배경이 번쩍이도록
export function flashClass(stock) {
  return stock.tick ? (stock.price >= stock.prev ? 'animate-flash-up' : 'animate-flash-down') : ''
}

let timer = null
let users = 0

// 여러 컴포넌트가 구독해도 타이머는 하나만 동작, 반환된 함수로 구독 해제
export function startMarket() {
  users++
  if (!timer) {
    timer = setInterval(() => {
      // 매 틱마다 일부 종목만 움직여서 자연스럽게
      for (const s of stocks) {
        if (Math.random() < 0.45) continue
        s.prev = s.price
        s.price = step(s.price, s.currency)
        s.history.push(s.price)
        if (s.history.length > HISTORY) s.history.shift()
        s.tick++
      }
    }, 1400)
  }
  return () => {
    users--
    if (users === 0) {
      clearInterval(timer)
      timer = null
    }
  }
}

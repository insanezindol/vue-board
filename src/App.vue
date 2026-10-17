<template>
  <div id="app" class="relative flex min-h-screen flex-col" @pointermove="onPointerMove">
    <MarketBackground />

    <header class="sticky top-0 z-30 border-b border-white/10 bg-ink-950/70 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <router-link to="/" class="group flex items-center gap-3">
          <span class="relative grid size-10 place-items-center rounded-xl bg-linear-to-br from-neon to-down text-ink-950 shadow-[0_0_24px_-2px_var(--color-neon)] transition group-hover:rotate-6 group-hover:scale-110">
            <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" />
            </svg>
          </span>
          <span class="leading-tight">
            <span class="block font-mono text-lg font-black tracking-[.2em] neon-text text-neon">STOCK TALK</span>
            <span class="block text-[11px] tracking-widest text-slate-400">종목 토론방</span>
          </span>
        </router-link>

        <div class="flex items-center gap-4">
          <div class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-300 sm:flex">
            <span class="size-2 rounded-full bg-up text-up animate-pulse-dot"></span>
            <span class="font-bold text-up">LIVE</span>
            <span class="tabular-nums">{{ clock }}</span>
          </div>
          <router-link to="/create" class="btn-primary !px-4 !py-2">✎ 글쓰기</router-link>
        </div>
      </div>
      <TickerTape />
    </header>

    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>

    <footer class="border-t border-white/10 bg-ink-950/70 py-5 text-center text-xs text-slate-500 backdrop-blur">
      본 화면의 시세·차트는 연출용 <b class="text-slate-400">가상 데이터</b>이며 실제 시세와 무관합니다. 투자 판단과 책임은 투자자 본인에게 있습니다.
    </footer>
  </div>
</template>

<script>
import MarketBackground from '@/components/MarketBackground.vue'
import TickerTape from '@/components/TickerTape.vue'
import { startMarket } from '@/data/market'

export default {
  name: 'App',
  components: { MarketBackground, TickerTape },
  data() {
    return { clock: '' }
  },
  mounted() {
    this.stopMarket = startMarket()
    const tick = () => {
      this.clock = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    }
    tick()
    this.clockTimer = setInterval(tick, 1000)
  },
  beforeUnmount() {
    this.stopMarket()
    clearInterval(this.clockTimer)
  },
  methods: {
    // 유리 패널 하이라이트가 마우스를 따라오도록 좌표 전달
    onPointerMove(e) {
      const root = document.documentElement.style
      root.setProperty('--mx', e.clientX + 'px')
      root.setProperty('--my', e.clientY + 'px')
    }
  }
}
</script>

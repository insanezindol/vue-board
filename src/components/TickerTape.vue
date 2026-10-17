<template>
    <div class="group relative overflow-hidden border-y border-white/10 bg-ink-950/80 backdrop-blur [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div class="flex w-max animate-ticker group-hover:[animation-play-state:paused]">
            <div v-for="copy in 2" :key="copy" class="flex shrink-0" :aria-hidden="copy === 2">
                <div v-for="s in stocks" :key="s.code" class="flex items-center gap-2 border-r border-white/5 px-5 py-2 font-mono text-xs">
                    <span class="font-sans font-semibold text-slate-300">{{ s.name }}</span>
                    <span
                        :key="s.tick"
                        class="rounded px-1 tabular-nums text-slate-100"
                        :class="flashClass(s)"
                    >{{ formatPrice(s) }}</span>
                    <span class="tabular-nums" :class="rateClass(s)">
                        {{ changeRate(s) > 0 ? '▲' : changeRate(s) < 0 ? '▼' : '-' }} {{ formatRate(changeRate(s)) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { stocks, changeRate, formatPrice, formatRate, rateClass, flashClass } from '@/data/market'

export default {
    name: 'TickerTape',
    data() {
        return { stocks }
    },
    methods: { changeRate, formatPrice, formatRate, rateClass, flashClass }
}
</script>

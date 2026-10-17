<template>
    <div class="space-y-8">
        <!-- 히어로 -->
        <section class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="animate-rise">
                <p class="mb-2 font-mono text-xs tracking-[.3em] text-neon">// MARKET DISCUSSION</p>
                <h1 class="text-4xl font-black tracking-tight sm:text-5xl">
                    <span class="shine-text">종목 토론방</span>
                </h1>
                <p class="mt-3 text-slate-400">개미들의 실시간 매매 의견을 확인하고 당신의 시나리오를 공유하세요.</p>
            </div>
            <button class="btn-primary self-start px-7 py-3 text-base lg:self-auto" @click="write">✎ 글쓰기</button>
        </section>

        <!-- 요약 지표 -->
        <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="glass p-5 animate-rise [animation-delay:.05s]">
                <p class="text-xs tracking-wider text-slate-400">전체 토론</p>
                <p class="mt-2 font-mono text-3xl font-black text-slate-100 tabular-nums">{{ data.length }}<span class="ml-1 text-base text-slate-500">건</span></p>
            </div>
            <div class="glass p-5 sm:col-span-2 animate-rise [animation-delay:.1s]">
                <div class="flex items-center justify-between text-xs tracking-wider text-slate-400">
                    <span>투자 심리</span>
                    <span class="font-mono font-bold" :class="sentiment.label.cls">{{ sentiment.label.text }}</span>
                </div>
                <div class="mt-3 flex h-3 overflow-hidden rounded-full bg-white/5">
                    <div class="bg-up shadow-[0_0_16px_var(--color-up)] transition-all duration-700" :style="{ width: sentiment.buy + '%' }"></div>
                    <div class="bg-hold/80 transition-all duration-700" :style="{ width: sentiment.hold + '%' }"></div>
                    <div class="bg-down shadow-[0_0_16px_var(--color-down)] transition-all duration-700" :style="{ width: sentiment.sell + '%' }"></div>
                </div>
                <div class="mt-2 flex justify-between font-mono text-xs tabular-nums">
                    <span class="text-up">매수 {{ sentiment.buy }}%</span>
                    <span class="text-hold">관망 {{ sentiment.hold }}%</span>
                    <span class="text-down">매도 {{ sentiment.sell }}%</span>
                </div>
            </div>
            <div class="glass p-5 animate-rise [animation-delay:.15s]">
                <p class="text-xs tracking-wider text-slate-400">가장 핫한 종목 🔥</p>
                <p class="mt-2 truncate text-2xl font-black text-slate-100">{{ hottest || '-' }}</p>
            </div>
        </section>

        <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
            <!-- 게시글 목록 -->
            <section class="glass glow-border overflow-hidden animate-rise [animation-delay:.2s]">
                <div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <h2 class="font-bold tracking-wide">실시간 토론</h2>
                    <span class="font-mono text-xs text-slate-500">{{ data.length }} POSTS</span>
                </div>
                <table class="w-full table-fixed text-left text-sm">
                    <thead class="text-xs tracking-wider text-slate-500">
                        <tr class="border-b border-white/5">
                            <th class="w-24 px-5 py-3 font-medium sm:w-28">의견</th>
                            <th class="hidden w-36 px-3 py-3 font-medium sm:table-cell">종목</th>
                            <th class="px-3 py-3 font-medium">제목</th>
                            <th class="hidden w-28 px-5 py-3 text-right font-medium md:table-cell">글쓴이</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(value, index) in data" :key="index" @click="detail(index)"
                            class="group cursor-pointer border-b border-white/5 transition duration-300 animate-rise hover:bg-white/[.04]"
                            :style="{ animationDelay: 0.25 + index * 0.06 + 's', '--op': opinionOf(value.opinion).color }"
                        >
                            <td class="relative px-5 py-4">
                                <span class="absolute inset-y-2 left-0 w-0.5 rounded-full bg-(--op) opacity-0 shadow-[0_0_12px_var(--op)] transition group-hover:opacity-100"></span>
                                <span class="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-bold whitespace-nowrap" :class="opinionOf(value.opinion).badge">
                                    {{ opinionOf(value.opinion).icon }} {{ opinionOf(value.opinion).label }}
                                </span>
                            </td>
                            <td class="hidden px-3 py-4 sm:table-cell">
                                <div class="truncate font-semibold text-slate-100">{{ value.stock }}</div>
                                <div v-if="findStock(value.stock)" class="font-mono text-xs tabular-nums" :class="rateClass(findStock(value.stock))">
                                    {{ formatRate(changeRate(findStock(value.stock))) }}
                                </div>
                            </td>
                            <td class="px-3 py-4">
                                <div class="truncate font-semibold text-slate-100 transition group-hover:text-neon">{{ value.title }}</div>
                                <div class="truncate text-xs text-slate-500">
                                    <span class="font-semibold text-slate-300 sm:hidden">{{ value.stock }} · </span>{{ value.content }}
                                </div>
                            </td>
                            <td class="hidden truncate px-5 py-4 text-right text-slate-400 md:table-cell">{{ value.writer }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="!data.length" class="px-5 py-16 text-center text-slate-500">
                    아직 토론이 없습니다. 첫 번째 의견을 남겨보세요!
                </div>
            </section>

            <!-- 관심 종목 시세 -->
            <aside class="glass h-fit overflow-hidden animate-rise [animation-delay:.3s]">
                <div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <h2 class="font-bold tracking-wide">관심 종목</h2>
                    <span class="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">가상 시세</span>
                </div>
                <ul>
                    <li v-for="s in watchlist" :key="s.code" class="flex items-center gap-3 border-b border-white/5 px-5 py-3 transition hover:bg-white/[.04]">
                        <div class="min-w-0 flex-1">
                            <div class="truncate text-sm font-semibold">{{ s.name }}</div>
                            <div class="font-mono text-[11px] text-slate-500">{{ s.code }}</div>
                        </div>
                        <Sparkline :points="s.history" :color="rateColor(s)" :width="64" :height="28" :dot="false" class="h-7 w-16" />
                        <div class="w-24 text-right font-mono tabular-nums">
                            <div :key="s.tick" class="rounded px-1 text-sm text-slate-100" :class="flashClass(s)">{{ formatPrice(s) }}</div>
                            <div class="text-[11px]" :class="rateClass(s)">{{ formatRate(changeRate(s)) }}</div>
                        </div>
                    </li>
                </ul>
            </aside>
        </div>
    </div>
</template>
<script>
import data from '@/data'
import Sparkline from '@/components/Sparkline.vue'
import { stocks, findStock, changeRate, formatPrice, formatRate, rateClass, flashClass } from '@/data/market'
import { opinionOf } from '@/lib/opinion'

export default {
    name: 'Read',
    components: { Sparkline },
    data() {
        return {
            data: data,
            watchlist: stocks.slice(0, 8)
        }
    },
    computed: {
        sentiment() {
            const total = this.data.length || 1
            const count = k => this.data.filter(d => d.opinion === k).length
            const buy = Math.round(count('buy') / total * 100)
            const sell = Math.round(count('sell') / total * 100)
            const hold = this.data.length ? 100 - buy - sell : 0
            const label = buy > sell
                ? { text: '탐욕 GREED', cls: 'text-up' }
                : sell > buy ? { text: '공포 FEAR', cls: 'text-down' } : { text: '중립 NEUTRAL', cls: 'text-hold' }
            return { buy, sell, hold, label }
        },
        hottest() {
            const counts = {}
            for (const d of this.data) if (d.stock) counts[d.stock] = (counts[d.stock] || 0) + 1
            return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
        }
    },
    methods: {
        opinionOf,
        findStock,
        changeRate,
        formatPrice,
        formatRate,
        rateClass,
        flashClass,
        rateColor(s) {
            return changeRate(s) >= 0 ? 'var(--color-up)' : 'var(--color-down)'
        },
        write() {
            this.$router.push({
                path: '/create'
            })
        },
        detail(index) {
            this.$router.push({
                name: 'Detail',
                params: {
                    contentId: index
                }
            })
        }
    }
}
</script>

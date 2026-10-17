<template>
    <div v-if="data" class="mx-auto max-w-4xl space-y-6">
        <router-link to="/" class="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:-translate-x-1 hover:text-neon">← 목록으로</router-link>

        <!-- 종목 차트 카드 -->
        <section class="glass glow-border overflow-hidden animate-rise" :style="{ '--op': opinion.color }">
            <div class="flex flex-wrap items-end justify-between gap-4 px-6 pt-6">
                <div>
                    <div class="flex items-center gap-2">
                        <h2 class="text-2xl font-black text-slate-100">{{ data.stock }}</h2>
                        <span v-if="stock" class="font-mono text-xs text-slate-500">{{ stock.code }}</span>
                        <span v-if="stock" class="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">가상 시세</span>
                    </div>
                    <div v-if="stock" class="mt-1 flex items-baseline gap-3 font-mono tabular-nums">
                        <span :key="stock.tick" class="rounded px-1 text-3xl font-black text-slate-100" :class="flashClass(stock)">{{ formatPrice(stock) }}</span>
                        <span class="text-sm font-bold" :class="rateClass(stock)">
                            {{ rate > 0 ? '▲' : rate < 0 ? '▼' : '-' }} {{ formatRate(rate) }}
                        </span>
                    </div>
                    <p v-else class="mt-1 text-sm text-slate-500">시세 정보가 없는 종목입니다</p>
                </div>
                <span
                    class="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-lg font-black shadow-[0_0_30px_-6px_var(--op)]"
                    :class="opinion.badge"
                >{{ opinion.icon }} {{ opinion.label }} 의견</span>
            </div>
            <div class="mt-4 h-48 pr-3">
                <Sparkline
                    v-if="stock" :points="stock.history" :color="rate >= 0 ? 'var(--color-up)' : 'var(--color-down)'"
                    :width="800" :height="192" :stroke-width="2.5" class="size-full"
                />
                <div v-else class="grid h-full place-items-center font-mono text-xs tracking-[.3em] text-slate-600">NO CHART DATA</div>
            </div>
        </section>

        <!-- 본문 -->
        <article class="glass p-6 sm:p-8 animate-rise [animation-delay:.1s]">
            <h1 class="text-2xl font-black leading-snug text-slate-50 sm:text-3xl">{{ data.title }}</h1>
            <div class="mt-3 flex items-center gap-2 text-sm text-slate-400">
                <span class="grid size-7 place-items-center rounded-full bg-linear-to-br from-neon/80 to-down/80 text-xs font-black text-ink-950">{{ (data.writer || '?').slice(0, 1) }}</span>
                {{ data.writer }}
            </div>
            <div class="my-6 h-px bg-linear-to-r from-transparent via-white/15 to-transparent"></div>
            <p class="whitespace-pre-wrap leading-relaxed text-slate-300">{{ data.content }}</p>

            <div class="mt-8 flex flex-wrap justify-end gap-3">
                <button class="btn-ghost" @click="updateData">수정</button>
                <button class="btn-danger" @click="deleteData">삭제</button>
            </div>
        </article>
    </div>
    <div v-else class="glass mx-auto max-w-md p-10 text-center animate-rise">
        <p class="font-mono text-5xl font-black text-down neon-text">404</p>
        <p class="mt-3 text-slate-400">게시글을 찾을 수 없습니다.</p>
        <router-link to="/" class="btn-primary mt-6">목록으로</router-link>
    </div>
</template>
<script>
import data from '@/data'
import Sparkline from '@/components/Sparkline.vue'
import { findStock, changeRate, formatPrice, formatRate, rateClass, flashClass } from '@/data/market'
import { opinionOf } from '@/lib/opinion'

export default {
    name: 'Detail',
    components: { Sparkline },
    data() {
        const index = this.$route.params.contentId
        return {
            data: data[index],
            index: index
        }
    },
    computed: {
        stock() {
            return findStock(this.data.stock)
        },
        opinion() {
            return opinionOf(this.data.opinion)
        },
        rate() {
            return this.stock ? changeRate(this.stock) : 0
        }
    },
    methods: {
        formatPrice,
        formatRate,
        rateClass,
        flashClass,
        updateData() {
            this.$router.push({
                name: 'Create',
                params: {
                    contentId: this.index
                }
            })
        },

        deleteData() {
            data.splice(this.index, 1)
            this.$router.push({
                path: '/'
            })
        }
    }
}
</script>

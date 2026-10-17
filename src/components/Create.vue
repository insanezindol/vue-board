<template>
    <div class="mx-auto max-w-3xl space-y-6">
        <router-link to="/" class="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:-translate-x-1 hover:text-neon">← 목록으로</router-link>

        <section class="glass glow-border p-6 sm:p-8 animate-rise">
            <p class="font-mono text-xs tracking-[.3em] text-neon">// {{ index !== undefined ? 'EDIT POST' : 'NEW POST' }}</p>
            <h1 class="mt-2 text-3xl font-black"><span class="shine-text">{{ index !== undefined ? '의견 수정하기' : '새 의견 남기기' }}</span></h1>

            <div class="mt-8 space-y-6">
                <!-- 종목 -->
                <div class="space-y-2">
                    <label for="stock" class="text-xs font-semibold tracking-wider text-slate-400">종목</label>
                    <div class="relative">
                        <input id="stock" v-model="stock" list="stock-list" type="text" placeholder="종목명 또는 코드 (예: 삼성전자, NVDA)" class="field pr-40" autocomplete="off" />
                        <div v-if="matched" class="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 font-mono text-xs tabular-nums">
                            <span :key="matched.tick" class="rounded px-1 text-slate-200" :class="flashClass(matched)">{{ formatPrice(matched) }}</span>
                            <span :class="changeRate(matched) >= 0 ? 'text-up' : 'text-down'">{{ formatRate(changeRate(matched)) }}</span>
                        </div>
                    </div>
                    <datalist id="stock-list">
                        <option v-for="s in stocks" :key="s.code" :value="s.name">{{ s.code }}</option>
                    </datalist>
                </div>

                <!-- 투자 의견 -->
                <fieldset class="space-y-2">
                    <legend class="mb-2 text-xs font-semibold tracking-wider text-slate-400">투자 의견</legend>
                    <div class="grid grid-cols-3 gap-3">
                        <label
                            v-for="(o, key) in opinions" :key="key"
                            class="relative cursor-pointer rounded-xl border px-4 py-3 text-center font-black transition duration-300 hover:-translate-y-0.5"
                            :class="opinion === key ? o.badge + ' scale-[1.03]' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'"
                            :style="opinion === key ? { boxShadow: `0 0 32px -6px ${o.color}` } : null"
                        >
                            <input v-model="opinion" type="radio" name="opinion" :value="key" class="sr-only" />
                            <span class="mr-1">{{ o.icon }}</span>{{ o.label }}
                        </label>
                    </div>
                </fieldset>

                <div class="grid gap-6 sm:grid-cols-[200px_1fr]">
                    <div class="space-y-2">
                        <label for="writer" class="text-xs font-semibold tracking-wider text-slate-400">글쓴이</label>
                        <input id="writer" v-model="writer" type="text" placeholder="글쓴이" class="field" />
                    </div>
                    <div class="space-y-2">
                        <label for="title" class="text-xs font-semibold tracking-wider text-slate-400">제목</label>
                        <input id="title" v-model="title" type="text" placeholder="제목" class="field" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="content" class="text-xs font-semibold tracking-wider text-slate-400">내용</label>
                    <textarea id="content" v-model="content" placeholder="내용" rows="8" class="field resize-y leading-relaxed"></textarea>
                </div>
            </div>

            <div class="mt-8 flex justify-end gap-3">
                <router-link to="/" class="btn-ghost">취소</router-link>
                <button data-test="submit" class="btn-primary px-8" @click="index !== undefined ? update() : write()">{{index !== undefined ? '수정' : '작성'}}</button>
            </div>
        </section>
    </div>
</template>
<script>
import data from '@/data'
import { stocks, findStock, changeRate, formatPrice, formatRate, flashClass } from '@/data/market'
import { OPINIONS } from '@/lib/opinion'

export default {
    name: 'Create',
    data() {
        const index = this.$route.params.contentId
        return {
            data: data,
            index: index,
            stocks: stocks,
            opinions: OPINIONS,
            writer: index !== undefined ? data[index].writer : '',
            stock: index !== undefined ? data[index].stock : '',
            opinion: index !== undefined ? data[index].opinion : 'buy',
            title: index !== undefined ? data[index].title : '',
            content: index !== undefined ? data[index].content : '',
        }
    },
    computed: {
        matched() {
            return findStock(this.stock)
        }
    },
    methods: {
        changeRate,
        formatPrice,
        formatRate,
        flashClass,
        write() {
            this.data.push({
                writer: this.writer,
                stock: this.stock,
                opinion: this.opinion,
                title: this.title,
                content: this.content
            })
            this.$router.push({
                path: '/'
            })
        },

        update() {
            data[this.index].writer = this.writer
            data[this.index].stock = this.stock
            data[this.index].opinion = this.opinion
            data[this.index].title = this.title
            data[this.index].content = this.content
            this.$router.push({
                path: '/'
            })
        }
    }
}
</script>

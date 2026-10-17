<template>
    <svg :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none" class="block overflow-visible animate-reveal" aria-hidden="true">
        <defs>
            <linearGradient :id="gradId" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" :stop-color="color" stop-opacity="0.45" />
                <stop offset="100%" :stop-color="color" stop-opacity="0" />
            </linearGradient>
            <filter :id="glowId" x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        <path v-if="area" :d="areaPath" :fill="`url(#${gradId})`" />
        <path
            :d="linePath" fill="none" :stroke="color" :stroke-width="strokeWidth"
            stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"
            :filter="`url(#${glowId})`"
        />
        <circle v-if="dot && coords.length" :cx="coords[coords.length - 1][0]" :cy="coords[coords.length - 1][1]" r="3" :fill="color">
            <animate attributeName="r" values="3;6;3" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
    </svg>
</template>
<script>
let uid = 0

export default {
    name: 'Sparkline',
    props: {
        points: { type: Array, required: true },
        color: { type: String, default: 'var(--color-neon)' },
        width: { type: Number, default: 120 },
        height: { type: Number, default: 36 },
        strokeWidth: { type: Number, default: 1.75 },
        area: { type: Boolean, default: true },
        dot: { type: Boolean, default: true }
    },
    data() {
        uid++
        return { gradId: `spark-grad-${uid}`, glowId: `spark-glow-${uid}` }
    },
    computed: {
        coords() {
            const pts = this.points
            if (pts.length < 2) return []
            const min = Math.min(...pts)
            const max = Math.max(...pts)
            const range = max - min || 1
            const pad = 4
            return pts.map((p, i) => [
                (i / (pts.length - 1)) * this.width,
                pad + (1 - (p - min) / range) * (this.height - pad * 2)
            ])
        },
        linePath() {
            return this.coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('')
        },
        areaPath() {
            if (!this.coords.length) return ''
            return `${this.linePath}L${this.width},${this.height}L0,${this.height}Z`
        }
    }
}
</script>

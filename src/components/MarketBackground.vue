<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <!-- 원근감 있게 흘러가는 그리드 바닥 -->
        <div class="absolute inset-x-0 bottom-0 h-[60vh] [perspective:600px]">
            <div
                class="absolute inset-0 origin-bottom animate-grid opacity-60 [transform:rotateX(62deg)] [mask-image:linear-gradient(to_top,#000_10%,transparent_90%)]"
                style="background-image: linear-gradient(rgb(0 240 192 / .35) 1px, transparent 1px), linear-gradient(90deg, rgb(0 240 192 / .35) 1px, transparent 1px); background-size: 56px 56px;"
            ></div>
        </div>

        <!-- 떠다니는 빛 덩어리 -->
        <div class="absolute -left-40 -top-40 size-[38rem] rounded-full bg-neon/25 blur-[120px] animate-orb"></div>
        <div class="absolute -right-40 top-1/3 size-[34rem] rounded-full bg-up/20 blur-[120px] animate-orb [animation-delay:-6s]"></div>
        <div class="absolute bottom-0 left-1/3 size-[30rem] rounded-full bg-down/20 blur-[120px] animate-orb [animation-delay:-12s]"></div>

        <!-- 실시간 차트 라인 + 파티클 -->
        <canvas ref="canvas" class="absolute inset-0 size-full opacity-90"></canvas>

        <!-- 스캔라인 + 비네팅 -->
        <div class="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-transparent via-neon/5 to-transparent animate-scan"></div>
        <div class="absolute inset-0 opacity-[.07]" style="background-image: repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 3px);"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-ink-950)_100%)]"></div>
    </div>
</template>
<script>
const COLORS = ['#00f0c0', '#ff3b5c', '#3b8bff']

export default {
    name: 'MarketBackground',
    mounted() {
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext && canvas.getContext('2d')
        if (!ctx) return

        const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        let w = 0
        let h = 0
        let lines = []
        let particles = []

        const resize = () => {
            w = canvas.clientWidth
            h = canvas.clientHeight
            canvas.width = w * dpr
            canvas.height = h * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            const gap = 10
            lines = COLORS.map((color, i) => {
                const points = []
                let y = h * (0.35 + i * 0.18)
                for (let x = 0; x <= w + gap; x += gap) {
                    y += (Math.random() - 0.5) * 18
                    y = Math.min(h * 0.9, Math.max(h * 0.15, y))
                    points.push(y)
                }
                return { color, points, gap, offset: 0, speed: 0.35 + i * 0.15 }
            })
            particles = Array.from({ length: Math.round(w / 22) }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.6 + 0.3,
                vy: Math.random() * 0.4 + 0.1,
                c: COLORS[Math.floor(Math.random() * COLORS.length)]
            }))
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h)
            for (const p of particles) {
                p.y -= p.vy
                if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w }
                ctx.globalAlpha = 0.6
                ctx.fillStyle = p.c
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.globalAlpha = 0.55
            ctx.lineWidth = 1.5
            for (const l of lines) {
                l.offset += l.speed
                if (l.offset >= l.gap) {
                    // 왼쪽으로 한 칸 밀고 오른쪽 끝에 새 시세 추가
                    l.offset -= l.gap
                    l.points.shift()
                    const last = l.points[l.points.length - 1]
                    l.points.push(Math.min(h * 0.9, Math.max(h * 0.15, last + (Math.random() - 0.5) * 18)))
                }
                ctx.strokeStyle = l.color
                ctx.shadowColor = l.color
                ctx.shadowBlur = 12
                ctx.beginPath()
                l.points.forEach((y, i) => {
                    const x = i * l.gap - l.offset
                    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
                })
                ctx.stroke()
            }
            ctx.shadowBlur = 0
            ctx.globalAlpha = 1
            if (!reduced) this.raf = requestAnimationFrame(draw)
        }

        this.onResize = resize
        resize()
        draw()
        window.addEventListener('resize', resize)
    },
    beforeUnmount() {
        cancelAnimationFrame(this.raf)
        window.removeEventListener('resize', this.onResize)
    }
}
</script>

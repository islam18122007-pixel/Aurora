import { useRef, useEffect } from 'react'

export default function Visualizer({ bars, isPlaying }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const count = 32
      const barW = (width / count) - 2
      const slice = Math.floor(bars.length / count)

      for (let i = 0; i < count; i++) {
        const val = bars[i * slice] || 0
        const barH = isPlaying ? (val / 255) * height * 0.85 + 2 : 2
        const x = i * (barW + 2)
        const y = height - barH

        // Aurora gradient per bar
        const grad = ctx.createLinearGradient(x, y, x, height)
        grad.addColorStop(0, `rgba(124,106,255,${isPlaying ? 0.9 : 0.2})`)
        grad.addColorStop(0.5, `rgba(255,106,176,${isPlaying ? 0.7 : 0.15})`)
        grad.addColorStop(1, `rgba(106,255,218,${isPlaying ? 0.4 : 0.1})`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, barW, barH, [2, 2, 0, 0])
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [bars, isPlaying])

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      canvas.style.width = canvas.offsetWidth + 'px'
      canvas.style.height = canvas.offsetHeight + 'px'
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

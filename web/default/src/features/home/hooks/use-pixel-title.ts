/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useEffect, type RefObject } from 'react'

type UsePixelTitleOptions = {
  text: string
  rootRef: RefObject<HTMLElement | null>
  textRef: RefObject<HTMLElement | null>
  layerRef: RefObject<HTMLElement | null>
}

function seededNoise(seed: number, textLength: number): number {
  const x = Math.sin(seed * 12.9898 + textLength * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function pickColor(colors: string[], seed: number): string {
  return colors[Math.floor(seed * colors.length)] || colors[0] || '#CE6C4C'
}

export function usePixelTitle(options: UsePixelTitleOptions) {
  useEffect(() => {
    const root = options.rootRef.current
    const textEl = options.textRef.current
    const layer = options.layerRef.current
    if (!root || !textEl || !layer || !options.text) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      root.classList.remove('is-pixel-ready')
      layer.textContent = ''
      return
    }

    let resizeTimer = 0
    let cancelled = false

    const renderPixelTitle = () => {
      if (cancelled) return

      root.classList.remove('is-pixel-ready')
      layer.textContent = ''

      const styles = window.getComputedStyle(textEl)
      const fontSize = Number.parseFloat(styles.fontSize) || 82
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return

      const font = [
        styles.fontStyle,
        styles.fontWeight,
        `${fontSize}px`,
        styles.fontFamily,
      ].join(' ')

      context.font = font
      const metrics = context.measureText(options.text)
      const pad = Math.ceil(fontSize * 0.12)
      const leftOffset = Math.ceil(Math.max(0, -metrics.actualBoundingBoxLeft))
      const ascent = Math.ceil(
        metrics.actualBoundingBoxAscent || fontSize * 0.78
      )
      const descent = Math.ceil(
        metrics.actualBoundingBoxDescent || fontSize * 0.22
      )
      const width = Math.ceil(
        metrics.actualBoundingBoxRight + leftOffset + pad * 2
      )
      const height = Math.ceil(ascent + descent + pad * 2)

      canvas.width = Math.max(1, width)
      canvas.height = Math.max(1, height)

      context.clearRect(0, 0, width, height)
      context.font = font
      context.fillStyle = '#000'
      context.textBaseline = 'alphabetic'
      context.fillText(options.text, pad + leftOffset, pad + ascent)

      const pixels = context.getImageData(0, 0, width, height).data
      let cellSize = 8
      if (fontSize >= 108) {
        cellSize = 12
      } else if (fontSize >= 72) {
        cellSize = 10
      }
      const sampleSize = cellSize / 2
      const dotSize = Math.max(3, Math.round(cellSize * 0.34))
      const fragment = document.createDocumentFragment()
      const tileColors = [
        '#D97757',
        '#E08B6E',
        '#DD8263',
        '#E29478',
        '#D17A60',
        '#E6A085',
      ]
      const solidColors = ['#CE6C4C', '#C9694C', '#D17052', '#CB6B4E']

      for (let y = 0; y < height; y += sampleSize) {
        for (let x = 0; x < width; x += sampleSize) {
          let filled = 0
          let maxAlpha = 0

          for (let py = 0; py < sampleSize; py += 1) {
            for (let px = 0; px < sampleSize; px += 1) {
              const sx = x + px
              const sy = y + py
              if (sx >= width || sy >= height) continue
              const alpha = pixels[(sy * width + sx) * 4 + 3]
              if (alpha > 44) filled += 1
              if (alpha > maxAlpha) maxAlpha = alpha
            }
          }

          if (filled < 3) continue

          const index = fragment.childNodes.length
          const cx = x + sampleSize / 2
          const cy = y + sampleSize / 2
          const cellCol = Math.floor(cx / cellSize)
          const cellRow = Math.floor(cy / cellSize)
          const centeredRow = cy / cellSize - height / cellSize / 2
          const tone = seededNoise(
            index + cellCol * 17 + cellRow * 31,
            options.text.length
          )
          const dot = document.createElement('i')

          dot.className = 'picdesign-pixel-dot'
          dot.style.left = `${Math.round(cx - dotSize / 2)}px`
          dot.style.top = `${Math.round(cy - dotSize / 2)}px`
          dot.style.width = `${dotSize}px`
          dot.style.height = `${dotSize}px`
          dot.style.backgroundColor =
            tone > 0.74
              ? pickColor(
                  tileColors,
                  seededNoise(index + 7, options.text.length)
                )
              : pickColor(
                  solidColors,
                  seededNoise(index + 11, options.text.length)
                )
          dot.style.setProperty(
            '--pixel-opacity',
            (0.5 + (maxAlpha / 255) * 0.36).toFixed(2)
          )
          dot.style.setProperty(
            '--pixel-delay',
            `${(
              (cx / cellSize) * 0.014 +
              Math.abs(centeredRow) * 0.01 +
              seededNoise(index, options.text.length) * 0.064
            ).toFixed(3)}s`
          )
          dot.style.setProperty(
            '--twinkle-delay',
            `${(1.2 + seededNoise(index + 19, options.text.length) * 2.8).toFixed(3)}s`
          )
          fragment.appendChild(dot)
        }
      }

      layer.appendChild(fragment)
      root.style.setProperty('--pixel-title-width', `${width}px`)
      root.style.setProperty('--pixel-title-height', `${height}px`)
      root.classList.add('is-pixel-ready')
    }

    const queueRender = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(renderPixelTitle, 120)
    }

    renderPixelTitle()
    document.fonts?.ready.then(renderPixelTitle).catch(() => undefined)
    window.addEventListener('resize', queueRender)

    return () => {
      cancelled = true
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', queueRender)
    }
  }, [options.layerRef, options.rootRef, options.text, options.textRef])
}

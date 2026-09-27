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

export function usePicDesignReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      root
        .querySelectorAll(
          '[data-picdesign-reveal], [data-picdesign-reveal-children]'
        )
        .forEach((element) => element.classList.add('is-in'))
      root.querySelectorAll('[data-picdesign-count]').forEach((element) => {
        element.textContent = `${element.getAttribute('data-picdesign-count') || ''}${element.getAttribute('data-picdesign-count-suffix') || ''}`
      })
      return
    }

    root.classList.add('js-motion')

    root
      .querySelectorAll('[data-picdesign-reveal-children]')
      .forEach((group) => {
        const children = [...group.children]
        children.forEach((child, index) => {
          if (child instanceof HTMLElement) {
            child.style.setProperty('--i', String(index))
          }
        })
      })

    const priceTable = root.querySelector('.picdesign-price-table')
    priceTable
      ?.querySelectorAll('.picdesign-table-row:not(.picdesign-table-head)')
      .forEach((row, index) => {
        if (row instanceof HTMLElement) {
          row.style.setProperty('--i', String(index))
          const chip = row.querySelector('.picdesign-price-chip')
          if (chip instanceof HTMLElement) {
            chip.style.setProperty('--i', String(index))
          }
        }
      })

    const countUp = (element: Element) => {
      const target = Number(element.getAttribute('data-picdesign-count'))
      const suffix = element.getAttribute('data-picdesign-count-suffix') || ''
      if (!Number.isFinite(target)) return

      const duration = 1100
      let start: number | null = null
      element.classList.add('counting')

      const frame = (timestamp: number) => {
        if (start === null) start = timestamp
        const progress = Math.min((timestamp - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        element.textContent = `${Math.round(eased * target)}${suffix}`

        if (progress < 1) {
          requestAnimationFrame(frame)
          return
        }

        element.textContent = `${target}${suffix}`
        element.classList.remove('counting')
        element.classList.add('count-done')
      }

      requestAnimationFrame(frame)
    }

    if (!('IntersectionObserver' in window)) {
      root
        .querySelectorAll(
          '[data-picdesign-reveal], [data-picdesign-reveal-children]'
        )
        .forEach((element) => element.classList.add('is-in'))
      priceTable?.classList.add('is-in')
      root.querySelectorAll('[data-picdesign-count]').forEach(countUp)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const element = entry.target
          element.classList.add('is-in')

          if (element.id === 'picdesign-pricing') {
            priceTable?.classList.add('is-in')
            const countElement = element.querySelector('[data-picdesign-count]')
            if (countElement) countUp(countElement)
          }

          observer.unobserve(element)
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    )

    root
      .querySelectorAll(
        '[data-picdesign-reveal], [data-picdesign-reveal-children]'
      )
      .forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [rootRef])
}

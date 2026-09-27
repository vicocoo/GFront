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
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'

import { HeroIllustration } from './components/picdesign-home/hero-illustration'

function getCssBlock(css: string, blockStart: string): string {
  const start = css.indexOf(blockStart)

  expect(start).not.toBe(-1)

  let depth = 0

  for (let index = start; index < css.length; index += 1) {
    if (css[index] === '{') {
      depth += 1
    }

    if (css[index] === '}') {
      depth -= 1

      if (depth === 0) {
        return css.slice(start, index + 1)
      }
    }
  }

  throw new Error(`Could not find CSS block for ${blockStart}`)
}

describe('HeroIllustration', () => {
  test('renders separate background, dialogue, and star layers', () => {
    const markup = renderToStaticMarkup(createElement(HeroIllustration))

    expect(markup).toMatch(/class="picdesign-hero-art-stack"/)
    expect(markup).toMatch(/class="picdesign-hero-background"/)
    expect(markup).toMatch(
      /class="picdesign-hero-layer picdesign-hero-chatgpt"/
    )
    expect(markup).toMatch(/class="picdesign-hero-layer picdesign-hero-claude"/)
    expect(markup).toMatch(
      /class="picdesign-hero-layer picdesign-hero-star picdesign-hero-star-lower"/
    )
    expect(markup).toMatch(
      /class="picdesign-hero-layer picdesign-hero-star picdesign-hero-star-upper"/
    )
  })

  test('keeps dialogue and star layers on separate motion tracks', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'src/features/home/picdesign-home.css'),
      'utf8'
    )

    expect(css).toMatch(
      /\.picdesign-home\.js-motion\s+\.picdesign-hero-chatgpt\s*\{[^}]*picdesign-chatgpt-float/s
    )
    expect(css).toMatch(
      /\.picdesign-home\.js-motion\s+\.picdesign-hero-claude\s*\{[^}]*picdesign-claude-float/s
    )
    expect(css).toMatch(
      /\.picdesign-home\.js-motion\s+\.picdesign-hero-star-lower\s*\{[^}]*picdesign-star-twinkle/s
    )
    expect(css).toMatch(
      /\.picdesign-home\.js-motion\s+\.picdesign-hero-star-upper\s*\{[^}]*picdesign-star-twinkle/s
    )
  })

  test('uses classic PicDesign float parameters while keeping dialogue phases offset', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'src/features/home/picdesign-home.css'),
      'utf8'
    )
    const chatgptRule = getCssBlock(
      css,
      '.picdesign-home.js-motion .picdesign-hero-chatgpt {'
    )
    const claudeRule = getCssBlock(
      css,
      '.picdesign-home.js-motion .picdesign-hero-claude {'
    )
    const chatgptKeyframes = getCssBlock(
      css,
      '@keyframes picdesign-chatgpt-float {'
    )
    const claudeKeyframes = getCssBlock(
      css,
      '@keyframes picdesign-claude-float {'
    )

    expect(chatgptRule).toMatch(
      /animation:\s*picdesign-chatgpt-float 7s ease-in-out 1\.4s infinite;/
    )
    expect(claudeRule).toMatch(
      /animation:\s*picdesign-claude-float 7s ease-in-out -2\.1s infinite;/
    )
    expect(chatgptKeyframes).toMatch(/transform:\s*translateY\(0\);/)
    expect(chatgptKeyframes).toMatch(/transform:\s*translateY\(-9px\);/)
    expect(claudeKeyframes).toMatch(/transform:\s*translateY\(0\);/)
    expect(claudeKeyframes).toMatch(/transform:\s*translateY\(-9px\);/)
  })

  test('keeps star positions fixed while twinkling through opacity only', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'src/features/home/picdesign-home.css'),
      'utf8'
    )
    const twinkleKeyframes = getCssBlock(
      css,
      '@keyframes picdesign-star-twinkle {'
    )
    const lowerStarRule = getCssBlock(
      css,
      '.picdesign-home.js-motion .picdesign-hero-star-lower {'
    )
    const upperStarRule = getCssBlock(
      css,
      '.picdesign-home.js-motion .picdesign-hero-star-upper {'
    )

    expect(twinkleKeyframes).toMatch(/opacity:/)
    expect(twinkleKeyframes).not.toMatch(/transform:/)
    expect(twinkleKeyframes).not.toMatch(/filter:/)
    expect(lowerStarRule).toMatch(/will-change:\s*opacity;/)
    expect(upperStarRule).toMatch(/will-change:\s*opacity;/)
  })
})

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
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, test } from 'node:test'

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { HeroIllustration } from './components/picdesign-home/hero-illustration'

function getCssBlock(css: string, blockStart: string): string {
  const start = css.indexOf(blockStart)

  assert.notEqual(start, -1)

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

  assert.fail(`Could not find CSS block for ${blockStart}`)
}

describe('HeroIllustration', () => {
  test('renders separate background, dialogue, and star layers', () => {
    const markup = renderToStaticMarkup(createElement(HeroIllustration))

    assert.match(markup, /class="picdesign-hero-art-stack"/)
    assert.match(markup, /class="picdesign-hero-background"/)
    assert.match(markup, /class="picdesign-hero-layer picdesign-hero-chatgpt"/)
    assert.match(markup, /class="picdesign-hero-layer picdesign-hero-claude"/)
    assert.match(
      markup,
      /class="picdesign-hero-layer picdesign-hero-star picdesign-hero-star-lower"/
    )
    assert.match(
      markup,
      /class="picdesign-hero-layer picdesign-hero-star picdesign-hero-star-upper"/
    )
  })

  test('keeps dialogue and star layers on separate motion tracks', () => {
    const css = readFileSync(
      new URL('./picdesign-home.css', import.meta.url),
      'utf8'
    )

    assert.match(
      css,
      /\.picdesign-home\.js-motion\s+\.picdesign-hero-chatgpt\s*\{[^}]*picdesign-chatgpt-float/s
    )
    assert.match(
      css,
      /\.picdesign-home\.js-motion\s+\.picdesign-hero-claude\s*\{[^}]*picdesign-claude-float/s
    )
    assert.match(
      css,
      /\.picdesign-home\.js-motion\s+\.picdesign-hero-star-lower\s*\{[^}]*picdesign-star-twinkle/s
    )
    assert.match(
      css,
      /\.picdesign-home\.js-motion\s+\.picdesign-hero-star-upper\s*\{[^}]*picdesign-star-twinkle/s
    )
  })

  test('uses classic PicDesign float parameters while keeping dialogue phases offset', () => {
    const css = readFileSync(
      new URL('./picdesign-home.css', import.meta.url),
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

    assert.match(
      chatgptRule,
      /animation:\s*picdesign-chatgpt-float 7s ease-in-out 1\.4s infinite;/
    )
    assert.match(
      claudeRule,
      /animation:\s*picdesign-claude-float 7s ease-in-out -2\.1s infinite;/
    )
    assert.match(chatgptKeyframes, /transform:\s*translateY\(0\);/)
    assert.match(chatgptKeyframes, /transform:\s*translateY\(-9px\);/)
    assert.match(claudeKeyframes, /transform:\s*translateY\(0\);/)
    assert.match(claudeKeyframes, /transform:\s*translateY\(-9px\);/)
  })

  test('keeps star positions fixed while twinkling through opacity only', () => {
    const css = readFileSync(
      new URL('./picdesign-home.css', import.meta.url),
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

    assert.match(twinkleKeyframes, /opacity:/)
    assert.doesNotMatch(twinkleKeyframes, /transform:/)
    assert.doesNotMatch(twinkleKeyframes, /filter:/)
    assert.match(lowerStarRule, /will-change:\s*opacity;/)
    assert.match(upperStarRule, /will-change:\s*opacity;/)
  })
})

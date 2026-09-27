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

import { PixelTitle } from './components/picdesign-home/pixel-title'

describe('PixelTitle', () => {
  test('merges caller class names onto the pixel title root', () => {
    const markup = renderToStaticMarkup(
      createElement(PixelTitle, {
        text: 'API',
        className: 'picdesign-hero-subtitle',
      })
    )

    expect(markup).toMatch(
      /class="picdesign-pixel-title picdesign-hero-subtitle"/
    )
  })

  test('keeps the hero subtitle pixel title at the inherited hero size', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'src/features/home/picdesign-home.css'),
      'utf8'
    )

    expect(css).toMatch(
      /\.picdesign-pixel-title\.picdesign-hero-subtitle\s*\{[^}]*font-size:\s*inherit;/s
    )
  })
})

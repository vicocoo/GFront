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
import { describe, test } from 'node:test'

import {
  getPicDesignPrimaryAction,
  picDesignFooterColumns,
  picDesignHero,
  picDesignModelCards,
  picDesignPricingRows,
  PICDESIGN_MODEL_SQUARE_HREF,
} from './picdesign-content'

describe('picdesign homepage content behavior', () => {
  test('sends authenticated users to the dashboard', () => {
    assert.deepEqual(
      getPicDesignPrimaryAction({
        isAuthenticated: true,
        registerEnabled: true,
        selfUseModeEnabled: false,
      }),
      { href: '/dashboard', label: 'Go to Dashboard' }
    )
  })

  test('sends guests to sign up only when registration is available', () => {
    assert.deepEqual(
      getPicDesignPrimaryAction({
        isAuthenticated: false,
        registerEnabled: true,
        selfUseModeEnabled: false,
      }),
      { href: '/sign-up', label: 'Get Started' }
    )

    assert.deepEqual(
      getPicDesignPrimaryAction({
        isAuthenticated: false,
        registerEnabled: false,
        selfUseModeEnabled: false,
      }),
      { href: '/sign-in', label: 'Sign in' }
    )

    assert.deepEqual(
      getPicDesignPrimaryAction({
        isAuthenticated: false,
        registerEnabled: true,
        selfUseModeEnabled: true,
      }),
      { href: '/sign-in', label: 'Sign in' }
    )
  })

  test('uses the model square for pricing and model links', () => {
    assert.equal(PICDESIGN_MODEL_SQUARE_HREF, '/pricing')
  })

  test('uses the compact PicDesign hero eyebrow copy', () => {
    assert.equal(picDesignHero.eyebrow, 'Stable / efficient / convenient')
  })

  test('keeps only one model square footer link', () => {
    const modelSquareLinks = picDesignFooterColumns
      .flatMap((column) => column.links)
      .filter((link) => link.href === PICDESIGN_MODEL_SQUARE_HREF)

    assert.deepEqual(
      modelSquareLinks.map((link) => link.label),
      ['Model Square']
    )
  })

  test('uses the requested PicDesign model and pricing highlights', () => {
    assert.deepEqual(
      picDesignModelCards.slice(0, 4).map((model) => model.name),
      ['GPT-5.5', 'GPT-5.4', 'Claude Fable 5', 'Claude Opus 4.8']
    )

    assert.deepEqual(picDesignPricingRows, [
      {
        model: 'GPT-5.5',
        officialPrice: '$30.00',
        discountLabel: 'discount of',
        maximumSavings: '96%',
      },
      {
        model: 'GPT-5.4',
        officialPrice: '$15.00',
        discountLabel: 'discount of',
        maximumSavings: '96%',
      },
      {
        model: 'Claude Opus 4.8',
        officialPrice: '$25.00',
        discountLabel: 'discount of',
        maximumSavings: '97%',
      },
      {
        model: 'Claude Opus 4.6',
        officialPrice: '$25.00',
        discountLabel: 'discount of',
        maximumSavings: '97%',
      },
    ])
  })
})

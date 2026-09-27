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
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  picDesignBillingFeatures,
  picDesignIcons,
  picDesignPricingRows,
  PICDESIGN_MODEL_SQUARE_HREF,
} from '../../picdesign-content'

export function PricingSection() {
  const { t } = useTranslation()

  return (
    <section
      id='picdesign-pricing'
      className='picdesign-pricing-section'
      aria-labelledby='picdesign-pricing-title'
      data-picdesign-reveal
    >
      <div className='picdesign-savings-panel'>
        <h2 id='picdesign-pricing-title'>
          {t('Save up to')}{' '}
          <span data-picdesign-count='97' data-picdesign-count-suffix='%'>
            97%
          </span>
        </h2>
        <p>{t('The same models, at lower prices')}</p>

        <div
          className='picdesign-price-table'
          role='table'
          aria-label={t('Model price comparison')}
        >
          <div className='picdesign-table-row picdesign-table-head' role='row'>
            <span role='columnheader'>{t('Model')}</span>
            <span role='columnheader'>
              {t('Official price per 1M output tokens')}
            </span>
            <span role='columnheader'>{t('Maximum savings on this site')}</span>
          </div>
          {picDesignPricingRows.map((row) => (
            <div key={row.model} className='picdesign-table-row' role='row'>
              <span>{row.model}</span>
              <span>{row.officialPrice}</span>
              <span className='picdesign-discount-cell'>
                <span className='picdesign-price-chip'>
                  {row.discountLabel}
                </span>
                <span className='picdesign-saving'>{row.maximumSavings}</span>
              </span>
            </div>
          ))}
        </div>

        <p className='picdesign-pricing-note'>
          <span aria-hidden='true' className='picdesign-pricing-note-marker'>
            *
          </span>
          <span>
            {t(
              'Prices may fluctuate and are for reference only. Actual prices are based on the model square.'
            )}
          </span>
        </p>
      </div>

      <div className='picdesign-billing-card' data-picdesign-reveal>
        <h2>{t('Flexible billing, use on demand')}</h2>
        <p>{t('No monthly fee, no subscription, pay for actual usage')}</p>

        <div className='picdesign-billing-features'>
          {picDesignBillingFeatures.map((feature) => {
            const Icon = picDesignIcons[feature.icon]
            return (
              <div key={feature.title}>
                <Icon aria-hidden='true' />
                <h3>{t(feature.title)}</h3>
                <p>
                  {feature.description.split('\n').map((line, index) => (
                    <span key={line}>
                      {index > 0 ? <br /> : null}
                      {t(line)}
                    </span>
                  ))}
                </p>
              </div>
            )
          })}
        </div>

        <Link
          className='picdesign-wide-button'
          to={PICDESIGN_MODEL_SQUARE_HREF}
        >
          {t('View pricing details')}
          <ChevronRight aria-hidden='true' />
        </Link>
      </div>
    </section>
  )
}

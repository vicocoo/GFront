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
import { useTranslation } from 'react-i18next'

import { picDesignIcons, picDesignWhyCards } from '../../picdesign-content'

export function WhySection(props: { systemName: string }) {
  const { t } = useTranslation()

  return (
    <section
      className='picdesign-why-section'
      aria-labelledby='picdesign-why-title'
      data-picdesign-reveal
    >
      <h2 id='picdesign-why-title'>
        {t('Why choose {{name}}', { name: props.systemName })}
      </h2>

      <div className='picdesign-why-grid' data-picdesign-reveal-children>
        {picDesignWhyCards.map((feature) => {
          const Icon = picDesignIcons[feature.icon]
          return (
            <article key={feature.title}>
              <Icon aria-hidden='true' />
              <div>
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
            </article>
          )
        })}
      </div>
    </section>
  )
}

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

import claudeIcon from '../../assets/claude-color.svg'
import openaiIcon from '../../assets/openai.svg'
import {
  picDesignIcons,
  picDesignModelCards,
  PICDESIGN_MODEL_SQUARE_HREF,
  type PicDesignModelCard,
} from '../../picdesign-content'

function getModelIcon(
  model: PicDesignModelCard,
  GridIcon: typeof picDesignIcons.grid
) {
  if (model.provider === 'openai') {
    return <img src={openaiIcon} alt='' />
  }

  if (model.provider === 'claude') {
    return <img src={claudeIcon} alt='' />
  }

  return <GridIcon />
}

export function ModelsPanel() {
  const { t } = useTranslation()
  const GridIcon = picDesignIcons.grid

  return (
    <section
      className='picdesign-models-panel'
      aria-labelledby='picdesign-models-title'
      data-picdesign-reveal
    >
      <div className='picdesign-section-header'>
        <h2 id='picdesign-models-title'>{t('Supported models')}</h2>
        <Link to={PICDESIGN_MODEL_SQUARE_HREF}>
          {t('View all models')}
          <ChevronRight aria-hidden='true' />
        </Link>
      </div>

      <div className='picdesign-model-grid' data-picdesign-reveal-children>
        {picDesignModelCards.map((model) => (
          <article
            key={model.name}
            className={
              model.more
                ? 'picdesign-model-card picdesign-more-card'
                : 'picdesign-model-card'
            }
          >
            <span
              className={
                model.more
                  ? 'picdesign-model-icon picdesign-grid-icon'
                  : `picdesign-model-icon picdesign-${model.provider}-icon`
              }
              aria-hidden='true'
            >
              {getModelIcon(model, GridIcon)}
            </span>
            <div>
              <h3>{model.name}</h3>
              <p>{t(model.description)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

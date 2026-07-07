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
import { BookOpenText, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'

import heroIllustration from '../../assets/hero-illustration.webp'
import { usePicDesignReveal } from '../../hooks'
import {
  getPicDesignPrimaryAction,
  picDesignHero,
  picDesignIcons,
  picDesignTrustPills,
} from '../../picdesign-content'

import '../../picdesign-home.css'
import { ModelsPanel } from './models-panel'
import { PicDesignFooter } from './picdesign-footer'
import { PicDesignHeader } from './picdesign-header'
import { PixelTitle } from './pixel-title'
import { PricingSection } from './pricing-section'
import { WhySection } from './why-section'

type PicDesignHomeProps = {
  isAuthenticated: boolean
}

function isExternalHref(href: string): boolean {
  return href.startsWith('http')
}

export function PicDesignHome(props: PicDesignHomeProps) {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLDivElement>(null)
  const { systemName } = useSystemConfig()
  const { status } = useStatus()
  const docsHref =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'
  const primaryAction = getPicDesignPrimaryAction({
    isAuthenticated: props.isAuthenticated,
    registerEnabled: status?.register_enabled !== false,
    selfUseModeEnabled: Boolean(status?.self_use_mode_enabled),
  })

  usePicDesignReveal(rootRef)

  const docsButton = isExternalHref(docsHref) ? (
    <a
      className='picdesign-secondary-button'
      href={docsHref}
      target='_blank'
      rel='noopener noreferrer'
    >
      {t(picDesignHero.docsLabel)}
      <BookOpenText aria-hidden='true' />
    </a>
  ) : (
    <Link className='picdesign-secondary-button' to={docsHref}>
      {t(picDesignHero.docsLabel)}
      <BookOpenText aria-hidden='true' />
    </Link>
  )

  return (
    <div ref={rootRef} className='picdesign-home'>
      <div className='picdesign-page-shell'>
        <PicDesignHeader systemName={systemName} />

        <main>
          <section
            className='picdesign-hero-section'
            aria-labelledby='picdesign-hero-title'
          >
            <div className='picdesign-hero-copy'>
              <div className='picdesign-eyebrow'>
                <span className='picdesign-eyebrow-dot' aria-hidden='true' />
                {t(picDesignHero.eyebrow)}
              </div>

              <h1 id='picdesign-hero-title'>
                <PixelTitle text={systemName} />
                <span className='picdesign-hero-subtitle'>
                  {t(picDesignHero.subtitle)}
                </span>
              </h1>

              <p className='picdesign-hero-description'>
                {t(picDesignHero.description)}
                <br />
                {t(picDesignHero.savingsDescription)}{' '}
                <strong>{t(picDesignHero.savingsStrong)}</strong>
              </p>

              <div className='picdesign-hero-actions'>
                <Link
                  className='picdesign-primary-button'
                  to={primaryAction.href}
                >
                  {t(primaryAction.label)}
                  <ChevronRight aria-hidden='true' />
                </Link>
                {docsButton}
              </div>

              <div
                className='picdesign-trust-pills'
                aria-label={t('Service features')}
              >
                {picDesignTrustPills.map((pill) => {
                  const Icon = picDesignIcons[pill.icon]
                  return (
                    <span key={pill.title}>
                      <Icon aria-hidden='true' />
                      {t(pill.title)}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className='picdesign-hero-art' aria-hidden='true'>
              <img src={heroIllustration} alt='' />
            </div>
          </section>

          <ModelsPanel />
          <PricingSection />
          <WhySection systemName={systemName} />
        </main>
      </div>

      <PicDesignFooter systemName={systemName} />
    </div>
  )
}

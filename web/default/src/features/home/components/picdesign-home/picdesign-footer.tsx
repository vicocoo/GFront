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

import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'

import { picDesignFooterColumns } from '../../picdesign-content'

type PicDesignFooterProps = {
  systemName: string
}

function isExternalHref(href: string): boolean {
  return href.startsWith('http')
}

export function PicDesignFooter(props: PicDesignFooterProps) {
  const { t } = useTranslation()
  const { logo, footerHtml } = useSystemConfig()
  const { status } = useStatus()
  const currentYear = new Date().getFullYear()
  const docsHref =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'

  const legalEnabled = {
    '/user-agreement': Boolean(status?.user_agreement_enabled),
    '/privacy-policy': Boolean(status?.privacy_policy_enabled),
  }

  return (
    <footer className='picdesign-site-footer'>
      <div className='picdesign-footer-inner' data-picdesign-reveal-children>
        <div className='picdesign-footer-brand'>
          <Link className='picdesign-brand picdesign-dark-brand' to='/'>
            <span className='picdesign-brand-logo'>
              <img src={logo} alt={props.systemName} />
            </span>
            <span>{props.systemName}</span>
          </Link>
          <p>
            {t(
              'Professional AI API relay service that keeps leading AI capabilities within reach.'
            )}
          </p>
          {footerHtml ? (
            <div
              className='picdesign-custom-footer'
              dangerouslySetInnerHTML={{ __html: footerHtml }}
            />
          ) : null}
        </div>

        {picDesignFooterColumns.map((column) => (
          <div key={column.title} className='picdesign-footer-column'>
            <h2>{t(column.title)}</h2>
            {column.links.map((link) => {
              const href = link.href === 'docs' ? docsHref : link.href
              if (
                'legal' in link &&
                link.legal &&
                !legalEnabled[href as keyof typeof legalEnabled]
              ) {
                return null
              }
              if (isExternalHref(href)) {
                return (
                  <a
                    key={`${column.title}-${link.label}`}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {t(link.label)}
                  </a>
                )
              }
              return (
                <Link key={`${column.title}-${link.label}`} to={href}>
                  {t(link.label)}
                </Link>
              )
            })}
          </div>
        ))}

        <div className='picdesign-footer-column picdesign-status-column'>
          <h2>{t('Status')}</h2>
          <span className='picdesign-status-ok'>
            <i aria-hidden='true' />
            {t('Service operational')}
          </span>
          <Link to='/rankings'>
            {t('View status details')}
            <ChevronRight aria-hidden='true' />
          </Link>
        </div>
      </div>

      <div className='picdesign-footer-bottom'>
        <span>
          &copy; {currentYear} {props.systemName}.{' '}
          {t('footer.defaultCopyright')}
        </span>
        <span>
          <a
            href='https://github.com/QuantumNous/new-api'
            target='_blank'
            rel='noopener noreferrer'
          >
            {t('New API')}
          </a>
          . {t('footer.newapi.projectAttributionSuffix')}
        </span>
      </div>
    </footer>
  )
}

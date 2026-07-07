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
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/language-switcher'
import { HeaderLogo } from '@/components/layout/components/header-logo'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Skeleton } from '@/components/ui/skeleton'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { getPicDesignPrimaryAction } from '../../picdesign-content'

type PicDesignHeaderProps = {
  systemName: string
}

export function PicDesignHeader(props: PicDesignHeaderProps) {
  const { t } = useTranslation()
  const { logo, loading, logoLoaded } = useSystemConfig()
  const { status } = useStatus()
  const links = useTopNavLinks()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const user = useAuthStore((state) => state.auth.user)
  const isAuthenticated = Boolean(user)
  const registerEnabled = status?.register_enabled !== false
  const selfUseModeEnabled = Boolean(status?.self_use_mode_enabled)
  const primaryAction = getPicDesignPrimaryAction({
    isAuthenticated,
    registerEnabled,
    selfUseModeEnabled,
  })

  return (
    <header className='picdesign-site-header' aria-label={t('Main navigation')}>
      <Link className='picdesign-brand' to='/' aria-label={t('Home')}>
        <span className='picdesign-brand-logo'>
          {loading ? (
            <Skeleton className='size-full rounded-lg' />
          ) : (
            <HeaderLogo
              src={logo}
              alt={props.systemName}
              loading={loading}
              logoLoaded={logoLoaded}
              className='size-full rounded-lg object-contain'
            />
          )}
        </span>
        <span>{props.systemName}</span>
      </Link>

      <nav className='picdesign-nav-links' aria-label={t('Page navigation')}>
        {links.map((link) => {
          const isActive = pathname === link.href
          if (link.external) {
            return (
              <a
                key={`${link.href}-${link.title}`}
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  isActive && 'active',
                  link.disabled && 'disabled'
                )}
                aria-disabled={link.disabled}
              >
                {t(link.title)}
              </a>
            )
          }
          return (
            <Link
              key={`${link.href}-${link.title}`}
              to={link.href}
              disabled={link.disabled}
              className={cn(isActive && 'active', link.disabled && 'disabled')}
            >
              {t(link.title)}
            </Link>
          )
        })}
      </nav>

      <div className='picdesign-header-actions'>
        <LanguageSwitcher />
        {isAuthenticated ? (
          <>
            <Link className='picdesign-login-link' to='/dashboard'>
              {t('Console')}
            </Link>
            <ProfileDropdown />
          </>
        ) : (
          <>
            <Link className='picdesign-login-link' to='/sign-in'>
              {t('Sign in')}
            </Link>
            <Link className='picdesign-register-button' to={primaryAction.href}>
              {t(primaryAction.label)}
              <ChevronRight aria-hidden='true' />
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

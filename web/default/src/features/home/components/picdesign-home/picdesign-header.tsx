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
import { ChevronRight, Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/language-switcher'
import { HeaderLogo } from '@/components/layout/components/header-logo'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'
import { type TopNavLink, useTopNavLinks } from '@/hooks/use-top-nav-links'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { getPicDesignPrimaryAction } from '../../picdesign-content'

type PicDesignHeaderProps = {
  systemName: string
}

type PicDesignNavItemProps = {
  link: TopNavLink
  pathname: string
  onNavigate?: () => void
}

function PicDesignNavItem(props: PicDesignNavItemProps) {
  const isActive = props.pathname === props.link.href
  const className = cn(isActive && 'active', props.link.disabled && 'disabled')

  if (props.link.external) {
    return (
      <a
        href={props.link.href}
        target='_blank'
        rel='noopener noreferrer'
        className={className}
        aria-disabled={props.link.disabled}
        onClick={props.onNavigate}
      >
        {props.link.title}
      </a>
    )
  }

  return (
    <Link
      to={props.link.href}
      disabled={props.link.disabled}
      className={className}
      onClick={props.onNavigate}
    >
      {props.link.title}
    </Link>
  )
}

export function PicDesignHeader(props: PicDesignHeaderProps) {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
  let mobileAccountAction: ReactNode = null
  if (isAuthenticated) {
    mobileAccountAction = <ProfileDropdown />
  } else if (primaryAction.label !== 'Sign in') {
    mobileAccountAction = (
      <Link
        className='picdesign-mobile-auth-link'
        to='/sign-in'
        onClick={() => setMobileMenuOpen(false)}
      >
        {t('Sign in')}
      </Link>
    )
  }

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
        {links.map((link) => (
          <PicDesignNavItem
            key={`${link.href}-${link.title}`}
            link={link}
            pathname={pathname}
          />
        ))}
      </nav>

      <div className='picdesign-header-actions'>
        <div className='picdesign-desktop-actions'>
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
              <Link
                className='picdesign-register-button'
                to={primaryAction.href}
              >
                {t(primaryAction.label)}
                <ChevronRight aria-hidden='true' />
              </Link>
            </>
          )}
        </div>

        <Link
          className='picdesign-register-button picdesign-mobile-primary'
          to={primaryAction.href}
        >
          {t(isAuthenticated ? 'Console' : primaryAction.label)}
          <ChevronRight aria-hidden='true' />
        </Link>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant='ghost'
                size='icon-lg'
                className='picdesign-mobile-menu-trigger'
                aria-label={t('Main navigation')}
              />
            }
          >
            <Menu aria-hidden='true' />
          </SheetTrigger>
          <SheetContent
            className='picdesign-mobile-menu'
            showCloseButton={false}
          >
            <SheetClose
              render={
                <Button
                  variant='ghost'
                  size='icon-sm'
                  className='picdesign-mobile-menu-close'
                  aria-label={t('Close')}
                />
              }
            >
              <X aria-hidden='true' />
            </SheetClose>
            <SheetHeader className='picdesign-mobile-menu-header'>
              <SheetTitle>{props.systemName}</SheetTitle>
            </SheetHeader>

            <nav
              className='picdesign-mobile-nav-links'
              aria-label={t('Page navigation')}
            >
              {links.map((link) => (
                <PicDesignNavItem
                  key={`${link.href}-${link.title}`}
                  link={link}
                  pathname={pathname}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>

            <div className='picdesign-mobile-menu-footer'>
              <div className='picdesign-mobile-language'>
                <span>{t('Change language')}</span>
                <LanguageSwitcher />
              </div>
              {mobileAccountAction}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

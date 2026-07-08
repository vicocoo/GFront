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
import { useRef } from 'react'

import { cn } from '@/lib/utils'

import { usePixelTitle } from '../../hooks'

type PixelTitleProps = {
  text: string
  className?: string
}

export function PixelTitle(props: PixelTitleProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const layerRef = useRef<HTMLSpanElement>(null)

  usePixelTitle({
    text: props.text,
    rootRef,
    textRef,
    layerRef,
  })

  return (
    <span
      ref={rootRef}
      className={cn('picdesign-pixel-title', props.className)}
    >
      <span ref={textRef} className='picdesign-pixel-text'>
        {props.text}
      </span>
      <span
        ref={layerRef}
        className='picdesign-pixel-canvas'
        aria-hidden='true'
      />
    </span>
  )
}

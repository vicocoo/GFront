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
import heroBackground from '../../assets/hero-illustration-background.webp'
import heroChatgpt from '../../assets/hero-illustration-chatgpt.webp'
import heroClaude from '../../assets/hero-illustration-claude.webp'
import heroStarLower from '../../assets/hero-illustration-star-lower.webp'
import heroStarUpper from '../../assets/hero-illustration-star-upper.webp'

const heroLayers = [
  {
    className: 'picdesign-hero-chatgpt',
    src: heroChatgpt,
  },
  {
    className: 'picdesign-hero-claude',
    src: heroClaude,
  },
  {
    className: 'picdesign-hero-star picdesign-hero-star-lower',
    src: heroStarLower,
  },
  {
    className: 'picdesign-hero-star picdesign-hero-star-upper',
    src: heroStarUpper,
  },
] as const

export function HeroIllustration() {
  return (
    <div className='picdesign-hero-art-stack'>
      <img
        className='picdesign-hero-background'
        src={heroBackground}
        alt=''
        fetchPriority='high'
      />
      {heroLayers.map((layer) => (
        <img
          key={layer.className}
          className={`picdesign-hero-layer ${layer.className}`}
          src={layer.src}
          alt=''
        />
      ))}
    </div>
  )
}

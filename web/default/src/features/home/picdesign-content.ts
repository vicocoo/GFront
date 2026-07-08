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
import {
  Box,
  ChartNoAxesCombined,
  CircleDollarSign,
  Code2,
  Layers,
  LayoutGrid,
  Lock,
  RefreshCw,
  Shield,
  SquareTerminal,
  type LucideIcon,
  Wallet,
  Zap,
} from 'lucide-react'

export const PICDESIGN_MODEL_SQUARE_HREF = '/pricing'

export type PicDesignPrimaryAction = {
  href: '/dashboard' | '/sign-up' | '/sign-in'
  label: 'Go to Dashboard' | 'Get Started' | 'Sign in'
}

export type PicDesignPrimaryActionOptions = {
  isAuthenticated: boolean
  registerEnabled: boolean
  selfUseModeEnabled: boolean
}

export type PicDesignIconName =
  | 'box'
  | 'chart'
  | 'code'
  | 'dollar'
  | 'grid'
  | 'layers'
  | 'lock'
  | 'refresh'
  | 'shield'
  | 'terminal'
  | 'wallet'
  | 'zap'

export type PicDesignModelCard = {
  name: string
  description: string
  provider: 'openai' | 'claude' | 'more'
  more?: boolean
}

export type PicDesignPricingRow = {
  model: string
  officialPrice: string
  discountLabel: 'discount of'
  maximumSavings: string
}

export type PicDesignFeatureCard = {
  icon: PicDesignIconName
  title: string
  description: string
}

export type PicDesignFooterColumn = {
  title: string
  links: Array<{
    label: string
    href: string
    legal?: boolean
  }>
}

export const picDesignIcons: Record<PicDesignIconName, LucideIcon> = {
  box: Box,
  chart: ChartNoAxesCombined,
  code: Code2,
  dollar: CircleDollarSign,
  grid: LayoutGrid,
  layers: Layers,
  lock: Lock,
  refresh: RefreshCw,
  shield: Shield,
  terminal: SquareTerminal,
  wallet: Wallet,
  zap: Zap,
}

export const picDesignHero = {
  eyebrow: 'Stable / efficient / convenient',
  subtitle: 'API',
  description:
    'Stable AI model relay service supporting ChatGPT, Claude, and other mainstream models.',
  savingsDescription:
    'Pay as you go, with pricing as low as 3% of official rates.',
  savingsStrong: 'Save up to 97%.',
  docsLabel: 'View Docs',
} as const

export const picDesignTrustPills: PicDesignFeatureCard[] = [
  { icon: 'dollar', title: 'Pay as you go', description: '' },
  { icon: 'shield', title: 'Stable and reliable', description: '' },
  { icon: 'zap', title: 'Fast response', description: '' },
  { icon: 'lock', title: 'Private and secure', description: '' },
]

export const picDesignModelCards: PicDesignModelCard[] = [
  {
    name: 'GPT-5.5',
    description: 'Frontier coding and professional work',
    provider: 'openai',
  },
  {
    name: 'GPT-5.4',
    description: 'Affordable coding and professional work',
    provider: 'openai',
  },
  {
    name: 'Claude Fable 5',
    description: 'Long-running agent intelligence',
    provider: 'claude',
  },
  {
    name: 'Claude Opus 4.8',
    description: 'Complex agentic coding and enterprise work',
    provider: 'claude',
  },
  {
    name: 'More models',
    description: 'Continuously expanding',
    provider: 'more',
    more: true,
  },
]

export const picDesignPricingRows: PicDesignPricingRow[] = [
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
]

export const picDesignBillingFeatures: PicDesignFeatureCard[] = [
  {
    icon: 'layers',
    title: 'Usage-based billing',
    description: 'Pay for what you use\nNo minimum top-up',
  },
  {
    icon: 'chart',
    title: 'Real-time billing',
    description: 'Clear deductions\nTransparent usage',
  },
  {
    icon: 'wallet',
    title: 'Flexible recharge',
    description: 'Multiple payment options\nFast account crediting',
  },
]

export const picDesignWhyCards: PicDesignFeatureCard[] = [
  {
    icon: 'box',
    title: 'Stable and reliable',
    description: 'Multi-node load balancing\n99.9% availability target',
  },
  {
    icon: 'zap',
    title: 'Fast response',
    description: 'Global acceleration network\nAverage response under 1s',
  },
  {
    icon: 'lock',
    title: 'Private and secure',
    description: 'Request content is not stored\nEncrypted transport',
  },
  {
    icon: 'terminal',
    title: 'Developer friendly',
    description: 'OpenAI-compatible format\nSimple integration',
  },
  {
    icon: 'refresh',
    title: 'Always current',
    description: 'Tracks official updates\nNew models added quickly',
  },
]

export const picDesignFooterColumns: PicDesignFooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Model Square', href: PICDESIGN_MODEL_SQUARE_HREF },
      { label: 'Console', href: '/dashboard' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: 'docs' },
      { label: 'About', href: '/about' },
      { label: 'User Agreement', href: '/user-agreement', legal: true },
      { label: 'Privacy Policy', href: '/privacy-policy', legal: true },
    ],
  },
]

export function getPicDesignPrimaryAction(
  options: PicDesignPrimaryActionOptions
): PicDesignPrimaryAction {
  if (options.isAuthenticated) {
    return { href: '/dashboard', label: 'Go to Dashboard' }
  }

  if (options.registerEnabled && !options.selfUseModeEnabled) {
    return { href: '/sign-up', label: 'Get Started' }
  }

  return { href: '/sign-in', label: 'Sign in' }
}

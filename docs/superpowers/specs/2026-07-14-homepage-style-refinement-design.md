# Homepage Style Refinement Design

## Goal

Refine the existing PicDesign homepage without replacing its visual identity.
The work should make the header quieter, improve the mobile hero, and reduce
repetitive card treatment in content sections while preserving the warm grid,
pixel illustration, coral accent, and current homepage behavior.

## Scope

This change is limited to the default homepage rendered when
`HomePageContent` is empty:

- Top navigation layout, typography, and mobile navigation.
- Mobile hero spacing, actions, trust signals, and illustration framing.
- Supported-model, pricing, billing, and "why choose" content blocks.
- The two OpenAI model names shown in the illustrative pricing comparison.

The custom URL, HTML, and Markdown homepage paths remain unchanged.

## Non-Goals

- Do not redesign authenticated pages, the model square, or other public pages.
- Do not change backend APIs, status fields, authentication behavior, or routes.
- Do not replace the pixel hero illustration or the warm grid identity.
- Do not add a new font package or other frontend dependency.
- Do not make the illustrative homepage pricing rows live-priced.

## Design Principles

1. Keep the homepage recognizable. Refine hierarchy instead of introducing a
   third visual system.
2. Give the hero priority. Navigation and trust signals should support the
   message rather than compete with it.
3. Use one containing surface per content block. Prefer separators and quiet
   hover states over cards nested inside cards.
4. Preserve operational clarity. Model names, prices, and calls to action must
   remain easy to scan in every supported language.
5. Reuse existing assets and the bundled Public Sans variable font.

## Typography

The homepage currently declares `Inter`, but Inter is not bundled. Use the
already imported `Public Sans Variable` for Latin and Vietnamese glyphs, then
fall back to platform CJK fonts.

Homepage font stack:

```css
'Public Sans Variable', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC',
sans-serif
```

Header type scale:

| Element | Desktop | Mobile |
| --- | --- | --- |
| Brand | 24px / 700 | 20px / 700 |
| Navigation link | 15px / 600 | 16px / 600 in the menu sheet |
| Sign-in action | 15px / 600 | 16px / 600 in the menu sheet |
| Primary action | 15px / 700 | 14px / 700 |

Letter spacing remains `0`. Active navigation is communicated by color and an
underline, not by increasing font weight.

## Top Navigation

Desktop:

- Reduce header height from 112px to 80px.
- Reduce link gaps while keeping a centered navigation group.
- Keep the configured brand, dynamic navigation links, language switcher,
  authentication state, and primary action.
- Keep the current dark primary button and coral hover accent.

Mobile and narrow tablet:

- Use a single compact header row.
- Keep the brand and primary action visible.
- Move navigation links, language selection, and the secondary authentication
  action into a right-side sheet opened by a familiar menu icon.
- The sheet must have an accessible title, close control, focus management, and
  current-route indication.
- Long translated labels must wrap inside the sheet and never force horizontal
  page overflow.

## Mobile Hero

At 760px and below:

- Reduce vertical space above and within the hero.
- Keep the eyebrow compact and allow its text to wrap.
- Keep the two CTA buttons side by side where they fit; stack only below 430px.
- Keep the four trust signals in a 2-by-2 grid at common 390px mobile widths.
- Reduce trust-signal height and visual weight so the illustration appears
  sooner in the scroll sequence.
- Keep the illustration full-width and stable without horizontal overflow.

The desktop hero composition remains unchanged apart from the shorter header.

## Content Blocks

Supported models:

- Keep one bordered panel with a section header.
- Present model entries as columns separated by hairlines on desktop.
- Present entries as compact rows separated by hairlines on mobile.
- Remove individual card shadows and floating hover movement.

Pricing and billing:

- Keep the dark savings comparison as the primary evidence block.
- Keep the table structure and the disclaimer.
- Simplify the billing side into one supporting surface with feature separators
  instead of independent mini-cards.
- Preserve the `/pricing` destination for both pricing and model links.

Why choose:

- Replace five independent cards with one quiet section band.
- Use vertical separators on wide screens and horizontal separators on mobile.
- Keep icons, headings, and descriptions, but remove card shadows and lift
  effects.

Section rhythm:

- Use consistent top spacing between major homepage sections.
- Retain the grid background, but allow containing surfaces and separators to
  create hierarchy instead of adding more decorative cards.

## Pricing Model Copy

Update only the two requested model identifiers:

- `GPT-5.5` becomes `GPT-5.6 Sol`.
- `GPT-5.4` becomes `GPT-5.6 Terra`.

Model identifiers remain untranslated. Existing illustrative prices, discounts,
and the pricing disclaimer remain unchanged.

## Accessibility And Performance

- Use the existing Base UI sheet and button primitives for mobile navigation.
- Keep visible focus styles and semantic `header`, `nav`, `main`, and `section`
  elements.
- Icon-only controls require an accessible label.
- Preserve `prefers-reduced-motion` behavior.
- Reuse the bundled variable font and current icons; do not add assets or block
  the initial bundle with another font package.

## Verification

- Content behavior test covers the updated pricing model identifiers.
- `bun run i18n:sync` reports zero missing or untranslated keys.
- Type checking and lint pass for touched frontend files.
- The homepage production build succeeds.
- Browser checks at 1440px, 1024px, 760px, and 390px confirm:
  - no horizontal overflow;
  - compact desktop and mobile headers;
  - accessible mobile navigation;
  - a 2-by-2 trust grid at 390px;
  - readable price rows and content blocks;
  - no text overlap in Chinese and English.

## Expected Files

- `web/default/src/features/home/components/picdesign-home/picdesign-header.tsx`
- `web/default/src/features/home/components/picdesign-home/models-panel.tsx`
- `web/default/src/features/home/components/picdesign-home/pricing-section.tsx`
- `web/default/src/features/home/components/picdesign-home/why-section.tsx`
- `web/default/src/features/home/picdesign-content.ts`
- `web/default/src/features/home/picdesign-content.test.ts`
- `web/default/src/features/home/picdesign-home.css`

# Homepage PicDesign Migration Design

## Goal

Migrate the homepage from `F:\Tools\API Relay\PicDesign - copy` into the current `web/default` frontend as the default public homepage, while preserving the current project's backend-driven behavior and limiting changes to homepage-related frontend code.

## Source Page

The reference page is a static HTML/CSS/JS landing page with these visible elements:

- A warm beige grid background and compact header.
- A hero with a pixel-rendered brand title, subtitle, eyebrow, CTA buttons, trust pills, and `hero-illustration.webp`.
- A supported models panel with OpenAI and Claude model cards.
- A dark pricing section with a count-up savings headline, animated price table rows, and a billing card.
- A "why choose" grid with five feature cards.
- A dark footer with brand, columns, status, legal/copyright row, and social links.
- Motion behavior: initial hero cascade, pixel title reveal/twinkle, subtle illustration float, scroll reveal, staggered child reveal, price bar growth, count-up, and restrained hover interactions.

The migration should be visually close to the reference for the homepage body. The header and footer should adopt the reference style but keep the current project's behavior and backend integration.

## Current Project Context

The current default homepage lives at:

- `web/default/src/routes/index.tsx`
- `web/default/src/features/home/index.tsx`
- `web/default/src/features/home/components/*`
- `web/default/src/features/home/hooks/use-home-page-content.ts`

The existing homepage already supports backend-configured custom content:

- `/api/home_page_content` returns `OptionMap["HomePageContent"]`.
- If content is a URL, the homepage renders it in an iframe and posts theme/language messages.
- If content is HTML, the homepage renders isolated rich HTML.
- If content is Markdown, the homepage renders Markdown inside `PublicLayout`.

This behavior must remain intact. The migrated PicDesign homepage is only the default homepage shown when `HomePageContent` is empty.

The public header currently gets project state from:

- `useSystemConfig()` for `system_name`, `logo`, `footer_html`, currency flags, demo mode.
- `useTopNavLinks()` and `/api/status` `HeaderNavModules` for dynamic navigation.
- `useAuthStore()` for login state.
- `useStatus()` for docs link, legal links, registration switches, and pricing module access.

The model square route is:

- `web/default/src/routes/pricing/index.tsx`
- `web/default/src/features/pricing/index.tsx`

It already enforces `HeaderNavModules.pricing.enabled` and `requireAuth` in `beforeLoad`.

## Hard Requirements

- Do not make code changes outside homepage-related frontend files unless a tiny shared type/export is strictly required.
- Keep the `/api/home_page_content` custom homepage behavior unchanged.
- Do not display system notice, announcement, notification, theme switch, or theme customization controls on the migrated homepage.
- Keep the language switcher visible in the homepage header.
- Keep current project functionality for header and footer:
  - backend-configured site name and logo,
  - backend-configured navigation modules,
  - docs link,
  - login state,
  - auth entry points,
  - `footer_html`,
  - user agreement and privacy policy links.
- `View pricing details` and `View all models` must both link to `/pricing`.
- All user-facing copy must use i18n with `useTranslation()` / `t(...)`.
- Locale writes must follow the project i18n workflow: use the temporary `add-missing-keys.mjs` script, then run `bun run i18n:sync`; do not hand-edit locale JSON.
- Do not show system announcements or theme color/system functionality on the migrated homepage for now.
- Preserve responsive behavior and avoid text overlap at mobile and desktop sizes.
- Respect `prefers-reduced-motion`.

## Recommended Architecture

Implement the migration as a React homepage feature, not by embedding the static HTML wholesale.

Keep `Home` as the routing and backend-content gate:

1. Load custom homepage content with `useHomePageContent()`.
2. Show loading state while content is unresolved.
3. If backend content exists, keep the current URL/HTML/Markdown rendering behavior.
4. If backend content is empty, render the new PicDesign-inspired default homepage.

Add a dedicated default homepage component tree under `web/default/src/features/home/`:

- `components/picdesign-home/picdesign-home.tsx`: page composition and top-level layout.
- `components/picdesign-home/picdesign-header.tsx`: homepage-only public header styled like the reference, backed by current project navigation and auth behavior.
- `components/picdesign-home/picdesign-footer.tsx`: homepage-only footer styled like the reference, backed by system config and legal links.
- `components/picdesign-home/pixel-title.tsx`: pixel title rendering shell.
- `components/picdesign-home/models-panel.tsx`: supported models panel.
- `components/picdesign-home/pricing-section.tsx`: savings table and billing card.
- `components/picdesign-home/why-section.tsx`: benefits grid.
- `hooks/use-pixel-title.ts`: canvas sampling logic from the reference title script.
- `hooks/use-picdesign-reveal.ts`: scroll reveal, stagger assignment, pricing reveal, and count-up orchestration.
- `picdesign-content.ts`: editable copy/data arrays for hero, pills, models, pricing rows, billing features, why cards, footer sections.
- `picdesign-home.css`: scoped classes and keyframes for this homepage only.

Asset placement:

- Copy `hero-illustration.webp`, `openai.svg`, and `claude-color.svg` into a homepage-specific asset location, preferably `web/default/src/features/home/assets/`.
- Import assets from React components so Rsbuild fingerprints them.

## Header Behavior

The migrated homepage header should look closer to the reference:

- Beige transparent surface in the first viewport.
- Centered nav links with underline hover/active treatment.
- Dark filled primary action button.
- Compact mobile layout with horizontal nav or drawer behavior matched to the existing project where practical.

Functional behavior must come from the current app:

- Brand text uses `useSystemConfig().systemName`.
- Brand logo uses configured system logo through the same loaded logo behavior where practical.
- Nav links use `useTopNavLinks()` and dynamic backend modules.
- Docs link follows backend `docs_link`.
- Auth area:
  - authenticated user sees a dashboard/console entry or profile action consistent with current project behavior;
  - unauthenticated user sees sign-in and optional sign-up/register action depending on registration availability.
- Language switcher remains visible.
- Notification/announcement button is not rendered.
- Theme switch and theme customization entry are not rendered.

If reusing `PublicHeader` directly makes the visual migration too constrained, create a homepage-only header that reuses the same hooks and route behavior. Do not change the global `PublicHeader` style for other public pages.

## Footer Behavior

The migrated homepage footer should visually follow the dark reference footer, but remain integrated with the current project:

- Display system logo and system name.
- Use a translated product tagline.
- Keep legal links:
  - show User Agreement only when backend enables it;
  - show Privacy Policy only when backend enables it.
- Preserve project attribution behavior if required by the existing footer.
- If `footerHtml` is configured, render it in the footer area and keep legal/project attribution alongside it.
- Keep dark visual treatment from the reference.
- Do not hard-code ICP/filing text unless it comes from an existing backend field or footer HTML.

## Homepage Body Behavior

Hero:

- Pixel title should render the current `systemName` instead of hard-coded `GCG Code`.
- Subtitle and supporting copy should be data-driven and translated.
- Primary CTA:
  - authenticated users go to `/dashboard`;
  - unauthenticated users go to `/sign-up` when registration is enabled;
  - if registration is disabled or self-use mode is enabled, fall back to `/sign-in`.
- Secondary CTA links to docs using backend `docs_link` when present, otherwise a safe docs fallback.
- Trust pills are data-driven and translated.
- The illustration should match the reference asset and preserve responsive sizing.

Models panel:

- Model examples remain static marketing examples for the homepage.
- `View all models` links to `/pricing`.
- Cards and text are data-driven in `picdesign-content.ts`.

Pricing section:

- `View pricing details` links to `/pricing`.
- Price rows remain illustrative and include a translated note that actual prices are based on the model square/billing page.
- Count-up and row-bar animations trigger when the pricing section enters view.

Why section:

- Five cards should match the reference structure and motion.
- Text is data-driven and translated.

## Motion Design

Migrate the reference motion behavior with React-safe effects:

- `usePixelTitle`:
  - renders a hidden text layer into an offscreen canvas;
  - samples alpha values into positioned pixel nodes;
  - re-renders on font readiness and resize;
  - seeds color/noise deterministically from the title text.
- `usePicDesignReveal`:
  - assigns `--i` indexes to staggered children;
  - uses `IntersectionObserver` to add `is-in`;
  - reveals price rows and chips;
  - counts the savings figure once.
- Reduced motion:
  - no hidden content for reduced-motion users;
  - animation durations disabled or shortened;
  - counter should render final value directly.

## Styling Design

Use a homepage-scoped CSS file for complex reference styles and keyframes. This keeps the large landing-page visual system out of global `index.css`.

CSS requirements:

- Keep cards at 8px radius to match both the reference and project design guidance.
- Use the reference beige/dark/accent palette for this homepage only.
- Avoid changing global CSS variables or global body background.
- Put the page background on the homepage shell, not global `body`.
- Ensure mobile breakpoints do not overflow:
  - buttons stack below narrow widths;
  - model and why grids collapse;
  - the pricing table remains readable with compact columns;
  - pixel title has a mobile font-size cap.
- Use imported `lucide-react` icons for icon buttons and feature icons where available.

## Internationalization

All new copy must be wrapped in `t(...)` from `useTranslation()`.

Recommended key strategy:

- Use English source strings as keys, consistent with the existing locale files in this project.
- Keep model names and brands untranslated: OpenAI, GPT-4o, Claude, Anthropic, API.
- Translate all user-facing labels, descriptions, CTAs, notes, and footer column headings.
- For dynamic strings such as counts or percentages, keep placeholders intact.

Implementation must follow `i18n-translate`:

1. Add `t(...)` calls in components.
2. Create temporary `web/default/scripts/add-missing-keys.mjs`.
3. Populate all supported locales used by the project: `en`, `zh`, `zh-TW`, `fr`, `ja`, `ru`, `vi`.
4. Run the script from `web/default`.
5. Run `bun run i18n:sync`.
6. Verify no missing keys.
7. Delete temporary scripts.

If the project i18n script only documents six locales but the repository contains `zh-TW.json`, include `zh-TW` for this repository to keep locale files complete.

## Testing And Verification

Static verification:

- Run frontend type checking after TS/TSX changes.
- Run lint for touched frontend files or the project lint command.
- Run i18n sync after locale changes.
- Run production build.

Suggested commands:

- `cd web/default && bun run typecheck`
- `cd web/default && bun run lint`
- `cd web/default && bun run i18n:sync`
- `cd web/default && bun run build`

If `bun` is not on PATH in the current shell, locate the workspace runtime first and use the bundled Bun/Node-compatible path if available. Do not silently skip verification.

Browser verification:

- With empty `HomePageContent`, `/` renders the migrated homepage.
- With markdown `HomePageContent`, `/` renders Markdown as before.
- With HTML `HomePageContent`, `/` renders isolated HTML as before.
- With URL `HomePageContent`, `/` renders iframe as before and still posts theme/language messages.
- `View all models` and `View pricing details` navigate to `/pricing`.
- Pricing module disabled/requireAuth behavior remains governed by the existing `/pricing` route guard.
- Header:
  - language switcher visible;
  - notification/announcement control absent;
  - theme switch absent;
  - dynamic nav links match backend config;
  - authenticated/unauthenticated CTA behavior is correct.
- Footer:
  - system name/logo render;
  - legal links follow backend switches;
  - `footer_html` still renders when configured.
- Responsive snapshots:
  - desktop around 1440px;
  - tablet around 1024px;
  - mobile around 390px.
- Reduced-motion mode shows all content without hidden reveal states.

## Non-Goals

- Do not redesign the model square page.
- Do not change backend APIs.
- Do not change global public header/footer behavior on other routes.
- Do not expose announcements or theme customization on the migrated homepage.
- Do not make the illustrative price rows live-priced in this migration.
- Do not add new dependencies unless a current dependency cannot reasonably cover the behavior.

## Open Decisions

- Header implementation can be homepage-only rather than modifying `PublicHeader`. This is the preferred route if visual parity requires structural changes.
- Price/model marketing copy can remain static and editable in `picdesign-content.ts`; live price integration is intentionally out of scope.
- Social links in the reference footer should only be shown if backed by known project links or existing configured URLs. Otherwise omit them rather than adding dead links.

## Acceptance Criteria

- The default homepage visually matches the reference page closely, excluding intentional header/footer functional adaptations.
- The current project's custom homepage backend behavior remains unchanged.
- The homepage does not show announcements/notifications, theme switch, or theme customization controls.
- The language switcher remains visible.
- Both pricing/model links point to `/pricing`.
- New copy is maintainable from a central homepage content module and translated in all locale files.
- The implementation passes typecheck, lint, i18n sync, and build, or any inability to run these is reported with a concrete reason.

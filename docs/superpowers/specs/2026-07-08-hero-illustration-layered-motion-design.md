# PicDesign Hero Illustration Layered Motion Design

## Goal

Split the PicDesign homepage hero illustration into independent visual layers so the dialogue bubbles and star accents can animate separately while preserving the current layout, backend integration, and maintainability of the migrated homepage.

## Source Asset

The source PSD is `F:\Tools\图片\hero-illustration.psd`.

Layer mapping:

- `Background`: static base illustration, excluding the animated dialogue bubbles and stars.
- `图层 1`: ChatGPT dialogue bubble.
- `图层 2`: Claude dialogue bubble.
- `图层 3`: lower-left cross star.
- `图层 4`: upper-left cross star.

The PSD can be processed with `psd-tools` and Pillow. Each exported layer should keep the original PSD canvas size so all layers align with CSS alone and do not require hand-maintained pixel offsets.

## Export Strategy

Create separate homepage assets under `web/default/src/features/home/assets/`:

- `hero-illustration-background.webp`
- `hero-illustration-chatgpt.webp`
- `hero-illustration-claude.webp`
- `hero-illustration-star-lower.webp`
- `hero-illustration-star-upper.webp`

Export as WebP with transparency. Use quality `80` for the background and dialogue layers to balance size and clarity. Use the same WebP format for the star layers; if edge artifacts are visible, the stars can be switched to WebP lossless later because they are very small.

## Frontend Structure

Replace the single hero `<img>` with a focused `HeroIllustration` component:

- The component owns only the layered hero artwork markup.
- The background layer remains a normal image in document flow to preserve the current aspect ratio and responsive sizing.
- Dialogue and star layers are absolutely positioned over the background and use the same full-canvas dimensions as the background.
- All layers remain decorative with `aria-hidden='true'` inherited from the hero art wrapper.

## Motion Direction

Primary action: keep the hero illustration calm and readable while making the dialogue bubbles feel lightly suspended.

Motion hierarchy:

- The hero art wrapper keeps the existing entrance animation.
- ChatGPT and Claude bubbles float vertically with similar amplitude but different timing.
- ChatGPT floats upward first; Claude uses a phase offset so the two bubbles do not move in sync.
- The two star layers animate with slow opacity and brightness changes. Their delays are offset so one brightens while the other softens.
- Reduced-motion users should see all layers statically without continuous float or twinkle effects.

## Testing And Verification

Add a small component test to protect the layered structure:

- `HeroIllustration` renders one background layer.
- It renders two dialogue bubble layers with explicit layer class names.
- It renders two star layers with explicit layer class names.

Run targeted homepage tests, typecheck, lint on touched files, `git diff --check`, and a production build.

## Scope

Only the PicDesign homepage hero illustration is changed. No backend routes, settings, navigation behavior, pricing/model content, or pages outside the homepage are changed.

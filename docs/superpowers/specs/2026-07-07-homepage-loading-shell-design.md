# Homepage Loading Shell Design

## Problem

After the PicDesign homepage migration, the default homepage can briefly show
the previous public navigation during initial load. This happens before
`/api/home_page_content` finishes loading.

## Root Cause

`web/default/src/features/home/index.tsx` keeps the original custom homepage
loading branch:

- `useHomePageContent()` starts with `isLoaded = false`.
- While `isLoaded` is false, `Home` returns `PublicLayout`.
- `PublicLayout` always renders `PublicHeader`.
- Once `/api/home_page_content` returns an empty value, `Home` switches to
  `PicDesignHome`.

The old header is therefore a real first-render state, not only a local preview
artifact. Local preview can make it more visible when the API is slow, missing,
or returning errors.

## Selected Approach

Render `PicDesignHome` while custom homepage content is still loading. Keep the
existing custom content branches unchanged after loading completes.

The resulting flow:

1. While `HomePageContent` is loading, render `PicDesignHome`.
2. If custom content exists after loading, render the existing Markdown, HTML,
   or iframe content path.
3. If custom content is empty, continue rendering `PicDesignHome`.

This preserves backend custom homepage support while avoiding the old public
navigation flash for the default homepage.

## Alternatives Considered

- Neutral loading screen without `PublicLayout`: removes the old header flash,
  but creates a blank/loading first impression before the default homepage.
- Add a no-header option to `PublicLayout`: works, but expands the change into a
  shared public layout used by other public pages and increases merge risk.
- Remove custom homepage support from the default route: simplest visually, but
  violates the requirement to preserve backend-controlled custom homepage
  behavior.

## Scope

Only the default homepage route should change:

- `web/default/src/features/home/index.tsx`

No backend changes, no route changes, no `PublicLayout` changes, and no i18n
changes are needed.

## Merge And Maintenance Notes

The change is intentionally small and localized. Future conflicts are likely
only if another branch also edits the default homepage loading branch. Custom
homepage rendering remains centralized in the same component, so later changes
to Markdown, HTML, iframe, or PicDesign defaults remain easy to review.

## Verification

Run:

- `bun run typecheck`
- scoped `oxlint` for `src/features/home/index.tsx`
- `git diff --check`
- `bun run build`

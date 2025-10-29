# Add Conditional CV Visibility

## Why

The CV page is currently always visible at `/cv`, which may not be desirable when not actively job hunting. We need a way to control CV visibility while still being able to share direct links with recruiters and potential employers when needed.

## What Changes

- Add a configuration-based visibility toggle for the CV page
- Implement "shareable but not discoverable" mode where CV is accessible via direct link but not linked from navigation/homepage
- Add "fully visible" mode for active job seeking where CV is linked from site navigation
- Add "fully hidden" mode where CV returns 404 (optional, for completeness)
- Store visibility configuration in a simple, git-committable format (e.g., environment variable or config file)

## Impact

- **Affected specs**: `cv-visibility` (new capability)
- **Affected code**: 
  - `src/pages/cv.astro` - May need conditional rendering logic
  - `src/layouts/SidebarLayout.astro` - May need conditional navigation links
  - `src/pages/index.astro` - May need conditional CV link
  - Configuration file (new) - e.g., `astro.config.mjs` or `.env`
- **User impact**: CV can be kept private by default, shared via direct link when needed, or made fully public during job search
- **SEO impact**: When in "shareable" mode, CV won't be indexed by search engines unless explicitly shared

## Implementation Approach

Three visibility modes:
1. **hidden**: CV returns 404 or redirect (completely inaccessible)
2. **shareable**: CV accessible via direct URL but not linked from site (default)
3. **public**: CV fully visible and linked from navigation/homepage

Configuration via environment variable or astro.config.mjs to allow easy toggling via git commits or deployment settings.


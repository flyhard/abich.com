## 1. Configuration Setup
- [x] 1.1 Add CV visibility configuration to `astro.config.mjs` or create `.env` file
- [x] 1.2 Define three modes: `hidden`, `shareable`, `public`
- [x] 1.3 Set default mode to `shareable`
- [x] 1.4 Document configuration in README.md

## 2. CV Page Logic
- [x] 2.1 Update `src/pages/cv.astro` to read visibility configuration
- [x] 2.2 Implement redirect/404 logic for `hidden` mode
- [x] 2.3 Add `<meta name="robots" content="noindex">` for `shareable` mode
- [x] 2.4 Keep normal behavior for `public` mode

## 3. Navigation Updates
- [x] 3.1 Update `src/layouts/SidebarLayout.astro` to conditionally show CV link
- [x] 3.2 Only show CV link in navigation when mode is `public`
- [x] 3.3 Update `src/pages/index.astro` to conditionally show CV link
- [x] 3.4 Test navigation in all three modes

## 4. Testing & Documentation
- [x] 4.1 Test CV access in `hidden` mode (should 404 or redirect)
- [x] 4.2 Test CV access in `shareable` mode (accessible but not linked)
- [x] 4.3 Test CV access in `public` mode (fully visible and linked)
- [x] 4.4 Verify SEO meta tags are correct
- [x] 4.5 Update project documentation with visibility toggle instructions


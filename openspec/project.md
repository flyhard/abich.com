# Project Context

## Purpose
Personal homepage and CV website for abich.com. The site serves as a professional portfolio and includes:
- Landing page
- Interactive CV/resume page
- Welcome page
- Custom shipman28 page

The site is hosted on GitHub Pages with a custom domain (abich.com).

## Tech Stack
- **Astro 5.15.2** - Static site generator
- **TypeScript** - Type-safe JavaScript
- **Astro Components** - Component-based architecture (.astro files)

## Project Conventions

### Code Style
- Use `.astro` components for UI elements
- Follow Astro's component structure (frontmatter, template, styles)
- TypeScript for type safety where applicable
- Component names in PascalCase (e.g., `CVHeader.astro`, `CVExperienceList.astro`)

### Architecture Patterns
- **Layouts**: Reusable page layouts in `src/layouts/`
  - `Layout.astro` - Base layout
  - `SidebarLayout.astro` - Layout with sidebar
- **Components**: Modular UI components in `src/components/`
  - CV-related components prefixed with `CV`
  - Reusable components like `Welcome.astro`
- **Pages**: Route-based pages in `src/pages/`
  - File-based routing (e.g., `cv.astro` → `/cv`)
- **Assets**: Static assets in `src/assets/` and `public/`
  - `public/` for files that don't need processing (favicon, CNAME)
  - `src/assets/` for assets that may be optimized by Astro

### Testing Strategy
Currently no automated testing framework configured. Manual testing for static site generation.

### Git Workflow
- Main branch: `main`
- Deployed automatically via GitHub Actions to GitHub Pages
- Active workflow: `.github/workflows/deploy.yml` (note: plural "workflows")
- Deprecated workflow exists at `.github/workflow/deploy.yml` (singular) - can be deleted

## Domain Context
Personal website for professional portfolio and CV presentation. Focus on clean, accessible design and fast static site performance.

## Important Constraints
- Static site only (no server-side rendering)
- Must deploy to GitHub Pages
- Custom domain configuration via CNAME file in `public/`
- Site URL: https://abich.com

## External Dependencies
- GitHub Pages for hosting
- GitHub Actions for CI/CD deployment
- Astro build toolchain


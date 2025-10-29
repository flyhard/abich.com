## Context

The CV page is currently always public at `/cv`. The owner wants flexibility to:
- Keep CV accessible via direct link (for sharing with recruiters) without advertising it
- Make CV fully public during active job search
- Optionally hide CV completely when not relevant

This is a static site built with Astro and deployed to GitHub Pages, so server-side logic is not available. All visibility control must happen at build time.

## Goals / Non-Goals

**Goals:**
- Simple configuration to toggle CV visibility modes
- Three distinct modes: hidden, shareable (unlisted), public
- Git-committable configuration for deployment flexibility
- SEO control (noindex for shareable mode)
- No breaking changes to existing CV functionality

**Non-Goals:**
- Password protection or authentication (static site limitation)
- Dynamic runtime visibility toggling
- User-specific access control
- Analytics tracking of who accesses CV

## Decisions

### Decision 1: Configuration Method
**Choice**: Use environment variable with fallback in `astro.config.mjs`

**Rationale:**
- Astro's `import.meta.env` provides build-time environment variables
- Can be overridden at deployment without code changes
- Fallback value in config ensures safe default
- Follows Astro best practices

**Alternatives considered:**
- Separate config file: Adds complexity, not needed for single setting
- Hardcoded constant: Less flexible for different deployments
- `.env` file only: Not as idiomatic for Astro projects

### Decision 2: Visibility Modes
**Choice**: Three string modes: `"hidden"`, `"shareable"`, `"public"`

**Rationale:**
- Clear, self-documenting values
- Covers all use cases identified
- Easy to extend if needed

**Default**: `"shareable"` - Safe default that allows sharing without advertising

### Decision 3: Hidden Mode Implementation
**Choice**: Return 404 page using Astro's standard 404 handling

**Rationale:**
- Clean, expected behavior for hidden content
- No need for custom error page
- Works with static site deployment
- SEO-friendly (search engines understand 404)

**Alternative considered:**
- Redirect to homepage: Less clear, may confuse users with direct link

### Decision 4: Shareable Mode Implementation
**Choice**: Render page normally but add `<meta name="robots" content="noindex, nofollow">`

**Rationale:**
- Page is accessible but won't be indexed by search engines
- Simple to implement in Astro's `<head>` section
- Standard SEO practice for unlisted content
- No JavaScript required

### Decision 5: Navigation Link Control
**Choice**: Conditionally render navigation links based on mode

**Rationale:**
- Keeps implementation simple (no conditional logic in multiple places)
- Clear separation between "accessible" and "discoverable"
- Easy to test and maintain

## Implementation Details

### Configuration Structure
```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://abich.com',
  // Access as import.meta.env.CV_VISIBILITY in components
});
```

```env
# .env or deployment environment
CV_VISIBILITY=shareable  # or "hidden" or "public"
```

### CV Page Logic (src/pages/cv.astro)
```astro
---
const cvVisibility = import.meta.env.CV_VISIBILITY || 'shareable';

if (cvVisibility === 'hidden') {
  return Astro.redirect('/404');
}

const robotsMeta = cvVisibility === 'shareable' 
  ? 'noindex, nofollow' 
  : 'index, follow';
---
<html>
  <head>
    <meta name="robots" content={robotsMeta} />
    <!-- rest of head -->
  </head>
  <!-- rest of CV page -->
</html>
```

### Navigation Logic
```astro
---
const cvVisibility = import.meta.env.CV_VISIBILITY || 'shareable';
const showCvLink = cvVisibility === 'public';
---
{showCvLink && <a href="/cv">CV</a>}
```

## Risks / Trade-offs

### Risk: Direct link sharing in hidden mode
- **Issue**: If someone has the link and mode changes to "hidden", they'll get 404
- **Mitigation**: Document mode changes in deployment notes; "shareable" is safer default

### Risk: Browser/link preview caching
- **Issue**: Link previews (Discord, Slack) may cache CV even in shareable mode
- **Mitigation**: Acceptable trade-off; owner controls who they share link with

### Trade-off: No runtime toggling
- **Issue**: Mode change requires rebuild and redeploy
- **Acceptance**: This is inherent to static sites; deployment is automated via GitHub Actions

### Trade-off: No password protection
- **Issue**: Anyone with direct link can access CV in shareable mode
- **Acceptance**: Acceptable for this use case; owner can control link distribution

## Migration Plan

1. Add configuration with default "shareable" mode
2. Deploy changes (no impact on existing CV visibility)
3. Document how to change modes for future deployments
4. Test all three modes in preview environment before production

**Rollback**: Remove environment variable check, CV returns to always-public behavior

## Open Questions

- Should we add a visual indicator on CV page when in "shareable" mode? (e.g., "This page is unlisted")
- Should we log/track when CV is accessed? (Would require external analytics, out of scope)
- Do we need a fourth mode like "password-protected"? (Not feasible with static site, skip for now)


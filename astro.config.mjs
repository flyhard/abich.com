// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Assumption: This site will live at https://abich.com (custom domain configured in GitHub Pages)
  // Change if different (e.g., https://username.github.io or project URL)
  site: 'https://abich.com',

  // CV visibility now read directly via import.meta.env.CV_VISIBILITY with fallback logic in helper.
});

# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🔒 CV Visibility Configuration

The CV page (`/cv`) supports three visibility modes to control when and how it's accessible:

### Visibility Modes

1. **`shareable`** (default) - CV is accessible via direct URL but not linked in navigation
   - Perfect for sharing with recruiters via direct link
   - Includes `noindex, nofollow` meta tags to prevent search engine indexing
   - Not discoverable through site navigation

2. **`public`** - CV is fully visible and linked from site navigation
   - Use when actively job seeking
   - CV link appears in navigation menu
   - Indexed by search engines

3. **`hidden`** - CV returns 404 (completely inaccessible)
   - Use for complete privacy
   - Direct links will show 404 page

### Configuration

Set the visibility mode in your `.env` file:

```bash
CV_VISIBILITY=shareable  # or "public" or "hidden"
```

Or override at deployment time with environment variables:

```bash
CV_VISIBILITY=public npm run build
```

### Examples

**During job search:**
```bash
# Edit .env
CV_VISIBILITY=public

# Build and deploy
npm run build
```

**Share with specific recruiters:**
```bash
# Edit .env
CV_VISIBILITY=shareable

# Build and deploy
npm run build

# Share direct link: https://abich.com/cv
```

**Complete privacy:**
```bash
# Edit .env
CV_VISIBILITY=hidden

# Build and deploy
npm run build
```

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

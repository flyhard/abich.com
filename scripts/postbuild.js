#!/usr/bin/env node
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const mode = process.env.CV_VISIBILITY || 'shareable';
if (mode === 'hidden') {
  const cvPath = join(process.cwd(), 'dist', 'cv');
  if (existsSync(cvPath)) {
    rmSync(cvPath, { recursive: true, force: true });
    console.log(`[postbuild] Removed CV output because CV_VISIBILITY=hidden`);
  } else {
    console.log('[postbuild] CV output not present; nothing to remove');
  }
} else {
  console.log(`[postbuild] CV visibility mode '${mode}' retained CV page.`);
}


export const SEASON_ANCHORS: Record<string, { month: number; day: number }> = {
  winterize: { month: 9, day: 15 }, // Oct (0-based month index 9) 15 assumed winterization start
  commission: { month: 3, day: 15 } // Apr (0-based 3) 15 assumed commissioning prep
};

export function nextSeasonAnchor(season: string, reference = new Date()): Date {
  const anchor = SEASON_ANCHORS[season];
  if (!anchor) return reference;
  const currentYear = reference.getFullYear();
  const candidate = new Date(Date.UTC(currentYear, anchor.month, anchor.day));
  if (candidate.getTime() <= reference.getTime()) {
    return new Date(Date.UTC(currentYear + 1, anchor.month, anchor.day));
  }
  return candidate;
}


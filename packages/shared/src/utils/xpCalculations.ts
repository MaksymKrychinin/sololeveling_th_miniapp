/**
 * Calculate XP required for a given level
 * Formula: XP = 100 * level^1.5
 */
export function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate user level based on total XP
 */
export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpAccumulated = 0;
  
  while (xpAccumulated + calculateXPForLevel(level) <= totalXP) {
    xpAccumulated += calculateXPForLevel(level);
    level++;
  }
  
  return level;
}

/**
 * Get rank title for a given level
 */
export function getRankTitle(level: number): string {
  const ranks = [
    { level: 200, title: 'Shadow Monarch' },
    { level: 150, title: 'National Level Hunter' },
    { level: 100, title: 'S-Rank Hunter' },
    { level: 75, title: 'A-Rank Hunter' },
    { level: 50, title: 'B-Rank Hunter' },
    { level: 25, title: 'C-Rank Hunter' },
    { level: 10, title: 'D-Rank Hunter' },
    { level: 1, title: 'E-Rank Hunter' },
  ];
  
  const rank = ranks.find((r) => level >= r.level);
  return rank?.title || 'E-Rank Hunter';
}

/**
 * Calculate XP progress percentage for current level
 */
export function calculateXPProgress(currentXP: number, level: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const required = calculateXPForLevel(level);
  const percentage = Math.min((currentXP / required) * 100, 100);
  
  return {
    current: currentXP,
    required,
    percentage,
  };
}

/**
 * Calculate total XP from level and current XP
 */
export function calculateTotalXP(level: number, currentXP: number): number {
  let totalXP = currentXP;
  
  for (let i = 1; i < level; i++) {
    totalXP += calculateXPForLevel(i);
  }
  
  return totalXP;
}

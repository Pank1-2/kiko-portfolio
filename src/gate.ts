let unlocked = false;

export const LOCKED_CASES = new Set(["expert-advice", "alert-monitor"]);

export function isLockedCase(slug: string) {
  return LOCKED_CASES.has(slug);
}

export function isCaseUnlocked() {
  return unlocked;
}

export function unlockCases() {
  unlocked = true;
}

export function passwordMatches(value: string) {
  return value.trim().toLowerCase() === "catnip";
}

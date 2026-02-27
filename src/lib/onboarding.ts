const CHECKLIST_DISMISSED_KEY = "onboarding_checklist_dismissed";
const INVITE_VISITED_KEY = "onboarding_invite_visited";
const HINT_PREFIX = "hint_dismissed_";

function getItem(key: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) === "true";
}

function setItem(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, "true");
}

export function isChecklistDismissed(): boolean {
  return getItem(CHECKLIST_DISMISSED_KEY);
}

export function dismissChecklist(): void {
  setItem(CHECKLIST_DISMISSED_KEY);
}

export function hasVisitedInvite(): boolean {
  return getItem(INVITE_VISITED_KEY);
}

export function markInviteVisited(): void {
  setItem(INVITE_VISITED_KEY);
}

export function isHintDismissed(hintKey: string): boolean {
  return getItem(`${HINT_PREFIX}${hintKey}`);
}

export function dismissHint(hintKey: string): void {
  setItem(`${HINT_PREFIX}${hintKey}`);
}

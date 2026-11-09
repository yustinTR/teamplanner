/**
 * Google Play closed test. A personal developer account needs 12 testers
 * opted in for 14 days before the app may go to production.
 */
export const TESTER_GROUP_URL = "https://groups.google.com/g/myteamplanner-android-testers";
export const TESTER_OPT_IN_URL = "https://play.google.com/apps/testing/nl.myteamplanner.app";
export const ANDROID_PAGE_URL = "https://www.myteamplanner.nl/android";
export const TESTERS_NEEDED = 12;
export const TEST_DAYS = 14;

export const TESTER_SHARE_TEXT =
  `Gebruik je Android? Help MyTeamPlanner de Play Store in: Google zoekt ${TESTERS_NEEDED} testers ` +
  `die de app ${TEST_DAYS} dagen op hun telefoon hebben. Twee klikken, gratis: ${ANDROID_PAGE_URL}`;

export function whatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

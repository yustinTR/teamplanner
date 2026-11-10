/**
 * Ready-made reminder a coach shares (WhatsApp, etc.) for players who have
 * not yet said whether they can play.
 */

interface ReminderContext {
  opponent: string;
  matchDate: string;
  homeAway: "home" | "away";
  /** Link to the match in the app, where players answer. */
  matchUrl: string;
}

const TIME_ZONE = "Europe/Amsterdam";

/** "Tom, Sem en Daan" */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} en ${names[names.length - 1]}`;
}

export function availabilityReminderText(names: string[], context: ReminderContext): string {
  const date = new Date(context.matchDate);
  const day = date.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", timeZone: TIME_ZONE });
  const time = date.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE });
  const side = context.homeAway === "home" ? "thuis" : "uit";

  return [
    `Wie kan er ${day} mee tegen ${context.opponent}? (${time}, ${side})`,
    "",
    `Nog geen reactie van ${joinNames(names)}.`,
    `Geef het even door in de app: ${context.matchUrl}`,
    "Of laat het hier weten. Dank je!",
  ].join("\n");
}

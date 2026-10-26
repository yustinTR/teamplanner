/**
 * Green footer strip for shared images. Inline styles only: html2canvas
 * renders these cards off-screen, where Tailwind tokens are not reliable.
 * Expects the parent card to have 24px padding; the negative margins pull
 * the strip to the card's edges.
 */
export function MadeWithStrip() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        margin: "20px -24px -24px",
        padding: "12px 24px",
        background: "#16A34A",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- html2canvas needs a plain img */}
        <img
          src="/icons/icon-512x512.png"
          alt=""
          width={24}
          height={24}
          style={{ borderRadius: 6, display: "block" }}
        />
        <span style={{ fontSize: 13, fontWeight: 700 }}>Gemaakt met MyTeamPlanner</span>
      </div>
      <span style={{ fontSize: 11, opacity: 0.9 }}>myteamplanner.nl · gratis voor je team</span>
    </div>
  );
}

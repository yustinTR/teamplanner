import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #065f46 0%, #059669 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Pitch lines background */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.08)",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Football icon */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 512 512"
              fill="none"
            >
              <circle cx="256" cy="256" r="200" fill="white" />
              <polygon
                points="256,200 290,222 278,260 234,260 222,222"
                fill="#065f46"
              />
              <line x1="256" y1="200" x2="256" y2="148" stroke="#0d7a5f" strokeWidth="6" />
              <line x1="290" y1="222" x2="334" y2="196" stroke="#0d7a5f" strokeWidth="6" />
              <line x1="278" y1="260" x2="318" y2="294" stroke="#0d7a5f" strokeWidth="6" />
              <line x1="234" y1="260" x2="194" y2="294" stroke="#0d7a5f" strokeWidth="6" />
              <line x1="222" y1="222" x2="178" y2="196" stroke="#0d7a5f" strokeWidth="6" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            MyTeamPlanner
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 700,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            De gratis teamplanner voor amateurvoetbal
          </div>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 12,
            }}
          >
            {["Wedstrijden", "Opstellingen", "Beschikbaarheid", "Wissels"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 22,
            color: "rgba(255,255,255,0.4)",
            fontWeight: 500,
          }}
        >
          myteamplanner.nl
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

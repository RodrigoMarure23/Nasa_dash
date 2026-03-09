import { GlobeIcon, RadioIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function Header({ t, language, toggleLanguage }) {
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const mexicoTime = now.toLocaleString("es-MX", {
        timeZone: "America/Mexico_City",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "short",
      });

      setUtcTime(mexicoTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleKeyToggle = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleLanguage();
    }
  };

  return (
    <header
      role="banner"
      aria-label="Dashboard header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        backgroundColor: "rgba(10, 14, 26, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* LEFT SECTION */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "14px" }}
        aria-label="Application title"
      >
        {/* Logo */}
        <div
          aria-hidden="true"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-cyan), #2563eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 18px var(--glow-cyan)",
            animation: "pulseLogo 4s ease-in-out infinite",
          }}
        >
          <GlobeIcon
            aria-hidden="true"
            style={{ width: "18px", height: "18px", color: "#ffffff" }}
          />
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "var(--text-primary)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {t("title")}
          </h1>

          <span
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
            }}
          >
            Near-Earth Object Monitoring
          </span>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* LIVE indicator */}
        <div
          aria-live="polite"
          aria-label="Live monitoring active"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--text-muted)",
            fontFamily: "monospace",
          }}
        >
          <RadioIcon
            aria-hidden="true"
            style={{
              width: "14px",
              height: "14px",
              color: "#22c55e",
              animation: "pulseLive 2s infinite",
            }}
          />
          <span>LIVE</span>
        </div>

        {/* Clock */}
        <time
          aria-live="polite"
          aria-label={`Current time in Mexico City ${utcTime}`}
          style={{
            fontSize: "12px",
            fontFamily: "monospace",
            color: "var(--text-muted)",
          }}
        >
          CDMX {utcTime}
        </time>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          onKeyDown={handleKeyToggle}
          className="btn-hover"
          aria-label="Toggle language"
          aria-pressed={language === "es"}
          tabIndex={0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            borderRadius: "9999px",
            backgroundColor: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            color: "var(--text-secondary)",
            fontSize: "0.8rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <GlobeIcon
            aria-hidden="true"
            style={{
              width: "14px",
              height: "14px",
              color: "var(--accent-cyan)",
            }}
          />
          {language.toUpperCase()}
        </button>
      </div>
    </header>
  );
}

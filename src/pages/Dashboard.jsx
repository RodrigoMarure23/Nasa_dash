import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { useNasaApi } from "../hooks/useNasaApi";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { ScatterChartSection } from "../components/ScatterChartSection";
import { BarChartSection } from "../components/BarChartSection";
import { Loader2Icon, AlertCircleIcon, InfoIcon } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import AsteroidAnimation from "../components/AsteroidAnimation";

import Radar from "../components/Radar";
import MissionPanel from "../components/MisionPanel";

const formatDate = (date) => date.toISOString().split("T")[0];

const getDaysBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.abs(e - s);
  return diff / (1000 * 60 * 60 * 24);
};

export function Dashboard() {
  const { t, language, toggleLanguage } = useTranslation();

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const [filters, setFilters] = useState({
    startDate: formatDate(today),
    endDate: formatDate(nextWeek),
    showDangerous: null,
    magnitudeRange: [15, 30],
  });

  const [selectedAsteroid, setSelectedAsteroid] = useState(null);

  const handleSelectAsteroid = (asteroid) => {
    setSelectedAsteroid(asteroid);
  };
  const showDashboardInfo = () => {
    Swal.fire({
      title: t("dashboardInfoTitle"),
      html: t("dashboardInfoContent"),
      confirmButtonColor: "#06b6d4",
      background: "#0a0e1a",
      color: "#e2e8f0",
    });
  };
  const daysRange = getDaysBetween(filters.startDate, filters.endDate);

  if (daysRange > 7) {
    Swal.fire({
      icon: "warning",
      title: "NASA API Limit",
      text: "The asteroid feed only allows a maximum range of 7 days.",
      confirmButtonColor: "#06b6d4",
      background: "#0a0e1a",
      color: "#e2e8f0",
    });
  }

  const { asteroids, dailyCounts, loading, error } = useNasaApi(
    filters.startDate,
    filters.endDate,
  );

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "NASA API Error",
        text: error,
        confirmButtonColor: "#ef4444",
        background: "#0a0e1a",
        color: "#e2e8f0",
      });
    }
  }, [error]);

  const filteredAsteroids = useMemo(() => {
    return asteroids.filter((a) => {
      if (
        filters.showDangerous !== null &&
        a.isHazardous !== filters.showDangerous
      )
        return false;

      if (
        a.magnitude < filters.magnitudeRange[0] ||
        a.magnitude > filters.magnitudeRange[1]
      )
        return false;

      return true;
    });
  }, [asteroids, filters.showDangerous, filters.magnitudeRange]);

  const featuredAsteroid = useMemo(() => {
    if (!filteredAsteroids.length) return null;

    return filteredAsteroids.reduce((biggest, current) =>
      current.diameter > biggest.diameter ? current : biggest,
    );
  }, [filteredAsteroids]);

  const asteroidToDisplay = selectedAsteroid || featuredAsteroid;

  const filteredDailyCounts = useMemo(() => {
    const countsByDate = {};

    filteredAsteroids.forEach((a) => {
      if (!countsByDate[a.date]) {
        countsByDate[a.date] = { safeCount: 0, hazardousCount: 0 };
      }

      if (a.isHazardous) countsByDate[a.date].hazardousCount++;
      else countsByDate[a.date].safeCount++;
    });

    return dailyCounts.map((day) => ({
      ...day,
      safeCount: countsByDate[day.rawDate]?.safeCount || 0,
      hazardousCount: countsByDate[day.rawDate]?.hazardousCount || 0,
      count:
        (countsByDate[day.rawDate]?.safeCount || 0) +
        (countsByDate[day.rawDate]?.hazardousCount || 0),
    }));
  }, [filteredAsteroids, dailyCounts]);

  return (
    <div
      className="bg-stars"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        minWidth: "100vw",
      }}
    >
      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>
      <Header t={t} language={language} toggleLanguage={toggleLanguage} />

      <main
        id="main-content"
        aria-label="Asteroid monitoring dashboard"
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "24px",
          width: "100%",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={showDashboardInfo}
            className="btn-hover"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <InfoIcon size={16} />
            {t("info")}
          </button>
        </div>

        <div className="dashboard-layout">
          <Sidebar
            t={t}
            filters={filters}
            setFilters={setFilters}
            asteroids={filteredAsteroids}
          />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              minWidth: 100,
            }}
          >
            {loading ? (
              <div
                role="status"
                aria-live="polite"
                aria-busy="true"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "400px",
                  backgroundColor: "rgba(15, 15, 42, 0.4)",
                  backdropFilter: "blur(4px)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                }}
              >
                <Loader2Icon
                  className="animate-spin-fast"
                  style={{
                    width: "40px",
                    height: "40px",
                    color: "var(--accent-cyan)",
                    marginBottom: "16px",
                  }}
                />

                <p
                  className="animate-pulse-custom"
                  style={{ color: "var(--text-muted)", margin: 0 }}
                >
                  {t("loading")}
                </p>
              </div>
            ) : error ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "400px",
                  backgroundColor: "rgba(15, 23, 42, 0.4)",
                  backdropFilter: "blur(4px)",
                  borderRadius: "12px",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                }}
              >
                <AlertCircleIcon
                  style={{
                    width: "48px",
                    height: "48px",
                    color: "var(--accent-red)",
                    marginBottom: "16px",
                  }}
                />

                <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
                  {t("error")}
                </p>

                <button
                  onClick={() => window.location.reload()}
                  className="btn-hover"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-primary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                  }}
                >
                  {t("retry")}
                </button>
              </div>
            ) : (
              <section
                aria-labelledby="scatter-chart-title"
                role="region"
                style={{ width: "100%", minWidth: 100 }}
              >
                <ScatterChartSection
                  className="chart-section"
                  t={t}
                  data={filteredAsteroids}
                  onSelectAsteroid={handleSelectAsteroid}
                  selectedAsteroid={selectedAsteroid}
                />

                <div className="chart-grid">
                  <div>
                    <BarChartSection t={t} data={filteredDailyCounts} />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="decorative-asteroid"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "12px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        width: "clamp(120px,25vw,180px)",
                        height: "clamp(120px,25vw,180px)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {asteroidToDisplay && (
                        <AsteroidAnimation
                          hazardous={asteroidToDisplay.isHazardous}
                          diameter={
                            (asteroidToDisplay.estimatedDiameter || 0.1) * 1000
                          }
                          velocity={asteroidToDisplay.velocity}
                        />
                      )}
                    </div>

                    {asteroidToDisplay && (
                      <div
                        style={{
                          marginTop: "12px",
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          textAlign: "center",
                        }}
                      >
                        ☄️ {asteroidToDisplay.name}
                        <br />
                        Diameter:{" "}
                        {Math.round(
                          (asteroidToDisplay.estimatedDiameter || 0) * 1000,
                        )}{" "}
                        m
                        <br />
                        Magnitude: {asteroidToDisplay.magnitude}
                      </div>
                    )}
                  </motion.div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <Radar
                      asteroids={filteredAsteroids}
                      onSelectAsteroid={handleSelectAsteroid}
                    />

                    <MissionPanel data={filteredAsteroids} />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

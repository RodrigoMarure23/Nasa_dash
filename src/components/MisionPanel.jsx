import { useTranslation } from "../hooks/useTranslation";

export default function MissionPanel({ data }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) return null;

  const hazardousCount = data.filter((a) => a.isHazardous).length;

  const closestDistance =
    data.length > 0
      ? Math.min(...data.map((a) => Number(a.missDistance || Infinity)))
      : 0;

  return (
    <section
      className="mission-panel"
      role="region"
      aria-labelledby="mission-panel-title"
      aria-live="polite"
      tabIndex="0"
    >
      <h3 id="mission-panel-title">{t("missionControl")}</h3>

      {/* Descripción accesible */}
      <p
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          border: 0,
        }}
      >
        Mission control panel displaying asteroid statistics including total
        detected asteroids, potentially hazardous asteroids, and closest
        approach distance.
      </p>

      <dl>
        <div className="mission-stat">
          <dt>{t("asteroidsDetected")}</dt>
          <dd aria-label={`${data.length} asteroids detected`}>
            <strong>{data.length}</strong>
          </dd>
        </div>

        <div className="mission-stat">
          <dt>{t("potentiallyHazardous")}</dt>
          <dd aria-label={`${hazardousCount} potentially hazardous asteroids`}>
            <strong>{hazardousCount}</strong>
          </dd>
        </div>

        <div className="mission-stat">
          <dt>{t("closestApproach")}</dt>
          <dd
            aria-label={`Closest asteroid approach ${closestDistance.toLocaleString()} kilometers`}
          >
            <strong>{closestDistance.toLocaleString()} km</strong>
          </dd>
        </div>
      </dl>
    </section>
  );
}

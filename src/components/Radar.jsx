import { useMemo } from "react";

export default function Radar({ asteroids = [], onSelectAsteroid }) {
  const radarSize = 220;
  const center = radarSize / 2;

  const radarObjects = useMemo(() => {
    const maxDistance = 10000000;

    return asteroids.slice(0, 20).map((a, index) => {
      const distance = Number(a.missDistance || maxDistance);

      const normalized = Math.min(distance / maxDistance, 1);

      const minRadius = 25;
      const maxRadius = radarSize / 2 - 15;

      const radius = minRadius + normalized * (maxRadius - minRadius);

      const angle = (index / 20) * Math.PI * 2;

      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);

      return {
        ...a,
        x,
        y,
      };
    });
  }, [asteroids]);

  return (
    <section
      className="radar-container"
      aria-labelledby="radar-title"
      role="region"
    >
      {/* título accesible */}
      <h3 id="radar-title" className="sr-only">
        Asteroid radar visualization
      </h3>

      {/* Tierra */}
      <div
        className="radar-earth"
        role="img"
        aria-label="Earth at the center of the radar"
        title="Earth"
        tabIndex="0"
      >
        🌍
      </div>

      <div className="radar-circle" aria-hidden="true"></div>
      <div className="radar-circle" aria-hidden="true"></div>
      <div className="radar-circle" aria-hidden="true"></div>

      <div className="radar-sweep" aria-hidden="true"></div>

      {radarObjects.map((a) => (
        <button
          key={a.id}
          className="radar-dot"
          onClick={() => onSelectAsteroid?.(a)}
          aria-label={`Asteroid ${a.name}. Velocity ${Math.round(
            a.velocity,
          )} kilometers per second. Distance ${Number(
            a.missDistance,
          ).toLocaleString()} kilometers.`}
          title={`${a.name}
Velocity: ${Math.round(a.velocity)} km/s
Distance: ${Number(a.missDistance).toLocaleString()} km`}
          style={{
            left: a.x,
            top: a.y,
            background: a.isHazardous ? "#ef4444" : "#22c55e",
          }}
        />
      ))}
    </section>
  );
}

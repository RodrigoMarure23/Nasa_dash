import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload, t }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: "rgba(15,23,42,0.95)",
          border: "1px solid var(--border-color)",
          padding: "12px",
          borderRadius: "8px",
          backdropFilter: "blur(12px)",
        }}
      >
        <p style={{ fontWeight: "bold", color: "white" }}>{data.name}</p>

        <p style={{ margin: 0 }}>
          {t("velocity")}: {data.velocity.toFixed(2)} km/s
        </p>

        <p style={{ margin: 0 }}>
          {t("size")}: {data.estimatedDiameter.toFixed(3)} km
        </p>

        <p style={{ margin: 0 }}>
          {t("distance")}: {(data.missDistance / 1000000).toFixed(2)}M km
        </p>

        <p
          style={{
            marginTop: "6px",
            color: data.isHazardous ? "#f97316" : "#06b6d4",
          }}
        >
          {data.isHazardous ? t("hazardous") : t("notHazardous")}
        </p>
      </div>
    );
  }

  return null;
};

function CustomDot(props) {
  const { cx, cy, payload, selectedAsteroid, onSelectAsteroid } = props;

  const isSelected = selectedAsteroid && payload.name === selectedAsteroid.name;

  const radius = isSelected ? 8 : 5;

  const color = payload.isHazardous ? "#f97316" : "#06b6d4";

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill={color}
      stroke={isSelected ? "#ffffff" : "none"}
      strokeWidth={isSelected ? 2 : 0}
      tabIndex={0}
      role="button"
      aria-label={`Asteroid ${payload.name}. Velocity ${payload.velocity.toFixed(
        2,
      )} kilometers per second. Diameter ${payload.estimatedDiameter.toFixed(
        3,
      )} kilometers.`}
      style={{
        cursor: "pointer",
        filter: isSelected
          ? "drop-shadow(0px 0px 6px rgba(255,255,255,0.9))"
          : "none",
      }}
      onClick={() => onSelectAsteroid?.(payload)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelectAsteroid?.(payload);
        }
      }}
    />
  );
}

export function ScatterChartSection({
  t,
  data,
  onSelectAsteroid,
  selectedAsteroid,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      aria-labelledby="scatter-chart-title"
      aria-describedby="scatter-chart-desc"
      role="region"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        padding: "20px",
        height: "400px",
      }}
    >
      <h2
        id="scatter-chart-title"
        style={{
          fontSize: "0.875rem",
          fontWeight: "600",
          color: "var(--text-primary)",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        {t("sizeVsVelocity")}
      </h2>

      {/* Screen reader description */}
      <p id="scatter-chart-desc" className="sr-only">
        Scatter chart showing asteroid diameter compared with velocity. Each
        point represents one asteroid detected near Earth.
      </p>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis
            type="number"
            dataKey="velocity"
            name="Velocity"
            unit=" km/s"
            stroke="#64748b"
            tick={{ fill: "#94a3b8" }}
          />

          <YAxis
            type="number"
            dataKey="estimatedDiameter"
            name="Size"
            unit=" km"
            stroke="#64748b"
            tick={{ fill: "#94a3b8" }}
          />

          <Tooltip content={<CustomTooltip t={t} />} />

          <Scatter
            data={data}
            shape={(props) => (
              <CustomDot
                {...props}
                selectedAsteroid={selectedAsteroid}
                onSelectAsteroid={onSelectAsteroid}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </motion.section>
  );
}

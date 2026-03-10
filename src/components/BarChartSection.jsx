import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    return (
      <div
        role="tooltip"
        aria-live="polite"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          border: "1px solid var(--border-color)",
          padding: "12px",
          borderRadius: "8px",
          boxShadow:
            "0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.2)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            color: "var(--text-primary)",
            marginBottom: "8px",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "4px",
            margin: "0 0 8px 0",
          }}
        >
          {label}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: "0.875rem",
          }}
        >
          <p style={{ color: "var(--accent-cyan)", margin: 0 }}>
            <span style={{ color: "var(--text-muted)" }}>
              {t("notHazardous")}:
            </span>{" "}
            {payload[0].value}
          </p>

          {payload[1] && (
            <p style={{ color: "var(--accent-orange)", margin: 0 }}>
              <span style={{ color: "var(--text-muted)" }}>
                {t("hazardous")}:
              </span>{" "}
              {payload[1].value}
            </p>
          )}

          <p
            style={{
              color: "var(--text-primary)",
              paddingTop: "4px",
              marginTop: "4px",
              borderTop: "1px solid var(--border-color)",
              marginBottom: 0,
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>Total:</span>{" "}
            {payload[0].value + (payload[1]?.value || 0)}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export function BarChartSection({ t, data }) {
  return (
    <motion.section
      role="region"
      aria-labelledby="asteroids-chart-title"
      aria-describedby="asteroids-chart-desc"
      tabIndex="0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        backgroundColor: "var(--bg-card)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "350px",
        outline: "none",
      }}
    >
      <h2
        id="asteroids-chart-title"
        style={{
          fontSize: "0.875rem",
          fontWeight: "600",
          color: "var(--text-primary)",
          textTransform: "uppercase",
          letterSpacing: "0.025em",
          marginBottom: "24px",
          margin: "0 0 24px 0",
        }}
      >
        {t("asteroidsPerDay")}
      </h2>

      <p
        id="asteroids-chart-desc"
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
        Bar chart showing the number of hazardous and non hazardous asteroids
        detected per day.
      </p>

      <div
        style={{ flex: 1, width: "100%" }}
        role="img"
        aria-label="Bar chart representing asteroid counts per day"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 20, left: -20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={{ stroke: "#475569" }}
              axisLine={{ stroke: "#475569" }}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={{ stroke: "#475569" }}
              axisLine={{ stroke: "#475569" }}
            />

            <Tooltip
              content={<CustomTooltip t={t} />}
              cursor={{ fill: "#334155", opacity: 0.4 }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ outline: "none" }}
              formatter={(value) => (
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                    marginLeft: "4px",
                  }}
                >
                  {value === "safeCount" ? t("notHazardous") : t("hazardous")}
                </span>
              )}
            />

            <Bar
              dataKey="safeCount"
              name="safeCount"
              stackId="a"
              fill="#06b6d4"
              radius={[0, 0, 4, 4]}
              aria-label="Non hazardous asteroids"
            />

            <Bar
              dataKey="hazardousCount"
              name="hazardousCount"
              stackId="a"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              aria-label="Hazardous asteroids"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}

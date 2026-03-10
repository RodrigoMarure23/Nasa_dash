import { AlertTriangleIcon, FilterIcon, ActivityIcon } from "lucide-react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Sidebar({ t, filters, setFilters, asteroids }) {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const closestAsteroids = [...asteroids]
    .sort((a, b) => a.missDistance - b.missDistance)
    .slice(0, 10);

  const cardStyle = {
    backgroundColor: "var(--bg-card)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "20px",
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "var(--bg-input)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "0.875rem",
    color: "var(--text-secondary)",
    transition: "all 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "var(--text-muted)",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <aside
      className="sidebar-container"
      aria-label="Asteroid filters and nearby objects"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={cardStyle}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "12px",
          }}
        >
          <FilterIcon
            style={{
              width: "20px",
              height: "20px",
              color: "var(--accent-cyan)",
            }}
          />

          <h2
            id="filter-panel-title"
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
              margin: 0,
            }}
          >
            {t("filterData")}
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div>
              <label htmlFor="start-date" style={labelStyle}>
                {t("startDate")}
              </label>

              <DatePicker
                id="start-date"
                selected={new Date(filters.startDate)}
                onChange={(date) =>
                  handleFilterChange(
                    "startDate",
                    date.toISOString().split("T")[0],
                  )
                }
                dateFormat="yyyy-MM-dd"
                className="input-focus"
                style={inputStyle}
                wrapperClassName="date-picker-wrapper"
              />
            </div>

            <div>
              <label htmlFor="end-date" style={labelStyle}>
                {t("endDate")}
              </label>

              <DatePicker
                id="end-date"
                selected={new Date(filters.endDate)}
                onChange={(date) =>
                  handleFilterChange(
                    "endDate",
                    date.toISOString().split("T")[0],
                  )
                }
                dateFormat="yyyy-MM-dd"
                className="input-focus"
                style={inputStyle}
                wrapperClassName="date-picker-wrapper"
              />
            </div>
          </div>

          <div
            style={{
              paddingTop: "8px",
              borderTop: "1px solid rgba(30, 41, 59, 0.5)",
            }}
          >
            <label
              htmlFor="hazard-filter"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AlertTriangleIcon
                  style={{
                    width: "16px",
                    height: "16px",
                    color: "var(--accent-orange)",
                  }}
                />
                {t("dangerous")}
              </span>

              <select
                id="hazard-filter"
                value={
                  filters.showDangerous === null
                    ? "all"
                    : filters.showDangerous.toString()
                }
                onChange={(e) => {
                  const val = e.target.value;
                  handleFilterChange(
                    "showDangerous",
                    val === "all" ? null : val === "true",
                  );
                }}
                className="input-focus"
                style={{
                  ...inputStyle,
                  padding: "4px 32px 4px 8px",
                  appearance: "none",
                }}
              >
                <option value="all">{t("all")}</option>
                <option value="true">{t("hazardous")}</option>
                <option value="false">{t("notHazardous")}</option>
              </select>
            </label>
          </div>

          <div
            style={{
              paddingTop: "8px",
              borderTop: "1px solid rgba(30, 41, 59, 0.5)",
            }}
          >
            <label style={{ ...labelStyle, marginBottom: "12px" }}>
              {t("magnitude")}
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="magnitude-min" style={labelStyle}>
                  {t("min")}
                </label>

                <input
                  id="magnitude-min"
                  type="number"
                  value={filters.magnitudeRange[0]}
                  onChange={(e) =>
                    handleFilterChange("magnitudeRange", [
                      Number(e.target.value),
                      filters.magnitudeRange[1],
                    ])
                  }
                  className="input-focus"
                  style={{ ...inputStyle, padding: "6px 8px" }}
                />
              </div>

              <span style={{ color: "var(--text-muted)" }}>-</span>

              <div style={{ flex: 1 }}>
                <label htmlFor="magnitude-max" style={labelStyle}>
                  {t("max")}
                </label>

                <input
                  id="magnitude-max"
                  type="number"
                  value={filters.magnitudeRange[1]}
                  onChange={(e) =>
                    handleFilterChange("magnitudeRange", [
                      filters.magnitudeRange[0],
                      Number(e.target.value),
                    ])
                  }
                  className="input-focus"
                  style={{ ...inputStyle, padding: "6px 8px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          ...cardStyle,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "300px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "12px",
          }}
        >
          <ActivityIcon
            style={{
              width: "20px",
              height: "20px",
              color: "var(--accent-cyan)",
            }}
          />

          <h2
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
              margin: 0,
            }}
          >
            {t("nearAsteroids")}
          </h2>
        </div>

        <ul
          className="custom-scrollbar"
          role="list"
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {closestAsteroids.length === 0 ? (
            <li style={{ listStyle: "none" }}>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                  padding: "16px 0",
                  margin: 0,
                }}
              >
                {t("noData")}
              </p>
            </li>
          ) : (
            closestAsteroids.map((asteroid) => (
              <li key={asteroid.id} style={{ listStyle: "none" }}>
                <button
                  className="asteroid-item"
                  aria-label={`Asteroid ${asteroid.name}. Distance ${(asteroid.missDistance / 1000000).toFixed(1)} million kilometers`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(10, 14, 26, 0.5)",
                    border: "1px solid rgba(30, 41, 59, 0.5)",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: asteroid.isHazardous
                          ? "var(--accent-orange)"
                          : "var(--accent-cyan)",
                      }}
                    />

                    <span
                      title={asteroid.name}
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {asteroid.name}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      fontFamily: "monospace",
                      marginLeft: "8px",
                    }}
                  >
                    {(asteroid.missDistance / 1000000).toFixed(1)}M km
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </motion.div>
    </aside>
  );
}

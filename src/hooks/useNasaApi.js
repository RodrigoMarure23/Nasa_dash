import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const BASE_URL = import.meta.env.VITE_NASA_BASE_URL;

export function useNasaApi(startDate, endDate) {
  const [data, setData] = useState({ asteroids: [], dailyCounts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getDaysBetween = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.abs(e - s) / (1000 * 60 * 60 * 24);
  };
  useEffect(() => {
    if (!startDate || !endDate) return;

    const range = getDaysBetween(startDate, endDate);

    if (range > 7) {
      setError("Date range cannot exceed 7 days");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Process data
        const neoData = result.near_earth_objects;
        let flatAsteroids = [];
        let dailyStats = [];

        // Sort dates to ensure chronological order in charts
        const sortedDates = Object.keys(neoData).sort();

        sortedDates.forEach((date) => {
          const dayAsteroids = neoData[date];
          let hazardousCount = 0;
          let safeCount = 0;

          const processedDayAsteroids = dayAsteroids.map((a) => {
            const isHazardous = a.is_potentially_hazardous_asteroid;
            if (isHazardous) hazardousCount++;
            else safeCount++;

            return {
              id: a.id,
              name: a.name,
              date: date,
              estimatedDiameter:
                (a.estimated_diameter.kilometers.estimated_diameter_min +
                  a.estimated_diameter.kilometers.estimated_diameter_max) /
                2,
              velocity: parseFloat(
                a.close_approach_data[0].relative_velocity
                  .kilometers_per_second,
              ),
              isHazardous: isHazardous,
              magnitude: a.absolute_magnitude_h,
              missDistance: parseFloat(
                a.close_approach_data[0].miss_distance.kilometers,
              ),
            };
          });

          flatAsteroids = [...flatAsteroids, ...processedDayAsteroids];

          // Format date for display (e.g., "Oct 15")
          const dateObj = new Date(date);
          const shortDate = dateObj.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });

          dailyStats.push({
            date: shortDate,
            rawDate: date,
            count: dayAsteroids.length,
            hazardousCount,
            safeCount,
          });
        });

        setData({
          asteroids: flatAsteroids,
          dailyCounts: dailyStats,
        });
      } catch (e) {
        console.error("Failed to fetch NASA data:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return { ...data, loading, error };
}

import { useState, useCallback } from "react";

const translations = {
  es: {
    title: "Panel de Asteroides",
    filterData: "Filtrar Datos",
    startDate: "Fecha Inicio",
    endDate: "Fecha Fin",
    dangerous: "Peligroso",
    magnitude: "Magnitud",
    nearAsteroids: "Asteroides Cercanos",
    extra:"extra",
    sizeVsVelocity: "Tamaño Estimado vs. Velocidad (km/s)",
    asteroidsPerDay: "Número de Asteroides por Día",
    loading: "Cargando datos espaciales...",
    error: "Error al cargar datos",
    noData: "Sin datos para este rango",
    hazardous: "Peligroso",
    notHazardous: "No Peligroso",
    velocity: "Velocidad",
    size: "Tamaño",
    distance: "Distancia",
    name: "Nombre",
    retry: "Reintentar",
    all: "Todos",
    min: "Mín",
    max: "Máx",

    missionControl: "Control de Misión",
    asteroidsDetected: "Asteroides Detectados",
    potentiallyHazardous: "Potencialmente Peligrosos",
    closestApproach: "Aproximación Más Cercana",

    info: "Info",

    dashboardInfoTitle: "🛰️ Sistema de Monitoreo de Asteroides",

    dashboardInfoContent: `
<div style="text-align:left;font-size:14px;line-height:1.6">

<b>🌍 Radar</b><br/>
Muestra la posición relativa de los asteroides cercanos alrededor de la Tierra.
<br/><br/>

<b>📊 Gráfico de Dispersión</b><br/>
Muestra el tamaño estimado frente a la velocidad.
Cada punto representa un asteroide detectado por la NASA.
<br/><br/>

<b>📅 Gráfico por Día</b><br/>
Muestra cuántos asteroides pasan cerca de la Tierra cada día.
<br/><br/>

<b>☄ Visualización del Asteroide</b><br/>
Muestra el asteroide seleccionado.
El tamaño y la velocidad influyen en la animación.
<br/><br/>

<b>🚨 Colores</b><br/>
🟢 Asteroide seguro<br/>
🔴 Asteroide potencialmente peligroso

</div>
`,
  },

  en: {
    title: "Asteroid Dashboard",
    filterData: "Filter Data",
    startDate: "Start Date",
    endDate: "End Date",
    dangerous: "Dangerous",
    magnitude: "Magnitude",
    nearAsteroids: "Near Asteroids",
    sizeVsVelocity: "Estimated Size vs. Velocity (km/s)",
    asteroidsPerDay: "Number of Asteroids per Day",
    loading: "Loading space data...",
    error: "Error loading data",
    noData: "No data for this range",
    hazardous: "Hazardous",
    notHazardous: "Not Hazardous",
    velocity: "Velocity",
    size: "Size",
    distance: "Distance",
    name: "Name",
    retry: "Retry",
    all: "All",
    min: "Min",
    max: "Max",

    missionControl: "Mission Control",
    asteroidsDetected: "Asteroids Detected",
    potentiallyHazardous: "Potentially Hazardous",
    closestApproach: "Closest Approach",

    info: "Info",

    dashboardInfoTitle: "🛰️ Asteroid Monitoring System",

    dashboardInfoContent: `
<div style="text-align:left;font-size:14px;line-height:1.6">

<b>🌍 Radar</b><br/>
Shows the relative position of nearby asteroids around Earth.
<br/><br/>

<b>📊 Scatter Chart</b><br/>
Displays asteroid size vs velocity.
Each point represents one asteroid detected by NASA.
<br/><br/>

<b>📅 Bar Chart</b><br/>
Shows how many asteroids pass near Earth each day.
<br/><br/>

<b>☄ Asteroid Visualization</b><br/>
Displays the currently selected asteroid.
The size and speed influence the animation.
<br/><br/>

<b>🚨 Colors</b><br/>
🟢 Safe asteroid<br/>
🔴 Potentially hazardous asteroid

</div>
`,
  },
};

export function useTranslation() {
  const [language, setLanguage] = useState("es");

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"));
  }, []);

  const t = useCallback(
    (key) => {
      return translations[language][key] || key;
    },
    [language],
  );

  return { t, language, toggleLanguage };
}

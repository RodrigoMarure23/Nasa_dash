import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const AsteroidAnimation = ({
  width = "100%",
  height = "100%",
  hazardous = false,
  diameter = 100,
  velocity = 10,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let frame;

    /* ---------------- WEBGL CHECK ---------------- */

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      container.innerHTML =
        "<div style='color:#94a3b8;font-size:12px'>3D visualization not supported</div>";
      return;
    }

    /* ---------------- SCENE ---------------- */

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setClearColor(0x000000, 0);

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);

    container.appendChild(renderer.domElement);

    /* ---------------- RESIZE ---------------- */

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      if (!w || !h) return;

      renderer.setSize(w, h);

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    /* ---------------- LIGHTS ---------------- */

    const ambient = new THREE.AmbientLight(0x334155, 0.6);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(4, 3, 5);
    scene.add(light);

    const rim = new THREE.DirectionalLight(0x06b6d4, 1);
    rim.position.set(-3, 2, -4);
    scene.add(rim);

    /* ---------------- ASTEROID ---------------- */

    let scale = 1;

    if (diameter < 50) scale = 0.8;
    else if (diameter < 150) scale = 1.3;
    else scale = 1.9;

    const geometry = new THREE.IcosahedronGeometry(scale, 4);

    const pos = geometry.attributes.position;
    const colors = [];

    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);

      const noise =
        0.2 * Math.sin(v.x * 5) +
        0.2 * Math.cos(v.y * 6) +
        0.15 * Math.sin(v.z * 4);

      v.multiplyScalar(1 + noise);

      pos.setXYZ(i, v.x, v.y, v.z);

      let baseColor = hazardous
        ? new THREE.Color(0xf97316)
        : new THREE.Color(0x06b6d4);

      const variation = (Math.random() - 0.5) * 0.1;

      const c = baseColor.clone().offsetHSL(0, 0, variation);

      colors.push(c.r, c.g, c.b);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });

    const asteroid = new THREE.Mesh(geometry, material);
    scene.add(asteroid);

    if (hazardous) {
      const glowGeo = new THREE.SphereGeometry(scale * 1.3, 32, 32);

      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.35,
      });

      const glow = new THREE.Mesh(glowGeo, glowMat);

      asteroid.add(glow);
    }

    /* ---------------- PARTICLES ---------------- */

    const pGeo = new THREE.BufferGeometry();

    const pCount = 250;
    const pPositions = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const r = 2 + Math.random();

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.03,
      color: hazardous ? 0xf97316 : 0x06b6d4,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ---------------- KEYBOARD INTERACTION ---------------- */

    const handleKey = (e) => {
      const step = 0.05;

      if (e.key === "ArrowLeft") asteroid.rotation.y -= step;
      if (e.key === "ArrowRight") asteroid.rotation.y += step;
      if (e.key === "ArrowUp") asteroid.rotation.x -= step;
      if (e.key === "ArrowDown") asteroid.rotation.x += step;
    };

    container.addEventListener("keydown", handleKey);

    /* ---------------- ANIMATION ---------------- */

    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      const rotationSpeed = velocity * 0.00015;

      asteroid.rotation.y += rotationSpeed;

      particles.rotation.y = t * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    /* ---------------- CLEANUP ---------------- */

    return () => {
      cancelAnimationFrame(frame);

      resizeObserver.disconnect();

      container.removeEventListener("keydown", handleKey);

      renderer.dispose();

      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, [diameter, velocity, hazardous]);

  return (
    <div
      ref={mountRef}
      role="img"
      tabIndex={0}
      aria-label={`3D asteroid visualization. Diameter approximately ${diameter} meters. Velocity ${velocity} kilometers per second. ${
        hazardous ? "Potentially hazardous asteroid." : "Not hazardous."
      }`}
      aria-describedby="asteroid-3d-desc"
      style={{
        width,
        height,
        outline: "none",
        touchAction: "none",
      }}
    >
      <span
        id="asteroid-3d-desc"
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
        Interactive 3D asteroid model. Use arrow keys to rotate the asteroid.
      </span>
    </div>
  );
};

export default AsteroidAnimation;

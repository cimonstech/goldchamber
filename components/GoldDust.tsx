"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function generateSprite(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(201, 168, 76, 1)");
  gradient.addColorStop(0.3, "rgba(201, 168, 76, 0.4)");
  gradient.addColorStop(1, "rgba(201, 168, 76, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(16, 16, 16, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

export interface GoldDustProps {
  particleCount?: number;
  opacity?: number;
  speed?: number;
  size?: number;
  zIndex?: number;
}

export default function GoldDust({
  particleCount = 80,
  opacity = 0.15,
  speed = 1.0,
  size = 0.06,
  zIndex = 0,
}: GoldDustProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = isMobile ? 40 : particleCount;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    container.appendChild(renderer.domElement);

    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.random() * 10 - 8;
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.001 * speed;
      velocities[i * 3 + 1] = (0.0003 + Math.random() * 0.0007) * speed;
      velocities[i * 3 + 2] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const spriteTexture = generateSprite();
    const material = new THREE.PointsMaterial({
      size: 0.06,
      map: spriteTexture,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    startTimeRef.current = Date.now();

    const animate = () => {
      const t = (Date.now() - startTimeRef.current) / 1000;
      const breath = 0.4 + 0.6 * (Math.sin(t * (Math.PI * 2) / 4) * 0.5 + 0.5);
      (points.material as THREE.PointsMaterial).opacity = opacity * breath;

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 0] += velocities[i * 3 + 0]!;
        posArray[i * 3 + 1] += velocities[i * 3 + 1]!;
        posArray[i * 3 + 2] += velocities[i * 3 + 2]!;

        if (posArray[i * 3 + 1]! > 1.2) {
          posArray[i * 3 + 1] = -1.2;
          posArray[i * 3 + 0] = (Math.random() - 0.5) * 2;
          posArray[i * 3 + 2] = Math.random() * 10 - 8;
        }
      }
      posAttr.needsUpdate = true;

      points.rotation.y += 0.00008;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      geometry.dispose();
      material.dispose();
      material.map?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [particleCount, opacity, speed, size]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ top: 0, left: 0, zIndex: zIndex }}
      aria-hidden
    />
  );
}

"use client";

import dynamic from "next/dynamic";

const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground").then((m) => m.ParticleBackground),
  { ssr: false }
);

export function ParticleBackgroundWrapper() {
  return <ParticleBackground />;
}

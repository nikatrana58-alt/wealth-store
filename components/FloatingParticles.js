"use client";

const PARTICLE_COUNT = 20;

function getParticlePosition(index, axisOffset) {
  const value =
    Math.sin((index + 1) * (axisOffset + 1) * 12.9898) *
    43758.5453;

  const normalized = (value - Math.floor(value)) * 100;

  return `${normalized.toFixed(2)}%`;
}

const particles = Array.from(
  { length: PARTICLE_COUNT },
  (_, index) => ({
    top: getParticlePosition(index, 0),
    left: getParticlePosition(index, 1),
  })
);

export default function FloatingParticles() {

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">

      {particles.map((particle, i) => (

        <div
          key={i}
          className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
          style={particle}
        />

      ))}

    </div>
  );
}

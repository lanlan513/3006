import { useMemo } from 'react';
import type { WeatherType } from '@/types';

interface WeatherEffectsProps {
  weather: WeatherType;
  intensity?: 'light' | 'normal' | 'heavy';
  darkMode?: boolean;
}

const Particle = ({
  id,
  left,
  delay,
  duration,
  size,
  children,
  opacity = 1,
}: {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  children: React.ReactNode;
  opacity?: number;
}) => (
  <div
    className={`weather-particle particle-${id}`}
    style={{
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      opacity,
      fontSize: `${size}px`,
    }}
  >
    {children}
  </div>
);

export default function WeatherEffects({ weather, intensity = 'normal', darkMode = false }: WeatherEffectsProps) {
  const particleCount = intensity === 'light' ? 20 : intensity === 'heavy' ? 60 : 40;

  const snowflakes = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 6 + Math.random() * 8,
        size: 12 + Math.random() * 18,
        type: Math.random() > 0.5 ? '❄️' : '❅',
      })),
    [particleCount]
  );

  const meteors = useMemo(
    () =>
      Array.from({ length: Math.floor(particleCount / 4) }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 50,
        delay: Math.random() * 15,
        duration: 1.5 + Math.random() * 2,
        length: 80 + Math.random() * 120,
      })),
    [particleCount]
  );

  const candies = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 5 + Math.random() * 6,
        size: 14 + Math.random() * 14,
        type: ['🍬', '🍭', '🧁', '🍩', '🍪', '🎂'][Math.floor(Math.random() * 6)],
        rotation: Math.random() * 360,
      })),
    [particleCount]
  );

  const petals = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 7,
        size: 14 + Math.random() * 16,
        type: Math.random() > 0.3 ? '🌸' : '🌺',
        swayAmount: 20 + Math.random() * 40,
      })),
    [particleCount]
  );

  const raindrops = useMemo(
    () =>
      Array.from({ length: particleCount * 2 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.5,
        height: 10 + Math.random() * 20,
      })),
    [particleCount]
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: Math.floor(particleCount / 2) }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        size: 8 + Math.random() * 12,
        color: ['#7FFFD4', '#DDA0DD', '#87CEEB', '#FFE4E1', '#98FB98'][Math.floor(Math.random() * 5)],
      })),
    [particleCount]
  );

  const sunRays = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        rotation: i * 45,
        delay: i * 0.2,
      })),
    []
  );

  const renderWeatherContent = () => {
    switch (weather) {
      case '白雪':
        return (
          <div className="weather-snow">
            {snowflakes.map((s) => (
              <Particle
                key={s.id}
                id={s.id}
                left={s.left}
                delay={s.delay}
                duration={s.duration}
                size={s.size}
                opacity={0.8}
              >
                {s.type}
              </Particle>
            ))}
            <div className="weather-snow-ground" />
          </div>
        );

      case '流星雨':
        return (
          <div className="weather-meteor">
            {meteors.map((m) => (
              <div
                key={m.id}
                className="meteor-shower"
                style={{
                  left: `${m.left}%`,
                  top: `${m.top}%`,
                  animationDelay: `${m.delay}s`,
                  animationDuration: `${m.duration}s`,
                  '--meteor-length': `${m.length}px`,
                } as React.CSSProperties}
              />
            ))}
            <div className="weather-stars-bg">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: 0.3 + Math.random() * 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        );

      case '魔法极光':
        return (
          <div className="weather-aurora">
            <div className="aurora-band aurora-1" />
            <div className="aurora-band aurora-2" />
            <div className="aurora-band aurora-3" />
            <div className="aurora-band aurora-4" />
            {sparkles.map((s) => (
              <div
                key={s.id}
                className="aurora-sparkle"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                  fontSize: `${s.size}px`,
                  color: s.color,
                }}
              >
                ✨
              </div>
            ))}
          </div>
        );

      case '糖果风暴':
        return (
          <div className="weather-candy">
            {candies.map((c) => (
              <div
                key={c.id}
                className="weather-particle candy-particle"
                style={{
                  left: `${c.left}%`,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.duration}s`,
                  fontSize: `${c.size}px`,
                  transform: `rotate(${c.rotation}deg)`,
                }}
              >
                {c.type}
              </div>
            ))}
            <div className="weather-candy-glow" />
          </div>
        );

      case '花瓣雨':
        return (
          <div className="weather-petal">
            {petals.map((p) => (
              <div
                key={p.id}
                className="weather-particle petal-particle"
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  fontSize: `${p.size}px`,
                  '--sway-amount': `${p.swayAmount}px`,
                } as React.CSSProperties}
              >
                {p.type}
              </div>
            ))}
          </div>
        );

      case '月光夜':
        return (
          <div className="weather-moonlight">
            <div className="moon-container">
              <div className="moon-body">
                <div className="moon-crater moon-crater-1" />
                <div className="moon-crater moon-crater-2" />
                <div className="moon-crater moon-crater-3" />
              </div>
              <div className="moon-glow" />
              <div className="moon-rays" />
            </div>
            <div className="weather-stars-bg">
              {Array.from({ length: 80 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-star twinkle-star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: 0.3 + Math.random() * 0.7,
                    width: `${1 + Math.random() * 3}px`,
                    height: `${1 + Math.random() * 3}px`,
                  }}
                />
              ))}
            </div>
          </div>
        );

      case '彩虹桥':
        return (
          <div className="weather-rainbow">
            <div className="rainbow-arch">
              <div className="rainbow-band rainbow-red" />
              <div className="rainbow-band rainbow-orange" />
              <div className="rainbow-band rainbow-yellow" />
              <div className="rainbow-band rainbow-green" />
              <div className="rainbow-band rainbow-blue" />
              <div className="rainbow-band rainbow-indigo" />
              <div className="rainbow-band rainbow-violet" />
            </div>
            {sparkles.slice(0, 30).map((s) => (
              <div
                key={s.id}
                className="aurora-sparkle rainbow-sparkle"
                style={{
                  left: `${s.left}%`,
                  top: `${60 + Math.random() * 35}%`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                  fontSize: `${s.size}px`,
                }}
              >
                ✨
              </div>
            ))}
            <div className="rainbow-cloud rainbow-cloud-left">☁️</div>
            <div className="rainbow-cloud rainbow-cloud-right">☁️</div>
          </div>
        );

      case '晴朗':
      default:
        return (
          <div className="weather-sunny">
            <div className="sun-container">
              <div className="sun-body" />
              {sunRays.map((r) => (
                <div
                  key={r.id}
                  className="sun-ray"
                  style={{
                    transform: `rotate(${r.rotation}deg)`,
                    animationDelay: `${r.delay}s`,
                  }}
                />
              ))}
              <div className="sun-glow" />
            </div>
            {sparkles.slice(0, 15).map((s) => (
              <div
                key={s.id}
                className="aurora-sparkle"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                  fontSize: `${s.size * 0.7}px`,
                  color: '#FFD700',
                }}
              >
                ✨
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div
      className={`weather-effects-container pointer-events-none fixed inset-0 z-5 overflow-hidden ${
        darkMode ? 'weather-dark-mode' : ''
      }`}
    >
      {renderWeatherContent()}
    </div>
  );
}

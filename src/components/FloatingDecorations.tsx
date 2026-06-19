import { Sparkles, Cloud, Star } from 'lucide-react';

export default function FloatingDecorations() {
  const stars = [
    { top: '10%', left: '5%', size: 'w-4 h-4', delay: '0s', color: 'text-fairy-gold' },
    { top: '20%', left: '90%', size: 'w-5 h-5', delay: '0.5s', color: 'text-fairy-purple' },
    { top: '60%', left: '3%', size: 'w-3 h-3', delay: '1s', color: 'text-fairy-pink' },
    { top: '80%', left: '95%', size: 'w-4 h-4', delay: '1.5s', color: 'text-fairy-gold' },
    { top: '40%', left: '92%', size: 'w-3 h-3', delay: '2s', color: 'text-fairy-sky' },
  ];

  const sparkles = [
    { top: '15%', left: '15%', size: 'w-6 h-6', delay: '0s' },
    { top: '70%', left: '85%', size: 'w-5 h-5', delay: '1s' },
    { top: '35%', left: '80%', size: 'w-4 h-4', delay: '0.5s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star, i) => (
        <Star
          key={`star-${i}`}
          className={`absolute ${star.size} ${star.color} animate-twinkle fill-current`}
          style={{ top: star.top, left: star.left, animationDelay: star.delay }}
        />
      ))}

      {sparkles.map((sparkle, i) => (
        <Sparkles
          key={`sparkle-${i}`}
          className={`absolute ${sparkle.size} text-fairy-purple/40 animate-float`}
          style={{ top: sparkle.top, left: sparkle.left, animationDelay: sparkle.delay }}
        />
      ))}

      <Cloud
        className="absolute w-20 h-20 text-fairy-sky/30 animate-float-slow"
        style={{ top: '12%', left: '10%', animationDelay: '0.5s' }}
      />
      <Cloud
        className="absolute w-16 h-16 text-fairy-pink/30 animate-float"
        style={{ top: '25%', right: '15%', animationDelay: '1s' }}
      />
      <Cloud
        className="absolute w-24 h-24 text-fairy-lavender/40 animate-float-slow"
        style={{ bottom: '15%', left: '8%', animationDelay: '1.5s' }}
      />
    </div>
  );
}

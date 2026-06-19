import { Link } from 'react-router-dom';
import { Crown, Star, MapPin } from 'lucide-react';
import type { StoryCharacter } from '@/types';

interface CharacterCardProps {
  character: StoryCharacter;
  variant?: 'default' | 'compact';
}

export default function CharacterCard({ character, variant = 'default' }: CharacterCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/characters/${character.id}`}
        className="fairy-card p-4 flex gap-4 group"
      >
        <div
          className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: character.coverColor }}
        >
          <img
            src={character.coverImage}
            alt={character.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-fairy text-lg text-gray-800 group-hover:text-fairy-purple transition-colors line-clamp-1">
              {character.name}
            </h3>
            {character.isProtagonist && (
              <Crown className="w-4 h-4 text-fairy-gold flex-shrink-0" />
            )}
          </div>
          <span className="fairy-tag text-xs mt-1">{character.type}</span>
          <p className="text-sm text-gray-600 mt-2 line-clamp-1 font-body">
            {character.storyTitle}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/characters/${character.id}`}
      className="fairy-card overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: character.coverColor }}
        />
        <img
          src={character.coverImage}
          alt={character.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {character.isProtagonist && (
          <div className="absolute top-3 left-3 bg-fairy-gold/90 text-white px-3 py-1 rounded-full text-xs font-body font-medium flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3" />
            主角
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="fairy-tag text-xs bg-white/20 backdrop-blur-sm text-white border-white/30">
              {character.type}
            </span>
          </div>
          <h3 className="font-fairy text-xl text-white drop-shadow-lg">{character.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {character.storyTitle}
          </span>
        </div>
        <p className="text-sm text-gray-600 font-body line-clamp-2 mb-3">{character.description}</p>
        <div className="flex flex-wrap gap-2">
          {character.traits.slice(0, 3).map((trait) => (
            <span key={trait} className="fairy-tag text-xs bg-fairy-purple/5">
              {trait}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

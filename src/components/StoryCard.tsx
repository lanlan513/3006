import { Link } from 'react-router-dom';
import { MapPin, User, Flame, Wand2 } from 'lucide-react';
import type { Story } from '@/types';
import { useStoryStore, getInteractiveStoryByStoryId } from '@/store/storyStore';

interface StoryCardProps {
  story: Story;
  variant?: 'default' | 'compact' | 'shelf';
}

export default function StoryCard({ story, variant = 'default' }: StoryCardProps) {
  const interactiveStories = useStoryStore((state) => state.interactiveStories);
  const hasInteractiveMode = getInteractiveStoryByStoryId(interactiveStories, story.id) !== undefined;
  if (variant === 'shelf') {
    return (
      <Link to={`/stories/${story.id}`} className="story-book group">
        <div className="story-book-inner">
          <div
            className="w-24 h-36 md:w-28 md:h-44 rounded-r-lg shadow-book relative overflow-hidden cursor-pointer"
            style={{ backgroundColor: story.coverColor }}
          >
            <div className="absolute left-0 top-0 w-3 h-full bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
              <h3 className="text-white text-sm md:text-base font-fairy font-bold drop-shadow-lg leading-tight">
                {story.title}
              </h3>
              <p className="text-white/80 text-xs mt-1 font-body">{story.author}</p>
            </div>
            {story.isHot && (
              <div className="absolute top-2 right-2">
                <Flame className="w-4 h-4 text-fairy-gold drop-shadow-lg animate-bounce-soft" />
              </div>
            )}
            {hasInteractiveMode && (
              <div className="absolute top-2 left-4 px-1.5 py-0.5 bg-gradient-fairy text-white text-[9px] rounded-full font-body font-medium flex items-center gap-0.5 shadow-md">
                <Wand2 className="w-2.5 h-2.5" />
                互动
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/stories/${story.id}`} className="fairy-card p-4 flex gap-4 group">
        <div
          className="w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundColor: story.coverColor }}
        >
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-fairy text-lg text-gray-800 group-hover:text-fairy-purple transition-colors line-clamp-1">
                {story.title}
              </h3>
              {hasInteractiveMode && (
                <span className="flex-shrink-0 px-1.5 py-0.5 bg-gradient-fairy text-white text-[9px] rounded-full font-body font-medium flex items-center gap-0.5">
                  <Wand2 className="w-2.5 h-2.5" />
                  互动
                </span>
              )}
            </div>
            {story.isHot && <Flame className="w-4 h-4 text-fairy-gold flex-shrink-0 animate-bounce-soft" />}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {story.author}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {story.region}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-body">{story.summary}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/stories/${story.id}`} className="fairy-card overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: story.coverColor }}
        />
        <img
          src={story.coverImage}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {story.isHot && (
          <div className="absolute top-3 right-3 bg-fairy-gold/90 text-white px-3 py-1 rounded-full text-xs font-body font-medium flex items-center gap-1 shadow-lg">
            <Flame className="w-3 h-3" />
            热门
          </div>
        )}
        {hasInteractiveMode && (
          <div className="absolute top-3 left-3 bg-gradient-fairy text-white px-2.5 py-1 rounded-full text-[10px] font-body font-medium flex items-center gap-1 shadow-lg">
            <Wand2 className="w-3 h-3" />
            命运选择器
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-fairy text-xl text-white drop-shadow-lg">{story.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {story.author}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {story.region}
          </span>
        </div>
        <p className="text-sm text-gray-600 font-body line-clamp-2 mb-3">{story.summary}</p>
        <div className="flex flex-wrap gap-2">
          {story.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="fairy-tag text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

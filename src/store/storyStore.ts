import { create } from 'zustand';
import type { Story, Region } from '@/types';
import { stories } from '@/data/stories';

interface StoryState {
  stories: Story[];
  searchQuery: string;
  selectedRegion: Region;
  setSearchQuery: (query: string) => void;
  setSelectedRegion: (region: Region) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  stories,
  searchQuery: '',
  selectedRegion: '全部',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
}));

export const getHotStories = (stories: Story[]): Story[] => {
  return stories.filter((story) => story.isHot);
};

export const getStoryById = (stories: Story[], id: string): Story | undefined => {
  return stories.find((story) => story.id === id);
};

export const getFilteredStories = (
  stories: Story[],
  searchQuery: string,
  selectedRegion: Region
): Story[] => {
  return stories.filter((story) => {
    const matchesRegion = selectedRegion === '全部' || story.region === selectedRegion;
    const matchesSearch =
      searchQuery === '' ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesSearch;
  });
};

export const searchStories = (stories: Story[], query: string): Story[] => {
  if (!query.trim()) return [];
  return stories.filter(
    (story) =>
      story.title.toLowerCase().includes(query.toLowerCase()) ||
      story.author.toLowerCase().includes(query.toLowerCase()) ||
      story.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
      story.summary.toLowerCase().includes(query.toLowerCase())
  );
};

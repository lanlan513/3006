import { create } from 'zustand';
import type {
  Story,
  Region,
  StoryCharacter,
  CharacterType,
  InteractiveStory,
  StoryProgress,
  UserChoiceRecord,
  EndingRoute,
  EndingPathStep,
  MagicItem,
  MagicItemCategory,
  MagicItemRarity,
  Creature,
  CreatureHabitat,
  CreatureAbilityType,
  DangerLevel,
  WeatherType,
  WeatherEffect,
  WeatherForecast,
  WEATHER_INFO,
  Course,
  SkillBadge,
  Title,
  CourseCategory,
  CosmicEvent,
  ActiveCosmicEvent,
  WorldState,
  WorldBuff,
  EventLeaderboardEntry,
  EventHistoryRecord,
  CosmicEventTab,
  CharacterDreamState,
  DreamLocation,
  DreamCreature,
  DreamEncounter,
  DreamEncounterOption,
  DreamMemory,
  InnerWish,
  InnerFear,
  DreamTab,
  DayNightPhase,
  LanguageRace,
  LanguageWord,
  GrammarRule,
  WordPuzzle,
  AncientStele,
  DecipherTab,
} from '@/types';
import { stories } from '@/data/stories';
import { characters } from '@/data/characters';
import { interactiveStories } from '@/data/interactiveStories';
import { magicItems } from '@/data/magicItems';
import { creatures } from '@/data/creatures';
import { courses, allBadges, allTitles, getCourseById } from '@/data/academy';
import {
  cosmicEvents,
  initialWorldState,
  initialLeaderboard,
  initialEventHistory,
  getEraNameByLevel,
  getCosmicEventById,
} from '@/data/cosmicEvents';
import {
  DREAM_CREATURES,
  BASE_DREAM_LOCATIONS,
  generateWishesForCharacter,
  generateFearsForCharacter,
  generateLocationsForCharacter,
  generateDreamEncounter,
  getDreamCreatureById,
  getDreamLocationById,
  DREAM_EVOLUTION_TRIGGERS,
} from '@/data/dreamWorld';
import {
  allWords,
  allGrammar,
  allPuzzles,
  ancientSteles,
  getWordById,
  getGrammarById,
  getPuzzleById,
  getSteleById,
  getWordsByRace,
  getGrammarByRace,
  getPuzzlesByRace,
  getStelesByRace,
} from '@/data/languages';
import {
  RAILWAY_STATIONS,
  RAILWAY_ROUTES,
  RAILWAY_EVENTS,
  INITIAL_TRAINS,
  INITIAL_RESOURCES,
  getStationById,
  getRouteById,
  getEventById,
  canBuildStation,
  canBuildRoute,
  getBuiltStations,
  getBuiltRoutes,
} from '@/data/railway';
import type {
  RailwayStation,
  RailwayRoute,
  MagicTrain,
  RailwayEvent,
  RailwayProgress,
  ActiveRailwayEvent,
  RailwayTab,
  ResourceType,
  TransportLog,
} from '@/types';

interface StoryState {
  stories: Story[];
  characters: StoryCharacter[];
  interactiveStories: InteractiveStory[];
  magicItems: MagicItem[];
  customMagicItems: MagicItem[];
  creatures: Creature[];
  unlockedCreatures: Set<string>;
  searchQuery: string;
  selectedRegion: Region;
  selectedCharacterType: CharacterType;
  selectedMagicItemCategory: MagicItemCategory;
  selectedMagicItemRarity: MagicItemRarity | '全部';
  selectedCreatureHabitat: CreatureHabitat;
  selectedCreatureAbility: CreatureAbilityType;
  selectedCreatureDanger: DangerLevel;
  combineSlots: (MagicItem | null)[];
  likedStories: Set<string>;
  storyProgress: Record<string, StoryProgress>;
  regionWeathers: Record<Exclude<Region, '全部'>, WeatherType>;
  currentGlobalWeather: WeatherType;
  weatherChangeTimer: number;
  unlockedWeatherStories: Set<string>;
  academyCourses: Course[];
  academyBadges: SkillBadge[];
  academyTitles: Title[];
  completedLessons: Set<string>;
  completedCourses: Set<string>;
  earnedBadges: Set<string>;
  earnedTitles: Set<string>;
  currentTitle: string | null;
  totalAcademyExperience: number;
  quizScores: Record<string, number>;
  lessonStars: Record<string, number>;
  selectedAcademyCategory: CourseCategory | '全部';
  cosmicEvents: CosmicEvent[];
  activeEvents: ActiveCosmicEvent[];
  worldState: WorldState;
  eventLeaderboard: EventLeaderboardEntry[];
  eventHistory: EventHistoryRecord[];
  playerEventScore: number;
  playerEventsParticipated: number;
  playerEventsCompleted: number;
  playerEventTitles: string[];
  selectedEventTab: CosmicEventTab;
  setSelectedEventTab: (tab: CosmicEventTab) => void;
  triggerRandomEvent: () => void;
  startEvent: (eventId: string) => void;
  endEvent: (eventId: string, outcome: 'success' | 'partial' | 'failure') => void;
  updateEventProgress: (eventId: string, objectiveId: string, amount: number) => void;
  completeEventObjective: (eventId: string, objectiveId: string) => void;
  claimEventReward: (eventId: string, rewardIndex: number) => void;
  getActiveEventById: (eventId: string) => ActiveCosmicEvent | undefined;
  getCurrentActiveEvent: () => ActiveCosmicEvent | undefined;
  addWorldBuff: (buff: WorldBuff) => void;
  removeWorldBuff: (buffId: string) => void;
  updateWorldState: (updates: Partial<WorldState>) => void;
  levelUpWorld: () => void;
  addEventHistory: (record: EventHistoryRecord) => void;
  incrementPlayerEventScore: (amount: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedRegion: (region: Region) => void;
  setSelectedCharacterType: (type: CharacterType) => void;
  setSelectedMagicItemCategory: (category: MagicItemCategory) => void;
  setSelectedMagicItemRarity: (rarity: MagicItemRarity | '全部') => void;
  setSelectedCreatureHabitat: (habitat: CreatureHabitat) => void;
  setSelectedCreatureAbility: (ability: CreatureAbilityType) => void;
  setSelectedCreatureDanger: (danger: DangerLevel) => void;
  setCombineSlot: (index: number, item: MagicItem | null) => void;
  clearCombineSlots: () => void;
  addCustomMagicItem: (item: MagicItem) => void;
  removeCustomMagicItem: (id: string) => void;
  toggleLike: (storyId: string) => void;
  isLiked: (storyId: string) => boolean;
  unlockCreature: (creatureId: string) => void;
  isCreatureUnlocked: (creatureId: string) => boolean;
  initStoryProgress: (interactiveStoryId: string, startNodeId: string) => void;
  setCurrentNode: (interactiveStoryId: string, nodeId: string) => void;
  recordChoice: (interactiveStoryId: string, nodeId: string, choiceId: string) => void;
  addVisitedNode: (interactiveStoryId: string, nodeId: string) => void;
  addDiscoveredEnding: (
    interactiveStoryId: string,
    endingNodeId: string,
    route: EndingRoute
  ) => void;
  resetStoryProgress: (interactiveStoryId: string, startNodeId: string) => void;
  setRegionWeather: (region: Exclude<Region, '全部'>, weather: WeatherType) => void;
  setGlobalWeather: (weather: WeatherType) => void;
  advanceWeather: () => void;
  getWeatherByRegion: (region: Region) => WeatherType;
  getWeatherEffect: (weather: WeatherType) => WeatherEffect;
  getWeatherForecast: (region: Region) => WeatherForecast;
  isRegionUnlocked: (region: Region) => boolean;
  isStoryWeatherUnlocked: (storyId: string, storyRegion: Region, storyTags: string[]) => boolean;
  unlockWeatherStory: (storyId: string) => void;
  getCharacterWeatherBuff: (characterType: CharacterType, weather: WeatherType) => number;
  setSelectedAcademyCategory: (category: CourseCategory | '全部') => void;
  completeLesson: (lessonId: string, courseId: string, stars?: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isCourseCompleted: (courseId: string) => boolean;
  getCourseProgress: (courseId: string) => number;
  addAcademyExperience: (amount: number) => void;
  earnBadge: (badgeId: string) => void;
  hasBadge: (badgeId: string) => boolean;
  earnTitle: (titleId: string) => void;
  hasTitle: (titleId: string) => boolean;
  setCurrentTitle: (titleId: string | null) => void;
  setQuizScore: (quizId: string, score: number) => void;
  getQuizScore: (quizId: string) => number;
  completeCourse: (courseId: string) => void;
  isLessonUnlocked: (lessonId: string, courseId: string) => boolean;
  dreamCreatures: DreamCreature[];
  characterDreamStates: Record<string, CharacterDreamState>;
  activeDreamCharacterId: string | null;
  currentDreamEncounter: DreamEncounter | null;
  selectedDreamTab: DreamTab;
  dayNightPhase: DayNightPhase;
  gameHour: number;
  dayNightTimer: number;
  autoDreamEnabled: boolean;
  lastNightDreamTriggered: boolean;
  setSelectedDreamTab: (tab: DreamTab) => void;
  initDreamForCharacter: (characterId: string) => void;
  enterDream: (characterId: string) => void;
  exitDream: () => void;
  travelToDreamLocation: (locationId: string) => void;
  triggerDreamEncounter: () => void;
  resolveDreamEncounter: (optionId: string) => void;
  closeDreamEncounter: () => void;
  grantWish: (wishId: string) => void;
  confrontFear: (fearId: string) => void;
  discoverDreamLocation: (locationId: string) => void;
  addDreamMemory: (memory: Omit<DreamMemory, 'id' | 'timestamp'>) => void;
  getCharacterDreamState: (characterId: string) => CharacterDreamState | undefined;
  levelUpDream: (characterId: string) => void;
  updateDistortion: (characterId: string, amount: number) => void;
  advanceDayNight: () => void;
  setAutoDreamEnabled: (enabled: boolean) => void;
  getCurrentDreamLocations: () => DreamLocation[];
  getCurrentDreamState: () => CharacterDreamState | undefined;
  languageWords: LanguageWord[];
  languageGrammar: GrammarRule[];
  languagePuzzles: WordPuzzle[];
  ancientSteles: AncientStele[];
  selectedDecipherTab: DecipherTab;
  selectedLanguageRace: LanguageRace;
  unlockedLanguageWords: Record<string, boolean>;
  unlockedLanguageGrammar: Record<string, boolean>;
  completedLanguagePuzzles: Set<string>;
  discoveredSteles: Set<string>;
  translatedSteles: Set<string>;
  languageExperience: Record<LanguageRace, number>;
  languageLevels: Record<LanguageRace, number>;
  currentPuzzle: WordPuzzle | null;
  currentStele: AncientStele | null;
  setSelectedDecipherTab: (tab: DecipherTab) => void;
  setSelectedLanguageRace: (race: LanguageRace) => void;
  isWordUnlocked: (wordId: string) => boolean;
  unlockWord: (wordId: string) => void;
  isGrammarUnlocked: (grammarId: string) => boolean;
  unlockGrammar: (grammarId: string) => void;
  completePuzzle: (puzzleId: string) => void;
  isPuzzleCompleted: (puzzleId: string) => boolean;
  discoverStele: (steleId: string) => void;
  isSteleDiscovered: (steleId: string) => boolean;
  translateStele: (steleId: string) => void;
  isSteleTranslated: (steleId: string) => boolean;
  getWordsByRace: (race: LanguageRace) => LanguageWord[];
  getGrammarByRace: (race: LanguageRace) => GrammarRule[];
  getPuzzlesByRace: (race: LanguageRace) => WordPuzzle[];
  getStelesByRace: (race: LanguageRace) => AncientStele[];
  getUnlockedWordsByRace: (race: LanguageRace) => LanguageWord[];
  getUnlockedGrammarByRace: (race: LanguageRace) => GrammarRule[];
  addLanguageExperience: (race: LanguageRace, amount: number) => void;
  getLanguageLevel: (race: LanguageRace) => number;
  setCurrentPuzzle: (puzzle: WordPuzzle | null) => void;
  setCurrentStele: (stele: AncientStele | null) => void;
  canTranslateStele: (steleId: string) => boolean;
  railwayStations: RailwayStation[];
  railwayRoutes: RailwayRoute[];
  railwayEvents: RailwayEvent[];
  railwayProgress: RailwayProgress;
  selectedRailwayTab: RailwayTab;
  selectedTrainId: string | null;
  selectedRouteId: string | null;
  currentRailwayEvent: ActiveRailwayEvent | null;
  transportLogs: TransportLog[];
  railwayLevel: number;
  railwayExperience: number;
  autoAdvanceTrains: boolean;
  setSelectedRailwayTab: (tab: RailwayTab) => void;
  setSelectedTrainId: (id: string | null) => void;
  setSelectedRouteId: (id: string | null) => void;
  buildStation: (stationId: string) => boolean;
  buildRoute: (routeId: string) => boolean;
  upgradeStation: (stationId: string) => boolean;
  startTrain: (trainId: string, routeId: string) => boolean;
  completeTrainJourney: (trainId: string) => void;
  triggerRailwayEvent: (trainId: string, routeId: string) => void;
  resolveRailwayEvent: (eventId: string, choiceId?: string) => void;
  closeRailwayEvent: () => void;
  addRailwayExperience: (amount: number) => void;
  levelUpRailway: () => void;
  addResource: (type: ResourceType, amount: number) => void;
  removeResource: (type: ResourceType, amount: number) => boolean;
  getBuiltStations: () => RailwayStation[];
  getBuiltRoutes: () => RailwayRoute[];
  getAvailableRoutesForStation: (stationId: string) => RailwayRoute[];
  getAvailableEvents: (routeId: string, weather: string, timeOfDay: string) => RailwayEvent[];
  setAutoAdvanceTrains: (enabled: boolean) => void;
  updateTrainPosition: (trainId: string, progress: number) => void;
  repairTrain: (trainId: string) => void;
  addTransportLog: (log: Omit<TransportLog, 'id'>) => void;
  getTotalTransportedPassengers: () => number;
  getTotalTransportedResources: () => number;
  getRailwayLevel: () => number;
  canBuildStation: (stationId: string) => boolean;
  canBuildRoute: (routeId: string) => boolean;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories,
  characters,
  interactiveStories,
  magicItems,
  customMagicItems: [],
  creatures,
  unlockedCreatures: new Set(),
  searchQuery: '',
  selectedRegion: '全部',
  selectedCharacterType: '全部',
  selectedMagicItemCategory: '全部',
  selectedMagicItemRarity: '全部',
  selectedCreatureHabitat: '全部',
  selectedCreatureAbility: '全部',
  selectedCreatureDanger: '全部',
  combineSlots: [null, null, null, null, null],
  likedStories: new Set(),
  storyProgress: {},
  regionWeathers: {
    '丹麦': '晴朗',
    '德国': '晴朗',
    '中国': '花瓣雨',
    '阿拉伯': '晴朗',
    '古希腊': '晴朗',
    '法国': '花瓣雨',
    '俄罗斯': '白雪',
    '日本': '花瓣雨',
    '印度': '彩虹桥',
    '北欧': '魔法极光',
    '英国': '月光夜',
  },
  currentGlobalWeather: '晴朗',
  weatherChangeTimer: 300,
  unlockedWeatherStories: new Set(),
  academyCourses: courses,
  academyBadges: allBadges,
  academyTitles: allTitles,
  completedLessons: new Set(),
  completedCourses: new Set(),
  earnedBadges: new Set(),
  earnedTitles: new Set(),
  currentTitle: null,
  totalAcademyExperience: 0,
  quizScores: {},
  lessonStars: {},
  selectedAcademyCategory: '全部',
  cosmicEvents,
  activeEvents: [],
  worldState: initialWorldState,
  eventLeaderboard: initialLeaderboard,
  eventHistory: initialEventHistory,
  playerEventScore: 0,
  playerEventsParticipated: 0,
  playerEventsCompleted: 0,
  playerEventTitles: [],
  selectedEventTab: 'current',
  dreamCreatures: DREAM_CREATURES,
  characterDreamStates: {},
  activeDreamCharacterId: null,
  currentDreamEncounter: null,
  selectedDreamTab: 'character-select',
  dayNightPhase: 'day',
  gameHour: 12,
  dayNightTimer: 0,
  autoDreamEnabled: false,
  lastNightDreamTriggered: false,
  languageWords: allWords,
  languageGrammar: allGrammar,
  languagePuzzles: allPuzzles,
  ancientSteles: ancientSteles,
  selectedDecipherTab: 'overview',
  selectedLanguageRace: '精灵',
  unlockedLanguageWords: allWords.reduce((acc, word) => {
    acc[word.id] = word.unlocked;
    return acc;
  }, {} as Record<string, boolean>),
  unlockedLanguageGrammar: allGrammar.reduce((acc, grammar) => {
    acc[grammar.id] = grammar.unlocked;
    return acc;
  }, {} as Record<string, boolean>),
  completedLanguagePuzzles: new Set(),
  discoveredSteles: new Set(ancientSteles.filter((s) => s.discovered).map((s) => s.id)),
  translatedSteles: new Set(),
  languageExperience: { '精灵': 0, '龙': 0, '海妖': 0 },
  languageLevels: { '精灵': 1, '龙': 1, '海妖': 1 },
  currentPuzzle: null,
  currentStele: null,

  setSelectedDreamTab: (tab) => set({ selectedDreamTab: tab }),
  initDreamForCharacter: (characterId) => {
    const state = get();
    if (state.characterDreamStates[characterId]) return;
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;
    const wishes = generateWishesForCharacter(character);
    const fears = generateFearsForCharacter(character);
    const locations = generateLocationsForCharacter(character);
    const discovered = locations.filter((l) => l.discovered).map((l) => l.id);
    const wishProgress: Record<string, number> = {};
    const fearProgress: Record<string, number> = {};
    wishes.forEach((w) => { wishProgress[w.id] = 0; });
    fears.forEach((f) => { fearProgress[f.id] = 0; });
    const startLocation = discovered[0] || locations[0]?.id || 'dl1';
    const dreamState: CharacterDreamState = {
      characterId,
      dreamLevel: 1,
      lucidity: 50,
      dreamStability: 70,
      distortionLevel: 20,
      dreamLocations: locations,
      discoveredLocationIds: discovered,
      currentLocationId: startLocation,
      encounteredCreatureIds: [],
      innerWishes: wishes,
      innerFears: fears,
      wishProgress,
      fearProgress,
      dreamMemories: [],
      unlockedDreamLayers: 1,
      totalDreamTime: 0,
      lastDreamEntry: undefined,
    };
    set({
      characterDreamStates: { ...state.characterDreamStates, [characterId]: dreamState },
    });
  },
  enterDream: (characterId) => {
    const state = get();
    if (!state.characterDreamStates[characterId]) {
      state.initDreamForCharacter(characterId);
    }
    const dreamState = get().characterDreamStates[characterId];
    if (!dreamState) return;
    const updated = { ...dreamState, lastDreamEntry: Date.now() };
    set({
      activeDreamCharacterId: characterId,
      currentDreamEncounter: null,
      selectedDreamTab: 'overview',
      characterDreamStates: { ...get().characterDreamStates, [characterId]: updated },
    });
  },
  exitDream: () => {
    const state = get();
    const characterId = state.activeDreamCharacterId;
    if (!characterId) return;
    const dreamState = state.characterDreamStates[characterId];
    if (dreamState && dreamState.lastDreamEntry) {
      const elapsed = Math.floor((Date.now() - dreamState.lastDreamEntry) / 1000);
      const updated = {
        ...dreamState,
        totalDreamTime: dreamState.totalDreamTime + elapsed,
      };
      set({
        characterDreamStates: { ...state.characterDreamStates, [characterId]: updated },
      });
    }
    set({
      activeDreamCharacterId: null,
      currentDreamEncounter: null,
    });
  },
  travelToDreamLocation: (locationId) => {
    const state = get();
    const characterId = state.activeDreamCharacterId;
    if (!characterId) return;
    const dreamState = state.characterDreamStates[characterId];
    if (!dreamState) return;
    const location = dreamState.dreamLocations.find((l) => l.id === locationId);
    if (!location) return;
    const discovered = new Set(dreamState.discoveredLocationIds);
    let updatedLocations = dreamState.dreamLocations;
    let updatedDs: CharacterDreamState = { ...dreamState, currentLocationId: locationId };
    if (!discovered.has(locationId)) {
      discovered.add(locationId);
      updatedLocations = dreamState.dreamLocations.map((l) =>
        l.id === locationId ? { ...l, discovered: true } : l
      );
      updatedDs = {
        ...updatedDs,
        dreamLocations: updatedLocations,
        discoveredLocationIds: Array.from(discovered),
      };
      const memoryData: Omit<DreamMemory, 'id' | 'timestamp'> = {
        characterId,
        locationId,
        type: 'discovery',
        title: `发现了${location.name}`,
        description: location.twistedDescription,
        impactOnDream: 10,
      };
      set({
        characterDreamStates: { ...state.characterDreamStates, [characterId]: updatedDs },
      });
      get().addDreamMemory(memoryData);
      const trigger = DREAM_EVOLUTION_TRIGGERS.find((t) => t.type === 'location_discovered');
      if (trigger && discovered.size >= trigger.threshold) {
        if (trigger.distortionShift) {
          get().updateDistortion(characterId, trigger.distortionShift);
        }
      }
    } else {
      set({
        characterDreamStates: { ...state.characterDreamStates, [characterId]: updatedDs },
      });
    }
  },
  triggerDreamEncounter: () => {
    const state = get();
    const characterId = state.activeDreamCharacterId;
    const dreamState = state.characterDreamStates[characterId || ''];
    if (!characterId || !dreamState || !dreamState.currentLocationId) return;
    const encounter = generateDreamEncounter(characterId, dreamState.currentLocationId, dreamState.dreamLevel);
    set({ currentDreamEncounter: encounter });
  },
  resolveDreamEncounter: (optionId) => {
    const state = get();
    const characterId = state.activeDreamCharacterId;
    const encounter = state.currentDreamEncounter;
    if (!characterId || !encounter) return;
    const dreamState = state.characterDreamStates[characterId];
    if (!dreamState || !dreamState.currentLocationId) return;
    const locationId = dreamState.currentLocationId;
    const option = encounter.options.find((o) => o.id === optionId);
    if (!option) return;
    let newLucidity = Math.max(0, Math.min(100, dreamState.lucidity + option.lucidityChange));
    let newStability = Math.max(0, Math.min(100, dreamState.dreamStability + option.stabilityChange));
    const updatedWishes = [...dreamState.innerWishes];
    const updatedFears = [...dreamState.innerFears];
    const newWishProgress = { ...dreamState.wishProgress };
    const newFearProgress = { ...dreamState.fearProgress };
    let updatedLocations = [...dreamState.dreamLocations];
    let newDiscovered = [...dreamState.discoveredLocationIds];
    const memoriesToAdd: Omit<DreamMemory, 'id' | 'timestamp'>[] = [];
    if (option.wishProgress) {
      updatedWishes.forEach((wish, idx) => {
        const current = newWishProgress[wish.id] || 0;
        const next = Math.min(100, current + option.wishProgress!);
        newWishProgress[wish.id] = next;
        if (next >= 100 && !wish.granted) {
          updatedWishes[idx] = { ...wish, granted: true };
          memoriesToAdd.push({
            characterId,
            locationId,
            type: 'wish_granted',
            title: `愿望实现：${wish.title}`,
            description: wish.description,
            impactOnDream: 30,
          });
        }
      });
    }
    if (option.fearProgress) {
      updatedFears.forEach((fear, idx) => {
        const current = newFearProgress[fear.id] || 0;
        const next = Math.min(100, current + option.fearProgress!);
        newFearProgress[fear.id] = next;
        if (next >= 100 && !fear.confronted) {
          updatedFears[idx] = { ...fear, confronted: true };
          memoriesToAdd.push({
            characterId,
            locationId,
            type: 'confrontation',
            title: `直面恐惧：${fear.title}`,
            description: fear.description,
            impactOnDream: 35,
          });
        }
      });
    }
    if (option.unlocksLocationId) {
      const loc = dreamState.dreamLocations.find((l) => l.id === option.unlocksLocationId);
      if (loc && !newDiscovered.includes(option.unlocksLocationId)) {
        newDiscovered.push(option.unlocksLocationId);
        updatedLocations = updatedLocations.map((l) =>
          l.id === option.unlocksLocationId ? { ...l, discovered: true } : l
        );
        memoriesToAdd.push({
          characterId,
          locationId: option.unlocksLocationId,
          type: 'discovery',
          title: `新道路：${loc.name}`,
          description: loc.description,
          impactOnDream: 15,
        });
      }
    }
    if (option.outcome === 'revelation') {
      memoriesToAdd.push({
        characterId,
        locationId,
        type: 'revelation',
        title: encounter.title,
        description: option.impactDescription,
        impactOnDream: 20,
      });
    } else {
      memoriesToAdd.push({
        characterId,
        locationId,
        type: 'encounter',
        title: encounter.title,
        description: option.impactDescription,
        impactOnDream: 10,
      });
    }
    let newLevel = dreamState.dreamLevel;
    const currentMemories = dreamState.dreamMemories.length + memoriesToAdd.length;
    if (currentMemories >= newLevel * 5 && newLevel < 10) {
      newLevel = newLevel + 1;
    }
    const newEncountered = new Set(dreamState.encounteredCreatureIds);
    if (encounter.creatureId) {
      newEncountered.add(encounter.creatureId);
    }
    const newDistortion = Math.max(0, Math.min(100, dreamState.distortionLevel + (option.outcome === 'negative' ? 8 : option.outcome === 'positive' ? -3 : 2)));
    const updated: CharacterDreamState = {
      ...dreamState,
      lucidity: newLucidity,
      dreamStability: newStability,
      distortionLevel: newDistortion,
      dreamLevel: newLevel,
      innerWishes: updatedWishes,
      innerFears: updatedFears,
      wishProgress: newWishProgress,
      fearProgress: newFearProgress,
      dreamLocations: updatedLocations,
      discoveredLocationIds: newDiscovered,
      encounteredCreatureIds: Array.from(newEncountered),
    };
    set({
      characterDreamStates: { ...state.characterDreamStates, [characterId]: updated },
    });
    memoriesToAdd.forEach((m) => get().addDreamMemory(m));
    if (newLevel > dreamState.dreamLevel) {
      const trigger = DREAM_EVOLUTION_TRIGGERS.find((t) => t.type === 'dream_level_up');
      if (trigger && trigger.distortionShift) {
        get().updateDistortion(characterId, trigger.distortionShift);
      }
    }
  },
  closeDreamEncounter: () => set({ currentDreamEncounter: null }),
  grantWish: (wishId) => {
    const state = get();
    const characterId = state.activeDreamCharacterId;
    if (!characterId) return;
    const dreamState = state.characterDreamStates[characterId];
    if (!dreamState) return;
    const updatedWishes = dreamState.innerWishes.map((w) =>
      w.id === wishId ? { ...w, granted: true } : w
    );
    const newWishProgress = { ...dreamState.wishProgress, [wishId]: 100 };
    const wish = dreamState.innerWishes.find((w) => w.id === wishId);
    if (wish) {
      get().addDreamMemory({
        characterId,
        locationId: dreamState.currentLocationId || 'dl1',
        type: 'wish_granted',
        title: `愿望实现：${wish.title}`,
        description: wish.description,
        impactOnDream: 30,
      });
    }
    set({
      characterDreamStates: {
        ...state.characterDreamStates,
        [characterId]: { ...dreamState, innerWishes: updatedWishes, wishProgress: newWishProgress },
      },
    });
  },
  confrontFear: (fearId) => {
    const state = get();
    const characterId = state.activeDreamCharacterId;
    if (!characterId) return;
    const dreamState = state.characterDreamStates[characterId];
    if (!dreamState) return;
    const updatedFears = dreamState.innerFears.map((f) =>
      f.id === fearId ? { ...f, confronted: true } : f
    );
    const newFearProgress = { ...dreamState.fearProgress, [fearId]: 100 };
    const fear = dreamState.innerFears.find((f) => f.id === fearId);
    if (fear) {
      get().addDreamMemory({
        characterId,
        locationId: dreamState.currentLocationId || 'dl1',
        type: 'confrontation',
        title: `直面恐惧：${fear.title}`,
        description: fear.description,
        impactOnDream: 35,
      });
    }
    set({
      characterDreamStates: {
        ...state.characterDreamStates,
        [characterId]: { ...dreamState, innerFears: updatedFears, fearProgress: newFearProgress },
      },
    });
  },
  discoverDreamLocation: (locationId) => {
    const state = get();
    const characterId = state.activeDreamCharacterId;
    if (!characterId) return;
    const dreamState = state.characterDreamStates[characterId];
    if (!dreamState) return;
    if (dreamState.discoveredLocationIds.includes(locationId)) return;
    const updatedLocations = dreamState.dreamLocations.map((l) =>
      l.id === locationId ? { ...l, discovered: true } : l
    );
    set({
      characterDreamStates: {
        ...state.characterDreamStates,
        [characterId]: {
          ...dreamState,
          dreamLocations: updatedLocations,
          discoveredLocationIds: [...dreamState.discoveredLocationIds, locationId],
        },
      },
    });
  },
  addDreamMemory: (memory) => {
    const state = get();
    const { characterId } = memory;
    const dreamState = state.characterDreamStates[characterId];
    if (!dreamState) return;
    const newMemory: DreamMemory = {
      ...memory,
      id: `mem_${characterId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    const currentMemories = [...dreamState.dreamMemories, newMemory];
    let newLayer = dreamState.unlockedDreamLayers;
    const layerThresholds = [3, 8, 15, 25, 40];
    for (const threshold of layerThresholds) {
      if (currentMemories.length >= threshold && newLayer <= layerThresholds.indexOf(threshold) + 1) {
        newLayer = layerThresholds.indexOf(threshold) + 2;
      }
    }
    set({
      characterDreamStates: {
        ...state.characterDreamStates,
        [characterId]: {
          ...dreamState,
          dreamMemories: currentMemories,
          unlockedDreamLayers: newLayer,
        },
      },
    });
  },
  getCharacterDreamState: (characterId) => {
    return get().characterDreamStates[characterId];
  },
  getCurrentDreamState: () => {
    const state = get();
    if (!state.activeDreamCharacterId) return undefined;
    return state.characterDreamStates[state.activeDreamCharacterId];
  },
  getCurrentDreamLocations: () => {
    const state = get();
    if (!state.activeDreamCharacterId) return [];
    return state.characterDreamStates[state.activeDreamCharacterId]?.dreamLocations || [];
  },
  levelUpDream: (characterId) => {
    const state = get();
    const dreamState = state.characterDreamStates[characterId];
    if (!dreamState) return;
    const newLevel = Math.min(10, dreamState.dreamLevel + 1);
    set({
      characterDreamStates: {
        ...state.characterDreamStates,
        [characterId]: { ...dreamState, dreamLevel: newLevel },
      },
    });
  },
  updateDistortion: (characterId, amount) => {
    const state = get();
    const dreamState = state.characterDreamStates[characterId];
    if (!dreamState) return;
    const newDistortion = Math.max(0, Math.min(100, dreamState.distortionLevel + amount));
    set({
      characterDreamStates: {
        ...state.characterDreamStates,
        [characterId]: { ...dreamState, distortionLevel: newDistortion },
      },
    });
  },
  setAutoDreamEnabled: (enabled) => set({ autoDreamEnabled: enabled }),
  advanceDayNight: () => {
    const state = get();
    let newHour = state.gameHour + 1;
    let newPhase: DayNightPhase = state.dayNightPhase;
    let triggered = state.lastNightDreamTriggered;
    if (newHour >= 24) newHour = 0;
    if (newHour >= 6 && newHour < 8) {
      newPhase = 'dawn';
    } else if (newHour >= 8 && newHour < 17) {
      newPhase = 'day';
      triggered = false;
    } else if (newHour >= 17 && newHour < 20) {
      newPhase = 'dusk';
    } else {
      newPhase = 'night';
    }
    set({
      gameHour: newHour,
      dayNightPhase: newPhase,
      lastNightDreamTriggered: triggered,
    });
    if (newPhase === 'night' && !triggered) {
      set({ lastNightDreamTriggered: true });
    }
  },

  setSelectedDecipherTab: (tab) => set({ selectedDecipherTab: tab }),
  setSelectedLanguageRace: (race) => set({ selectedLanguageRace: race }),
  isWordUnlocked: (wordId) => {
    return get().unlockedLanguageWords[wordId] || false;
  },
  unlockWord: (wordId) => {
    const state = get();
    if (state.unlockedLanguageWords[wordId]) return;
    set({
      unlockedLanguageWords: {
        ...state.unlockedLanguageWords,
        [wordId]: true,
      },
    });
  },
  isGrammarUnlocked: (grammarId) => {
    return get().unlockedLanguageGrammar[grammarId] || false;
  },
  unlockGrammar: (grammarId) => {
    const state = get();
    if (state.unlockedLanguageGrammar[grammarId]) return;
    set({
      unlockedLanguageGrammar: {
        ...state.unlockedLanguageGrammar,
        [grammarId]: true,
      },
    });
  },
  completePuzzle: (puzzleId) => {
    const state = get();
    if (state.completedLanguagePuzzles.has(puzzleId)) return;
    const puzzle = getPuzzleById(puzzleId);
    if (!puzzle) return;
    const newCompleted = new Set(state.completedLanguagePuzzles);
    newCompleted.add(puzzleId);
    const newUnlockedWords = { ...state.unlockedLanguageWords };
    puzzle.rewardWordIds.forEach((wordId) => {
      newUnlockedWords[wordId] = true;
    });
    const newUnlockedGrammar = { ...state.unlockedLanguageGrammar };
    if (puzzle.rewardGrammarIds) {
      puzzle.rewardGrammarIds.forEach((grammarId) => {
        newUnlockedGrammar[grammarId] = true;
      });
    }
    const newExp = { ...state.languageExperience };
    newExp[puzzle.race] = (newExp[puzzle.race] || 0) + puzzle.experienceReward;
    const newLevels = { ...state.languageLevels };
    const expNeeded = newLevels[puzzle.race] * 200;
    if (newExp[puzzle.race] >= expNeeded) {
      newLevels[puzzle.race] = Math.min(10, newLevels[puzzle.race] + 1);
    }
    set({
      completedLanguagePuzzles: newCompleted,
      unlockedLanguageWords: newUnlockedWords,
      unlockedLanguageGrammar: newUnlockedGrammar,
      languageExperience: newExp,
      languageLevels: newLevels,
    });
  },
  isPuzzleCompleted: (puzzleId) => get().completedLanguagePuzzles.has(puzzleId),
  discoverStele: (steleId) => {
    const state = get();
    if (state.discoveredSteles.has(steleId)) return;
    const newDiscovered = new Set(state.discoveredSteles);
    newDiscovered.add(steleId);
    set({ discoveredSteles: newDiscovered });
  },
  isSteleDiscovered: (steleId) => get().discoveredSteles.has(steleId),
  translateStele: (steleId) => {
    const state = get();
    if (state.translatedSteles.has(steleId)) return;
    if (!state.canTranslateStele(steleId)) return;
    const newTranslated = new Set(state.translatedSteles);
    newTranslated.add(steleId);
    const stele = getSteleById(steleId);
    if (stele) {
      const newExp = { ...state.languageExperience };
      newExp[stele.race] = (newExp[stele.race] || 0) + 300;
      const newLevels = { ...state.languageLevels };
      const expNeeded = newLevels[stele.race] * 200;
      if (newExp[stele.race] >= expNeeded) {
        newLevels[stele.race] = Math.min(10, newLevels[stele.race] + 1);
      }
      set({
        translatedSteles: newTranslated,
        languageExperience: newExp,
        languageLevels: newLevels,
      });
      return;
    }
    set({ translatedSteles: newTranslated });
  },
  isSteleTranslated: (steleId) => get().translatedSteles.has(steleId),
  getWordsByRace: (race) => getWordsByRace(race),
  getGrammarByRace: (race) => getGrammarByRace(race),
  getPuzzlesByRace: (race) => getPuzzlesByRace(race),
  getStelesByRace: (race) => getStelesByRace(race),
  getUnlockedWordsByRace: (race) => {
    const state = get();
    return getWordsByRace(race).filter((w) => state.unlockedLanguageWords[w.id]);
  },
  getUnlockedGrammarByRace: (race) => {
    const state = get();
    return getGrammarByRace(race).filter((g) => state.unlockedLanguageGrammar[g.id]);
  },
  addLanguageExperience: (race, amount) => {
    const state = get();
    const newExp = { ...state.languageExperience };
    newExp[race] = (newExp[race] || 0) + amount;
    const newLevels = { ...state.languageLevels };
    let level = newLevels[race];
    while (newExp[race] >= level * 200 && level < 10) {
      level++;
    }
    newLevels[race] = level;
    set({
      languageExperience: newExp,
      languageLevels: newLevels,
    });
  },
  getLanguageLevel: (race) => get().languageLevels[race] || 1,
  setCurrentPuzzle: (puzzle) => set({ currentPuzzle: puzzle }),
  setCurrentStele: (stele) => set({ currentStele: stele }),
  canTranslateStele: (steleId) => {
    const state = get();
    const stele = getSteleById(steleId);
    if (!stele) return false;
    const hasAllWords = stele.requiredWords.every((wordId) => state.unlockedLanguageWords[wordId]);
    const hasAllGrammar = stele.requiredGrammar.every((grammarId) => state.unlockedLanguageGrammar[grammarId]);
    return hasAllWords && hasAllGrammar;
  },

  railwayStations: RAILWAY_STATIONS,
  railwayRoutes: RAILWAY_ROUTES,
  railwayEvents: RAILWAY_EVENTS,
  railwayProgress: {
    builtStations: new Set(RAILWAY_STATIONS.filter(s => s.built).map(s => s.id)),
    builtRoutes: new Set(RAILWAY_ROUTES.filter(r => r.built).map(r => r.id)),
    trains: INITIAL_TRAINS,
    resources: { ...INITIAL_RESOURCES },
    magicCrystals: 100,
    experience: 0,
    level: 1,
    activeEvents: [],
    eventHistory: [],
    stationUpgrades: {},
    discoveredSecrets: new Set(),
    encounteredCharacters: new Set(),
    completedSideStories: new Set(),
    totalPassengersTransported: 0,
    totalResourcesTransported: 0,
  },
  selectedRailwayTab: 'map',
  selectedTrainId: null,
  selectedRouteId: null,
  currentRailwayEvent: null,
  transportLogs: [],
  railwayLevel: 1,
  railwayExperience: 0,
  autoAdvanceTrains: false,

  setSelectedRailwayTab: (tab) => set({ selectedRailwayTab: tab }),
  setSelectedTrainId: (id) => set({ selectedTrainId: id }),
  setSelectedRouteId: (id) => set({ selectedRouteId: id }),

  canBuildStation: (stationId) => {
    const state = get();
    return canBuildStation(stationId, state.railwayProgress.magicCrystals, state.railwayProgress.builtStations);
  },

  canBuildRoute: (routeId) => {
    const state = get();
    return canBuildRoute(routeId, state.railwayProgress.magicCrystals, state.railwayProgress.builtRoutes, state.railwayProgress.builtStations);
  },

  buildStation: (stationId) => {
    const state = get();
    const station = getStationById(stationId);
    if (!station) return false;
    if (!state.canBuildStation(stationId)) return false;

    const newBuiltStations = new Set(state.railwayProgress.builtStations);
    newBuiltStations.add(stationId);
    const newCrystals = state.railwayProgress.magicCrystals - station.buildCost;

    set({
      railwayProgress: {
        ...state.railwayProgress,
        builtStations: newBuiltStations,
        magicCrystals: newCrystals,
      },
    });

    state.addRailwayExperience(50);
    return true;
  },

  buildRoute: (routeId) => {
    const state = get();
    const route = getRouteById(routeId);
    if (!route) return false;
    if (!state.canBuildRoute(routeId)) return false;

    const newBuiltRoutes = new Set(state.railwayProgress.builtRoutes);
    newBuiltRoutes.add(routeId);
    const newCrystals = state.railwayProgress.magicCrystals - route.buildCost;

    set({
      railwayProgress: {
        ...state.railwayProgress,
        builtRoutes: newBuiltRoutes,
        magicCrystals: newCrystals,
      },
    });

    state.addRailwayExperience(30);
    return true;
  },

  upgradeStation: (stationId) => {
    const state = get();
    const station = getStationById(stationId);
    if (!station) return false;
    if (!state.railwayProgress.builtStations.has(stationId) && !station.built) return false;

    const currentLevel = state.railwayProgress.stationUpgrades[stationId] || 1;
    const upgradeCost = station.buildCost * currentLevel * 0.5;
    
    if (state.railwayProgress.magicCrystals < upgradeCost) return false;

    const newUpgrades = { ...state.railwayProgress.stationUpgrades };
    newUpgrades[stationId] = currentLevel + 1;

    set({
      railwayProgress: {
        ...state.railwayProgress,
        stationUpgrades: newUpgrades,
        magicCrystals: state.railwayProgress.magicCrystals - upgradeCost,
      },
    });

    state.addRailwayExperience(80);
    return true;
  },

  startTrain: (trainId, routeId) => {
    const state = get();
    const train = state.railwayProgress.trains.find(t => t.id === trainId);
    const route = getRouteById(routeId);
    
    if (!train || !route) return false;
    if (train.status !== '停靠') return false;
    if (!state.railwayProgress.builtRoutes.has(routeId) && !route.built) return false;

    const startStation = getStationById(route.startStationId);
    const endStation = getStationById(route.endStationId);
    if (!startStation || !endStation) return false;

    const isAtStart = train.currentStationId === route.startStationId;
    const actualStart = isAtStart ? route.startStationId : route.endStationId;
    const actualEnd = isAtStart ? route.endStationId : route.startStationId;

    const updatedTrains = state.railwayProgress.trains.map(t => {
      if (t.id === trainId) {
        return {
          ...t,
          status: '行驶中' as const,
          nextStationId: actualEnd,
          departureTime: Date.now(),
          arrivalTime: Date.now() + route.travelTime * 1000,
          routeId,
        };
      }
      return t;
    });

    set({
      railwayProgress: {
        ...state.railwayProgress,
        trains: updatedTrains,
      },
    });

    setTimeout(() => {
      if (Math.random() < route.eventChance) {
        state.triggerRailwayEvent(trainId, routeId);
      }
    }, route.travelTime * 500);

    return true;
  },

  completeTrainJourney: (trainId) => {
    const state = get();
    const train = state.railwayProgress.trains.find(t => t.id === trainId);
    if (!train || train.status !== '行驶中' || !train.routeId || !train.nextStationId) return;

    const route = getRouteById(train.routeId);
    if (!route) return;

    const passengerCount = train.passengers.length;
    const cargoTotal = train.cargo.reduce((sum, c) => sum + c.amount, 0);

    const updatedTrains = state.railwayProgress.trains.map(t => {
      if (t.id === trainId) {
        return {
          ...t,
          currentStationId: train.nextStationId!,
          nextStationId: undefined,
          status: '停靠' as const,
          departureTime: undefined,
          arrivalTime: undefined,
          routeId: undefined,
        };
      }
      return t;
    });

    const newResources = { ...state.railwayProgress.resources };
    train.cargo.forEach(c => {
      newResources[c.resourceType] = (newResources[c.resourceType] || 0) + c.amount;
    });

    const log: Omit<TransportLog, 'id'> = {
      trainId,
      routeId: train.routeId,
      startTime: train.departureTime || Date.now(),
      endTime: Date.now(),
      cargo: [...train.cargo],
      passengers: train.passengers.map(p => p.name),
    };

    state.addTransportLog(log);

    set({
      railwayProgress: {
        ...state.railwayProgress,
        trains: updatedTrains,
        resources: newResources,
        totalPassengersTransported: state.railwayProgress.totalPassengersTransported + passengerCount,
        totalResourcesTransported: state.railwayProgress.totalResourcesTransported + cargoTotal,
      },
    });

    state.addRailwayExperience(Math.floor(route.distance / 10) + passengerCount * 5);
  },

  triggerRailwayEvent: (trainId, routeId) => {
    const state = get();
    const route = getRouteById(routeId);
    if (!route) return;

    const currentWeather = state.currentGlobalWeather;
    const timeOfDay = state.dayNightPhase;

    const availableEvents = state.getAvailableEvents(routeId, currentWeather, timeOfDay);
    if (availableEvents.length === 0) return;

    const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    
    const activeEvent: ActiveRailwayEvent = {
      eventId: randomEvent.id,
      routeId,
      trainId,
      startTime: Date.now(),
      status: 'active',
    };

    set({
      currentRailwayEvent: activeEvent,
      railwayProgress: {
        ...state.railwayProgress,
        activeEvents: [...state.railwayProgress.activeEvents, activeEvent],
      },
    });
  },

  resolveRailwayEvent: (eventId, choiceId) => {
    const state = get();
    const event = getEventById(eventId);
    if (!event) return;

    const activeEvent = state.railwayProgress.activeEvents.find(e => e.eventId === eventId);
    if (!activeEvent) return;

    let outcome = '';
    if (event.choices && choiceId) {
      const choice = event.choices.find(c => c.id === choiceId);
      if (choice) {
        outcome = choice.outcome;
      }
    }

    event.rewards.forEach(reward => {
      if (reward.type === '资源' && reward.item && reward.amount) {
        state.addResource(reward.item as ResourceType, reward.amount);
      } else if (reward.type === '经验' && reward.amount) {
        state.addRailwayExperience(reward.amount);
      } else if (reward.type === '故事' && reward.storyId) {
        const newCompleted = new Set(state.railwayProgress.completedSideStories);
        newCompleted.add(reward.storyId);
        set({
          railwayProgress: {
            ...state.railwayProgress,
            completedSideStories: newCompleted,
          },
        });
      } else if (reward.type === '角色' && reward.characterId) {
        const newEncountered = new Set(state.railwayProgress.encounteredCharacters);
        newEncountered.add(reward.characterId);
        set({
          railwayProgress: {
            ...state.railwayProgress,
            encounteredCharacters: newEncountered,
          },
        });
      }
    });

    const newActiveEvents = state.railwayProgress.activeEvents.filter(e => e.eventId !== eventId);
    const newEventHistory = [...state.railwayProgress.eventHistory, {
      eventId,
      timestamp: Date.now(),
      outcome,
    }];

    set({
      railwayProgress: {
        ...state.railwayProgress,
        activeEvents: newActiveEvents,
        eventHistory: newEventHistory,
      },
      currentRailwayEvent: null,
    });
  },

  closeRailwayEvent: () => set({ currentRailwayEvent: null }),

  addRailwayExperience: (amount) => {
    const state = get();
    const newExp = state.railwayExperience + amount;
    let newLevel = state.railwayLevel;
    const expNeeded = newLevel * 500;
    
    if (newExp >= expNeeded && newLevel < 10) {
      newLevel = newLevel + 1;
      set({
        railwayLevel: newLevel,
        railwayExperience: newExp - expNeeded,
        railwayProgress: {
          ...state.railwayProgress,
          level: newLevel,
          experience: newExp - expNeeded,
          magicCrystals: state.railwayProgress.magicCrystals + newLevel * 50,
        },
      });
    } else {
      set({
        railwayExperience: newExp,
        railwayProgress: {
          ...state.railwayProgress,
          experience: newExp,
        },
      });
    }
  },

  levelUpRailway: () => {
    const state = get();
    const newLevel = Math.min(10, state.railwayLevel + 1);
    set({
      railwayLevel: newLevel,
      railwayProgress: {
        ...state.railwayProgress,
        level: newLevel,
      },
    });
  },

  addResource: (type, amount) => {
    const state = get();
    const newResources = { ...state.railwayProgress.resources };
    newResources[type] = (newResources[type] || 0) + amount;
    set({
      railwayProgress: {
        ...state.railwayProgress,
        resources: newResources,
      },
    });
  },

  removeResource: (type, amount) => {
    const state = get();
    const current = state.railwayProgress.resources[type] || 0;
    if (current < amount) return false;
    const newResources = { ...state.railwayProgress.resources };
    newResources[type] = current - amount;
    set({
      railwayProgress: {
        ...state.railwayProgress,
        resources: newResources,
      },
    });
    return true;
  },

  getBuiltStations: () => {
    const state = get();
    return getBuiltStations(state.railwayProgress.builtStations);
  },

  getBuiltRoutes: () => {
    const state = get();
    return getBuiltRoutes(state.railwayProgress.builtRoutes);
  },

  getAvailableRoutesForStation: (stationId) => {
    const state = get();
    return state.railwayRoutes.filter(r => 
      (r.startStationId === stationId || r.endStationId === stationId) &&
      (state.railwayProgress.builtRoutes.has(r.id) || r.built)
    );
  },

  getAvailableEvents: (routeId, weather, timeOfDay) => {
    const state = get();
    const route = getRouteById(routeId);
    if (!route) return [];

    const startStation = getStationById(route.startStationId);
    const endStation = getStationById(route.endStationId);

    return state.railwayEvents.filter(event => {
      if (event.routeIds && !event.routeIds.includes(routeId)) return false;
      if (event.stationIds) {
        const hasStart = event.stationIds.includes(route.startStationId);
        const hasEnd = event.stationIds.includes(route.endStationId);
        if (!hasStart && !hasEnd) return false;
      }
      if (event.region && event.region !== '全部') {
        const regionsMatch = startStation?.region === event.region || endStation?.region === event.region;
        if (!regionsMatch) return false;
      }
      if (event.triggerCondition) {
        if (event.triggerCondition.includes('天气') && !event.triggerCondition.includes(weather)) return false;
        if (event.triggerCondition.includes('夜晚') && timeOfDay !== 'night') return false;
        if (event.triggerCondition.includes('白天') && timeOfDay !== 'day') return false;
      }
      const now = Date.now();
      if (event.lastTriggered && now - event.lastTriggered < event.cooldown * 1000) return false;
      
      return true;
    });
  },

  setAutoAdvanceTrains: (enabled) => set({ autoAdvanceTrains: enabled }),

  updateTrainPosition: (trainId, progress) => {
    const state = get();
    const updatedTrains = state.railwayProgress.trains.map(t => {
      if (t.id === trainId && t.status === '行驶中') {
        return t;
      }
      return t;
    });
    if (progress >= 1) {
      state.completeTrainJourney(trainId);
    }
  },

  repairTrain: (trainId) => {
    const state = get();
    const updatedTrains = state.railwayProgress.trains.map(t => {
      if (t.id === trainId && t.status === '维修中') {
        return { ...t, status: '停靠' as const };
      }
      return t;
    });
    set({
      railwayProgress: {
        ...state.railwayProgress,
        trains: updatedTrains,
      },
    });
  },

  addTransportLog: (log) => {
    const state = get();
    const newLog: TransportLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
    set({
      transportLogs: [newLog, ...state.transportLogs].slice(0, 50),
    });
  },

  getTotalTransportedPassengers: () => {
    return get().railwayProgress.totalPassengersTransported;
  },

  getTotalTransportedResources: () => {
    return get().railwayProgress.totalResourcesTransported;
  },

  getRailwayLevel: () => {
    return get().railwayLevel;
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setSelectedCharacterType: (type) => set({ selectedCharacterType: type }),
  setSelectedMagicItemCategory: (category) => set({ selectedMagicItemCategory: category }),
  setSelectedMagicItemRarity: (rarity) => set({ selectedMagicItemRarity: rarity }),
  setSelectedCreatureHabitat: (habitat) => set({ selectedCreatureHabitat: habitat }),
  setSelectedCreatureAbility: (ability) => set({ selectedCreatureAbility: ability }),
  setSelectedCreatureDanger: (danger) => set({ selectedCreatureDanger: danger }),
  toggleLike: (storyId) => {
    const current = get().likedStories;
    const next = new Set(current);
    if (next.has(storyId)) {
      next.delete(storyId);
    } else {
      next.add(storyId);
    }
    set({ likedStories: next });
  },
  isLiked: (storyId) => get().likedStories.has(storyId),
  unlockCreature: (creatureId) => {
    const current = get().unlockedCreatures;
    if (current.has(creatureId)) return;
    const next = new Set(current);
    next.add(creatureId);
    set({ unlockedCreatures: next });
  },
  isCreatureUnlocked: (creatureId) => get().unlockedCreatures.has(creatureId),
  setCombineSlot: (index, item) => {
    const current = get().combineSlots;
    const next = [...current];
    if (item === null) {
      next[index] = null;
    } else {
      const existingIndex = next.findIndex((s) => s?.id === item.id);
      if (existingIndex !== -1 && existingIndex !== index) {
        next[existingIndex] = null;
      }
      next[index] = item;
    }
    set({ combineSlots: next });
  },
  clearCombineSlots: () => set({ combineSlots: [null, null, null, null, null] }),
  addCustomMagicItem: (item) => {
    const current = get().customMagicItems;
    set({ customMagicItems: [item, ...current] });
  },
  removeCustomMagicItem: (id) => {
    const current = get().customMagicItems;
    set({ customMagicItems: current.filter((i) => i.id !== id) });
  },

  initStoryProgress: (interactiveStoryId, startNodeId) => {
    const current = get().storyProgress;
    if (current[interactiveStoryId]) return;
    const story = interactiveStories.find((s) => s.id === interactiveStoryId);
    if (!story) return;
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          storyId: story.storyId,
          currentNodeId: startNodeId,
          visitedNodes: [startNodeId],
          choiceHistory: [],
          discoveredEndings: [],
          endingRoutes: {},
        },
      },
    });
  },

  setCurrentNode: (interactiveStoryId, nodeId) => {
    const current = get().storyProgress;
    const progress = current[interactiveStoryId];
    if (!progress) return;
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          ...progress,
          currentNodeId: nodeId,
        },
      },
    });
  },

  recordChoice: (interactiveStoryId, nodeId, choiceId) => {
    const current = get().storyProgress;
    const progress = current[interactiveStoryId];
    if (!progress) return;
    const record: UserChoiceRecord = {
      nodeId,
      choiceId,
      timestamp: Date.now(),
    };
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          ...progress,
          choiceHistory: [...progress.choiceHistory, record],
        },
      },
    });
  },

  addVisitedNode: (interactiveStoryId, nodeId) => {
    const current = get().storyProgress;
    const progress = current[interactiveStoryId];
    if (!progress) return;
    if (progress.visitedNodes.includes(nodeId)) return;
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          ...progress,
          visitedNodes: [...progress.visitedNodes, nodeId],
        },
      },
    });
  },

  addDiscoveredEnding: (interactiveStoryId, endingNodeId, route) => {
    const current = get().storyProgress;
    const progress = current[interactiveStoryId];
    if (!progress) return;
    if (progress.discoveredEndings.includes(endingNodeId)) return;
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          ...progress,
          discoveredEndings: [...progress.discoveredEndings, endingNodeId],
          endingRoutes: {
            ...progress.endingRoutes,
            [endingNodeId]: route,
          },
        },
      },
    });
  },

  resetStoryProgress: (interactiveStoryId, startNodeId) => {
    const current = get().storyProgress;
    const story = interactiveStories.find((s) => s.id === interactiveStoryId);
    if (!story) return;
    const existingDiscovered = current[interactiveStoryId]?.discoveredEndings || [];
    const existingRoutes = current[interactiveStoryId]?.endingRoutes || {};
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          storyId: story.storyId,
          currentNodeId: startNodeId,
          visitedNodes: [startNodeId],
          choiceHistory: [],
          discoveredEndings: existingDiscovered,
          endingRoutes: existingRoutes,
        },
      },
    });
  },

  setRegionWeather: (region, weather) => {
    const current = get().regionWeathers;
    set({
      regionWeathers: {
        ...current,
        [region]: weather,
      },
    });
  },

  setGlobalWeather: (weather) => {
    set({ currentGlobalWeather: weather });
  },

  advanceWeather: () => {
    const { regionWeathers, currentGlobalWeather } = get();
    const weathers: WeatherType[] = ['晴朗', '白雪', '流星雨', '魔法极光', '糖果风暴', '花瓣雨', '月光夜', '彩虹桥'];
    const randomWeather = (): WeatherType => weathers[Math.floor(Math.random() * weathers.length)];

    const newWeathers = { ...regionWeathers };
    const regions = Object.keys(newWeathers) as Exclude<Region, '全部'>[];
    const regionsToChange = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < regionsToChange; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      newWeathers[region] = randomWeather();
    }

    set({
      regionWeathers: newWeathers,
      currentGlobalWeather: randomWeather(),
      weatherChangeTimer: 300 + Math.floor(Math.random() * 180),
    });
  },

  getWeatherByRegion: (region) => {
    if (region === '全部') return get().currentGlobalWeather;
    return get().regionWeathers[region] || '晴朗';
  },

  getWeatherEffect: (weather): WeatherEffect => {
    const effects: Record<WeatherType, WeatherEffect> = {
      晴朗: {
        characterBuff: {},
        unlockedRegions: [],
        hiddenStoryBonus: 0,
        storyUnlockTags: [],
        explorationModifier: 1,
      },
      白雪: {
        characterBuff: { '人鱼': 20, '精灵': 15, '公主': 10 },
        unlockedRegions: ['北欧', '俄罗斯'],
        hiddenStoryBonus: 10,
        storyUnlockTags: ['冰雪', '雪', '冬日', '寒冷'],
        explorationModifier: 0.9,
      },
      流星雨: {
        characterBuff: { '巫师': 30, '仙女': 25, '精灵': 20 },
        unlockedRegions: [],
        hiddenStoryBonus: 25,
        storyUnlockTags: ['愿望', '星', '奇迹', '魔法'],
        explorationModifier: 1.15,
      },
      魔法极光: {
        characterBuff: { '巫师': 25, '精灵': 25, '仙女': 20, '巨龙': 15 },
        unlockedRegions: ['北欧'],
        hiddenStoryBonus: 20,
        storyUnlockTags: ['魔法', '极光', '神秘', '力量'],
        explorationModifier: 1.2,
      },
      糖果风暴: {
        characterBuff: { '公主': 20, '矮人': 15, '动物': 15 },
        unlockedRegions: [],
        hiddenStoryBonus: 5,
        storyUnlockTags: ['甜蜜', '糖果', '幸福', '快乐'],
        explorationModifier: 1.1,
      },
      花瓣雨: {
        characterBuff: { '公主': 15, '仙女': 15, '王子': 10 },
        unlockedRegions: ['日本', '中国'],
        hiddenStoryBonus: 15,
        storyUnlockTags: ['爱情', '花', '浪漫', '春天'],
        explorationModifier: 1.1,
      },
      月光夜: {
        characterBuff: { '女巫': 25, '狼人': 30, '精灵': 20, '动物': 15 },
        unlockedRegions: ['英国'],
        hiddenStoryBonus: 25,
        storyUnlockTags: ['夜晚', '月', '神秘', '变身'],
        explorationModifier: 1.1,
      },
      彩虹桥: {
        characterBuff: { '仙女': 25, '精灵': 20, '公主': 15, '王子': 15 },
        unlockedRegions: ['印度', '古希腊'],
        hiddenStoryBonus: 20,
        storyUnlockTags: ['仙境', '彩虹', '传说', '神'],
        explorationModifier: 1.25,
      },
    };
    return effects[weather];
  },

  getWeatherForecast: (region): WeatherForecast => {
    const weathers: WeatherType[] = ['晴朗', '白雪', '流星雨', '魔法极光', '糖果风暴', '花瓣雨', '月光夜', '彩虹桥'];
    const current = region === '全部' ? get().currentGlobalWeather : get().regionWeathers[region];
    const next = weathers[Math.floor(Math.random() * weathers.length)];

    const hours = ['现在', '1小时后', '3小时后', '6小时后', '12小时后', '明天'];
    const hourly = hours.map((h, i) => ({
      time: h,
      weather: i === 0 ? current : weathers[Math.floor(Math.random() * weathers.length)],
    }));

    return {
      region,
      currentWeather: current,
      nextWeather: next,
      nextWeatherIn: get().weatherChangeTimer,
      hourlyForecast: hourly,
    };
  },

  isRegionUnlocked: (region): boolean => {
    if (region === '全部') return true;
    const weather = get().regionWeathers[region as Exclude<Region, '全部'>] || '晴朗';
    const effect = get().getWeatherEffect(weather);
    if (effect.unlockedRegions.length === 0) return true;
    return effect.unlockedRegions.includes(region);
  },

  isStoryWeatherUnlocked: (storyId, storyRegion, storyTags): boolean => {
    if (get().unlockedWeatherStories.has(storyId)) return true;
    if (!get().isRegionUnlocked(storyRegion)) return false;
    const weather = get().getWeatherByRegion(storyRegion);
    const effect = get().getWeatherEffect(weather);
    if (effect.storyUnlockTags.length === 0) return true;
    const normaliz = (s: string) => s.replace(/[\s-_]/g, '').toLowerCase();
    const relatedKeywords: Record<string, string[]> = {
      '冬日': ['冬天', '冬季', '寒冬', '冰雪', '雪'],
      '冬天': ['冬日', '冬季', '寒冬', '冰雪', '雪', '寒冷'],
      '冰雪': ['雪', '冬天', '冬日', '寒冷', '冰'],
      '雪': ['冰雪', '冬天', '冬日', '雪花', '降雪'],
      '寒冷': ['冬天', '冬日', '冰雪', '严寒', '冷'],
      '愿望': ['许愿', '梦想', '希望', '祝福'],
      '星': ['星星', '星空', '流星', '星光'],
      '奇迹': ['神奇', '魔法', '惊喜'],
      '魔法': ['奇迹', '神奇', '巫术', '法术'],
    };
    const hasMatchingTag = storyTags.some((tag) => {
      const normTag = normaliz(tag);
      return effect.storyUnlockTags.some((unlockTag) => {
        const normUnlock = normaliz(unlockTag);
        if (normTag.includes(normUnlock) || normUnlock.includes(normTag)) return true;
        const tagRelatives = relatedKeywords[unlockTag] || [];
        return tagRelatives.some((rel) => normaliz(rel).includes(normTag) || normTag.includes(normaliz(rel)));
      });
    });
    if (effect.unlockedRegions.length > 0 && effect.unlockedRegions.includes(storyRegion)) {
      return true;
    }
    return hasMatchingTag;
  },

  unlockWeatherStory: (storyId) => {
    const current = get().unlockedWeatherStories;
    const next = new Set(current);
    next.add(storyId);
    set({ unlockedWeatherStories: next });
  },

  getCharacterWeatherBuff: (characterType, weather): number => {
    const effect = get().getWeatherEffect(weather);
    return effect.characterBuff[characterType] || 0;
  },

  setSelectedAcademyCategory: (category) => set({ selectedAcademyCategory: category }),

  completeLesson: (lessonId, courseId, stars = 3) => {
    const state = get();
    if (state.completedLessons.has(lessonId)) return;

    const course = getCourseById(courseId);
    const lesson = course?.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    const newCompletedLessons = new Set(state.completedLessons);
    newCompletedLessons.add(lessonId);

    const newLessonStars = { ...state.lessonStars };
    newLessonStars[lessonId] = Math.max(newLessonStars[lessonId] || 0, stars);

    const newExp = state.totalAcademyExperience + lesson.experienceReward;

    const allLessonsCompleted = course.lessons.every((l) =>
      newCompletedLessons.has(l.id)
    );

    if (allLessonsCompleted && !state.completedCourses.has(courseId)) {
      const newCompletedCourses = new Set(state.completedCourses);
      newCompletedCourses.add(courseId);

      const newEarnedBadges = new Set(state.earnedBadges);
      newEarnedBadges.add(course.completionBadge.id);

      const newEarnedTitles = new Set(state.earnedTitles);
      newEarnedTitles.add(course.completionTitle.id);

      set({
        completedLessons: newCompletedLessons,
        completedCourses: newCompletedCourses,
        earnedBadges: newEarnedBadges,
        earnedTitles: newEarnedTitles,
        totalAcademyExperience: newExp + Math.floor(course.totalExperience * 0.2),
        lessonStars: newLessonStars,
      });
    } else {
      set({
        completedLessons: newCompletedLessons,
        totalAcademyExperience: newExp,
        lessonStars: newLessonStars,
      });
    }
  },

  isLessonCompleted: (lessonId) => get().completedLessons.has(lessonId),

  isCourseCompleted: (courseId) => get().completedCourses.has(courseId),

  getCourseProgress: (courseId): number => {
    const course = getCourseById(courseId);
    if (!course) return 0;
    const completed = course.lessons.filter((l) => get().completedLessons.has(l.id)).length;
    return Math.round((completed / course.lessons.length) * 100);
  },

  addAcademyExperience: (amount) => {
    set({ totalAcademyExperience: get().totalAcademyExperience + amount });
  },

  earnBadge: (badgeId) => {
    const current = get().earnedBadges;
    if (current.has(badgeId)) return;
    const next = new Set(current);
    next.add(badgeId);
    set({ earnedBadges: next });
  },

  hasBadge: (badgeId) => get().earnedBadges.has(badgeId),

  earnTitle: (titleId) => {
    const current = get().earnedTitles;
    if (current.has(titleId)) return;
    const next = new Set(current);
    next.add(titleId);
    set({ earnedTitles: next });
  },

  hasTitle: (titleId) => get().earnedTitles.has(titleId),

  setCurrentTitle: (titleId) => set({ currentTitle: titleId }),

  setQuizScore: (quizId, score) => {
    set({
      quizScores: { ...get().quizScores, [quizId]: Math.max(get().quizScores[quizId] || 0, score) },
    });
  },

  getQuizScore: (quizId) => get().quizScores[quizId] || 0,

  completeCourse: (courseId) => {
    const state = get();
    if (state.completedCourses.has(courseId)) return;

    const course = getCourseById(courseId);
    if (!course) return;

    const newCompletedCourses = new Set(state.completedCourses);
    newCompletedCourses.add(courseId);

    const newEarnedBadges = new Set(state.earnedBadges);
    newEarnedBadges.add(course.completionBadge.id);

    const newEarnedTitles = new Set(state.earnedTitles);
    newEarnedTitles.add(course.completionTitle.id);

    set({
      completedCourses: newCompletedCourses,
      earnedBadges: newEarnedBadges,
      earnedTitles: newEarnedTitles,
    });
  },

  isLessonUnlocked: (lessonId, courseId): boolean => {
    const course = getCourseById(courseId);
    if (!course) return false;

    const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order);
    const lessonIndex = sortedLessons.findIndex((l) => l.id === lessonId);

    if (lessonIndex <= 0) return true;

    const prevLesson = sortedLessons[lessonIndex - 1];
    return get().completedLessons.has(prevLesson.id);
  },

  setSelectedEventTab: (tab) => set({ selectedEventTab: tab }),

  triggerRandomEvent: () => {
    const state = get();
    const availableEvents = state.cosmicEvents.filter(
      (e) => !state.activeEvents.some((ae) => ae.eventId === e.id)
    );
    if (availableEvents.length === 0) return;

    const weights: Record<string, number> = {
      minor: 40,
      moderate: 30,
      major: 20,
      catastrophic: 10,
    };

    const weightedEvents = availableEvents.flatMap((e) =>
      Array(weights[e.severity] || 10).fill(e)
    );

    const randomEvent = weightedEvents[Math.floor(Math.random() * weightedEvents.length)];
    get().startEvent(randomEvent.id);
  },

  startEvent: (eventId) => {
    const state = get();
    const event = getCosmicEventById(eventId);
    if (!event) return;
    if (state.activeEvents.some((ae) => ae.eventId === eventId)) return;

    const progress: Record<string, number> = {};
    event.objectives.forEach((obj) => {
      progress[obj.id] = 0;
    });

    const activeEvent: ActiveCosmicEvent = {
      eventId,
      status: 'active',
      startTime: Date.now(),
      endTime: Date.now() + event.duration * 1000,
      progress,
      completedObjectives: [],
      claimedRewards: [],
      participantCount: 1,
    };

    set({
      activeEvents: [...state.activeEvents, activeEvent],
      playerEventsParticipated: state.playerEventsParticipated + 1,
    });
  },

  endEvent: (eventId, outcome) => {
    const state = get();
    const activeEvent = state.activeEvents.find((ae) => ae.eventId === eventId);
    const event = getCosmicEventById(eventId);
    if (!activeEvent || !event) return;

    const newActiveEvents = state.activeEvents.filter((ae) => ae.eventId !== eventId);

    const historyRecord: EventHistoryRecord = {
      eventId,
      eventName: event.name,
      eventType: event.type,
      emoji: event.emoji,
      severity: event.severity,
      startTime: activeEvent.startTime,
      endTime: Date.now(),
      outcome,
      worldImpact:
        outcome === 'success'
          ? `成功应对了${event.name}，世界变得更加美好`
          : outcome === 'partial'
          ? `部分完成了${event.name}的挑战，世界发生了一些变化`
          : `${event.name}对世界造成了一定影响`,
      totalParticipants: activeEvent.participantCount,
      playerParticipated: true,
      playerScore: activeEvent.completedObjectives.length * 100,
      playerRank: Math.floor(Math.random() * 100) + 1,
    };

    let stabilityChange = 0;
    let magicChange = 0;
    if (outcome === 'success') {
      stabilityChange = 5;
      magicChange = 10;
    } else if (outcome === 'partial') {
      stabilityChange = 0;
      magicChange = 5;
    } else {
      stabilityChange = -10;
      magicChange = 3;
    }

    const completedCount = state.worldState.totalEventsCompleted + 1;
    const newWorldLevel = Math.floor(completedCount / 3) + 1;
    const eraInfo = getEraNameByLevel(Math.min(newWorldLevel, 7));

    const newWorldState: WorldState = {
      ...state.worldState,
      worldLevel: Math.min(newWorldLevel, 7),
      totalEventsCompleted: completedCount,
      worldStability: Math.max(0, Math.min(100, state.worldState.worldStability + stabilityChange)),
      magicDensity: Math.max(0, Math.min(100, state.worldState.magicDensity + magicChange)),
      era: eraInfo.era,
      eraEmoji: eraInfo.emoji,
      currentEraDescription: eraInfo.description,
    };

    if (newWorldLevel > state.worldState.worldLevel && newWorldLevel <= 7) {
      const newEraEntry = {
        era: eraInfo.era,
        eraEmoji: eraInfo.emoji,
        startedAt: Date.now(),
        majorEvents: [event.name],
        description: eraInfo.description,
      };
      const updatedHistory = [...state.worldState.eraHistory];
      if (updatedHistory.length > 0) {
        updatedHistory[updatedHistory.length - 1].endedAt = Date.now();
      }
      newWorldState.eraHistory = [...updatedHistory, newEraEntry];
    }

    set({
      activeEvents: newActiveEvents,
      worldState: newWorldState,
      eventHistory: [historyRecord, ...state.eventHistory],
      playerEventsCompleted: outcome === 'success' || outcome === 'partial'
        ? state.playerEventsCompleted + 1
        : state.playerEventsCompleted,
    });
  },

  updateEventProgress: (eventId, objectiveId, amount) => {
    const state = get();
    const event = getCosmicEventById(eventId);
    const activeEvent = state.activeEvents.find((ae) => ae.eventId === eventId);
    if (!event || !activeEvent) return;

    const objective = event.objectives.find((o) => o.id === objectiveId);
    if (!objective) return;

    const currentProgress = activeEvent.progress[objectiveId] || 0;
    const newProgress = Math.min(objective.target, currentProgress + amount);

    const newActiveEvents = state.activeEvents.map((ae) => {
      if (ae.eventId !== eventId) return ae;
      return {
        ...ae,
        progress: {
          ...ae.progress,
          [objectiveId]: newProgress,
        },
      };
    });

    set({ activeEvents: newActiveEvents });

    if (newProgress >= objective.target && !activeEvent.completedObjectives.includes(objectiveId)) {
      get().completeEventObjective(eventId, objectiveId);
    }
  },

  completeEventObjective: (eventId, objectiveId) => {
    const state = get();
    const activeEvent = state.activeEvents.find((ae) => ae.eventId === eventId);
    const event = getCosmicEventById(eventId);
    if (!activeEvent || !event) return;
    if (activeEvent.completedObjectives.includes(objectiveId)) return;

    const objective = event.objectives.find((o) => o.id === objectiveId);
    if (!objective) return;

    const newActiveEvents = state.activeEvents.map((ae) => {
      if (ae.eventId !== eventId) return ae;
      return {
        ...ae,
        completedObjectives: [...ae.completedObjectives, objectiveId],
      };
    });

    set({
      activeEvents: newActiveEvents,
      playerEventScore: state.playerEventScore + objective.reward,
    });
  },

  claimEventReward: (eventId, rewardIndex) => {
    const state = get();
    const activeEvent = state.activeEvents.find((ae) => ae.eventId === eventId);
    if (!activeEvent) return;

    const rewardKey = `reward-${rewardIndex}`;
    if (activeEvent.claimedRewards.includes(rewardKey)) return;

    const newActiveEvents = state.activeEvents.map((ae) => {
      if (ae.eventId !== eventId) return ae;
      return {
        ...ae,
        claimedRewards: [...ae.claimedRewards, rewardKey],
      };
    });

    set({ activeEvents: newActiveEvents });
  },

  getActiveEventById: (eventId) => {
    return get().activeEvents.find((ae) => ae.eventId === eventId);
  },

  getCurrentActiveEvent: () => {
    const active = get().activeEvents.filter((ae) => ae.status === 'active');
    return active.length > 0 ? active[0] : undefined;
  },

  addWorldBuff: (buff) => {
    const state = get();
    set({
      worldState: {
        ...state.worldState,
        globalBuffs: [...state.worldState.globalBuffs, buff],
      },
    });
  },

  removeWorldBuff: (buffId) => {
    const state = get();
    set({
      worldState: {
        ...state.worldState,
        globalBuffs: state.worldState.globalBuffs.filter((b) => b.id !== buffId),
      },
    });
  },

  updateWorldState: (updates) => {
    const state = get();
    set({
      worldState: {
        ...state.worldState,
        ...updates,
      },
    });
  },

  levelUpWorld: () => {
    const state = get();
    const newLevel = Math.min(state.worldState.worldLevel + 1, 7);
    const eraInfo = getEraNameByLevel(newLevel);

    const updatedHistory = [...state.worldState.eraHistory];
    if (updatedHistory.length > 0) {
      updatedHistory[updatedHistory.length - 1].endedAt = Date.now();
    }

    const newEraEntry = {
      era: eraInfo.era,
      eraEmoji: eraInfo.emoji,
      startedAt: Date.now(),
      majorEvents: ['世界等级提升'],
      description: eraInfo.description,
    };

    set({
      worldState: {
        ...state.worldState,
        worldLevel: newLevel,
        era: eraInfo.era,
        eraEmoji: eraInfo.emoji,
        currentEraDescription: eraInfo.description,
        eraHistory: [...updatedHistory, newEraEntry],
      },
    });
  },

  addEventHistory: (record) => {
    const state = get();
    set({
      eventHistory: [record, ...state.eventHistory],
    });
  },

  incrementPlayerEventScore: (amount) => {
    const state = get();
    set({
      playerEventScore: state.playerEventScore + amount,
    });
  },
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

export const getFilteredCharacters = (
  characters: StoryCharacter[],
  selectedType: CharacterType
): StoryCharacter[] => {
  if (selectedType === '全部') return characters;
  return characters.filter((c) => c.type === selectedType);
};

export const getCharacterById = (characters: StoryCharacter[], id: string): StoryCharacter | undefined => {
  return characters.find((c) => c.id === id);
};

export const getCharactersByStoryId = (characters: StoryCharacter[], storyId: string): StoryCharacter[] => {
  return characters.filter((c) => c.storyId === storyId);
};

export const getInteractiveStoryByStoryId = (
  interactiveStories: InteractiveStory[],
  storyId: string
): InteractiveStory | undefined => {
  return interactiveStories.find((s) => s.storyId === storyId);
};

export const buildStoryTree = (
  interactiveStory: InteractiveStory,
  visitedNodes: string[],
  currentNodeId: string
) => {
  const { nodes, startNodeId } = interactiveStory;

  const getLevel = (nodeId: string, targetId: string, path: string[] = []): number => {
    if (nodeId === targetId) return path.length;
    const node = nodes[nodeId];
    if (!node?.choices) return -1;
    for (const choice of node.choices) {
      const result = getLevel(choice.nextNodeId, targetId, [...path, nodeId]);
      if (result !== -1) return result;
    }
    return -1;
  };

  const nodesByLevel: Record<number, string[]> = {};
  const maxLevel = { value: 0 };

  const traverse = (nodeId: string, level: number, visited: Set<string>) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    if (!nodesByLevel[level]) nodesByLevel[level] = [];
    nodesByLevel[level].push(nodeId);
    if (level > maxLevel.value) maxLevel.value = level;

    const node = nodes[nodeId];
    if (node?.choices) {
      for (const choice of node.choices) {
        traverse(choice.nextNodeId, level + 1, new Set(visited));
      }
    }
  };

  traverse(startNodeId, 0, new Set());

  const currentPath = new Set<string>();
  let tempId = currentNodeId;
  while (tempId) {
    currentPath.add(tempId);
    let found = false;
    for (const [nId, node] of Object.entries(nodes)) {
      if (node.choices) {
        for (const choice of node.choices) {
          if (choice.nextNodeId === tempId) {
            tempId = nId;
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
    if (!found) break;
  }

  const positioned: Record<string, { x: number; y: number }> = {};
  const levelWidth = 180;
  const nodeHeight = 100;

  for (let level = 0; level <= maxLevel.value; level++) {
    const nodeIds = nodesByLevel[level] || [];
    const totalWidth = (nodeIds.length - 1) * levelWidth;
    const startX = -totalWidth / 2;
    nodeIds.forEach((nodeId, index) => {
      positioned[nodeId] = {
        x: startX + index * levelWidth,
        y: level * nodeHeight,
      };
    });
  }

  return {
    positioned,
    nodesByLevel,
    maxLevel: maxLevel.value,
    currentPath,
    visitedSet: new Set(visitedNodes),
    nodes,
  };
};

export const getAllMagicItems = (
  magicItems: MagicItem[], customMagicItems: MagicItem[]): MagicItem[] => {
  return [...magicItems, ...customMagicItems];
};

export const getFilteredMagicItems = (
  items: MagicItem[],
  category: MagicItemCategory,
  rarity: MagicItemRarity | '全部',
  searchQuery: string
): MagicItem[] => {
  return items.filter((item) => {
    const matchesCategory = category === '全部' || item.category === category;
    const matchesRarity = rarity === '全部' || item.rarity === rarity;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.abilities.some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesRarity && matchesSearch;
  });
};

export const getMagicItemById = (
  items: MagicItem[],
  id: string
): MagicItem | undefined => {
  return items.find((i) => i.id === id);
};

export const getMagicItemsByStory = (
  items: MagicItem[],
  storyTitle: string
): MagicItem[] => {
  return items.filter((i) => i.storyTitle === storyTitle);
};

export const getMagicItemsByRarity = (
  items: MagicItem[],
  rarity: MagicItemRarity
): MagicItem[] => {
  return items.filter((i) => i.rarity === rarity);
};

export const getFilteredCreatures = (
  creatures: Creature[],
  habitat: CreatureHabitat,
  ability: CreatureAbilityType,
  danger: DangerLevel,
  searchQuery: string
): Creature[] => {
  return creatures.filter((creature) => {
    const matchesHabitat = habitat === '全部' || creature.habitat === habitat;
    const matchesAbility = ability === '全部' || creature.abilityTypes.includes(ability as Exclude<CreatureAbilityType, '全部'>);
    const matchesDanger = danger === '全部' || creature.dangerLevel === danger;
    const matchesSearch =
      searchQuery === '' ||
      creature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creature.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creature.traits.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      creature.abilities.some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesHabitat && matchesAbility && matchesDanger && matchesSearch;
  });
};

export const getCreatureById = (
  creatures: Creature[],
  id: string
): Creature | undefined => {
  return creatures.find((c) => c.id === id);
};

export const getCreaturesByHabitat = (
  creatures: Creature[],
  habitat: Exclude<CreatureHabitat, '全部'>
): Creature[] => {
  return creatures.filter((c) => c.habitat === habitat);
};

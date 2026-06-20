import { create } from 'zustand';
import type {
  TheaterPerformance,
  TheaterScene,
  PlacedAsset,
  SceneDialogue,
  AnimationType,
  TheaterEditorMode,
} from '@/types';

const STORAGE_KEY = 'fairy-theater-performances';

const createDefaultScene = (index: number): TheaterScene => ({
  id: `scene-${Date.now()}-${index}`,
  name: `第 ${index + 1} 幕`,
  backgroundId: 'bg-forest',
  placedAssets: [],
  dialogues: [],
  narrative: '',
  duration: 5,
});

const createDefaultPerformance = (): TheaterPerformance => ({
  id: `perf-${Date.now()}`,
  title: '我的童话剧',
  description: '',
  scenes: [createDefaultScene(0)],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  coverSceneId: undefined,
});

const loadFromStorage = (): TheaterPerformance[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load performances', e);
  }
  return [];
};

const saveToStorage = (performances: TheaterPerformance[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(performances));
  } catch (e) {
    console.error('Failed to save performances', e);
  }
};

export const generateInstanceId = () => `inst-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
export const generateDialogueId = () => `dlg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

interface TheaterState {
  editorMode: TheaterEditorMode;
  currentPerformance: TheaterPerformance;
  currentSceneIndex: number;
  selectedInstanceId: string | null;
  savedPerformances: TheaterPerformance[];
  playingSceneIndex: number;
  playingDialogueIndex: number;
  isPlaying: boolean;

  setEditorMode: (mode: TheaterEditorMode) => void;
  setCurrentSceneIndex: (index: number) => void;
  setSelectedInstanceId: (id: string | null) => void;

  updatePerformanceTitle: (title: string) => void;
  updatePerformanceDescription: (description: string) => void;

  addScene: () => void;
  removeScene: (index: number) => void;
  duplicateScene: (index: number) => void;
  moveScene: (fromIndex: number, toIndex: number) => void;
  updateSceneName: (index: number, name: string) => void;
  updateSceneBackground: (index: number, backgroundId: string) => void;
  updateSceneNarrative: (index: number, narrative: string) => void;
  updateSceneDuration: (index: number, duration: number) => void;
  updateCurrentScene: (updates: Partial<TheaterScene>) => void;

  addPlacedAsset: (sceneIndex: number, assetId: string, x: number, y: number) => void;
  updatePlacedAsset: (sceneIndex: number, instanceId: string, updates: Partial<PlacedAsset>) => void;
  removePlacedAsset: (sceneIndex: number, instanceId: string) => void;
  setAssetAnimation: (sceneIndex: number, instanceId: string, animation: AnimationType) => void;

  addDialogue: (sceneIndex: number) => void;
  updateDialogue: (sceneIndex: number, dialogueId: string, updates: Partial<SceneDialogue>) => void;
  removeDialogue: (sceneIndex: number, dialogueId: string) => void;

  savePerformance: () => void;
  loadPerformance: (id: string) => void;
  deletePerformance: (id: string) => void;
  newPerformance: () => void;
  exportPerformance: () => string;
  importPerformance: (json: string) => void;

  startPlayback: () => void;
  stopPlayback: () => void;
  setPlayingSceneIndex: (index: number) => void;
  setPlayingDialogueIndex: (index: number) => void;
  nextPlaybackStep: () => void;
}

export const useTheaterStore = create<TheaterState>((set, get) => ({
  editorMode: 'edit',
  currentPerformance: createDefaultPerformance(),
  currentSceneIndex: 0,
  selectedInstanceId: null,
  savedPerformances: loadFromStorage(),
  playingSceneIndex: 0,
  playingDialogueIndex: 0,
  isPlaying: false,

  setEditorMode: (mode) => set({ editorMode: mode }),
  setCurrentSceneIndex: (index) => {
    const perf = get().currentPerformance;
    if (index >= 0 && index < perf.scenes.length) {
      set({ currentSceneIndex: index, selectedInstanceId: null });
    }
  },
  setSelectedInstanceId: (id) => set({ selectedInstanceId: id }),

  updatePerformanceTitle: (title) =>
    set((state) => ({
      currentPerformance: {
        ...state.currentPerformance,
        title,
        updatedAt: Date.now(),
      },
    })),

  updatePerformanceDescription: (description) =>
    set((state) => ({
      currentPerformance: {
        ...state.currentPerformance,
        description,
        updatedAt: Date.now(),
      },
    })),

  addScene: () =>
    set((state) => {
      const newScene = createDefaultScene(state.currentPerformance.scenes.length);
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: [...state.currentPerformance.scenes, newScene],
          updatedAt: Date.now(),
        },
        currentSceneIndex: state.currentPerformance.scenes.length,
      };
    }),

  removeScene: (index) =>
    set((state) => {
      if (state.currentPerformance.scenes.length <= 1) return state;
      const newScenes = state.currentPerformance.scenes.filter((_, i) => i !== index);
      const newIndex =
        state.currentSceneIndex >= newScenes.length
          ? newScenes.length - 1
          : state.currentSceneIndex > index
            ? state.currentSceneIndex - 1
            : state.currentSceneIndex;
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
        currentSceneIndex: Math.max(0, newIndex),
      };
    }),

  duplicateScene: (index) =>
    set((state) => {
      const source = state.currentPerformance.scenes[index];
      const duplicated: TheaterScene = {
        ...source,
        id: `scene-${Date.now()}-${index}`,
        name: `${source.name} (副本)`,
        placedAssets: source.placedAssets.map((a) => ({
          ...a,
          instanceId: generateInstanceId(),
        })),
        dialogues: source.dialogues.map((d) => ({
          ...d,
          id: generateDialogueId(),
        })),
      };
      const newScenes = [...state.currentPerformance.scenes];
      newScenes.splice(index + 1, 0, duplicated);
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
        currentSceneIndex: index + 1,
      };
    }),

  moveScene: (fromIndex, toIndex) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      const [removed] = newScenes.splice(fromIndex, 1);
      newScenes.splice(toIndex, 0, removed);
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  updateSceneName: (index, name) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      newScenes[index] = { ...newScenes[index], name };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  updateSceneBackground: (index, backgroundId) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      newScenes[index] = { ...newScenes[index], backgroundId };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  updateSceneNarrative: (index, narrative) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      newScenes[index] = { ...newScenes[index], narrative };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  updateSceneDuration: (index, duration) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      newScenes[index] = { ...newScenes[index], duration };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  updateCurrentScene: (updates) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      const idx = state.currentSceneIndex;
      newScenes[idx] = { ...newScenes[idx], ...updates };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  addPlacedAsset: (sceneIndex, assetId, x, y) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      const scene = newScenes[sceneIndex];
      const newInstance: PlacedAsset = {
        instanceId: generateInstanceId(),
        assetId,
        x,
        y,
        scale: 1,
        rotation: 0,
        animation: 'none',
        zIndex: scene.placedAssets.length + 1,
      };
      newScenes[sceneIndex] = {
        ...scene,
        placedAssets: [...scene.placedAssets, newInstance],
      };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
        selectedInstanceId: newInstance.instanceId,
      };
    }),

  updatePlacedAsset: (sceneIndex, instanceId, updates) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      const scene = newScenes[sceneIndex];
      newScenes[sceneIndex] = {
        ...scene,
        placedAssets: scene.placedAssets.map((a) =>
          a.instanceId === instanceId ? { ...a, ...updates } : a
        ),
      };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  removePlacedAsset: (sceneIndex, instanceId) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      const scene = newScenes[sceneIndex];
      newScenes[sceneIndex] = {
        ...scene,
        placedAssets: scene.placedAssets.filter((a) => a.instanceId !== instanceId),
      };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
        selectedInstanceId: state.selectedInstanceId === instanceId ? null : state.selectedInstanceId,
      };
    }),

  setAssetAnimation: (sceneIndex, instanceId, animation) =>
    get().updatePlacedAsset(sceneIndex, instanceId, { animation }),

  addDialogue: (sceneIndex) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      const scene = newScenes[sceneIndex];
      const newDialogue: SceneDialogue = {
        id: generateDialogueId(),
        speakerName: '角色',
        speakerEmoji: '🧙',
        text: '',
        color: '#D4A5FF',
      };
      newScenes[sceneIndex] = {
        ...scene,
        dialogues: [...scene.dialogues, newDialogue],
      };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  updateDialogue: (sceneIndex, dialogueId, updates) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      const scene = newScenes[sceneIndex];
      newScenes[sceneIndex] = {
        ...scene,
        dialogues: scene.dialogues.map((d) =>
          d.id === dialogueId ? { ...d, ...updates } : d
        ),
      };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  removeDialogue: (sceneIndex, dialogueId) =>
    set((state) => {
      const newScenes = [...state.currentPerformance.scenes];
      const scene = newScenes[sceneIndex];
      newScenes[sceneIndex] = {
        ...scene,
        dialogues: scene.dialogues.filter((d) => d.id !== dialogueId),
      };
      return {
        currentPerformance: {
          ...state.currentPerformance,
          scenes: newScenes,
          updatedAt: Date.now(),
        },
      };
    }),

  savePerformance: () =>
    set((state) => {
      const perf = {
        ...state.currentPerformance,
        updatedAt: Date.now(),
      };
      const existingIndex = state.savedPerformances.findIndex((p) => p.id === perf.id);
      let newSaved: TheaterPerformance[];
      if (existingIndex >= 0) {
        newSaved = [...state.savedPerformances];
        newSaved[existingIndex] = perf;
      } else {
        newSaved = [perf, ...state.savedPerformances];
      }
      saveToStorage(newSaved);
      return {
        savedPerformances: newSaved,
        currentPerformance: perf,
      };
    }),

  loadPerformance: (id) =>
    set((state) => {
      const perf = state.savedPerformances.find((p) => p.id === id);
      if (perf) {
        return {
          currentPerformance: { ...perf },
          currentSceneIndex: 0,
          selectedInstanceId: null,
        };
      }
      return state;
    }),

  deletePerformance: (id) =>
    set((state) => {
      const newSaved = state.savedPerformances.filter((p) => p.id !== id);
      saveToStorage(newSaved);
      return { savedPerformances: newSaved };
    }),

  newPerformance: () =>
    set({
      currentPerformance: createDefaultPerformance(),
      currentSceneIndex: 0,
      selectedInstanceId: null,
      isPlaying: false,
    }),

  exportPerformance: () => JSON.stringify(get().currentPerformance, null, 2),

  importPerformance: (json) => {
    try {
      const perf = JSON.parse(json) as TheaterPerformance;
      perf.id = `perf-${Date.now()}`;
      perf.createdAt = Date.now();
      perf.updatedAt = Date.now();
      set({ currentPerformance: perf, currentSceneIndex: 0 });
    } catch (e) {
      console.error('Failed to import performance', e);
    }
  },

  startPlayback: () =>
    set({
      editorMode: 'play',
      isPlaying: true,
      playingSceneIndex: 0,
      playingDialogueIndex: 0,
    }),

  stopPlayback: () =>
    set({
      editorMode: 'edit',
      isPlaying: false,
    }),

  setPlayingSceneIndex: (index) =>
    set((state) => ({
      playingSceneIndex: Math.max(0, Math.min(index, state.currentPerformance.scenes.length - 1)),
      playingDialogueIndex: 0,
    })),

  setPlayingDialogueIndex: (index) => set({ playingDialogueIndex: index }),

  nextPlaybackStep: () =>
    set((state) => {
      const scene = state.currentPerformance.scenes[state.playingSceneIndex];
      if (state.playingDialogueIndex < Math.max(0, scene.dialogues.length - 1)) {
        return { playingDialogueIndex: state.playingDialogueIndex + 1 };
      } else if (state.playingSceneIndex < state.currentPerformance.scenes.length - 1) {
        return {
          playingSceneIndex: state.playingSceneIndex + 1,
          playingDialogueIndex: 0,
        };
      } else {
        return { isPlaying: false };
      }
    }),
}));

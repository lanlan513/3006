import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Save,
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  Edit3,
  Download,
  Upload,
  Film,
  MessageSquare,
  Users,
  TreeDeciduous,
  Sparkles,
  Settings,
  Move,
  RotateCw,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Square,
  Eye,
  Palette,
  ArrowUp,
  ArrowDown,
  FileText,
  Wand2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useTheaterStore } from '@/store/theaterStore';
import {
  theaterBackgrounds,
  theaterCharacters,
  theaterProps,
  theaterScenes,
  getAssetById,
  getBackgroundById,
} from '@/data/theater';
import {
  ANIMATION_TYPES,
  type TheaterAsset,
  type TheaterPanelTab,
  type PlacedAsset,
  type AnimationType,
} from '@/types';

const getAnimationClass = (anim: AnimationType): string => {
  switch (anim) {
    case 'bounce': return 'anim-bounce';
    case 'float': return 'anim-float';
    case 'twinkle': return 'animate-twinkle';
    case 'shake': return 'anim-shake';
    case 'spin': return 'anim-spin';
    case 'fadeIn': return 'anim-fadeIn';
    case 'slideLeft': return 'anim-slideLeft';
    case 'slideRight': return 'anim-slideRight';
    default: return '';
  }
};

type DragState = {
  isDragging: boolean;
  assetId: string | null;
  fromLibrary: boolean;
  offsetX: number;
  offsetY: number;
};

export default function FairyTheater() {
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [leftTab, setLeftTab] = useState<TheaterPanelTab>('characters');
  const [rightTab, setRightTab] = useState<TheaterPanelTab>('storyboard');
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    assetId: null,
    fromLibrary: false,
    offsetX: 0,
    offsetY: 0,
  });
  const [isDropActive, setIsDropActive] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [playTimer, setPlayTimer] = useState<number | null>(null);

  const store = useTheaterStore();
  const currentScene = store.currentPerformance.scenes[store.currentSceneIndex];
  const currentBg = getBackgroundById(currentScene?.backgroundId || 'bg-forest');
  const playScene = store.currentPerformance.scenes[store.playingSceneIndex];
  const playBg = getBackgroundById(playScene?.backgroundId || 'bg-forest');
  const currentDialogue = playScene?.dialogues[store.playingDialogueIndex];

  const handleLibraryDragStart = useCallback((e: React.DragEvent, asset: TheaterAsset) => {
    e.dataTransfer.setData('assetId', asset.id);
    e.dataTransfer.setData('fromLibrary', 'true');
    setDragState({
      isDragging: true,
      assetId: asset.id,
      fromLibrary: true,
      offsetX: 0,
      offsetY: 0,
    });
  }, []);

  const handleStageDragStart = useCallback((e: React.DragEvent, placed: PlacedAsset) => {
    if (store.editorMode !== 'edit') return;
    e.dataTransfer.setData('assetId', placed.assetId);
    e.dataTransfer.setData('instanceId', placed.instanceId);
    e.dataTransfer.setData('fromLibrary', 'false');
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragState({
      isDragging: true,
      assetId: placed.assetId,
      fromLibrary: false,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
    store.setSelectedInstanceId(placed.instanceId);
  }, [store]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDropActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDropActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDropActive(false);

    if (store.editorMode !== 'edit') return;
    if (!stageRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    const assetId = e.dataTransfer.getData('assetId');
    const fromLibrary = e.dataTransfer.getData('fromLibrary') === 'true';
    const instanceId = e.dataTransfer.getData('instanceId');

    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    if (fromLibrary && assetId) {
      store.addPlacedAsset(store.currentSceneIndex, assetId, x, y);
    } else if (!fromLibrary && instanceId) {
      store.updatePlacedAsset(store.currentSceneIndex, instanceId, { x, y });
    }

    setDragState({
      isDragging: false,
      assetId: null,
      fromLibrary: false,
      offsetX: 0,
      offsetY: 0,
    });
  }, [store]);

  const handleStageClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.stage === 'true') {
      store.setSelectedInstanceId(null);
    }
  }, [store]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (store.editorMode !== 'edit' || !store.selectedInstanceId) return;

    const step = 0.01;
    const instance = currentScene?.placedAssets.find(
      (p) => p.instanceId === store.selectedInstanceId
    );
    if (!instance) return;

    switch (e.key) {
      case 'ArrowUp':
        store.updatePlacedAsset(store.currentSceneIndex, instance.instanceId, {
          y: Math.max(0, instance.y - step),
        });
        break;
      case 'ArrowDown':
        store.updatePlacedAsset(store.currentSceneIndex, instance.instanceId, {
          y: Math.min(1, instance.y + step),
        });
        break;
      case 'ArrowLeft':
        store.updatePlacedAsset(store.currentSceneIndex, instance.instanceId, {
          x: Math.max(0, instance.x - step),
        });
        break;
      case 'ArrowRight':
        store.updatePlacedAsset(store.currentSceneIndex, instance.instanceId, {
          x: Math.min(1, instance.x + step),
        });
        break;
      case 'Delete':
      case 'Backspace':
        store.removePlacedAsset(store.currentSceneIndex, instance.instanceId);
        break;
    }
  }, [store, currentScene]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (store.isPlaying && store.editorMode === 'play') {
      const scene = store.currentPerformance.scenes[store.playingSceneIndex];
      const dialogueCount = Math.max(1, scene.dialogues.length);
      const intervalMs = (scene.duration * 1000) / dialogueCount;

      const timer = window.setTimeout(() => {
        store.nextPlaybackStep();
      }, intervalMs);

      setPlayTimer(timer);
      return () => {
        if (timer) window.clearTimeout(timer);
      };
    }
  }, [store.isPlaying, store.editorMode, store.playingSceneIndex, store.playingDialogueIndex, store]);

  const togglePlayPause = () => {
    if (store.editorMode === 'play') {
      if (store.isPlaying) {
        store.stopPlayback();
      } else {
        useTheaterStore.setState({ isPlaying: true });
      }
    } else {
      store.startPlayback();
    }
  };

  const handleExport = () => {
    const json = store.exportPerformance();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${store.currentPerformance.title || 'fairy-play'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const json = evt.target?.result as string;
      store.importPerformance(json);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const renderAssetsList = (assets: TheaterAsset[], title: string) => (
    <div>
      <h4 className="font-fairy text-lg text-gray-700 mb-3 flex items-center gap-2">
        {title}
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {assets.map((asset) => (
          <div
            key={asset.id}
            draggable={store.editorMode === 'edit'}
            onDragStart={(e) => handleLibraryDragStart(e, asset)}
            className="bg-white/70 rounded-xl p-2 text-center cursor-grab hover:bg-white hover:shadow-md transition-all border-2 border-transparent hover:border-fairy-purple/30 active:cursor-grabbing"
            title={asset.description}
          >
            <div
              className="w-full aspect-square rounded-lg flex items-center justify-center text-3xl mb-1"
              style={{ backgroundColor: `${asset.coverColor}30` }}
            >
              {asset.emoji}
            </div>
            <div className="text-xs font-body text-gray-600 truncate">{asset.name}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const selectedInstance = currentScene?.placedAssets.find(
    (p) => p.instanceId === store.selectedInstanceId
  );
  const selectedAsset = selectedInstance ? getAssetById(selectedInstance.assetId) : undefined;

  return (
    <div className="min-h-screen relative">
      <FloatingDecorations />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="fairy-card p-4 mb-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-fairy flex items-center justify-center shadow-fairy">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <input
                  type="text"
                  value={store.currentPerformance.title}
                  onChange={(e) => store.updatePerformanceTitle(e.target.value)}
                  className="font-fairy text-2xl text-gray-800 bg-transparent border-b-2 border-transparent hover:border-fairy-purple/30 focus:border-fairy-purple focus:outline-none px-1 transition-colors w-full"
                  placeholder="输入剧目名称..."
                />
                <p className="text-xs text-gray-500 font-body mt-1">
                  童话剧场 · 共 {store.currentPerformance.scenes.length} 幕
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={togglePlayPause}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all shadow-md ${
                  store.editorMode === 'play'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
                    : 'bg-gradient-fairy text-white hover:shadow-fairy-lg'
                }`}
              >
                {store.editorMode === 'play' && store.isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    暂停
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {store.editorMode === 'play' ? '继续播放' : '开始演出'}
                  </>
                )}
              </button>

              {store.editorMode === 'play' && (
                <>
                  <button
                    onClick={() => store.setPlayingSceneIndex(Math.max(0, store.playingSceneIndex - 1))}
                    className="p-2 rounded-full bg-white/70 border border-fairy-purple/20 hover:bg-fairy-purple/10 transition-colors"
                  >
                    <SkipBack className="w-4 h-4 text-fairy-purple" />
                  </button>
                  <button
                    onClick={() => store.nextPlaybackStep()}
                    className="p-2 rounded-full bg-white/70 border border-fairy-purple/20 hover:bg-fairy-purple/10 transition-colors"
                  >
                    <SkipForward className="w-4 h-4 text-fairy-purple" />
                  </button>
                  <button
                    onClick={store.stopPlayback}
                    className="p-2 rounded-full bg-white/70 border border-red-300 hover:bg-red-50 transition-colors"
                  >
                    <Square className="w-4 h-4 text-red-500" />
                  </button>
                </>
              )}

              <div className="w-px h-6 bg-fairy-purple/20 mx-1 hidden sm:block" />

              <button
                onClick={() => {
                  store.savePerformance();
                  setShowSaveModal(true);
                  setTimeout(() => setShowSaveModal(false), 2000);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm bg-white/70 border border-fairy-purple/30 text-fairy-purple hover:bg-fairy-purple hover:text-white transition-all"
              >
                <Save className="w-4 h-4" />
                保存
              </button>

              <button
                onClick={() => setShowLoadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm bg-white/70 border border-fairy-purple/30 text-fairy-purple hover:bg-fairy-purple hover:text-white transition-all"
              >
                <FolderOpen className="w-4 h-4" />
                加载
              </button>

              <button
                onClick={handleExport}
                className="p-2 rounded-full bg-white/70 border border-fairy-purple/30 text-fairy-purple hover:bg-fairy-purple hover:text-white transition-all"
                title="导出剧目"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleImportClick}
                className="p-2 rounded-full bg-white/70 border border-fairy-purple/30 text-fairy-purple hover:bg-fairy-purple hover:text-white transition-all"
                title="导入剧目"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
              />

              <button
                onClick={() => {
                  if (confirm('确定要新建剧目吗？当前内容将丢失！')) {
                    store.newPerformance();
                  }
                }}
                className="p-2 rounded-full bg-white/70 border border-fairy-purple/30 text-fairy-purple hover:bg-fairy-purple hover:text-white transition-all"
                title="新建剧目"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Play Mode */}
        {store.editorMode === 'play' && playScene && (
          <div className="mb-4">
            <div className="fairy-card p-2 mb-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-fairy flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-fairy text-gray-800">{playScene.name}</h3>
                    <p className="text-xs text-gray-500 font-body">
                      第 {store.playingSceneIndex + 1} / {store.currentPerformance.scenes.length} 幕
                      {playScene.dialogues.length > 0 && ` · 对白 ${store.playingDialogueIndex + 1}/${playScene.dialogues.length}`}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-body text-gray-500 flex items-center gap-2">
                  {store.isPlaying && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      播放中
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Play Stage */}
            <div
              className={`relative w-full rounded-3xl overflow-hidden shadow-fairy-lg aspect-video bg-gradient-to-br ${playBg?.gradient}`}
              style={{ minHeight: '400px' }}
            >
              {playScene.placedAssets.map((placed) => {
                const asset = getAssetById(placed.assetId);
                if (!asset) return null;
                return (
                  <div
                    key={placed.instanceId}
                    className={`absolute ${getAnimationClass(placed.animation)}`}
                    style={{
                      left: `${placed.x * 100}%`,
                      top: `${placed.y * 100}%`,
                      transform: `translate(-50%, -50%) scale(${placed.scale}) rotate(${placed.rotation}deg)`,
                      zIndex: placed.zIndex,
                    }}
                  >
                    <div className="text-6xl md:text-7xl select-none drop-shadow-lg">
                      {asset.emoji}
                    </div>
                  </div>
                );
              })}

              {/* Dialogues */}
              {currentDialogue && (
                <div className="absolute bottom-6 left-6 right-6 z-30">
                  <div className="flex items-end gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white flex-shrink-0"
                      style={{ backgroundColor: `${currentDialogue.color}40` }}
                    >
                      {currentDialogue.speakerEmoji}
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-xs font-body font-bold mb-1 px-1"
                        style={{ color: currentDialogue.color }}
                      >
                        {currentDialogue.speakerName}
                      </div>
                      <div className="dialogue-bubble">
                        <p className="font-body text-gray-700 leading-relaxed">
                          {currentDialogue.text || '（沉默中...）'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Narrative overlay */}
              {playScene.narrative && playScene.dialogues.length === 0 && (
                <div className="absolute inset-x-6 bottom-6 z-30">
                  <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-5 text-center">
                    <p className="font-body text-white text-lg leading-relaxed">
                      {playScene.narrative}
                    </p>
                  </div>
                </div>
              )}
            </div>
            return;
          </div>
        )}

        {/* Edit Mode Main Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Panel - Assets Library */}
          <div className="col-span-12 lg:col-span-3">
            <div className="fairy-card p-4">
              <div className="flex gap-1 mb-4 p-1 bg-fairy-purple/10 rounded-xl">
                {([
                  { key: 'characters', label: '角色', icon: Users },
                  { key: 'scenes', label: '场景', icon: TreeDeciduous },
                  { key: 'props', label: '道具', icon: Sparkles },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setLeftTab(key)}
                    className={`flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg font-body text-xs transition-all ${
                      leftTab === key
                        ? 'bg-white shadow text-fairy-purple'
                        : 'text-gray-500 hover:text-fairy-purple'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
                {leftTab === 'characters' && renderAssetsList(theaterCharacters, '童话角色')}
                {leftTab === 'scenes' && renderAssetsList(theaterScenes, '场景元素')}
                {leftTab === 'props' && renderAssetsList(theaterProps, '魔法道具')}
              </div>

              <div className="mt-4 pt-4 border-t border-fairy-purple/10">
                <p className="text-xs text-gray-400 font-body text-center">
                  💡 拖拽资源到舞台上即可添加
                </p>
              </div>
            </div>
          </div>

          {/* Center - Stage */}
          <div className="col-span-12 lg:col-span-6">
            {/* Scene Tabs */}
            <div className="fairy-card p-2 mb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {store.currentPerformance.scenes.map((scene, idx) => {
                  const bg = getBackgroundById(scene.backgroundId);
                  return (
                    <div
                      key={scene.id}
                      className={`scene-thumbnail relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        store.currentSceneIndex === idx
                          ? 'border-fairy-purple shadow-fairy scale-105'
                          : 'border-transparent hover:border-fairy-purple/40'
                      } bg-gradient-to-br ${bg?.gradient}`}
                      onClick={() => store.setCurrentSceneIndex(idx)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-60">
                        {bg?.emoji}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] font-body text-center py-0.5 truncate px-1">
                        {scene.name}
                      </div>
                      {store.currentSceneIndex === idx && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-fairy-purple animate-pulse" />
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={store.addScene}
                  className="flex-shrink-0 w-24 h-16 rounded-xl border-2 border-dashed border-fairy-purple/40 bg-white/30 hover:bg-fairy-purple/10 hover:border-fairy-purple transition-all flex flex-col items-center justify-center gap-1 text-fairy-purple"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-body">添加幕</span>
                </button>
              </div>
            </div>

            {/* Stage */}
            <div
              ref={stageRef}
              data-stage="true"
              onClick={handleStageClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative w-full rounded-3xl overflow-hidden shadow-fairy-lg aspect-video bg-gradient-to-br ${currentBg?.gradient} theater-stage-grid ${
                isDropActive ? 'drop-zone-active' : ''
              }`}
              style={{ minHeight: '400px' }}
            >
              {/* Background emoji overlay */}
              <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20 pointer-events-none select-none">
                {currentBg?.emoji}
              </div>

              {/* Placed assets */}
              {currentScene?.placedAssets.map((placed) => {
                const asset = getAssetById(placed.assetId);
                if (!asset) return null;
                const isSelected = store.selectedInstanceId === placed.instanceId;
                return (
                  <div
                    key={placed.instanceId}
                    draggable={store.editorMode === 'edit'}
                    onDragStart={(e) => handleStageDragStart(e, placed)}
                    onClick={(e) => {
                      e.stopPropagation();
                      store.setSelectedInstanceId(placed.instanceId);
                    }}
                    className={`absolute cursor-move transition-shadow ${
                      isSelected ? 'ring-4 ring-fairy-purple ring-offset-2 rounded-xl z-50' : ''
                    } ${getAnimationClass(placed.animation)}`}
                    style={{
                      left: `${placed.x * 100}%`,
                      top: `${placed.y * 100}%`,
                      transform: `translate(-50%, -50%) scale(${placed.scale}) rotate(${placed.rotation}deg)`,
                      zIndex: isSelected ? 1000 : placed.zIndex,
                    }}
                  >
                    <div className="text-5xl md:text-6xl select-none drop-shadow-lg">
                      {asset.emoji}
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-fairy-purple text-white flex items-center justify-center text-xs shadow-lg">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Selected instance controls */}
              {selectedInstance && selectedAsset && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-2 flex flex-col gap-1 z-50">
                  <div className="text-[10px] font-body text-gray-500 px-1 pb-1 border-b border-gray-100 mb-1">
                    {selectedAsset.name}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.removePlacedAsset(store.currentSceneIndex, selectedInstance.instanceId);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newAsset: PlacedAsset = {
                        ...selectedInstance,
                        instanceId: `inst-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                        x: Math.min(1, selectedInstance.x + 0.05),
                        y: Math.min(1, selectedInstance.y + 0.05),
                        zIndex: currentScene!.placedAssets.length + 1,
                      };
                      store.updateCurrentScene({
                        placedAssets: [...currentScene!.placedAssets, newAsset],
                      });
                    }}
                    className="p-1.5 rounded-lg hover:bg-fairy-purple/10 text-fairy-purple transition-colors"
                    title="复制"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Empty stage hint */}
              {currentScene?.placedAssets.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center bg-white/40 backdrop-blur-sm rounded-2xl px-6 py-4">
                    <Wand2 className="w-10 h-10 text-fairy-purple/50 mx-auto mb-2" />
                    <p className="font-body text-gray-500">将左侧的角色、场景或道具拖到这里</p>
                  </div>
                </div>
              )}
            </div>

            {/* Scene Info Bar */}
            <div className="fairy-card p-3 mt-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Edit3 className="w-4 h-4 text-fairy-purple" />
                  <input
                    type="text"
                    value={currentScene?.name || ''}
                    onChange={(e) => store.updateSceneName(store.currentSceneIndex, e.target.value)}
                    className="flex-1 bg-transparent border-b border-fairy-purple/20 focus:border-fairy-purple outline-none font-body text-sm text-gray-700 py-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-fairy-purple" />
                  <select
                    value={currentScene?.backgroundId || 'bg-forest'}
                    onChange={(e) => store.updateSceneBackground(store.currentSceneIndex, e.target.value)}
                    className="bg-white/70 border border-fairy-purple/20 rounded-lg px-3 py-1.5 text-sm font-body text-gray-700 focus:outline-none focus:ring-2 focus:ring-fairy-purple/30"
                  >
                    {theaterBackgrounds.map((bg) => (
                      <option key={bg.id} value={bg.id}>
                        {bg.emoji} {bg.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    onClick={() => store.duplicateScene(store.currentSceneIndex)}
                    className="p-2 rounded-lg hover:bg-fairy-purple/10 text-fairy-purple transition-colors"
                    title="复制此幕"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => store.currentPerformance.scenes.length > 1 && store.removeScene(store.currentSceneIndex)}
                    disabled={store.currentPerformance.scenes.length <= 1}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="删除此幕"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-12 lg:col-span-3">
            <div className="fairy-card p-4">
              <div className="flex gap-1 mb-4 p-1 bg-fairy-purple/10 rounded-xl">
                {([
                  { key: 'storyboard', label: '剧情', icon: FileText },
                  { key: 'dialogue', label: '对白', icon: MessageSquare },
                  { key: 'characters', label: '属性', icon: Settings },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setRightTab(key)}
                    className={`flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg font-body text-xs transition-all ${
                      rightTab === key
                        ? 'bg-white shadow text-fairy-purple'
                        : 'text-gray-500 hover:text-fairy-purple'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="max-h-[65vh] overflow-y-auto pr-1">
                {/* Storyboard Tab */}
                {rightTab === 'storyboard' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-body text-gray-500 mb-2 block">剧目简介</label>
                      <textarea
                        value={store.currentPerformance.description}
                        onChange={(e) => store.updatePerformanceDescription(e.target.value)}
                        rows={3}
                        placeholder="描述一下你的童话剧..."
                        className="w-full bg-white/70 border border-fairy-purple/20 rounded-xl px-3 py-2 text-sm font-body text-gray-700 focus:outline-none focus:ring-2 focus:ring-fairy-purple/30 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-body text-gray-500 mb-2 block">
                        本幕旁白 · {currentScene?.name}
                      </label>
                      <textarea
                        value={currentScene?.narrative || ''}
                        onChange={(e) => store.updateSceneNarrative(store.currentSceneIndex, e.target.value)}
                        rows={4}
                        placeholder="输入本幕的旁白文字，播放时将显示在舞台底部..."
                        className="w-full bg-white/70 border border-fairy-purple/20 rounded-xl px-3 py-2 text-sm font-body text-gray-700 focus:outline-none focus:ring-2 focus:ring-fairy-purple/30 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-body text-gray-500 mb-2 block flex items-center justify-between">
                        <span>播放时长（秒）</span>
                        <span className="font-bold text-fairy-purple">{currentScene?.duration || 5}s</span>
                      </label>
                      <input
                        type="range"
                        min={2}
                        max={30}
                        step={1}
                        value={currentScene?.duration || 5}
                        onChange={(e) => store.updateSceneDuration(store.currentSceneIndex, parseInt(e.target.value))}
                        className="w-full accent-fairy-purple"
                      />
                    </div>

                    <div className="pt-4 border-t border-fairy-purple/10">
                      <h4 className="font-fairy text-gray-700 mb-3 flex items-center gap-2">
                        <Film className="w-4 h-4 text-fairy-purple" />
                        剧情时间线
                      </h4>
                      <div className="space-y-2">
                        {store.currentPerformance.scenes.map((scene, idx) => (
                          <div
                            key={scene.id}
                            className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${
                              store.currentSceneIndex === idx
                                ? 'bg-gradient-fairy text-white shadow-fairy'
                                : 'bg-white/50 hover:bg-white'
                            }`}
                            onClick={() => store.setCurrentSceneIndex(idx)}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              store.currentSceneIndex === idx ? 'bg-white/30' : 'bg-fairy-purple/20 text-fairy-purple'
                            }`}>
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-body truncate ${
                                store.currentSceneIndex === idx ? '' : 'text-gray-700'
                              }`}>
                                {scene.name}
                              </div>
                              <div className={`text-[10px] opacity-70 ${
                                store.currentSceneIndex === idx ? '' : 'text-gray-400'
                              }`}>
                                {scene.placedAssets.length} 元素 · {scene.dialogues.length} 对白
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {idx > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    store.moveScene(idx, idx - 1);
                                  }}
                                  className={`p-1 rounded-md transition-colors ${
                                    store.currentSceneIndex === idx ? 'hover:bg-white/20' : 'hover:bg-fairy-purple/10'
                                  }`}
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                              )}
                              {idx < store.currentPerformance.scenes.length - 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    store.moveScene(idx, idx + 1);
                                  }}
                                  className={`p-1 rounded-md transition-colors ${
                                    store.currentSceneIndex === idx ? 'hover:bg-white/20' : 'hover:bg-fairy-purple/10'
                                  }`}
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={store.addScene}
                          className="w-full p-2 rounded-xl border-2 border-dashed border-fairy-purple/30 hover:border-fairy-purple hover:bg-fairy-purple/5 transition-all flex items-center justify-center gap-2 text-fairy-purple text-sm font-body"
                        >
                          <Plus className="w-4 h-4" />
                          添加一幕
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dialogue Tab */}
                {rightTab === 'dialogue' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-fairy text-gray-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-fairy-purple" />
                        本幕对白
                      </h4>
                      <button
                        onClick={() => store.addDialogue(store.currentSceneIndex)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-fairy-purple text-white text-xs font-body hover:shadow-md transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        添加对白
                      </button>
                    </div>

                    {currentScene?.dialogues.length === 0 ? (
                      <div className="text-center py-8 bg-white/40 rounded-xl">
                        <MessageSquare className="w-10 h-10 text-fairy-purple/30 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 font-body">还没有对白</p>
                        <p className="text-xs text-gray-300 font-body">点击上方按钮添加第一句对白</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {currentScene?.dialogues.map((dlg, idx) => (
                          <div
                            key={dlg.id}
                            className="bg-white/70 rounded-xl p-3 space-y-2 border-2 border-transparent hover:border-fairy-purple/20 transition-all"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className="text-xs font-body font-bold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${dlg.color}30`, color: dlg.color }}
                              >
                                对话 {idx + 1}
                              </span>
                              <button
                                onClick={() => store.removeDialogue(store.currentSceneIndex, dlg.id)}
                                className="p-1 rounded-md hover:bg-red-50 text-red-400 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={dlg.speakerEmoji}
                                onChange={(e) => store.updateDialogue(store.currentSceneIndex, dlg.id, { speakerEmoji: e.target.value })}
                                className="w-12 text-center bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xl focus:outline-none focus:ring-2 focus:ring-fairy-purple/30"
                                placeholder="👸"
                              />
                              <input
                                type="text"
                                value={dlg.speakerName}
                                onChange={(e) => store.updateDialogue(store.currentSceneIndex, dlg.id, { speakerName: e.target.value })}
                                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-fairy-purple/30"
                                placeholder="说话角色名"
                              />
                            </div>
                            <input
                              type="color"
                              value={dlg.color}
                              onChange={(e) => store.updateDialogue(store.currentSceneIndex, dlg.id, { color: e.target.value })}
                              className="w-full h-8 rounded-lg border border-gray-200 cursor-pointer"
                            />
                            <textarea
                              value={dlg.text}
                              onChange={(e) => store.updateDialogue(store.currentSceneIndex, dlg.id, { text: e.target.value })}
                              rows={2}
                              placeholder="输入角色说的话..."
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-fairy-purple/30 resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Properties Tab */}
                {rightTab === 'characters' && (
                  <div className="space-y-4">
                    {selectedInstance && selectedAsset ? (
                      <>
                        <div className="bg-white/70 rounded-xl p-4 text-center">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-2"
                            style={{ backgroundColor: `${selectedAsset.coverColor}30` }}
                          >
                            {selectedAsset.emoji}
                          </div>
                          <h4 className="font-fairy text-gray-800">{selectedAsset.name}</h4>
                          <p className="text-xs text-gray-400 font-body">{selectedAsset.category}</p>
                          <p className="text-xs text-gray-500 font-body mt-2">{selectedAsset.description}</p>
                        </div>

                        <div>
                          <label className="text-xs font-body text-gray-500 mb-2 block flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Maximize className="w-3 h-3" />
                              大小缩放
                            </span>
                            <span className="font-bold text-fairy-purple">{Math.round(selectedInstance.scale * 100)}%</span>
                          </label>
                          <input
                            type="range"
                            min={0.3}
                            max={3}
                            step={0.05}
                            value={selectedInstance.scale}
                            onChange={(e) =>
                              store.updatePlacedAsset(store.currentSceneIndex, selectedInstance.instanceId, {
                                scale: parseFloat(e.target.value),
                              })
                            }
                            className="w-full accent-fairy-purple"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-body text-gray-500 mb-2 block flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <RotateCw className="w-3 h-3" />
                              旋转角度
                            </span>
                            <span className="font-bold text-fairy-purple">{selectedInstance.rotation}°</span>
                          </label>
                          <input
                            type="range"
                            min={-180}
                            max={180}
                            step={5}
                            value={selectedInstance.rotation}
                            onChange={(e) =>
                              store.updatePlacedAsset(store.currentSceneIndex, selectedInstance.instanceId, {
                                rotation: parseInt(e.target.value),
                              })
                            }
                            className="w-full accent-fairy-purple"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-body text-gray-500 mb-2 block flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Move className="w-3 h-3" />
                              图层顺序
                            </span>
                            <span className="font-bold text-fairy-purple">{selectedInstance.zIndex}</span>
                          </label>
                          <input
                            type="range"
                            min={1}
                            max={50}
                            step={1}
                            value={selectedInstance.zIndex}
                            onChange={(e) =>
                              store.updatePlacedAsset(store.currentSceneIndex, selectedInstance.instanceId, {
                                zIndex: parseInt(e.target.value),
                              })
                            }
                            className="w-full accent-fairy-purple"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-body text-gray-500 mb-2 block flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            动画效果
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {ANIMATION_TYPES.map((anim) => (
                              <button
                                key={anim.type}
                                onClick={() =>
                                  store.updatePlacedAsset(store.currentSceneIndex, selectedInstance.instanceId, {
                                    animation: anim.type,
                                  })
                                }
                                className={`p-2 rounded-lg text-center transition-all text-xs font-body ${
                                  selectedInstance.animation === anim.type
                                    ? 'bg-gradient-fairy text-white shadow-md'
                                    : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-sm border border-fairy-purple/10'
                                }`}
                                title={anim.name}
                              >
                                <div className="text-xl mb-0.5">{anim.icon}</div>
                                <div className="text-[10px] truncate">{anim.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => store.removePlacedAsset(store.currentSceneIndex, selectedInstance.instanceId)}
                          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors text-sm font-body"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除元素
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-12 bg-white/40 rounded-xl">
                        <Settings className="w-12 h-12 text-fairy-purple/30 mx-auto mb-3" />
                        <p className="text-sm text-gray-400 font-body">点击舞台上的元素</p>
                        <p className="text-xs text-gray-300 font-body">即可编辑其属性</p>
                      </div>
                    )}

                    {currentScene && (
                      <div className="pt-4 border-t border-fairy-purple/10">
                        <h4 className="text-xs font-body text-gray-400 mb-2">
                          舞台元素 ({currentScene.placedAssets.length})
                        </h4>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {currentScene.placedAssets.map((p) => {
                            const asset = getAssetById(p.assetId);
                            if (!asset) return null;
                            const isSel = p.instanceId === store.selectedInstanceId;
                            return (
                              <button
                                key={p.instanceId}
                                onClick={() => store.setSelectedInstanceId(p.instanceId)}
                                className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                                  isSel
                                    ? 'bg-gradient-fairy text-white shadow-md'
                                    : 'bg-white/50 hover:bg-white'
                                }`}
                              >
                                <span className="text-xl">{asset.emoji}</span>
                                <span className={`flex-1 text-sm font-body truncate ${
                                  isSel ? '' : 'text-gray-600'
                                }`}>
                                  {asset.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Toast */}
      {showSaveModal && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce-soft">
          <Save className="w-5 h-5" />
          <span className="font-body">保存成功！</span>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="fairy-card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-fairy-purple/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-fairy flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-fairy text-gray-800">加载剧目</h3>
                  <p className="text-sm text-gray-500 font-body">
                    已保存 {store.savedPerformances.length} 个剧目
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLoadModal(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {store.savedPerformances.length === 0 ? (
                <div className="text-center py-16">
                  <FolderOpen className="w-16 h-16 text-fairy-purple/30 mx-auto mb-4" />
                  <p className="text-gray-400 font-body">还没有保存的剧目</p>
                  <p className="text-gray-300 font-body text-sm">编辑后点击"保存"按钮即可保存</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {store.savedPerformances.map((perf) => (
                    <div
                      key={perf.id}
                      className="bg-white/70 rounded-xl p-4 border-2 border-transparent hover:border-fairy-purple/30 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-fairy flex items-center justify-center flex-shrink-0">
                          <Film className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-fairy text-lg text-gray-800 truncate">{perf.title}</h4>
                          <p className="text-xs text-gray-500 font-body mb-1 line-clamp-1">
                            {perf.description || '暂无简介'}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-gray-400 font-body">
                            <span>{perf.scenes.length} 幕</span>
                            <span>·</span>
                            <span>{new Date(perf.updatedAt).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              store.loadPerformance(perf.id);
                              setShowLoadModal(false);
                            }}
                            className="px-4 py-2 rounded-full bg-gradient-fairy text-white text-sm font-body hover:shadow-md transition-all"
                          >
                            加载
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('确定删除这个剧目吗？')) {
                                store.deletePerformance(perf.id);
                              }
                            }}
                            className="p-2 rounded-full hover:bg-red-50 text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from 'react';
import {
  BookOpen,
  ScrollText,
  Languages,
  Trophy,
  Lock,
  Unlock,
  ChevronRight,
  Sparkles,
  Puzzle,
  X,
  Check,
  Star,
  Lightbulb,
  RefreshCw,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore } from '@/store/storyStore';
import {
  LANGUAGE_RACES,
  LANGUAGE_RACE_INFO,
  DECIPHER_TABS,
} from '@/types';
import type {
  LanguageRace,
  DecipherTab,
  LanguageWord,
  GrammarRule,
  WordPuzzle,
  AncientStele,
} from '@/types';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case '入门':
      return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' };
    case '初级':
      return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' };
    case '中级':
      return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' };
    case '高级':
      return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-300' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' };
  }
};

export default function LanguageDecipher() {
  const [activeTab, setActiveTab] = useState<DecipherTab>('overview');
  const [selectedRace, setSelectedRace] = useState<LanguageRace>('精灵');
  const [selectedWord, setSelectedWord] = useState<LanguageWord | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarRule | null>(null);
  const [selectedStele, setSelectedStele] = useState<AncientStele | null>(null);
  const [activePuzzle, setActivePuzzle] = useState<WordPuzzle | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerChecked, setAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [shuffledRights, setShuffledRights] = useState<{ left: string; right: string }[]>([]);

  const {
    languageWords,
    languageGrammar,
    languagePuzzles,
    ancientSteles,
    unlockedLanguageWords,
    unlockedLanguageGrammar,
    completedLanguagePuzzles,
    discoveredSteles,
    translatedSteles,
    languageLevels,
    languageExperience,
    completePuzzle,
    isPuzzleCompleted,
    isWordUnlocked,
    isGrammarUnlocked,
    isSteleDiscovered,
    isSteleTranslated,
    canTranslateStele,
    translateStele,
    discoverStele,
  } = useStoryStore();

  const wordsByRace = useMemo(() => {
    return languageWords.filter((w) => w.race === selectedRace);
  }, [languageWords, selectedRace]);

  const grammarByRace = useMemo(() => {
    return languageGrammar.filter((g) => g.race === selectedRace);
  }, [languageGrammar, selectedRace]);

  const puzzlesByRace = useMemo(() => {
    return languagePuzzles.filter((p) => p.race === selectedRace);
  }, [languagePuzzles, selectedRace]);

  const stelesByRace = useMemo(() => {
    return ancientSteles.filter((s) => s.race === selectedRace);
  }, [ancientSteles, selectedRace]);

  const raceInfo = LANGUAGE_RACE_INFO[selectedRace];
  const level = languageLevels[selectedRace] || 1;
  const exp = languageExperience[selectedRace] || 0;
  const expNeeded = level * 200;
  const expProgress = Math.min(100, (exp / expNeeded) * 100);

  const unlockedWordCount = wordsByRace.filter((w) => unlockedLanguageWords[w.id]).length;
  const unlockedGrammarCount = grammarByRace.filter((g) => unlockedLanguageGrammar[g.id]).length;
  const completedPuzzleCount = puzzlesByRace.filter((p) => completedLanguagePuzzles.has(p.id)).length;
  const discoveredSteleCount = stelesByRace.filter((s) => discoveredSteles.has(s.id)).length;
  const translatedSteleCount = stelesByRace.filter((s) => translatedSteles.has(s.id)).length;

  const handleStartPuzzle = (puzzle: WordPuzzle) => {
    setActivePuzzle(puzzle);
    setPuzzleSolved(false);
    setShowHint(false);
    setHintIndex(0);
    setUserAnswer('');
    setAnswerChecked(false);
    setIsCorrect(null);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs(new Set());
    if (puzzle.type === 'matching' && puzzle.data.pairs) {
      setShuffledRights([...puzzle.data.pairs].sort(() => Math.random() - 0.5));
    }
  };

  const handleClosePuzzle = () => {
    setActivePuzzle(null);
    setPuzzleSolved(false);
    setShowHint(false);
    setHintIndex(0);
    setUserAnswer('');
    setAnswerChecked(false);
    setIsCorrect(null);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs(new Set());
  };

  const checkAnswer = () => {
    if (!activePuzzle) return;

    let correct = false;

    if (activePuzzle.type === 'matching') {
      correct = matchedPairs.size === activePuzzle.data.pairs.length;
    } else {
      const normalizedUserAnswer = userAnswer.trim().toLowerCase();
      let correctAnswer = '';
      if (activePuzzle.type === 'translate') {
        correctAnswer = activePuzzle.data.answer.toLowerCase();
      } else if (activePuzzle.type === 'fillBlank') {
        correctAnswer = activePuzzle.data.answer.toLowerCase();
      } else if (activePuzzle.type === 'anagram') {
        correctAnswer = activePuzzle.data.answer.toLowerCase();
      }
      correct = normalizedUserAnswer === correctAnswer;
    }

    setIsCorrect(correct);
    setAnswerChecked(true);

    if (correct && !isPuzzleCompleted(activePuzzle.id)) {
      setTimeout(() => {
        completePuzzle(activePuzzle.id);
        setPuzzleSolved(true);
      }, 800);
    }
  };

  const handleMatchingClick = (side: 'left' | 'right', index: number) => {
    if (answerChecked || matchedPairs.has(index)) return;

    if (side === 'left') {
      setSelectedLeft(index);
    } else {
      setSelectedRight(index);
    }

    if (side === 'right' && selectedLeft !== null) {
      const originalPair = activePuzzle?.type === 'matching' ? activePuzzle.data.pairs[selectedLeft] : null;
      const clickedPair = shuffledRights[index];

      if (originalPair && clickedPair && originalPair.left === clickedPair.left && originalPair.right === clickedPair.right) {
        const newMatched = new Set(matchedPairs);
        newMatched.add(selectedLeft);
        setMatchedPairs(newMatched);
      }

      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 300);
    } else if (side === 'left' && selectedRight !== null) {
      const originalPair = activePuzzle?.type === 'matching' ? activePuzzle.data.pairs[index] : null;
      const clickedPair = shuffledRights[selectedRight];

      if (originalPair && clickedPair && originalPair.left === clickedPair.left && originalPair.right === clickedPair.right) {
        const newMatched = new Set(matchedPairs);
        newMatched.add(index);
        setMatchedPairs(newMatched);
      }

      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 300);
    }
  };

  const handleNextHint = () => {
    if (activePuzzle?.data?.hints && Array.isArray(activePuzzle.data.hints)) {
      if (hintIndex < (activePuzzle.data.hints as string[]).length - 1) {
        setHintIndex(hintIndex + 1);
      }
      setShowHint(true);
    }
  };

  const handleTranslateStele = (stele: AncientStele) => {
    if (canTranslateStele(stele.id) && !isSteleTranslated(stele.id)) {
      translateStele(stele.id);
    }
  };

  const handleDiscoverStele = (stele: AncientStele) => {
    if (!isSteleDiscovered(stele.id)) {
      discoverStele(stele.id);
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 via-purple-50 to-pink-100 backdrop-blur-sm border border-purple-300/50 mb-4">
          <Languages className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-body text-purple-700">破译古老的语言</span>
          <Sparkles className="w-4 h-4 text-fairy-gold animate-twinkle" />
        </div>
        <h2 className="text-3xl md:text-4xl font-fairy text-gradient-fairy mb-2">
          童话语言破译所
        </h2>
        <p className="text-gray-600 font-body max-w-2xl mx-auto">
          不同种族拥有独特的文字和语言。通过解谜逐步解锁词汇和语法规则，
          发现古代石碑后进行翻译，揭示隐藏的剧情。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LANGUAGE_RACES.map((race) => {
          const info = LANGUAGE_RACE_INFO[race];
          const raceLevel = languageLevels[race] || 1;
          const raceExp = languageExperience[race] || 0;
          const raceExpNeeded = raceLevel * 200;
          const raceWords = languageWords.filter((w) => w.race === race);
          const raceUnlocked = raceWords.filter((w) => unlockedLanguageWords[w.id]).length;
          const racePuzzles = languagePuzzles.filter((p) => p.race === race);
          const raceCompleted = racePuzzles.filter((p) => completedLanguagePuzzles.has(p.id)).length;

          return (
            <div
              key={race}
              onClick={() => setSelectedRace(race)}
              className={`fairy-card p-6 cursor-pointer relative overflow-hidden ${
                selectedRace === race ? 'ring-4 ring-purple-400/50' : ''
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${info.bgColor}`} />
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.bgColor} flex items-center justify-center text-3xl shadow-lg`}>
                    {info.emoji}
                  </div>
                  <div>
                    <h3 className={`text-xl font-fairy ${info.color}`}>{info.name}</h3>
                    <p className="text-xs text-gray-500 font-body">Lv.{raceLevel}</p>
                  </div>
                </div>
                <Trophy className={`w-6 h-6 ${info.color} opacity-50`} />
              </div>
              <p className="text-sm text-gray-600 font-body mb-4">{info.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>经验值</span>
                    <span>{raceExp}/{raceExpNeeded}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${info.bgColor} transition-all duration-500`}
                      style={{ width: `${(raceExp / raceExpNeeded) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white/50 rounded-xl p-2 text-center">
                    <p className={`text-lg font-bold ${info.color}`}>{raceUnlocked}</p>
                    <p className="text-xs text-gray-500">已解锁词汇</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-2 text-center">
                    <p className={`text-lg font-bold ${info.color}`}>{raceCompleted}/{racePuzzles.length}</p>
                    <p className="text-xs text-gray-500">已完成解谜</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center">
                <button
                  onClick={() => {
                    setSelectedRace(race);
                    setActiveTab('puzzles');
                  }}
                  className="fairy-button-outline text-sm py-2 px-4"
                >
                  开始学习
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fairy-card p-6">
        <h3 className="text-xl font-fairy text-fairy-purple mb-4 flex items-center gap-2">
          <ScrollText className="w-5 h-5" />
          古代石碑发现
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ancientSteles.map((stele) => {
            const discovered = discoveredSteles.has(stele.id);
            const translated = translatedSteles.has(stele.id);
            const steleRaceInfo = LANGUAGE_RACE_INFO[stele.race];

            return (
              <div
                key={stele.id}
                className={`relative rounded-2xl p-4 transition-all duration-300 ${
                  discovered
                    ? `bg-gradient-to-br ${stele.coverColor} shadow-md`
                    : 'bg-gray-200 opacity-60'
                }`}
              >
                <div className="text-4xl mb-2 text-center">
                  {discovered ? stele.coverEmoji : '❓'}
                </div>
                <p className="text-sm font-medium text-center text-gray-700">
                  {discovered ? stele.name : '未发现'}
                </p>
                {discovered && (
                  <div className="mt-2 flex justify-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      translated ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {translated ? '已翻译' : '待翻译'}
                    </span>
                  </div>
                )}
                {discovered && (
                  <div className="absolute -top-2 -right-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${steleRaceInfo.bgColor} ${steleRaceInfo.color}`}>
                      {steleRaceInfo.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderVocabulary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-fairy text-fairy-purple flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            {raceInfo.name}词汇
          </h3>
          <p className="text-sm text-gray-500 font-body mt-1">
            已解锁 {unlockedWordCount} / {wordsByRace.length} 个词汇
          </p>
        </div>
        <div className="flex items-center gap-2">
          {LANGUAGE_RACES.map((race) => (
            <button
              key={race}
              onClick={() => setSelectedRace(race)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRace === race
                  ? `bg-gradient-to-r ${LANGUAGE_RACE_INFO[race].bgColor} ${LANGUAGE_RACE_INFO[race].color} shadow-md`
                  : 'bg-white/50 text-gray-600 hover:bg-white'
              }`}
            >
              {LANGUAGE_RACE_INFO[race].emoji} {LANGUAGE_RACE_INFO[race].name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wordsByRace.map((word) => {
          const unlocked = unlockedLanguageWords[word.id];
          const diffColor = getDifficultyColor(word.difficulty);

          return (
            <div
              key={word.id}
              onClick={() => unlocked && setSelectedWord(word)}
              className={`fairy-card p-5 relative ${
                unlocked ? 'cursor-pointer hover:-translate-y-1' : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xl font-fairy ${raceInfo.color}`}>
                      {unlocked ? word.word : '???'}
                    </h4>
                    {unlocked ? (
                      <Unlock className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-body">
                    {unlocked ? `[${word.pronunciation}]` : '[未解锁]'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${diffColor.bg} ${diffColor.text}`}>
                  {word.difficulty}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">词义：</span>
                  <span className="text-sm font-medium text-gray-700">
                    {unlocked ? word.meaning : '???'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">词性：</span>
                  <span className="text-sm text-gray-600">
                    {unlocked ? word.partOfSpeech : '???'}
                  </span>
                </div>
                {unlocked && word.unlockCondition && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-amber-600 font-body">
                      🌟 {word.unlockCondition}
                    </p>
                  </div>
                )}
                {!unlocked && word.unlockCondition && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-body">
                      <Lock className="w-3 h-3 inline mr-1" />
                      {word.unlockCondition}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGrammar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-fairy text-fairy-purple flex items-center gap-2">
            <ScrollText className="w-6 h-6" />
            {raceInfo.name}语法
          </h3>
          <p className="text-sm text-gray-500 font-body mt-1">
            已解锁 {unlockedGrammarCount} / {grammarByRace.length} 条语法规则
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {grammarByRace.map((grammar) => {
          const unlocked = unlockedLanguageGrammar[grammar.id];
          const diffColor = getDifficultyColor(grammar.difficulty);

          return (
            <div
              key={grammar.id}
              onClick={() => unlocked && setSelectedGrammar(grammar)}
              className={`fairy-card p-5 ${
                unlocked ? 'cursor-pointer hover:-translate-y-1' : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {unlocked ? (
                    <Unlock className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <h4 className={`text-lg font-fairy ${raceInfo.color}`}>
                    {unlocked ? grammar.title : '???'}
                  </h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${diffColor.bg} ${diffColor.text}`}>
                  {grammar.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-600 font-body mb-3">
                {unlocked ? grammar.description : '完成相关解谜解锁此语法规则'}
              </p>

              {unlocked && (
                <div className="bg-white/50 rounded-xl p-4 space-y-2">
                  {grammar.examples.slice(0, 2).map((example, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className={`text-sm font-medium ${raceInfo.color}`}>
                        {example.original}
                      </p>
                      <p className="text-sm text-gray-600">{example.translation}</p>
                      <p className="text-xs text-gray-400">{example.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              <ChevronRight className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPuzzles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-fairy text-fairy-purple flex items-center gap-2">
            <Puzzle className="w-6 h-6" />
            {raceInfo.name}解谜
          </h3>
          <p className="text-sm text-gray-500 font-body mt-1">
            已完成 {completedPuzzleCount} / {puzzlesByRace.length} 个解谜
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {puzzlesByRace.map((puzzle) => {
          const completed = completedLanguagePuzzles.has(puzzle.id);
          const diffColor = getDifficultyColor(puzzle.difficulty);
          const typeIcons: Record<string, string> = {
            matching: '🔗',
            fillBlank: '✏️',
            translate: '🔤',
            anagram: '🔀',
          };
          const typeNames: Record<string, string> = {
            matching: '配对游戏',
            fillBlank: '填空题',
            translate: '翻译题',
            anagram: '字母重组',
          };

          return (
            <div
              key={puzzle.id}
              onClick={() => handleStartPuzzle(puzzle)}
              className={`fairy-card p-5 cursor-pointer relative overflow-hidden ${
                completed ? 'ring-2 ring-green-400/50' : ''
              }`}
            >
              {completed && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-xl text-sm font-medium">
                  <Check className="w-4 h-4 inline mr-1" />
                  已完成
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${raceInfo.bgColor} flex items-center justify-center text-2xl shadow-md`}>
                  {typeIcons[puzzle.type] || '🧩'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-fairy text-gray-800">{puzzle.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${diffColor.bg} ${diffColor.text}`}>
                      {puzzle.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{typeNames[puzzle.type]}</p>
                  <p className="text-sm text-gray-600 font-body">{puzzle.description}</p>
                  
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500" />
                      +{puzzle.experienceReward} 经验
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-blue-500" />
                      解锁 {puzzle.rewardWordIds.length} 个词汇
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button className={`text-sm font-medium ${
                  completed ? 'text-green-600' : 'text-fairy-purple'
                }`}>
                  {completed ? '再次挑战' : '开始挑战'}
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSteles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-fairy text-fairy-purple flex items-center gap-2">
            🏛️
            古代石碑
          </h3>
          <p className="text-sm text-gray-500 font-body mt-1">
            已发现 {discoveredSteleCount} / {stelesByRace.length} 块石碑
            ，已翻译 {translatedSteleCount} 块
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stelesByRace.map((stele) => {
          const discovered = discoveredSteles.has(stele.id);
          const translated = translatedSteles.has(stele.id);
          const canTranslate = canTranslateStele(stele.id);
          const steleRaceInfo = LANGUAGE_RACE_INFO[stele.race];

          return (
            <div
              key={stele.id}
              onClick={() => discovered && setSelectedStele(stele)}
              className={`fairy-card overflow-hidden ${
                discovered ? 'cursor-pointer' : 'opacity-60'
              }`}
            >
              <div className={`h-32 bg-gradient-to-br ${stele.coverColor} flex items-center justify-center relative`}>
                <span className="text-6xl">{discovered ? stele.coverEmoji : '❓'}</span>
                {discovered && (
                  <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${
                    translated ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {translated ? '已翻译' : canTranslate ? '可翻译' : '待研究'}
                  </span>
                )}
                {discovered && (
                  <span className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full ${steleRaceInfo.bgColor} ${steleRaceInfo.color}`}>
                    {steleRaceInfo.name}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h4 className="text-lg font-fairy text-gray-800 mb-2">
                  {discovered ? stele.name : '未发现的石碑'}
                </h4>
                
                {discovered ? (
                  <>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {stele.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {stele.era}
                      </span>
                    </div>

                    <div className="bg-white/50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-gray-500 mb-1">碑文原文：</p>
                      <p className={`text-sm font-medium ${steleRaceInfo.color} font-mono`}>
                        {stele.originalText}
                      </p>
                    </div>

                    {translated && stele.hiddenPlot && (
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs text-amber-600 font-medium mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          隐藏剧情
                        </p>
                        <p className="text-sm text-amber-700 font-body">{stele.hiddenPlot}</p>
                      </div>
                    )}

                    {!translated && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">翻译进度</span>
                          <span className={canTranslate ? 'text-green-600' : 'text-gray-400'}>
                            {canTranslate ? '可以翻译！' : `需要更多词汇`}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              canTranslate
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-gray-300 to-gray-400'
                            }`}
                            style={{
                              width: `${canTranslate ? 100 : Math.min(
                                100,
                                (stele.requiredWords.filter((w) => unlockedLanguageWords[w]).length /
                                  stele.requiredWords.length) *
                                  70
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400 font-body">
                    探索世界以发现更多古代石碑...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPuzzleModal = () => {
    if (!activePuzzle) return null;
    const puzzleRaceInfo = LANGUAGE_RACE_INFO[activePuzzle.race];
    const diffColor = getDifficultyColor(activePuzzle.difficulty);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
          <div className={`p-6 bg-gradient-to-r ${puzzleRaceInfo.bgColor}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-fairy text-gray-800">{activePuzzle.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${diffColor.bg} ${diffColor.text}`}>
                    {activePuzzle.difficulty}
                  </span>
                  <span className="text-xs text-gray-600">+{activePuzzle.experienceReward} 经验</span>
                </div>
              </div>
              <button
                onClick={handleClosePuzzle}
                className="p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <p className="text-gray-600 font-body mb-4">{activePuzzle.description}</p>

            {puzzleSolved ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-xl font-fairy text-green-600 mb-2">恭喜！解谜成功！</h4>
                <p className="text-gray-500 mb-4">
                  你解锁了 {activePuzzle.rewardWordIds.length} 个新词汇
                  {activePuzzle.rewardGrammarIds && ` 和 ${activePuzzle.rewardGrammarIds.length} 条语法`}
                </p>
                <div className="flex items-center justify-center gap-2 text-amber-500">
                  <Star className="w-5 h-5 fill-amber-500" />
                  <span className="font-bold">+{activePuzzle.experienceReward} 经验</span>
                </div>
              </div>
            ) : (
              <>
                {answerChecked && isCorrect !== null && (
                  <div className={`mb-4 p-3 rounded-xl text-center ${
                    isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center justify-center gap-2">
                      {isCorrect ? (
                        <>
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-green-700 font-medium">答案正确！</span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5 text-red-500" />
                          <span className="text-red-700 font-medium">答案不正确，请再试一次</span>
                        </>
                      )}
                    </div>
                    {!isCorrect && activePuzzle.type !== 'matching' && (
                      <button
                        onClick={() => {
                          setAnswerChecked(false);
                          setIsCorrect(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                      >
                        重新作答
                      </button>
                    )}
                  </div>
                )}

                {activePuzzle.type === 'matching' && activePuzzle.data?.pairs && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">将左侧的词汇与右侧的意思配对（点击左侧词汇，再点击右侧对应意思）：</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {activePuzzle.data.pairs.map((pair, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleMatchingClick('left', idx)}
                            className={`p-3 rounded-xl text-center font-medium cursor-pointer transition-all ${
                              matchedPairs.has(idx)
                                ? 'bg-green-100 text-green-700 opacity-60'
                                : selectedLeft === idx
                                ? `${puzzleRaceInfo.bgColor} ${puzzleRaceInfo.color} ring-2 ring-purple-400 shadow-lg`
                                : `${puzzleRaceInfo.bgColor} ${puzzleRaceInfo.color} hover:shadow-md`
                            }`}
                          >
                            {pair.left}
                            {matchedPairs.has(idx) && <Check className="w-4 h-4 inline ml-2" />}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {shuffledRights.map((pair, idx) => {
                          const originalIndex = activePuzzle.data.pairs.findIndex(
                            (p) => p.left === pair.left && p.right === pair.right
                          );
                          const isMatched = matchedPairs.has(originalIndex);
                          return (
                            <div
                              key={idx}
                              onClick={() => handleMatchingClick('right', idx)}
                              className={`p-3 rounded-xl text-center font-medium cursor-pointer transition-all ${
                                isMatched
                                  ? 'bg-green-100 text-green-700 opacity-60'
                                  : selectedRight === idx
                                  ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-400 shadow-lg'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {pair.right}
                              {isMatched && <Check className="w-4 h-4 inline ml-2" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      已配对：{matchedPairs.size} / {activePuzzle.data.pairs.length}
                    </p>
                  </div>
                )}

                {activePuzzle.type === 'translate' && activePuzzle.data?.question && (
                  <div className="space-y-4">
                    <div className="bg-white/50 rounded-xl p-4 border-2 border-dashed border-purple-200">
                      <p className="text-sm text-gray-600 mb-4">{activePuzzle.data.question}</p>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="请输入翻译结果..."
                          disabled={answerChecked && isCorrect === true}
                          className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-center text-lg font-fairy bg-white disabled:bg-gray-50"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !answerChecked) {
                              checkAnswer();
                            }
                          }}
                        />
                        {answerChecked && isCorrect === false && (
                          <p className="text-xs text-gray-500 text-center">
                            正确答案：<span className={puzzleRaceInfo.color}>{activePuzzle.data.answer}</span>
                          </p>
                        )}
                        {answerChecked && isCorrect === true && activePuzzle.data.answer && (
                          <p className="text-sm text-center">
                            <span className={`text-lg font-fairy ${puzzleRaceInfo.color}`}>
                              {activePuzzle.data.answer}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activePuzzle.type === 'fillBlank' && activePuzzle.data?.sentence && (
                  <div className="space-y-4">
                    <div className="bg-white/50 rounded-xl p-4 border-2 border-dashed border-purple-200">
                      <p className="text-lg font-medium text-center mb-4">
                        {activePuzzle.data.sentence}
                      </p>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="请输入填空答案..."
                          disabled={answerChecked && isCorrect === true}
                          className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-center text-lg font-fairy bg-white disabled:bg-gray-50"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !answerChecked) {
                              checkAnswer();
                            }
                          }}
                        />
                        {answerChecked && isCorrect === false && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500">
                              正确答案：<span className={puzzleRaceInfo.color}>{activePuzzle.data.answer}</span>
                            </p>
                            {activePuzzle.data.meaning && (
                              <p className="text-xs text-gray-400 mt-1">
                                意为：{activePuzzle.data.meaning}
                              </p>
                            )}
                          </div>
                        )}
                        {answerChecked && isCorrect === true && (
                          <div className="text-center">
                            <p className={`text-lg font-fairy ${puzzleRaceInfo.color}`}>
                              {activePuzzle.data.answer}
                            </p>
                            {activePuzzle.data.meaning && (
                              <p className="text-xs text-gray-400 mt-1">
                                意为：{activePuzzle.data.meaning}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activePuzzle.type === 'anagram' && activePuzzle.data?.letters && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">重新排列这些字母，组成正确的单词：</p>
                    <div className="flex justify-center gap-2 flex-wrap mb-4">
                      {activePuzzle.data.letters.map((letter, idx) => (
                        <div
                          key={idx}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${puzzleRaceInfo.bgColor} ${puzzleRaceInfo.color} shadow-md`}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="请输入重组后的单词..."
                        disabled={answerChecked && isCorrect === true}
                        className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-center text-lg font-fairy bg-white disabled:bg-gray-50"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !answerChecked) {
                            checkAnswer();
                          }
                        }}
                      />
                      {answerChecked && isCorrect === false && (
                        <div className="text-center">
                          <p className="text-xs text-gray-500">
                            正确答案：<span className={puzzleRaceInfo.color}>{activePuzzle.data.answer}</span>
                          </p>
                          {activePuzzle.data.meaning && (
                            <p className="text-xs text-gray-400 mt-1">
                              意为：{activePuzzle.data.meaning}
                            </p>
                          )}
                        </div>
                      )}
                      {answerChecked && isCorrect === true && (
                        <div className="text-center">
                          <p className={`text-2xl font-fairy ${puzzleRaceInfo.color}`}>
                            {activePuzzle.data.answer}
                          </p>
                          {activePuzzle.data.meaning && (
                            <p className="text-xs text-gray-400 mt-1">
                              意为：{activePuzzle.data.meaning}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {showHint && activePuzzle.data?.hints && Array.isArray(activePuzzle.data.hints) && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-700">提示</span>
                    </div>
                    <p className="text-sm text-amber-600">
                      {activePuzzle.data.hints[hintIndex]}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            {!puzzleSolved ? (
              <>
                <button
                  onClick={handleNextHint}
                  className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                  disabled={answerChecked && isCorrect === true}
                >
                  <Lightbulb className="w-4 h-4" />
                  提示
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleClosePuzzle}
                    className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-full text-sm"
                  >
                    关闭
                  </button>
                  {activePuzzle.type === 'matching' ? (
                    <button
                      onClick={checkAnswer}
                      disabled={matchedPairs.size !== activePuzzle.data.pairs?.length}
                      className="fairy-button text-sm py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check className="w-4 h-4 inline mr-1" />
                      完成配对
                    </button>
                  ) : (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim() || (answerChecked && isCorrect === true)}
                      className="fairy-button text-sm py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check className="w-4 h-4 inline mr-1" />
                      验证答案
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <button onClick={handleClosePuzzle} className="fairy-button text-sm">
                  继续学习
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWordDetail = () => {
    if (!selectedWord) return null;
    const wordRaceInfo = LANGUAGE_RACE_INFO[selectedWord.race];
    const diffColor = getDifficultyColor(selectedWord.difficulty);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className={`p-6 bg-gradient-to-r ${wordRaceInfo.bgColor}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-3xl font-fairy ${wordRaceInfo.color}`}>{selectedWord.word}</h3>
                <p className="text-gray-600">[{selectedWord.pronunciation}]</p>
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                className="p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm px-3 py-1 rounded-full ${diffColor.bg} ${diffColor.text}`}>
                {selectedWord.difficulty}
              </span>
              <span className="text-sm text-gray-500">{selectedWord.partOfSpeech}</span>
            </div>

            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">词义</p>
              <p className="text-lg font-medium text-gray-800">{selectedWord.meaning}</p>
            </div>

            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">例句</p>
              <p className={`text-base font-medium ${wordRaceInfo.color}`}>
                {selectedWord.example}
              </p>
              <p className="text-sm text-gray-600 mt-1">{selectedWord.exampleTranslation}</p>
            </div>

            {selectedWord.etymology && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                <p className="text-xs text-amber-600 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  词源
                </p>
                <p className="text-sm text-amber-700 font-body">{selectedWord.etymology}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGrammarDetail = () => {
    if (!selectedGrammar) return null;
    const grammarRaceInfo = LANGUAGE_RACE_INFO[selectedGrammar.race];
    const diffColor = getDifficultyColor(selectedGrammar.difficulty);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh]">
          <div className={`p-6 bg-gradient-to-r ${grammarRaceInfo.bgColor}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-2xl font-fairy text-gray-800`}>{selectedGrammar.title}</h3>
                <span className={`text-sm px-3 py-1 rounded-full ${diffColor.bg} ${diffColor.text}`}>
                  {selectedGrammar.difficulty}
                </span>
              </div>
              <button
                onClick={() => setSelectedGrammar(null)}
                className="p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <p className="text-gray-600 font-body mb-6">{selectedGrammar.description}</p>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">例句</h4>
              {selectedGrammar.examples.map((example, idx) => (
                <div key={idx} className="bg-white/50 rounded-xl p-4 space-y-2">
                  <p className={`text-base font-medium ${grammarRaceInfo.color}`}>
                    {example.original}
                  </p>
                  <p className="text-sm text-gray-600">{example.translation}</p>
                  <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                    {example.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSteleDetail = () => {
    if (!selectedStele) return null;
    const steleRaceInfo = LANGUAGE_RACE_INFO[selectedStele.race];
    const discovered = discoveredSteles.has(selectedStele.id);
    const translated = translatedSteles.has(selectedStele.id);
    const canTranslate = canTranslateStele(selectedStele.id);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh]">
          <div className={`h-40 bg-gradient-to-br ${selectedStele.coverColor} flex items-center justify-center relative`}>
            <span className="text-7xl">{discovered ? selectedStele.coverEmoji : '❓'}</span>
            <button
              onClick={() => setSelectedStele(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            {discovered && (
              <span className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full ${steleRaceInfo.bgColor} ${steleRaceInfo.color}`}>
                {steleRaceInfo.name}
              </span>
            )}
          </div>

          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {discovered ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-fairy text-gray-800">{selectedStele.name}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    translated ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {translated ? '已翻译' : canTranslate ? '可翻译' : '待研究'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedStele.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedStele.era}
                  </span>
                </div>

                <div className="bg-white/50 rounded-xl p-4 mb-4 border-2 border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">碑文原文：</p>
                  <p className={`text-lg font-medium ${steleRaceInfo.color} font-mono leading-relaxed`}>
                    {selectedStele.originalText}
                  </p>
                </div>

                {translated ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                      <p className="text-xs text-emerald-600 mb-1 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        译文
                      </p>
                      <p className="text-gray-700 font-body">{selectedStele.translatedText}</p>
                    </div>

                    {selectedStele.hiddenPlot && (
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                        <p className="text-xs text-amber-600 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          隐藏剧情
                        </p>
                        <p className="text-amber-700 font-body">{selectedStele.hiddenPlot}</p>
                      </div>
                    )}

                    {selectedStele.storyRevelation && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <p className="text-xs text-purple-600 mb-1 flex items-center gap-1">
                          🔮
                          故事启示
                        </p>
                        <p className="text-purple-700 font-body italic">
                          "{selectedStele.storyRevelation}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-2">翻译所需条件：</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            需要词汇 ({selectedStele.requiredWords.filter((w) => unlockedLanguageWords[w]).length}/{selectedStele.requiredWords.length})
                          </span>
                          {selectedStele.requiredWords.every((w) => unlockedLanguageWords[w]) ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            需要语法 ({selectedStele.requiredGrammar.filter((g) => unlockedLanguageGrammar[g]).length}/{selectedStele.requiredGrammar.length})
                          </span>
                          {selectedStele.requiredGrammar.every((g) => unlockedLanguageGrammar[g]) ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTranslateStele(selectedStele)}
                      disabled={!canTranslate}
                      className={`w-full py-3 rounded-full font-medium transition-all ${
                        canTranslate
                          ? 'fairy-button'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canTranslate ? '✨ 开始翻译' : '🔒 需要更多词汇和语法'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <h4 className="text-lg font-fairy text-gray-600 mb-2">未发现的石碑</h4>
                <p className="text-sm text-gray-400">
                  继续探索童话世界，发现更多神秘的古代石碑吧！
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      <FloatingDecorations />
      <Navbar />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {DECIPHER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-body font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-fairy text-white shadow-fairy scale-105'
                    : 'bg-white/70 text-gray-600 hover:bg-white hover:text-fairy-purple'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'vocabulary' && renderVocabulary()}
          {activeTab === 'grammar' && renderGrammar()}
          {activeTab === 'puzzles' && renderPuzzles()}
          {activeTab === 'steles' && renderSteles()}
        </div>
      </div>

      {renderPuzzleModal()}
      {renderWordDetail()}
      {renderGrammarDetail()}
      {renderSteleDetail()}
    </div>
  );
}

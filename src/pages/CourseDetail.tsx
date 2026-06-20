import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Lock,
  ChevronRight,
  Star,
  Zap,
  HelpCircle,
  Check,
  X,
  RefreshCw,
  Award,
  Crown,
  Sparkles,
  Trophy,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore } from '@/store/storyStore';
import { getCourseById } from '@/data/academy';
import type { Lesson, MatchingGameItem, SpellGameData, PotionGameData } from '@/types';
import { cn } from '@/lib/utils';

const lessonTypeIcons: Record<string, string> = {
  lesson: '📖',
  quiz: '📝',
  game: '🎮',
};

const lessonTypeLabels: Record<string, string> = {
  lesson: '课程',
  quiz: '测验',
  game: '挑战',
};

function LessonContent({ lesson }: { lesson: Lesson }) {
  const content = lesson.content;
  if (!content || content.length === 0) {
    return <div className="text-gray-500">暂无内容</div>;
  }

  return (
    <div className="prose prose-fairy max-w-none">
      {content.map((paragraph, index) => (
        <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0 text-lg">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function QuizLesson({ lesson, onComplete }: {
  lesson: Lesson;
  onComplete: (stars: number) => void;
}) {
  const questions = lesson.quizQuestions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (showResult) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = currentQuestion.options.find((o) => o.id === selectedOption)?.isCorrect;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setQuizCompleted(true);
      const percentage = (correctCount / questions.length) * 100;
      const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;
      onComplete(stars);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setCorrectCount(0);
    setShowHint(false);
    setQuizCompleted(false);
  };

  if (!currentQuestion) {
    return <div className="text-gray-500">暂无题目</div>;
  }

  if (quizCompleted) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-fairy-gold to-amber-500 flex items-center justify-center shadow-fairy-lg">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-fairy text-gray-800 mb-2">测验完成！</h3>
        <p className="text-gray-500 mb-6">
          答对 {correctCount}/{questions.length} 题 ({percentage}%)
        </p>
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className={cn(
                'w-10 h-10 transition-all duration-500',
                i <= stars
                  ? 'text-fairy-gold fill-fairy-gold animate-bounce-soft'
                  : 'text-gray-200'
              )}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <button onClick={handleRetry} className="fairy-button-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          再试一次
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">
          第 {currentIndex + 1}/{questions.length} 题
        </span>
        <span className="text-sm font-medium text-fairy-purple">
          难度：{currentQuestion.difficulty}
        </span>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full mb-8">
        <div
          className="h-full bg-gradient-fairy rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h3 className="text-xl font-medium text-gray-800 mb-6">
        {currentQuestion.question}
      </h3>

      {currentQuestion.hint && (
        <div className="mb-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-fairy-purple flex items-center gap-1 hover:underline"
          >
            <HelpCircle className="w-4 h-4" />
            {showHint ? '隐藏提示' : '查看提示'}
          </button>
          {showHint && (
            <p className="mt-2 p-3 bg-amber-50 rounded-xl text-amber-700 text-sm">
              💡 {currentQuestion.hint}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.isCorrect;
          let optionClass = 'bg-white/70 border-fairy-purple/30 hover:bg-white hover:border-fairy-purple';

          if (showResult) {
            if (isCorrect) {
              optionClass = 'bg-green-50 border-green-400 text-green-700';
            } else if (isSelected && !isCorrect) {
              optionClass = 'bg-red-50 border-red-400 text-red-700';
            } else {
              optionClass = 'bg-gray-50 border-gray-200 text-gray-400';
            }
          } else if (isSelected) {
            optionClass = 'bg-fairy-purple/10 border-fairy-purple';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              disabled={showResult}
              className={cn(
                'w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-3',
                optionClass
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  isSelected ? 'border-fairy-purple bg-fairy-purple text-white' : 'border-gray-300'
                )}
              >
                {showResult && isCorrect && <Check className="w-4 h-4 text-green-500" />}
                {showResult && isSelected && !isCorrect && <X className="w-4 h-4 text-red-500" />}
              </div>
              <span className="flex-1">{option.text}</span>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200">
          <p className="text-blue-700 text-sm">
            💡 {currentQuestion.options.find((o) => o.isCorrect)?.explanation || '解释'}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={cn(
              'fairy-button',
              !selectedOption && 'opacity-50 cursor-not-allowed'
            )}
          >
            提交答案
          </button>
        ) : (
          <button onClick={handleNext} className="fairy-button inline-flex items-center gap-2">
            {currentIndex < questions.length - 1 ? (
              <>下一题 <ChevronRight className="w-4 h-4" /></>
            ) : (
              '查看结果'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function MatchingGame({ items, onComplete }: {
  items: MatchingGameItem[];
  onComplete: (stars: number) => void;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [shuffledRight, setShuffledRight] = useState<MatchingGameItem[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    setShuffledRight([...items].sort(() => Math.random() - 0.5));
  }, [items]);

  useEffect(() => {
    if (matchedPairs.size === items.length && items.length > 0 && !gameCompleted) {
      setGameCompleted(true);
      const maxAttempts = items.length * 2;
      const stars = attempts <= items.length ? 3 : attempts <= maxAttempts ? 2 : 1;
      onComplete(stars);
    }
  }, [matchedPairs, items.length, attempts, gameCompleted, onComplete]);

  const handleSelectLeft = (id: string) => {
    if (matchedPairs.has(id)) return;
    setSelectedLeft(id);
    checkMatch(id, selectedRight);
  };

  const handleSelectRight = (id: string) => {
    if (matchedPairs.has(id)) return;
    setSelectedRight(id);
    checkMatch(selectedLeft, id);
  };

  const checkMatch = (leftId: string | null, rightId: string | null) => {
    if (!leftId || !rightId) return;

    setAttempts((a) => a + 1);

    const leftItem = items.find((i) => i.id === leftId);
    const rightItem = items.find((i) => i.id === rightId);

    if (leftItem && rightItem && leftItem.left === rightItem.left) {
      setMatchedPairs((prev) => new Set(prev).add(leftId));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  const handleRestart = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs(new Set());
    setAttempts(0);
    setShuffledRight([...items].sort(() => Math.random() - 0.5));
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const maxAttempts = items.length * 2;
    const stars = attempts <= items.length ? 3 : attempts <= maxAttempts ? 2 : 1;

    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-fairy-lg">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-fairy text-gray-800 mb-2">挑战完成！</h3>
        <p className="text-gray-500 mb-6">总共尝试了 {attempts} 次</p>
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className={cn(
                'w-10 h-10 transition-all duration-500',
                i <= stars
                  ? 'text-fairy-gold fill-fairy-gold animate-bounce-soft'
                  : 'text-gray-200'
              )}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <button onClick={handleRestart} className="fairy-button-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          再玩一次
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <p className="text-gray-600">
          将左侧的词汇与右侧正确的含义配对
        </p>
        <p className="text-sm text-gray-400 mt-2">
          已配对：{matchedPairs.size}/{items.length}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-3">
          {items.map((item) => {
            const isMatched = matchedPairs.has(item.id);
            const isSelected = selectedLeft === item.id;

            return (
              <button
                key={`left-${item.id}`}
                onClick={() => handleSelectLeft(item.id)}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3',
                  isMatched
                    ? 'bg-green-50 border-green-400 text-green-700 cursor-default'
                    : isSelected
                    ? 'bg-fairy-purple/20 border-fairy-purple scale-105 shadow-lg'
                    : 'bg-white/70 border-fairy-purple/30 hover:bg-white hover:border-fairy-purple'
                )}
              >
                <span className="text-2xl">{item.leftEmoji}</span>
                <span className="font-medium">{item.left}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {shuffledRight.map((item) => {
            const isMatched = matchedPairs.has(item.id);
            const isSelected = selectedRight === item.id;

            return (
              <button
                key={`right-${item.id}`}
                onClick={() => handleSelectRight(item.id)}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3',
                  isMatched
                    ? 'bg-green-50 border-green-400 text-green-700 cursor-default'
                    : isSelected
                    ? 'bg-fairy-purple/20 border-fairy-purple scale-105 shadow-lg'
                    : 'bg-white/70 border-fairy-purple/30 hover:bg-white hover:border-fairy-purple'
                )}
              >
                <span className="text-2xl">{item.rightEmoji}</span>
                <span className="font-medium">{item.right}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SpellGame({ data, onComplete }: {
  data: SpellGameData;
  onComplete: (stars: number) => void;
}) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleStep = (step: string) => {
    if (gameCompleted) return;

    const nextIndex = sequence.length;
    const correctStep = data.sequence[nextIndex];

    if (step === correctStep) {
      const newSequence = [...sequence, step];
      setSequence(newSequence);

      if (newSequence.length === data.sequence.length) {
        setGameCompleted(true);
        onComplete(3);
      }
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setSequence([]);
      }, 1000);
    }
  };

  const handleRestart = () => {
    setSequence([]);
    setGameCompleted(false);
    setShowError(false);
  };

  const shuffledSteps = useMemo(() => {
    return [...data.sequence].sort(() => Math.random() - 0.5);
  }, [data.sequence]);

  if (gameCompleted) {
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-fairy-lg animate-glow">
          <span className="text-5xl">{data.spellEmoji}</span>
        </div>
        <h3 className="text-2xl font-fairy text-gray-800 mb-2">施法成功！</h3>
        <p className="text-gray-500 mb-2">{data.incantation}</p>
        <p className="text-sm text-fairy-purple mb-6">{data.description}</p>
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className="w-10 h-10 text-fairy-gold fill-fairy-gold animate-bounce-soft"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <button onClick={handleRestart} className="fairy-button-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          再试一次
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <span className="text-4xl">{data.spellEmoji}</span>
        </div>
        <h3 className="text-xl font-fairy text-gray-800 mb-1">{data.spellName}</h3>
        <p className="text-sm text-fairy-purple mb-2">{data.incantation}</p>
        <p className="text-gray-500 text-sm">{data.instructions || '按正确顺序点击施法步骤'}</p>
      </div>

      <div className={cn(
        'mb-6 p-4 rounded-2xl bg-white/70 border-2 border-dashed transition-all duration-300',
        showError ? 'border-red-400 bg-red-50' : 'border-fairy-purple/30'
      )}>
        <p className="text-center text-sm text-gray-500 mb-2">施法进度</p>
        <div className="flex justify-center items-center gap-2 min-h-[60px]">
          {sequence.length === 0 ? (
            <span className="text-gray-300">等待施法...</span>
          ) : (
            sequence.map((step, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-gradient-to-r from-fairy-purple to-fairy-pink text-white rounded-lg text-sm"
              >
                {step}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {shuffledSteps.map((step, index) => (
          <button
            key={`${step}-${index}`}
            onClick={() => handleStep(step)}
            className={cn(
              'p-4 rounded-2xl border-2 transition-all duration-300 font-medium',
              'bg-white/70 border-fairy-purple/30 hover:bg-white hover:border-fairy-purple hover:scale-105',
              showError && 'animate-shake'
            )}
          >
            {step}
          </button>
        ))}
      </div>

      {showError && (
        <p className="text-center text-red-500 mt-4 text-sm">
          顺序错误，请重新开始！
        </p>
      )}
    </div>
  );
}

function PotionGame({ data, onComplete }: {
  data: PotionGameData;
  onComplete: (stars: number) => void;
}) {
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showError, setShowError] = useState(false);

  const sortedIngredients = useMemo(() => {
    return [...data.ingredients].sort(() => Math.random() - 0.5);
  }, [data.ingredients]);

  const handleAddIngredient = (ingredientId: string) => {
    if (gameCompleted) return;
    if (addedIngredients.includes(ingredientId)) return;

    const ingredient = data.ingredients.find((i) => i.id === ingredientId);
    if (!ingredient) return;

    const expectedOrder = addedIngredients.length + 1;

    if (ingredient.correctOrder === expectedOrder) {
      const newAdded = [...addedIngredients, ingredientId];
      setAddedIngredients(newAdded);

      if (newAdded.length === data.ingredients.length) {
        setGameCompleted(true);
        onComplete(3);
      }
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setAddedIngredients([]);
      }, 1000);
    }
  };

  const handleRestart = () => {
    setAddedIngredients([]);
    setGameCompleted(false);
    setShowError(false);
  };

  if (gameCompleted) {
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-fairy-lg animate-glow">
          <span className="text-5xl">{data.potionEmoji}</span>
        </div>
        <h3 className="text-2xl font-fairy text-gray-800 mb-2">药剂调配成功！</h3>
        <p className="text-gray-500 mb-2">{data.potionName}</p>
        <p className="text-sm text-emerald-600 mb-6">{data.description}</p>
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className="w-10 h-10 text-fairy-gold fill-fairy-gold animate-bounce-soft"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <button onClick={handleRestart} className="fairy-button-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          再调配一次
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
          <span className="text-4xl">{data.potionEmoji}</span>
        </div>
        <h3 className="text-xl font-fairy text-gray-800 mb-1">{data.potionName}</h3>
        <p className="text-gray-500 text-sm">{data.description}</p>
        <p className="text-fairy-purple text-sm mt-2">按正确顺序加入材料</p>
      </div>

      <div className={cn(
        'mb-6 p-6 rounded-2xl bg-white/70 border-2 border-dashed min-h-[120px] transition-all duration-300',
        showError ? 'border-red-400 bg-red-50' : 'border-emerald-300 bg-emerald-50/30'
      )}>
        <p className="text-center text-sm text-gray-500 mb-3">药剂坩埚</p>
        <div className="flex flex-wrap justify-center gap-2">
          {addedIngredients.length === 0 ? (
            <span className="text-gray-300">点击下方材料加入...</span>
          ) : (
            addedIngredients.map((ingId, index) => {
              const ing = data.ingredients.find((i) => i.id === ingId);
              return (
                <div
                  key={index}
                  className="px-3 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg flex items-center gap-2"
                >
                  <span>{ing?.emoji}</span>
                  <span className="text-sm">{ing?.name}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sortedIngredients.map((ingredient) => {
          const isAdded = addedIngredients.includes(ingredient.id);
          return (
            <button
              key={ingredient.id}
              onClick={() => handleAddIngredient(ingredient.id)}
              disabled={isAdded}
              className={cn(
                'p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2',
                isAdded
                  ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                  : 'bg-white/70 border-emerald-300 hover:bg-white hover:border-emerald-500 hover:scale-105',
                showError && !isAdded && 'animate-shake'
              )}
            >
              <span className="text-3xl">{ingredient.emoji}</span>
              <span className="text-sm font-medium">{ingredient.name}</span>
            </button>
          );
        })}
      </div>

      {showError && (
        <p className="text-center text-red-500 mt-4 text-sm">
          材料顺序错误，重新调配！
        </p>
      )}
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = id ? getCourseById(id) : undefined;

  const completedLessons = useStoryStore((state) => state.completedLessons);
  const completedCourses = useStoryStore((state) => state.completedCourses);
  const completeLesson = useStoryStore((state) => state.completeLesson);
  const isLessonUnlocked = useStoryStore((state) => state.isLessonUnlocked);
  const lessonStars = useStoryStore((state) => state.lessonStars);
  const getCourseProgress = useStoryStore((state) => state.getCourseProgress);

  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const sortedLessons = useMemo(() => {
    return course ? [...course.lessons].sort((a, b) => a.order - b.order) : [];
  }, [course]);

  useEffect(() => {
    if (sortedLessons.length > 0 && !currentLessonId) {
      setCurrentLessonId(sortedLessons[0].id);
    }
  }, [sortedLessons, currentLessonId]);

  const currentLesson = sortedLessons.find((l) => l.id === currentLessonId);

  const handleLessonComplete = (stars: number) => {
    if (!currentLesson || !course) return;
    completeLesson(currentLesson.id, course.id, stars);

    const allDone = course.lessons.every((l) =>
      completedLessons.has(l.id) || l.id === currentLesson.id
    );

    if (allDone && !completedCourses.has(course.id)) {
      setShowCompletionModal(true);
    }
  };

  const handleMarkComplete = () => {
    if (!currentLesson || !course) return;
    if (!completedLessons.has(currentLesson.id)) {
      completeLesson(currentLesson.id, course.id, 3);

      const allDone = course.lessons.every((l) =>
        completedLessons.has(l.id) || l.id === currentLesson.id
      );

      if (allDone && !completedCourses.has(course.id)) {
        setShowCompletionModal(true);
      }
    }
  };

  const goToNextLesson = () => {
    if (!currentLesson) return;
    const currentIndex = sortedLessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex < sortedLessons.length - 1) {
      setCurrentLessonId(sortedLessons[currentIndex + 1].id);
    }
  };

  const goToPrevLesson = () => {
    if (!currentLesson) return;
    const currentIndex = sortedLessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex > 0) {
      setCurrentLessonId(sortedLessons[currentIndex - 1].id);
    }
  };

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.type) {
      case 'lesson':
        return <LessonContent lesson={currentLesson as Extract<Lesson, { type: 'lesson' }>} />;
      case 'quiz':
        return (
          <QuizLesson
            lesson={currentLesson as Extract<Lesson, { type: 'quiz' }>}
            onComplete={handleLessonComplete}
          />
        );
      case 'game': {
        const challenge = currentLesson.gameChallenge;
        if (!challenge) return <div className="text-gray-500">暂无游戏内容</div>;

        switch (challenge.type) {
          case 'matching':
            return (
              <MatchingGame
                items={challenge.data.items as MatchingGameItem[]}
                onComplete={handleLessonComplete}
              />
            );
          case 'spell':
            return (
              <SpellGame
                data={challenge.data as unknown as SpellGameData}
                onComplete={handleLessonComplete}
              />
            );
          case 'potion':
            return (
              <PotionGame
                data={challenge.data as unknown as PotionGameData}
                onComplete={handleLessonComplete}
              />
            );
          default:
            return <div className="text-gray-500">游戏类型不支持</div>;
        }
      }
      default:
        return <div className="text-gray-500">未知的课程类型</div>;
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">课程不存在</p>
          <button onClick={() => navigate('/academy')} className="fairy-button mt-4">
            返回学院
          </button>
        </div>
      </div>
    );
  }

  const progress = getCourseProgress(course.id);
  const isCurrentLessonCompleted = currentLesson ? completedLessons.has(currentLesson.id) : false;
  const isCurrentLessonUnlocked = currentLesson ? isLessonUnlocked(currentLesson.id, course.id) : false;
  const currentLessonIndex = sortedLessons.findIndex((l) => l.id === currentLessonId);
  const hasPrevLesson = currentLessonIndex > 0;
  const hasNextLesson = currentLessonIndex < sortedLessons.length - 1;

  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingDecorations />

      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/academy')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-fairy-purple mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回学院
        </button>

        <div className={`fairy-card p-6 mb-6 bg-gradient-to-br ${course.coverColor} text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-4xl">{course.emoji}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-fairy mb-2">{course.title}</h1>
              <p className="text-white/80 text-sm mb-4">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/20">
                  难度：{course.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20">
                  {course.lessons.length} 节课
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {course.totalExperience} XP
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>学习进度</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <h3 className="font-fairy text-lg text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-fairy-purple" />
              课程目录
            </h3>
            {sortedLessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              const isUnlocked = isLessonUnlocked(lesson.id, course.id);
              const stars = lessonStars[lesson.id] || 0;
              const isActive = lesson.id === currentLessonId;

              return (
                <button
                  key={lesson.id}
                  onClick={() => isUnlocked && setCurrentLessonId(lesson.id)}
                  disabled={!isUnlocked}
                  className={cn(
                    'w-full p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3',
                    isActive
                      ? 'bg-gradient-fairy text-white shadow-fairy'
                      : isUnlocked
                      ? 'bg-white/70 hover:bg-white hover:shadow-md'
                      : 'bg-gray-100 cursor-not-allowed opacity-60'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium',
                      isActive
                        ? 'bg-white/30 text-white'
                        : isCompleted
                        ? 'bg-green-100 text-green-600'
                        : isUnlocked
                        ? 'bg-fairy-purple/10 text-fairy-purple'
                        : 'bg-gray-200 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : !isUnlocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span>{lessonTypeIcons[lesson.type]}</span>
                      <span className="text-sm font-medium truncate">{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={cn(
                        'text-xs',
                        isActive ? 'text-white/70' : 'text-gray-400'
                      )}>
                        {lessonTypeLabels[lesson.type]}
                      </span>
                      {isCompleted && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-3 h-3',
                                i <= stars
                                  ? 'text-fairy-gold fill-fairy-gold'
                                  : isActive ? 'text-white/30' : 'text-gray-200'
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            {currentLesson && isCurrentLessonUnlocked ? (
              <div className="fairy-card p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lessonTypeIcons[currentLesson.type]}</span>
                    <div>
                      <h2 className="text-xl md:text-2xl font-fairy text-gray-800">
                        {currentLesson.title}
                      </h2>
                      <p className="text-sm text-gray-500">{currentLesson.description}</p>
                    </div>
                  </div>
                  {isCurrentLessonCompleted && (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      已完成
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  {renderLessonContent()}
                </div>

                {currentLesson.type === 'lesson' && !isCurrentLessonCompleted && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button onClick={handleMarkComplete} className="fairy-button inline-flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      标记为已学完
                    </button>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                  <button
                    onClick={goToPrevLesson}
                    disabled={!hasPrevLesson}
                    className={cn(
                      'px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2',
                      hasPrevLesson
                        ? 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    上一节
                  </button>
                  <button
                    onClick={goToNextLesson}
                    disabled={!hasNextLesson}
                    className={cn(
                      'fairy-button flex items-center gap-2',
                      !hasNextLesson && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    下一节
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="fairy-card p-12 text-center">
                <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-fairy text-gray-600 mb-2">课程未解锁</h3>
                <p className="text-gray-400">请先完成前一节课程</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-soft">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-fairy flex items-center justify-center shadow-fairy-lg">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-fairy text-gradient-fairy mb-2">恭喜你！</h2>
            <p className="text-gray-600 mb-6">你已完成《{course.title}》全部课程！</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-purple-50 rounded-2xl">
                <div className="text-3xl mb-2">{course.completionBadge.emoji}</div>
                <p className="font-fairy text-purple-700 text-sm">{course.completionBadge.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Award className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-400">徽章</span>
                </div>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl">
                <div className="text-3xl mb-2">{course.completionTitle.emoji}</div>
                <p className="font-fairy text-rose-700 text-sm">{course.completionTitle.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Crown className="w-3 h-3 text-rose-400" />
                  <span className="text-xs text-rose-400">称号</span>
                </div>
              </div>
            </div>

            <p className="text-fairy-gold font-medium mb-6">
              +{Math.floor(course.totalExperience * 0.2)} 额外经验值奖励！
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 fairy-button-outline"
              >
                继续学习
              </button>
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/academy');
                }}
                className="flex-1 fairy-button"
              >
                返回学院
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

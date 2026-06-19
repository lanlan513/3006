import { X, Heart, CloudRain, HelpCircle, Sparkles, ChevronRight, Route } from 'lucide-react';
import type { EndingRoute, EndingType } from '@/types';

interface EndingPathViewerProps {
  endingRoute: EndingRoute;
  storyTitle: string;
  onClose: () => void;
  onReplayPath?: () => void;
}

const getEndingStyle = (type?: EndingType) => {
  switch (type) {
    case 'happy':
      return {
        bg: 'from-pink-400 via-rose-400 to-red-400',
        light: 'bg-pink-50 border-pink-200',
        text: 'text-pink-600',
        icon: Heart,
        label: '快乐结局',
        labelBg: 'bg-pink-100',
        dot: 'bg-pink-500',
      };
    case 'sad':
      return {
        bg: 'from-blue-400 via-indigo-400 to-purple-400',
        light: 'bg-blue-50 border-blue-200',
        text: 'text-blue-600',
        icon: CloudRain,
        label: '悲伤结局',
        labelBg: 'bg-blue-100',
        dot: 'bg-blue-500',
      };
    case 'neutral':
      return {
        bg: 'from-gray-400 via-slate-400 to-zinc-400',
        light: 'bg-gray-50 border-gray-200',
        text: 'text-gray-600',
        icon: HelpCircle,
        label: '普通结局',
        labelBg: 'bg-gray-100',
        dot: 'bg-gray-500',
      };
    case 'secret':
      return {
        bg: 'from-amber-400 via-yellow-400 to-orange-400',
        light: 'bg-amber-50 border-amber-200',
        text: 'text-amber-600',
        icon: Sparkles,
        label: '隐藏结局',
        labelBg: 'bg-amber-100',
        dot: 'bg-amber-500',
      };
    default:
      return {
        bg: 'from-fairy-purple via-fairy-pink to-fairy-gold',
        light: 'bg-purple-50 border-purple-200',
        text: 'text-fairy-purple',
        icon: Sparkles,
        label: '结局',
        labelBg: 'bg-purple-100',
        dot: 'bg-fairy-purple',
      };
  }
};

const truncate = (text: string, maxLen: number) =>
  text.length > maxLen ? text.slice(0, maxLen) + '...' : text;

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export default function EndingPathViewer({
  endingRoute,
  storyTitle,
  onClose,
  onReplayPath,
}: EndingPathViewerProps) {
  const style = getEndingStyle(endingRoute.endingType);
  const Icon = style.icon;
  const choiceSteps = endingRoute.path.filter((step) => step.choiceId !== null);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="fairy-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className={`h-28 bg-gradient-to-br ${style.bg} flex items-center justify-between px-6 relative`}>
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(15)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-white animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${10 + Math.random() * 14}px`,
                  height: `${10 + Math.random() * 14}px`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className={`inline-block px-3 py-1 rounded-full ${style.labelBg} ${style.text} text-xs font-body font-medium mb-1`}>
                {style.label}
              </div>
              <h3 className="text-2xl font-fairy text-white drop-shadow-md">
                {endingRoute.endingTitle}
              </h3>
              <p className="text-white/80 text-sm font-body mt-0.5">
                出自：{storyTitle} · 发现于 {formatDate(endingRoute.discoveredAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors relative z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Route className={`w-5 h-5 ${style.text}`} />
              <h4 className="font-fairy text-lg text-gray-800">选择路线</h4>
              <span className="text-sm text-gray-500 font-body">
                共 {choiceSteps.length} 个抉择
              </span>
            </div>

            <div className="relative pl-6">
              <div
                className={`absolute left-[11px] top-2 bottom-2 w-0.5 ${style.dot} opacity-30`}
              />

              <div className="space-y-0">
                {endingRoute.path.map((step, index) => {
                  const isChoice = step.choiceId !== null;
                  const isLast = index === endingRoute.path.length - 1;

                  return (
                    <div key={index} className="relative pb-5 last:pb-0">
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isLast
                            ? `bg-gradient-to-br ${style.bg} border-transparent`
                            : isChoice
                            ? `bg-white ${style.dot} border-2`
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {isLast && <Icon className="w-3 h-3 text-white" />}
                        {!isLast && !isChoice && (
                          <div className={`w-2 h-2 rounded-full ${style.dot} opacity-40`} />
                        )}
                      </div>

                      <div className="ml-2">
                        {isChoice && step.choiceText ? (
                          <div className={`rounded-xl border p-3 ${style.light} mb-2`}>
                            <div className={`text-xs font-body ${style.text} font-medium mb-1`}>
                              ✦ 你的选择
                            </div>
                            <p className="text-gray-800 font-body leading-relaxed">
                              {step.choiceText}
                            </p>
                          </div>
                        ) : null}

                        {!isLast ? (
                          <div className="flex items-start gap-2">
                            <p className="text-gray-600 text-sm font-body leading-relaxed flex-1">
                              {truncate(step.nodeContent, 80)}
                            </p>
                            {!isChoice && (
                              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        ) : (
                          <div className={`rounded-xl border p-4 ${style.light}`}>
                            <div className={`text-xs font-body ${style.text} font-medium mb-2`}>
                              📖 结局
                            </div>
                            <p className="text-gray-700 font-body leading-relaxed">
                              {truncate(endingRoute.endingContent, 150)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-fairy-purple/10 bg-fairy-purple/5 flex flex-col sm:flex-row gap-3 justify-end">
          {onReplayPath && (
            <button
              onClick={onReplayPath}
              className="fairy-button inline-flex items-center justify-center gap-2"
            >
              <Route className="w-5 h-5" />
              重走这条路线
            </button>
          )}
          <button
            onClick={onClose}
            className="fairy-button-outline inline-flex items-center justify-center gap-2"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

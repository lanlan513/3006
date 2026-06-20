import type {
  DreamCreature,
  DreamLocation,
  InnerWish,
  InnerFear,
  DreamEvolutionTrigger,
  DreamEncounter,
  StoryCharacter,
  CharacterType,
} from '@/types';

export const DREAM_CREATURES: DreamCreature[] = [
  {
    id: 'dc1',
    name: '倒影之狼',
    originalCreatureId: undefined,
    emoji: '🐺',
    twistedEmoji: '👁️‍🗨️',
    coverColor: '#4A5568',
    description: '在梦境森林中游荡的神秘巨狼，每一步都在水面留下倒影',
    twistedDescription: '它的身体由无数双注视的眼睛构成，直视你的灵魂深处',
    isNightmare: true,
    abilities: ['揭示真相', '倒影分身', '心灵震慑'],
    symbolism: '代表被压抑的自我怀疑与内心审视',
  },
  {
    id: 'dc2',
    name: '糖果巨鲸',
    emoji: '🐋',
    twistedEmoji: '🍭',
    coverColor: '#FFB6C1',
    description: '在梦境海洋中遨游的温柔巨兽，喷出水柱是七彩糖浆',
    twistedDescription: '身体膨胀成巨大的棉花糖，甜蜜到令人窒息',
    isNightmare: false,
    abilities: ['甜蜜治愈', '糖果雨', '愿望泡泡'],
    symbolism: '童年最纯粹的快乐与对过度保护的微妙恐惧',
  },
  {
    id: 'dc3',
    name: '记忆蝶群',
    emoji: '🦋',
    twistedEmoji: '📖',
    coverColor: '#9F7AEA',
    description: '闪耀着磷光的蝴蝶群，每一只翅膀上都印着一段回忆',
    twistedDescription: '翅膀上的画面开始扭曲变化，记忆变得真假难辨',
    isNightmare: false,
    abilities: ['记忆闪回', '时间倒流', '遗忘迷雾'],
    symbolism: '对过去的执念与选择性遗忘',
  },
  {
    id: 'dc4',
    name: '楼梯蜈蚣',
    emoji: '🐛',
    twistedEmoji: '🪜',
    coverColor: '#718096',
    description: '由无数台阶组成的节肢生物，永远向上攀爬',
    twistedDescription: '每一节台阶都通向不同的时空，一不小心就会迷失',
    isNightmare: true,
    abilities: ['无尽阶梯', '空间扭曲', '方向混淆'],
    symbolism: '对人生方向的迷茫与永无止境的追求',
  },
  {
    id: 'dc5',
    name: '月光园丁',
    emoji: '🧚',
    twistedEmoji: '🌙',
    coverColor: '#BEE3F8',
    description: '在心灵花园中培育情感之花的温柔仙子',
    twistedDescription: '月光过于明亮，花朵开始尖叫，绽放出不该有的形状',
    isNightmare: false,
    abilities: ['情感滋养', '心碎愈合', '月下告白'],
    symbolism: '渴望被理解与情感的细腻敏感',
  },
  {
    id: 'dc6',
    name: '镜中骑士',
    emoji: '🤴',
    twistedEmoji: '🪞',
    coverColor: '#805AD5',
    description: '从破碎镜子中走出的英勇骑士，守护着愿望之巅',
    twistedDescription: '他的面容与你一模一样，却做出你永远不敢的选择',
    isNightmare: false,
    abilities: ['镜像守护', '勇气折射', '可能之剑'],
    symbolism: '理想中的自我与对另一种人生的向往',
  },
  {
    id: 'dc7',
    name: '深渊章鱼',
    emoji: '🐙',
    twistedEmoji: '🕳️',
    coverColor: '#2D3748',
    description: '潜伏在恐惧深渊底部的远古存在，触手连接着每个噩梦',
    twistedDescription: '每条触手都缠紧你最深的恐惧，将你拖入无尽黑暗',
    isNightmare: true,
    abilities: ['恐惧具象', '深渊凝视', '噩梦编织'],
    symbolism: '最深层的童年阴影与被压抑的创伤',
  },
  {
    id: 'dc8',
    name: '云朵绵羊',
    emoji: '🐑',
    twistedEmoji: '☁️',
    coverColor: '#E2E8F0',
    description: '在星空草原上飘浮的柔软生物，数着它们就能入睡',
    twistedDescription: '它们越变越多，填满了整个天空，让你无法呼吸',
    isNightmare: false,
    abilities: ['安眠之雾', '梦境跳跃', '焦虑吸收'],
    symbolism: '对安宁的渴望与对失控的焦虑',
  },
  {
    id: 'dc9',
    name: '时钟猫头鹰',
    emoji: '🦉',
    twistedEmoji: '⏰',
    coverColor: '#D69E2E',
    description: '栖息在遗忘迷宫入口的智者，知晓所有被遗忘之事',
    twistedDescription: '它的眼睛是两个旋转的时钟，指针飞速倒转，时间开始倒流',
    isNightmare: false,
    abilities: ['时间暂停', '先知预言', '遗忘召唤'],
    symbolism: '对衰老和时间流逝的焦虑',
  },
  {
    id: 'dc10',
    name: '钥匙花',
    emoji: '🌸',
    twistedEmoji: '🔑',
    coverColor: '#FC8181',
    description: '心灵花园中心绽放的神秘花朵，花蕊是一把发光的钥匙',
    twistedDescription: '花瓣合拢，钥匙变成了锁，锁住了所有美好的记忆',
    isNightmare: false,
    abilities: ['心扉解锁', '封印解除', '通道开启'],
    symbolism: '打开心防的勇气与被锁住的秘密',
  },
  {
    id: 'dc11',
    name: '水晶城堡之灵',
    emoji: '👻',
    twistedEmoji: '🏰',
    coverColor: '#63B3ED',
    description: '扭曲城堡中游荡的温柔灵魂，指引迷路的梦者',
    twistedDescription: '城堡的水晶开始融化，灵魂的面容逐渐消融变形',
    isNightmare: true,
    abilities: ['梦境指引', '水晶护盾', '幻觉穿透'],
    symbolism: '逝去的纯真与对成长的迷茫',
  },
  {
    id: 'dc12',
    name: '星尘独角兽',
    emoji: '🦄',
    twistedEmoji: '✨',
    coverColor: '#F687B3',
    description: '愿望之巅的守护者，只有纯净心灵才能看见',
    twistedDescription: '星光太过耀眼，它的角开始滴落滚烫的星之泪',
    isNightmare: false,
    abilities: ['愿望净化', '星光祝福', '梦境传送'],
    symbolism: '遥不可及的理想与对奇迹的信仰',
  },
];

export const BASE_DREAM_LOCATIONS: DreamLocation[] = [
  {
    id: 'dl1',
    name: '颠倒城堡',
    type: '扭曲城堡',
    originalRegion: '德国',
    description: '漂浮在云端的水晶城堡，楼梯倒挂，门窗悬浮',
    twistedDescription: '当你眨眼时，城堡的左右会互换，重力的方向也随之改变',
    color: '#63B3ED',
    glowColor: 'rgba(99, 179, 237, 0.6)',
    x: 250,
    y: 150,
    discovered: true,
    connectedLocationIds: ['dl2', 'dl6'],
    symbolism: '对熟悉事物的陌生感与身份认同的探索',
  },
  {
    id: 'dl2',
    name: '镜面森林',
    type: '镜像森林',
    originalRegion: '德国',
    description: '每棵树都是一面镜子，映照出不同版本的你',
    twistedDescription: '镜子中的你开始独立行动，朝着反方向走去',
    color: '#48BB78',
    glowColor: 'rgba(72, 187, 120, 0.6)',
    x: 450,
    y: 120,
    discovered: true,
    connectedLocationIds: ['dl1', 'dl3', 'dl5'],
    symbolism: '自我审视与多重人格的对话',
  },
  {
    id: 'dl3',
    name: '糖霜海洋',
    type: '梦境海洋',
    originalRegion: '丹麦',
    description: '海水是融化的冰淇淋，波浪是奶油，岛屿是巨大的马卡龙',
    twistedDescription: '海水开始凝固，将你包裹在甜蜜的琥珀中',
    color: '#F687B3',
    glowColor: 'rgba(246, 135, 179, 0.6)',
    x: 650,
    y: 200,
    discovered: false,
    connectedLocationIds: ['dl2', 'dl4'],
    symbolism: '过度的保护与令人窒息的温柔',
  },
  {
    id: 'dl4',
    name: '银河草原',
    type: '星空草原',
    originalRegion: '北欧',
    description: '脚下是流淌的银河，头顶是摇曳的青草，繁星如萤火虫飞舞',
    twistedDescription: '星辰开始坠落，草地变成无底深渊',
    color: '#9F7AEA',
    glowColor: 'rgba(159, 122, 234, 0.6)',
    x: 780,
    y: 300,
    discovered: false,
    connectedLocationIds: ['dl3', 'dl8'],
    symbolism: '浩瀚的可能性与对未知的向往',
  },
  {
    id: 'dl5',
    name: '无门迷宫',
    type: '遗忘迷宫',
    originalRegion: '古希腊',
    description: '走廊无穷无尽，所有门都消失了，墙上的画在窃窃私语',
    twistedDescription: '你开始记不起自己是谁，墙上的画变成了你遗忘的记忆',
    color: '#A0AEC0',
    glowColor: 'rgba(160, 174, 192, 0.6)',
    x: 350,
    y: 280,
    discovered: false,
    connectedLocationIds: ['dl2', 'dl6', 'dl7'],
    symbolism: '被压抑的记忆与迷失的自我',
  },
  {
    id: 'dl6',
    name: '情感花园',
    type: '心灵花园',
    originalRegion: '日本',
    description: '每种花都代表一种情感，色彩随心情绽放或凋零',
    twistedDescription: '荆棘开始蔓延，花朵哭泣，花园沉入悲伤之海',
    color: '#F6AD55',
    glowColor: 'rgba(246, 173, 85, 0.6)',
    x: 180,
    y: 320,
    discovered: false,
    connectedLocationIds: ['dl1', 'dl5'],
    symbolism: '内心的情感世界与被压抑的感受',
  },
  {
    id: 'dl7',
    name: '恐惧之井',
    type: '恐惧深渊',
    originalRegion: undefined,
    description: '黑暗的无底深渊，每个回声都是你最深的恐惧',
    twistedDescription: '你开始下落，井底浮现出你拼命逃避的画面',
    color: '#2D3748',
    glowColor: 'rgba(45, 55, 72, 0.6)',
    x: 520,
    y: 400,
    discovered: false,
    connectedLocationIds: ['dl5', 'dl8'],
    symbolism: '被压抑的创伤与最深的焦虑',
  },
  {
    id: 'dl8',
    name: '许愿之巅',
    type: '愿望之巅',
    originalRegion: undefined,
    description: '云海之上的最高峰，传说在这里许愿能够成真',
    twistedDescription: '你的愿望在眼前实现，却以你意想不到的方式',
    color: '#FBD38D',
    glowColor: 'rgba(251, 211, 141, 0.6)',
    x: 720,
    y: 450,
    discovered: false,
    connectedLocationIds: ['dl4', 'dl7'],
    symbolism: '潜意识的渴望与愿望的代价',
  },
];

const wishTemplates: Record<string, Omit<InnerWish, 'id'>> = {
  'default_1': {
    title: '被无条件接纳',
    description: '渴望无论自己是什么样子，都能被深深爱着和接纳',
    depth: '深层',
    relatedTraits: ['善良纯真', '善良'],
    granted: false,
    unlockCondition: '在情感花园中找到并拥抱真实的自己',
    symbolism: '代表对归属感的终极渴望',
  },
  'default_2': {
    title: '证明自己的价值',
    description: '内心深处希望向世界证明，自己的存在是有意义的',
    depth: '深层',
    relatedTraits: ['坚韧不拔', '勇敢追梦'],
    granted: false,
    unlockCondition: '登上愿望之巅，大声说出自己的名字',
    symbolism: '自我认同与价值感的追寻',
  },
  'default_3': {
    title: '时光倒流',
    description: '希望回到某个时刻，改写那些遗憾的决定',
    depth: '潜意识',
    relatedTraits: ['成长蜕变'],
    granted: false,
    unlockCondition: '在遗忘迷宫中找到时钟猫头鹰，接受无法改变之事',
    symbolism: '对遗憾的释怀与对过去的和解',
  },
  'default_4': {
    title: '永远不再孤单',
    description: '梦见一个永远不会离开的朋友，一个温暖的归宿',
    depth: '表面',
    relatedTraits: ['招人喜爱', '温柔善良'],
    granted: false,
    unlockCondition: '在镜面森林中遇见倒影之狼并建立友谊',
    symbolism: '对陪伴与安全感的需求',
  },
};

const fearTemplates: Record<string, Omit<InnerFear, 'id'>> = {
  'default_1': {
    title: '被遗忘的恐惧',
    description: '害怕自己在世界上消失，没有人记得自己曾经存在过',
    intensity: '强烈',
    relatedTraits: ['善良纯真'],
    confronted: false,
    confrontationHint: '在无门迷宫中直面空白的墙壁，在墙上刻下自己的名字',
    symbolism: '存在主义焦虑与永生的渴望',
  },
  'default_2': {
    title: '不够好的自己',
    description: '深夜里那个声音说，你配不上所有美好的事物',
    intensity: '中等',
    relatedTraits: ['坚韧不拔', '勇敢追梦'],
    confronted: false,
    confrontationHint: '在镜面森林中拥抱那个哭泣的倒影',
    symbolism: '自我怀疑与冒名顶替综合症',
  },
  'default_3': {
    title: '失去所爱之人',
    description: '每一次告别都像是预演，害怕醒来时身边空无一人',
    intensity: '极致',
    relatedTraits: ['善良', '重情重义'],
    confronted: false,
    confrontationHint: '跳入恐惧之井，在深渊底部握住他们的手',
    symbolism: '分离焦虑与对死亡的恐惧',
  },
  'default_4': {
    title: '无法选择的人生',
    description: '站在无数岔路口，害怕选错路后再也无法回头',
    intensity: '中等',
    relatedTraits: ['成长蜕变', '勇敢'],
    confronted: false,
    confrontationHint: '跟随楼梯蜈蚣爬上无尽阶梯，接受每一个选择',
    symbolism: '对自由意志的怀疑与责任的重量',
  },
};

export const generateWishesForCharacter = (character: StoryCharacter): InnerWish[] => {
  const wishes: InnerWish[] = [];
  const traitSet = new Set(character.traits);
  
  const baseTemplates = Object.entries(wishTemplates);
  baseTemplates.forEach(([key, template], index) => {
    const hasMatchingTrait = template.relatedTraits.some(t => traitSet.has(t));
    if (hasMatchingTrait || index < 2) {
      wishes.push({
        ...template,
        id: `wish_${character.id}_${key}`,
        relatedTraits: template.relatedTraits.filter(t => traitSet.has(t)).length > 0 
          ? template.relatedTraits.filter(t => traitSet.has(t))
          : character.traits.slice(0, 2),
      });
    }
  });

  if (character.type === '公主' || character.type === '王子') {
    wishes.push({
      id: `wish_${character.id}_royal`,
      title: '平凡的幸福',
      description: '渴望脱下王冠，像普通人一样爱与被爱',
      depth: '潜意识',
      relatedTraits: character.traits.slice(0, 2),
      granted: false,
      unlockCondition: '在糖霜海洋中变成一个没有身份的泡沫',
      symbolism: '身份的枷锁与对简单生活的向往',
    });
  }

  if (character.type === '女巫' || character.type === '巫师') {
    wishes.push({
      id: `wish_${character.id}_power`,
      title: '被理解而非畏惧',
      description: '希望人们看到魔法背后的眼泪，而非只看到力量',
      depth: '深层',
      relatedTraits: character.traits.slice(0, 2),
      granted: false,
      unlockCondition: '在情感花园中让荆棘化为花朵',
      symbolism: '被误解的痛苦与对连接的渴望',
    });
  }

  return wishes;
};

export const generateFearsForCharacter = (character: StoryCharacter): InnerFear[] => {
  const fears: InnerFear[] = [];
  const traitSet = new Set(character.traits);
  
  const baseTemplates = Object.entries(fearTemplates);
  baseTemplates.forEach(([key, template], index) => {
    const hasMatchingTrait = template.relatedTraits.some(t => traitSet.has(t));
    if (hasMatchingTrait || index < 2) {
      fears.push({
        ...template,
        id: `fear_${character.id}_${key}`,
        relatedTraits: template.relatedTraits.filter(t => traitSet.has(t)).length > 0
          ? template.relatedTraits.filter(t => traitSet.has(t))
          : character.traits.slice(0, 2),
      });
    }
  });

  if (character.traits.includes('善良纯真') || character.traits.includes('天真纯洁')) {
    fears.push({
      id: `fear_${character.id}_innocence`,
      title: '失去纯真',
      description: '害怕有一天看透了世界，眼中的光芒会熄灭',
      intensity: '强烈',
      relatedTraits: character.traits.filter(t => ['善良纯真', '天真纯洁', '纯真无邪'].includes(t)),
      confronted: false,
      confrontationHint: '在银河草原中让一滴眼泪落入星河',
      symbolism: '成长的代价与对童心消逝的恐惧',
    });
  }

  return fears;
};

export const DREAM_EVOLUTION_TRIGGERS: DreamEvolutionTrigger[] = [
  {
    type: 'wish_granted',
    threshold: 1,
    newLocationTypes: ['愿望之巅'],
    description: '一个愿望的实现，开启了通往愿望之巅的道路',
  },
  {
    type: 'fear_confronted',
    threshold: 1,
    newLocationTypes: ['恐惧深渊'],
    description: '直面恐惧后，你不再害怕看见深渊',
  },
  {
    type: 'location_discovered',
    threshold: 4,
    newLocationTypes: ['梦境海洋', '星空草原'],
    distortionShift: -10,
    description: '探索的区域越多，梦境变得越稳定和可预测',
  },
  {
    type: 'memory_created',
    threshold: 5,
    newLocationTypes: ['遗忘迷宫'],
    description: '足够多的梦境记忆，唤醒了迷宫中的记忆蝶群',
  },
  {
    type: 'dream_level_up',
    threshold: 3,
    newLocationTypes: ['心灵花园'],
    distortionShift: 5,
    description: '梦境等级提升，开启了更深处的潜意识领域',
  },
];

type EncounterTemplateByType = Record<string, (characterId: string, locationId: string) => DreamEncounter>;

export const generateDreamEncounter = (
  characterId: string,
  locationId: string,
  dreamLevel: number
): DreamEncounter => {
  const location = BASE_DREAM_LOCATIONS.find(l => l.id === locationId);
  const rand = Math.random();

  if (location?.type === '扭曲城堡') {
    return {
      id: `enc_${characterId}_${Date.now()}`,
      locationId,
      characterId,
      type: rand < 0.5 ? 'creature' : 'symbol',
      title: '水晶回廊',
      narrative: '你走在漂浮的楼梯上，水晶墙壁折射出无数个版本的你。某个版本的你停下来，微笑着向你伸出了手。',
      visualEmoji: '🏰',
      creatureId: rand < 0.5 ? 'dc11' : undefined,
      options: [
        {
          id: 'opt1',
          text: '握住那个自己的手',
          outcome: 'positive',
          impactDescription: '你与另一个自己合二为一，感到前所未有的完整',
          lucidityChange: 10,
          stabilityChange: 5,
          wishProgress: 15,
        },
        {
          id: 'opt2',
          text: '问那个自己："你是谁？"',
          outcome: 'revelation',
          impactDescription: '水晶中的你说："我是你从未选择的那条路。"',
          lucidityChange: 15,
          stabilityChange: -5,
          unlocksLocationId: 'dl5',
        },
        {
          id: 'opt3',
          text: '转身跑下楼梯',
          outcome: 'neutral',
          impactDescription: '你感到一阵眩晕，等回过神来时已经回到了起点',
          lucidityChange: -5,
          stabilityChange: 10,
        },
      ],
    };
  }

  if (location?.type === '镜像森林') {
    return {
      id: `enc_${characterId}_${Date.now()}`,
      locationId,
      characterId,
      type: 'creature',
      title: '倒影深处',
      narrative: '倒影之狼从镜面中走出，它的皮毛是流动的银色。它凝视着你，眼中映出你从未见过的自己。',
      visualEmoji: '🐺',
      creatureId: 'dc1',
      options: [
        {
          id: 'opt1',
          text: '与它对视，不眨眼',
          outcome: 'revelation',
          impactDescription: '你在狼眼中看到了自己最真实的样子，既丑陋又美丽',
          lucidityChange: 20,
          stabilityChange: -10,
          fearProgress: 25,
        },
        {
          id: 'opt2',
          text: '轻声说："我认识你"',
          outcome: 'positive',
          impactDescription: '狼低下头让你抚摸，你感到被压抑的部分正在被接纳',
          lucidityChange: 10,
          stabilityChange: 15,
          wishProgress: 20,
        },
        {
          id: 'opt3',
          text: '逃向森林深处',
          outcome: 'negative',
          impactDescription: '你跑得越远，狼的倒影出现在越多的树上，它们都在看你',
          lucidityChange: -10,
          stabilityChange: -15,
          unlocksLocationId: 'dl5',
        },
      ],
    };
  }

  if (location?.type === '梦境海洋') {
    return {
      id: `enc_${characterId}_${Date.now()}`,
      locationId,
      characterId,
      type: 'creature',
      title: '糖霜巨浪',
      narrative: '糖果巨鲸的巨大身影从糖浆海水中升起，它的微笑太过温柔。它的背上有一座用姜饼做的小屋，窗户里亮着温暖的灯。',
      visualEmoji: '🐋',
      creatureId: 'dc2',
      options: [
        {
          id: 'opt1',
          text: '爬上它的背，走进姜饼屋',
          outcome: 'positive',
          impactDescription: '屋内是你童年最温暖的记忆，你在壁炉旁睡着了',
          lucidityChange: -10,
          stabilityChange: 25,
          wishProgress: 30,
        },
        {
          id: 'opt2',
          text: '问它："如果我永远待在这里呢？"',
          outcome: 'revelation',
          impactDescription: '巨鲸说："甜蜜本是良药，过多即成囚笼。"',
          lucidityChange: 20,
          stabilityChange: 0,
          fearProgress: 15,
        },
        {
          id: 'opt3',
          text: '在糖浆海里自由自在地游泳',
          outcome: 'neutral',
          impactDescription: '海水温暖而甜蜜，你像回到了母亲的子宫',
          lucidityChange: 0,
          stabilityChange: 15,
          unlocksLocationId: 'dl4',
        },
      ],
    };
  }

  if (location?.type === '心灵花园') {
    return {
      id: `enc_${characterId}_${Date.now()}`,
      locationId,
      characterId,
      type: 'wish',
      title: '月光园丁',
      narrative: '月光园丁正在浇灌一片枯萎的花田。她转过身，手中握着一朵凋零的玫瑰："有些花，只有说出真心话才能让它重新绽放。"',
      visualEmoji: '🧚',
      creatureId: 'dc5',
      options: [
        {
          id: 'opt1',
          text: '说出一句从未对任何人说过的话',
          outcome: 'positive',
          impactDescription: '花田瞬间绽放，色彩如星河般流动，你感到一块大石落地',
          lucidityChange: 15,
          stabilityChange: 30,
          wishProgress: 40,
        },
        {
          id: 'opt2',
          text: '接过枯萎的玫瑰，默默流泪',
          outcome: 'revelation',
          impactDescription: '眼泪滴落的地方，钥匙花从泥土中破土而出',
          lucidityChange: 25,
          stabilityChange: 5,
          unlocksLocationId: 'dl8',
        },
        {
          id: 'opt3',
          text: '问园丁："你是谁的记忆？"',
          outcome: 'revelation',
          impactDescription: '园丁的面容变成了你深爱之人的样子，又变回仙子',
          lucidityChange: 30,
          stabilityChange: -10,
          wishProgress: 20,
          fearProgress: 20,
        },
      ],
    };
  }

  if (location?.type === '恐惧深渊') {
    return {
      id: `enc_${characterId}_${Date.now()}`,
      locationId,
      characterId,
      type: 'fear',
      title: '深渊之触',
      narrative: '深渊章鱼的触手从黑暗中缓缓升起，每条触手都展现出你最害怕的画面。它的眼睛是两团旋转的虚无，在将你吸入。',
      visualEmoji: '🐙',
      creatureId: 'dc7',
      options: [
        {
          id: 'opt1',
          text: '闭上双眼，任由自己被拖入',
          outcome: 'revelation',
          impactDescription: '你穿过深渊，从另一端醒来。恐惧的尽头是一片空无，而空无并不可怕',
          lucidityChange: 35,
          stabilityChange: -20,
          fearProgress: 50,
        },
        {
          id: 'opt2',
          text: '大声说出那个让你恐惧的名字',
          outcome: 'positive',
          impactDescription: '章鱼的触手开始消散，它用千万个声音说："被说出的恐惧，便失去了力量。"',
          lucidityChange: 25,
          stabilityChange: 20,
          fearProgress: 60,
        },
        {
          id: 'opt3',
          text: '拼命向上游',
          outcome: 'negative',
          impactDescription: '你游得越用力，触手缠得越紧。你在窒息中醒来，浑身冷汗。',
          lucidityChange: -20,
          stabilityChange: -30,
          fearProgress: 10,
        },
      ],
    };
  }

  if (location?.type === '愿望之巅') {
    return {
      id: `enc_${characterId}_${Date.now()}`,
      locationId,
      characterId,
      type: 'wish',
      title: '星辰许愿池',
      narrative: '星尘独角兽站在许愿池边，池水映照着亿万颗星辰。它低头说："说出你的愿望。但要记住——每一个愿望，都有它的重量。"',
      visualEmoji: '🦄',
      creatureId: 'dc12',
      options: [
        {
          id: 'opt1',
          text: '许下那个最深的愿望',
          outcome: 'positive',
          impactDescription: '星辰从池中升起，环绕你起舞。愿望实现了，同时你感到一份责任感降临',
          lucidityChange: 20,
          stabilityChange: 25,
          wishProgress: 70,
        },
        {
          id: 'opt2',
          text: '说："我不要愿望，我只想知道我该做什么"',
          outcome: 'revelation',
          impactDescription: '独角兽微微一笑，角上滴落一颗星之泪，融入你的眉心',
          lucidityChange: 40,
          stabilityChange: 30,
          wishProgress: 35,
          fearProgress: 35,
        },
        {
          id: 'opt3',
          text: '许愿让这个梦永远不要醒来',
          outcome: 'neutral',
          impactDescription: '世界开始凝固，时间像蜂蜜一样变得粘稠',
          lucidityChange: -30,
          stabilityChange: 50,
          wishProgress: 10,
        },
      ],
    };
  }

  return {
    id: `enc_${characterId}_${Date.now()}`,
    locationId,
    characterId,
    type: 'memory',
    title: '朦胧回廊',
    narrative: '梦境的迷雾中浮现出模糊的画面，像是记忆，又像是想象。记忆蝶群从你面前飞过，翅膀上的画面在召唤你。',
    visualEmoji: '🦋',
    creatureId: 'dc3',
    options: [
      {
        id: 'opt1',
        text: '跟随蝶群，看看它们带你去哪里',
        outcome: 'revelation',
        impactDescription: '你看到了被遗忘的童年片段，泪水不自觉流下',
        lucidityChange: 15,
        stabilityChange: 5,
        unlocksLocationId: dreamLevel >= 2 ? 'dl6' : undefined,
      },
      {
        id: 'opt2',
        text: '尝试抓住一只蝴蝶',
        outcome: 'neutral',
        impactDescription: '蝴蝶在你手中化为闪光的粉尘，你感到一阵熟悉又陌生的情绪',
        lucidityChange: 5,
        stabilityChange: 10,
        wishProgress: 10,
      },
      {
        id: 'opt3',
        text: '对蝶群说："谢谢你们保存了这些"',
        outcome: 'positive',
        impactDescription: '所有蝴蝶围绕你飞舞，你感到自己被温柔地看见和记住',
        lucidityChange: 10,
        stabilityChange: 25,
        wishProgress: 20,
      },
    ],
  };
};

export const getDreamCreatureById = (id: string): DreamCreature | undefined => {
  return DREAM_CREATURES.find(c => c.id === id);
};

export const getDreamLocationById = (id: string): DreamLocation | undefined => {
  return BASE_DREAM_LOCATIONS.find(l => l.id === id);
};

export const generateLocationsForCharacter = (character: StoryCharacter): DreamLocation[] => {
  const locations = [...BASE_DREAM_LOCATIONS];
  
  if (character.type === '人鱼') {
    const ocean = locations.find(l => l.id === 'dl3');
    if (ocean) {
      ocean.discovered = true;
      ocean.name = '珊瑚之心海';
      ocean.description = '海底花园与贝壳宫殿的梦幻海洋，人鱼公主真正的故乡';
    }
  }
  
  if (character.storyId === '2' || character.type === '公主') {
    const castle = locations.find(l => l.id === 'dl1');
    if (castle) {
      castle.discovered = true;
      castle.description = '没有继母的水晶城堡，只有欢笑与歌声';
    }
  }

  if (character.type === '动物') {
    const forest = locations.find(l => l.id === 'dl2');
    if (forest) {
      forest.discovered = true;
    }
  }

  return locations;
};

export const getCharacterTypeDreamTheme = (type: CharacterType): { color: string; icon: string; description: string } => {
  const themes: Record<CharacterType, { color: string; icon: string; description: string }> = {
    '公主': { color: '#F687B3', icon: '👸', description: '被施了魔法的舞会与午夜钟声' },
    '王子': { color: '#63B3ED', icon: '🤴', description: '屠龙之剑与玻璃棺材前的吻' },
    '巫师': { color: '#9F7AEA', icon: '🧙', description: '旋转的星辰与古老咒语的回响' },
    '巨龙': { color: '#FC8181', icon: '🐉', description: '黄金山巅的秘密与火焰之心' },
    '精灵': { color: '#68D391', icon: '🧚', description: '森林低语与翅膀扇动的月光' },
    '动物': { color: '#D69E2E', icon: '🦊', description: '动物们开口说话的夜晚' },
    '女巫': { color: '#805AD5', icon: '🧹', description: '坩埚中沸腾的预言与黑猫的眼睛' },
    '国王': { color: '#ECC94B', icon: '👑', description: '沉重王冠下的良心抉择' },
    '王后': { color: '#B794F4', icon: '👑', description: '魔镜的真相与永不枯萎的花园' },
    '矮人': { color: '#ED8936', icon: '⛏️', description: '矿山深处的宝石与啤酒泡沫' },
    '人鱼': { color: '#4FD1C5', icon: '🧜', description: '海底女巫的交易与化为泡沫的黎明' },
    '猎人': { color: '#48BB78', icon: '🏹', description: '森林狼嚎与劈开肚皮的勇气' },
    '仙女': { color: '#FBB6CE', icon: '✨', description: '魔杖尖的祝福与迟到的善意' },
    '狼人': { color: '#718096', icon: '🐺', description: '满月下的变身与人性的挣扎' },
    '其他': { color: '#A0AEC0', icon: '💫', description: '无法归类的奇妙梦境' },
    '全部': { color: '#A0AEC0', icon: '💫', description: '所有梦境的交汇处' },
  };
  return themes[type] || themes['其他'];
};

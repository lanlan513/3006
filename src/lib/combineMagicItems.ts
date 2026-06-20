import type { MagicItem, MagicItemRarity, MagicItemCategory } from '@/types';

const NAME_PREFIXES = [
  '永恒', '苍穹', '幻梦', '星辰', '暮光', '幽月', '晨曦', '神圣', '神秘', '奇迹',
  '远古', '至尊', '荣耀', '命运', '传奇', '混沌', '光辉', '幻影', '秘境', '无极',
  '碧落', '黄泉', '紫霄', '鸿蒙', '太初', '玄黄', '洪荒', '太上', '玉清', '上清',
  '龙渊', '凤舞', '麒麟', '玄武', '白虎', '朱雀', '青龙', '鲲鹏', '九尾', '三足',
];

const NAME_SUFFIXES = [
  '之魂', '之心', '之瞳', '之翼', '之钥', '之泉', '之冠', '之歌', '之誓', '之痕',
  '圣物', '神器', '秘宝', '灵物', '奇物', '至宝', '精华', '结晶', '遗产', '神谕',
  '权杖', '法球', '圣杯', '圣剑', '魔典', '灵珠', '仙丹', '灵符', '法阵', '宝塔',
  '龙鳞', '凤羽', '麟角', '虎牙', '豹胎', '鹰睛', '龟甲', '蛇蜕', '蚕丝', '蛛网',
];

const CUSTOM_ORIGIN_TEMPLATES = [
  '在一个星月齐辉的夜晚，{parentNames}在古老的魔法阵中相遇，它们的力量交织融合，诞生了这件前所未有的神奇物品。它继承了所有前身的优点，更获得了独特的新生之力。据说它的出现，预示着一个伟大传奇的开始……',
  '一位隐居千年的神秘炼金术士，穷尽毕生心血，终于找到了将{parentNames}完美融合的方法。在一个雷电交加的夜晚，熔炉迸发出万丈光芒，这件凝聚了无数魔力的宝物终于问世。术士临终前将它托付给命运，等待有缘人的出现。',
  '当{parentNames}在世界树下相遇时，它们的共鸣唤醒了沉睡的古老魔力。精灵们咏唱着远古的祝福之歌，万物生灵为新生的宝物献上贺礼。它承载着前代物品的所有记忆与情感，成为了连接过去与未来的纽带。',
  '在时空的夹缝中，{parentNames}跨越了各自的故事界限，命运的丝线将它们缠绕在一起。一道神圣的光芒闪过，一件全新的幻想宝物就此诞生。它的存在本身就是一个奇迹，证明了只要心怀梦想，一切皆有可能。',
  '传说在创世之初，众神将世界上最强大的神力封存在不同的宝物之中。漫长的岁月过去了，{parentNames}在命运的指引下重新聚首，它们的力量合而为一，形成了这件足以撼动天地的至宝。它的觉醒，意味着一个新纪元的开始。',
  '在梦境与现实的交界处，有一座神秘的工坊。每当月圆之夜，{parentNames}就会被吸引到那里，在梦之织机的作用下相互融合。第二天清晨，人们会在枕边发现这件崭新的宝物，以及关于它的奇妙故事。',
  '一位勇敢的冒险者带着{parentNames}踏上了寻找传说中圣地的旅途。历经千辛万苦，他们终于到达了圣地的最深处。在神圣泉水的洗礼下，这些宝物融合为一体，获得了全新的形态和更强大的力量，成为了冒险者最忠实的伙伴。',
];

const CUSTOM_DESCRIPTION_TEMPLATES = [
  '融合了{parentNames}之精华的神秘造物，它闪耀着超越言语的奇异光芒。持有此物者，将同时拥有所有前身物品的神秘力量，更将觉醒前所未有的全新能力。它是想象力的结晶，是无限可能的化身。',
  '一件由{parentNames}交融而生的幻想宝物，它的形态在不同光线和角度下会发生微妙的变化。据说每一个注视它的人，都会看到内心最渴望之物的影子。它的力量深不可测，只有真正纯净的心灵才能完全驾驭。',
  '传说中的梦幻造物，诞生于{parentNames}的神圣融合。它的出现让天地变色，日月无光。每一道纹理都诉说着古老的故事，每一丝光芒都蕴含着无尽的魔力。它是童话世界最珍贵的礼物，也是最危险的诱惑。',
  '集{parentNames}之大成的终极宝物，它不仅继承了所有前身的能力，更在融合过程中产生了质变。持有者可以自由切换不同的形态和能力，应对各种复杂的局面。它是智慧与力量的完美结合，是梦想与现实的交汇点。',
  '由{parentNames}共鸣而诞生的灵性之物，它拥有自己的意志和情感，会选择自己的主人。遇到心地善良的人，它会发挥出全部力量，甚至超越极限；而遇到心怀不轨的人，它则会变得平凡无奇，甚至带来厄运。',
];

const ABILITY_NAME_TEMPLATES = [
  '融合·{name1}与{name2}',
  '新生·{keyword}之力',
  '终极·{keyword}爆发',
  '奇迹·{keyword}共鸣',
  '神圣·{keyword}祝福',
  '混沌·{keyword}深渊',
  '创世·{keyword}之辉',
  '永恒·{keyword}守护',
  '时空·{keyword}裂隙',
  '灵魂·{keyword}链接',
];

const ABILITY_KEYWORDS = [
  '融合', '星辰', '梦幻', '永恒', '奇迹', '神圣', '时空', '命运',
  '极光', '混沌', '创世', '虚无', '光辉', '暗影', '元素', '灵魂',
  '龙炎', '冰霜', '雷霆', '暴风', '大地', '海洋', '森林', '圣光',
  '暗夜', '血月', '金乌', '玉兔', '鲲鹏', '凤凰', '麒麟', '玄武',
];

const RARITY_ORDER: MagicItemRarity[] = ['普通', '稀有', '史诗', '传说', '神话'];

interface SpecialRecipe {
  ingredients: string[];
  result: Partial<MagicItem>;
}

const SPECIAL_RECIPES: SpecialRecipe[] = [
  {
    ingredients: ['magic-mirror', 'truth-mirror-shard'],
    result: {
      name: '全知魔镜',
      emoji: '🔮',
      rarity: '神话',
      description: '由魔镜本体和其碎片重新融合而成的终极真理之镜，它能够洞察世间万物的本质，没有任何秘密能够逃脱它的注视。',
      originStory: '当魔镜的碎片回归本体，两件本为一体的宝物重新融合，产生了不可思议的质变。这面全知魔镜不仅能够回答所有问题，更能窥探命运的走向，甚至能够在一定程度上改变因果。据说只有拥有大智慧的人，才能承受它所揭示的全部真相。',
      powerLevel: 100,
    },
  },
  {
    ingredients: ['magic-beans', 'golden-goose'],
    result: {
      name: '生命之树种子',
      emoji: '🌱',
      rarity: '神话',
      description: '融合了魔豆的生长之力与金鹅的财富之能的神奇种子，种下后会长出一棵结满金果的生命之树。',
      originStory: '当魔豆与金鹅相遇，两种来自云端的神奇力量产生了奇妙的反应。生命之树的种子就这样诞生了——它不仅能够一夜之间长成参天大树，树上结出的每一颗金果都蕴含着无尽的财富和生命的力量。据说这棵树的果实还能治愈一切疾病，甚至让人返老还童。',
      powerLevel: 97,
    },
  },
  {
    ingredients: ['crystal-slippers', 'red-shoes'],
    result: {
      name: '命运舞鞋',
      emoji: '👑',
      rarity: '传说',
      description: '融合了水晶鞋的优雅与红舞鞋的热情的神奇舞鞋，穿上后既能展现最美的舞姿，又不会被诅咒控制。',
      originStory: '善良的仙女将红舞鞋的诅咒解除后，用水晶鞋的力量将其净化重生。新生的命运舞鞋拥有两双鞋子的全部优点——它能让穿着者跳出世界上最美的舞蹈，吸引所有人的目光，同时又完全受穿着者的控制，不会带来任何副作用。据说穿上这双鞋的人，一定会在舞会上遇到命中注定的真爱。',
      powerLevel: 88,
    },
  },
  {
    ingredients: ['flying-carpet', 'seven-league-boots'],
    result: {
      name: '瞬息千里靴',
      emoji: '👟',
      rarity: '神话',
      description: '结合了飞毯的翱翔能力与七里格靴的神速步伐的终极移动道具，真正做到了瞬息千里，无所不至。',
      originStory: '当飞毯与七里格靴的力量融合，诞生了这件传说级的移动神器。穿上瞬息千里靴，穿着者可以在地面上以超越音速的速度奔跑，也可以腾空而起翱翔九天之上。它能够穿越任何地形，无视任何障碍，甚至可以在水面和虚空中行走。据说穿上它的人，可以在一天之内走遍世界的每一个角落。',
      powerLevel: 95,
    },
  },
  {
    ingredients: ['magic-lamp', 'magic-gourd'],
    result: {
      name: '万象神灯',
      emoji: '🪔',
      rarity: '神话',
      description: '融合了神灯的许愿之力与宝葫芦的收纳之能的至尊宝物，内有乾坤世界，可实现无尽愿望。',
      originStory: '当阿拉丁神灯与宝葫芦相遇，两件许愿神器的力量相互碰撞又相互融合，诞生了这件前所未有的万象神灯。它内部有一个广阔无垠的世界，可以收纳万物；灯神也变得更加智慧和强大，能够实现的愿望不再局限于三个。但它也保留了宝葫芦的特性——愿望的实现方式往往出乎意料，考验着持有者的智慧和心性。',
      powerLevel: 99,
    },
  },
  {
    ingredients: ['magic-ring', 'invisibility-cloak'],
    result: {
      name: '幻影至尊戒',
      emoji: '💍',
      rarity: '神话',
      description: '结合了至尊魔戒的力量与隐身斗篷的隐匿能力的终极戒指，戴上后既能隐身又能统御众戒，且不会被腐化。',
      originStory: '精灵工匠用最精湛的技艺，将至尊魔戒的力量与隐身斗篷的材质完美融合，打造出了这枚幻影至尊戒。它保留了原有的全部力量，却消除了腐化人心的副作用。戴上它的人不仅能够完全隐形，还能感知并影响其他力量之戒的持有者。更重要的是，这枚戒指的意志与持有者完全同步，只会为正义的目的服务。',
      powerLevel: 98,
    },
  },
  {
    ingredients: ['phoenix-feather', 'unicorn-horn'],
    result: {
      name: '圣辉权杖',
      emoji: '🏆',
      rarity: '神话',
      description: '以凤凰羽毛为杖芯、独角兽角为杖身的神圣权杖，拥有治愈万物、净化一切邪恶的力量。',
      originStory: '在远古时代，一位伟大的精灵女王将凤凰的羽毛与独角兽的角结合，创造了这件光明与治愈的圣器。圣辉权杖散发着温暖的金色光芒，能够治愈任何伤病，净化任何诅咒，甚至能让刚刚逝去的生命重获新生。它还能够发出神圣的光芒，驱散一切黑暗生物和邪恶魔法。只有心地最纯洁、意志最坚定的人，才能得到它的认可并发挥其全部力量。',
      powerLevel: 98,
    },
  },
  {
    ingredients: ['wand', 'spell-book'],
    result: {
      name: '元初法杖',
      emoji: '🪄',
      rarity: '传说',
      description: '融合了仙女教母魔杖的变形之力与魔法咒语书的知识传承的至高法杖，精通所有魔法。',
      originStory: '当最强大的魔杖与最古老的咒语书相遇，两者产生了神奇的共鸣——法杖获得了咒语书中的全部知识，咒语书则获得了法杖的施法能力。它们融合为一体，成为了元初法杖。这根法杖精通变形术、祝福术、召唤术、治愈术等几乎所有类型的魔法，而且不需要使用者念诵咒语，只要心念一动就能施放。更神奇的是，它还会自己创造新的魔法。',
      powerLevel: 92,
    },
  },
  {
    ingredients: ['time-turner', 'pandora-box'],
    result: {
      name: '命运之匣',
      emoji: '⏳',
      rarity: '神话',
      description: '融合了时间转换器的时空之力与潘多拉魔盒的命运之力的神秘匣子，能够穿越时间修正错误，但要付出代价。',
      originStory: '当时间的力量与命运的法则交织，诞生了这件危险而又充满诱惑的宝物。命运之匣可以让持有者回到过去，改变已经发生的事情——但每一次改变，都会从盒子里释放出一些灾难作为代价。不过，就像潘多拉魔盒一样，匣子的最底层也藏着希望。据说，如果有人能够承受所有的灾难而不放弃希望，最终就能获得真正的幸福。',
      powerLevel: 99,
    },
  },
  {
    ingredients: ['excalibur', 'golden-fleece'],
    result: {
      name: '王者圣剑',
      emoji: '⚔️',
      rarity: '神话',
      description: '以石中剑为剑身、金羊毛为剑鞘的王者之剑，既是最强的武器也是最强的护盾。',
      originStory: '传说中，伟大的英雄们为了打造一把完美的圣剑，将石中剑与金羊毛这两件神话级的宝物融合在一起。新生的王者圣剑拥有石中剑的神圣力量——只有真正的王者才能拔出它，挥剑时释放的圣光能够净化一切邪恶；而金羊毛制成的剑鞘则拥有永恒的治愈之力，佩戴者永远不会受伤失血。这把剑象征着王权与守护，是真正的王者才能拥有的至宝。',
      powerLevel: 99,
    },
  },
  {
    ingredients: ['poison-apple', 'magic-spinning-wheel'],
    result: {
      name: '永恒纺车',
      emoji: '🧵',
      rarity: '传说',
      description: '融合了毒苹果的沉睡诅咒与魔法纺车的百年沉眠的神秘纺车，能够编织命运的丝线。',
      originStory: '当黑魔法的两件至邪之物相遇，却产生了意想不到的变化——永恒纺车不再只有诅咒的力量，它能够编织命运的丝线，改变一个人的人生轨迹。它既可以让人陷入永恒的沉睡，也可以让人在梦中经历完整的人生；既可以降下诅咒，也可以编织祝福。它的善恶完全取决于使用者的心——善良的人用它可以创造美好，邪恶的人用它则会带来灾难。',
      powerLevel: 88,
    },
  },
  {
    ingredients: ['magic-brush', 'fairy-dust'],
    result: {
      name: '仙画笔',
      emoji: '🖌️',
      rarity: '传说',
      description: '结合了神笔的造物能力与精灵仙尘的魔法增幅的神奇画笔，画出的东西不仅能成真，还能拥有魔法能力。',
      originStory: '当马良的神笔沾上了精灵仙尘，这支画笔获得了脱胎换骨的变化。仙画笔不仅能画出实物，还能为画出的东西赋予魔法能力——画出的鸟可以口吐人言，画出的马可以踏云而行，画出的宝剑可以施放魔法。而且，用仙笔作画需要的不是法力，而是想象力——想象力越丰富，画出的东西就越强大。据说真正的画道大师，甚至能用它画出一个完整的世界。',
      powerLevel: 94,
    },
  },
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRarityIndex(rarity: MagicItemRarity): number {
  return RARITY_ORDER.indexOf(rarity);
}

function findSpecialRecipe(items: MagicItem[]): SpecialRecipe | null {
  const itemIds = items.map((i) => i.id).sort();
  for (const recipe of SPECIAL_RECIPES) {
    const sortedIngredients = [...recipe.ingredients].sort();
    if (itemIds.length === sortedIngredients.length && 
        itemIds.every((id, i) => id === sortedIngredients[i])) {
      return recipe;
    }
  }
  return null;
}

function calculateCombinedRarity(items: MagicItem[]): MagicItemRarity {
  const totalIndex = items.reduce((sum, item) => sum + getRarityIndex(item.rarity), 0);
  const avgIndex = Math.floor(totalIndex / items.length);
  const boost = items.length >= 3 ? 1 : 0;
  const rareBoost = Math.random() < 0.1 ? 1 : 0;
  const finalIndex = Math.min(avgIndex + boost + rareBoost, RARITY_ORDER.length - 1);
  return RARITY_ORDER[finalIndex];
}

function determineCategory(items: MagicItem[]): MagicItemCategory {
  const categoryCount: Record<string, number> = {};
  items.forEach((item) => {
    if (item.category !== '其他') {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    }
  });
  const sorted = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return '其他';
  const topCategory = sorted[0][0] as MagicItemCategory;
  if (sorted.length >= 2 && sorted[0][1] === sorted[1][1]) {
    return '神器';
  }
  return topCategory;
}

function combineTags(items: MagicItem[]): string[] {
  const allTags = new Set<string>();
  items.forEach((item) => {
    item.tags.forEach((tag) => allTags.add(tag));
  });
  allTags.add('融合');
  allTags.add('创造');
  const extraTags = ['幻想', '奇迹', '神秘', '传说', '至宝', '梦幻'];
  const extraCount = Math.min(2, Math.floor(Math.random() * 3));
  for (let i = 0; i < extraCount; i++) {
    const tag = getRandomItem(extraTags);
    allTags.add(tag);
  }
  return Array.from(allTags).slice(0, 8);
}

function generateName(items: MagicItem[]): string {
  const parentKeywords: string[] = [];
  items.forEach((item) => {
    const cleanName = item.name.replace(/(魔|魔法|神|圣|之|的)/g, '');
    if (cleanName.length >= 2) {
      parentKeywords.push(cleanName.slice(0, 2));
    } else if (cleanName.length > 0) {
      parentKeywords.push(cleanName);
    }
  });

  const prefix = getRandomItem(NAME_PREFIXES);
  const suffix = getRandomItem(NAME_SUFFIXES);
  const keyword = parentKeywords.length > 0 ? getRandomItem(parentKeywords) : '幻';

  const patterns = [
    `${prefix}${keyword}${suffix}`,
    `${prefix}${parentKeywords.slice(0, 2).join('')}${suffix}`,
    `${keyword}${suffix}`,
    `${prefix}${keyword}宝具`,
    `${parentKeywords.slice(0, 2).join('·')}${suffix}`,
    `${prefix}·${keyword}${suffix}`,
  ];

  return getRandomItem(patterns);
}

function generateEmoji(items: MagicItem[]): string {
  const allEmojis = items.map((i) => i.emoji);
  const sparkleEmojis = ['✨', '🌟', '💫', '⭐', '🔮', '💎', '🏆', '👑', '⚡', '🔥'];
  const roll = Math.random();
  if (roll < 0.25) {
    return allEmojis[0];
  } else if (roll < 0.5) {
    return getRandomItem(sparkleEmojis);
  } else if (roll < 0.75) {
    return getRandomItem(allEmojis);
  }
  return getRandomItem([...allEmojis, ...sparkleEmojis]);
}

function generateDescription(items: MagicItem[]): string {
  const template = getRandomItem(CUSTOM_DESCRIPTION_TEMPLATES);
  const parentNames = items.map((i) => `「${i.name}」`).join('、');
  return template.replace('{parentNames}', parentNames);
}

function generateOriginStory(items: MagicItem[]): string {
  const template = getRandomItem(CUSTOM_ORIGIN_TEMPLATES);
  const parentNames = items.map((i) => `「${i.name}」`).join('、');
  return template.replace('{parentNames}', parentNames);
}

function combineAbilities(items: MagicItem[]) {
  const baseAbilities = items.flatMap((i) => i.abilities);
  const shuffled = [...baseAbilities].sort(() => Math.random() - 0.5);
  const selectedBase = shuffled.slice(0, Math.min(2, shuffled.length));

  const abilityNameTemplate = getRandomItem(ABILITY_NAME_TEMPLATES);
  const name1 = items[0]?.name.slice(0, 2) || '幻';
  const name2 = items[1]?.name.slice(0, 2) || '梦';
  const keyword = getRandomItem(ABILITY_KEYWORDS);

  const combinedAbilityName = abilityNameTemplate
    .replace('{name1}', name1)
    .replace('{name2}', name2)
    .replace('{keyword}', keyword);

  const parentAbilityDescs = selectedBase.map((a) => a.description).join('，');
  const combinedAbilityDesc = `融合了${parentAbilityDescs ? parentAbilityDescs + '，' : ''}释放出前所未有的强大力量，产生了全新的未知效应。这是只有融合创造才能诞生的奇迹之力。`;

  const getNumericManaCost = (cost: number | string | undefined): number => {
    if (typeof cost === 'number') return cost;
    if (typeof cost === 'string') {
      const match = cost.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    }
    return 0;
  };

  const maxManaCost = Math.max(...items.flatMap((i) => i.abilities.map((a) => getNumericManaCost(a.manaCost))), 0);

  const newAbility = {
    name: combinedAbilityName,
    description: combinedAbilityDesc,
    manaCost: maxManaCost + Math.floor(items.length * 15) + Math.floor(Math.random() * 20),
    cooldown: items.length >= 4 ? '72小时' : items.length >= 3 ? '48小时' : '24小时',
  };

  return [...selectedBase, newAbility];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 255, g: 228, b: 225 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function generateCoverColor(items: MagicItem[]): string {
  if (items.length === 1) return items[0].coverColor;
  
  const colors = items.map((i) => hexToRgb(i.coverColor));
  let totalR = 0, totalG = 0, totalB = 0;
  
  colors.forEach((c) => {
    totalR += c.r;
    totalG += c.g;
    totalB += c.b;
  });
  
  const avgR = totalR / colors.length;
  const avgG = totalG / colors.length;
  const avgB = totalB / colors.length;
  
  const saturationBoost = 1.1;
  const max = Math.max(avgR, avgG, avgB);
  const min = Math.min(avgR, avgG, avgB);
  const range = max - min;
  
  if (range > 0) {
    const factor = saturationBoost;
    const newR = avgR + (avgR - (max + min) / 2) * factor;
    const newG = avgG + (avgG - (max + min) / 2) * factor;
    const newB = avgB + (avgB - (max + min) / 2) * factor;
    return rgbToHex(newR, newG, newB);
  }
  
  return rgbToHex(avgR, avgG, avgB);
}

function calculatePowerLevel(items: MagicItem[]): number {
  const totalPower = items.reduce((sum, item) => sum + item.powerLevel, 0);
  const avgPower = totalPower / items.length;
  const combinationBonus = items.length * 5;
  const randomBonus = Math.floor(Math.random() * 10);
  return Math.min(100, Math.floor(avgPower + combinationBonus + randomBonus));
}

export function combineMagicItems(items: MagicItem[]): MagicItem {
  const specialRecipe = findSpecialRecipe(items);
  
  let name: string;
  let emoji: string;
  let rarity: MagicItemRarity;
  let description: string;
  let originStory: string;
  let coverColor: string;
  let powerLevel: number;
  let abilities;
  let tags;
  let category;

  if (specialRecipe && specialRecipe.result) {
    const result = specialRecipe.result;
    name = result.name || generateName(items);
    emoji = result.emoji || generateEmoji(items);
    rarity = result.rarity || calculateCombinedRarity(items);
    description = result.description || generateDescription(items);
    originStory = result.originStory || generateOriginStory(items);
    coverColor = result.coverColor || generateCoverColor(items);
    powerLevel = result.powerLevel || calculatePowerLevel(items);
    abilities = result.abilities || combineAbilities(items);
    tags = result.tags ? [...result.tags, '融合', '特殊'] : combineTags(items);
    category = result.category || determineCategory(items);
  } else {
    name = generateName(items);
    emoji = generateEmoji(items);
    rarity = calculateCombinedRarity(items);
    category = determineCategory(items);
    tags = combineTags(items);
    description = generateDescription(items);
    originStory = generateOriginStory(items);
    abilities = combineAbilities(items);
    coverColor = generateCoverColor(items);
    powerLevel = calculatePowerLevel(items);
  }

  const parentIds = items.map((i) => i.id);

  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    category,
    rarity,
    emoji,
    coverColor,
    description,
    originStory,
    storyTitle: '幻想创造',
    storyAuthor: '魔法工坊',
    storyRegion: '童话世界',
    abilities,
    tags,
    powerLevel,
    isCustom: true,
    parentIds,
    createdAt: Date.now(),
    isSpecialRecipe: !!specialRecipe,
  };
}

export function canCombineItems(items: MagicItem[]): { canCombine: boolean; reason?: string } {
  if (items.length < 2) {
    return { canCombine: false, reason: '至少需要2个道具才能进行组合' };
  }
  if (items.length > 5) {
    return { canCombine: false, reason: '最多只能组合5个道具' };
  }
  
  const uniqueIds = new Set(items.map((i) => i.id));
  if (uniqueIds.size !== items.length) {
    return { canCombine: false, reason: '不能组合相同的道具' };
  }
  
  return { canCombine: true };
}

export function getSpecialRecipesCount(): number {
  return SPECIAL_RECIPES.length;
}

export function hasSpecialRecipe(items: MagicItem[]): boolean {
  return findSpecialRecipe(items) !== null;
}

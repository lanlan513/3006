import type { InteractiveStory } from '@/types';

export const interactiveStories: InteractiveStory[] = [
  {
    id: 'is-1',
    storyId: '3',
    title: '灰姑娘的命运抉择',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        type: 'start',
        content: '从前，有一位善良的女孩，她的母亲去世后，父亲娶了一个恶毒的继母，还带来了两个傲慢的姐姐。她们让女孩穿上破旧的灰衣裳，整天在厨房干活，大家都叫她"灰姑娘"。这一天，王宫传来消息——王子要举办盛大的舞会，全城的少女都被邀请了！',
        choices: [
          { id: 'start-1', text: '请求继母让自己参加舞会', nextNodeId: 'ask-stepmother' },
          { id: 'start-2', text: '偷偷准备，想办法自己去', nextNodeId: 'secret-prepare' },
          { id: 'start-3', text: '认命，继续在厨房干活', nextNodeId: 'give-up' }
        ]
      },
      'ask-stepmother': {
        id: 'ask-stepmother',
        type: 'normal',
        content: '灰姑娘鼓起勇气对继母说："妈妈，我也想去参加舞会。"继母冷笑一声，把一碗扁豆倒进了灰烬里："如果你能在两个小时内把扁豆都拣出来，我就让你去。"',
        choices: [
          { id: 'ask-1', text: '求助小鸟朋友帮忙拣豆子', nextNodeId: 'ask-birds' },
          { id: 'ask-2', text: '自己一粒一粒地拣', nextNodeId: 'pick-alone' }
        ]
      },
      'secret-prepare': {
        id: 'secret-prepare',
        type: 'normal',
        content: '灰姑娘悄悄来到母亲的坟前，那里有一棵她亲手种下的榛树，树上住着一只神奇的小鸟。她对着榛树许愿："小榛树，摇一摇，摆一摆，把美丽的衣服抛下来。"',
        choices: [
          { id: 'secret-1', text: '穿上小鸟给的金色舞服，立刻去王宫', nextNodeId: 'go-ball-gold' },
          { id: 'secret-2', text: '先去花园里采些鲜花装饰自己', nextNodeId: 'pick-flowers' }
        ]
      },
      'give-up': {
        id: 'give-up',
        type: 'ending',
        content: '灰姑娘叹了口气，继续在厨房里忙碌。窗外传来王宫舞会的欢笑声，她擦了擦眼角的泪水，安慰自己："这样也好，至少不会被人笑话。"多年后，她仍然是那个在厨房里忙碌的灰姑娘，偶尔会在夜晚梦见一个从未去过的华丽舞会。',
        endingType: 'sad',
        endingTitle: '平淡的一生'
      },
      'ask-birds': {
        id: 'ask-birds',
        type: 'normal',
        content: '灰姑娘来到花园里，轻声呼唤："乖乖的小鸽子，小斑鸠，天空中所有的小鸟们，请你们飞来帮助我：好豆子拣进盆里，坏豆子吞进肚子里。"随着她的叫声，两只小白鸽从窗口飞了进来，接着是小斑鸠，最后天空中成千上万的小鸟都飞来了，不到一个小时就把豆子拣完了！',
        choices: [
          { id: 'birds-1', text: '高兴地端着豆子去找继母', nextNodeId: 'show-stepmother' },
          { id: 'birds-2', text: '趁继母不注意，直接溜去榛树那里', nextNodeId: '榛树-magic' }
        ]
      },
      'pick-alone': {
        id: 'pick-alone',
        type: 'normal',
        content: '灰姑娘蹲在灰烬旁，一粒一粒地拣着豆子。时间一分一秒地过去，她的眼睛发酸，手指也磨出了水泡。两个小时到了，可灰里还剩下好多豆子。继母冷笑着说："看吧，我就知道你做不到。"说完就带着两个姐姐出发去王宫了。',
        choices: [
          { id: 'pick-1', text: '追上去恳求继母带上自己', nextNodeId: 'chase-carriage' },
          { id: 'pick-2', text: '独自一人跑到母亲坟前哭泣', nextNodeId: 'cry-at-grave' }
        ]
      },
      'show-stepmother': {
        id: 'show-stepmother',
        type: 'normal',
        content: '灰姑娘高高兴兴地把豆子端给继母。谁知继母脸色一变，又倒了两碗豆子进去："光拣一碗可不够，要想参加舞会，你得把这些也都拣出来！"她心里暗想：这一次，她绝对做不到了。',
        choices: [
          { id: 'show-1', text: '再次呼唤小鸟朋友帮忙', nextNodeId: '榛树-magic' },
          { id: 'show-2', text: '愤怒地和继母争吵', nextNodeId: 'argue-stepmother' }
        ]
      },
      '榛树-magic': {
        id: '榛树-magic',
        type: 'normal',
        content: '灰姑娘来到母亲的坟前，榛树枝叶沙沙作响。她对着榛树喊道："小榛树，摇一摇，摆一摆，把金银制成的衣服抛下来。"话音刚落，树上的小鸟就扔下了一件华丽的金色舞服和一双纯金的舞鞋！灰姑娘欣喜若狂地换上衣服。',
        choices: [
          { id: 'magic-1', text: '立刻赶往王宫舞会', nextNodeId: 'go-ball-gold' },
          { id: 'magic-2', text: '先洗个澡，打扮得更精致一些', nextNodeId: 'prepare-more' }
        ]
      },
      'go-ball-gold': {
        id: 'go-ball-gold',
        type: 'normal',
        content: '灰姑娘穿着金光闪闪的舞服出现在王宫，所有人都为她的美丽惊叹不已，连继母和姐姐们都没认出她！王子立刻走过来，只和她一个人跳舞。夜深了，灰姑娘想起小鸟的告诫——必须在午夜十二点前离开。',
        choices: [
          { id: 'ball-1', text: '按照约定，准时离开王宫', nextNodeId: 'leave-on-time' },
          { id: 'ball-2', text: '再跳一支舞，王子看起来那么不舍', nextNodeId: 'stay-late' }
        ]
      },
      'pick-flowers': {
        id: 'pick-flowers',
        type: 'normal',
        content: '灰姑娘在花园里采了一束美丽的白玫瑰。当她准备出发时，发现时间已经有些晚了。她匆匆赶往王宫，可是舞会上最华丽的那支开场舞已经结束了。王子正站在角落里，神情有些落寞。',
        choices: [
          { id: 'flowers-1', text: '勇敢地走过去邀请王子跳舞', nextNodeId: 'invite-prince' },
          { id: 'flowers-2', text: '把白玫瑰送给王子，然后悄悄离开', nextNodeId: 'give-rose-leave' }
        ]
      },
      'chase-carriage': {
        id: 'chase-carriage',
        type: 'ending',
        content: '灰姑娘赤着脚追出了大门，可是马车已经远去，扬起的尘土让她睁不开眼睛。她跌倒在泥泞的路上，看着马车消失在街角。从那以后，灰姑娘变得沉默寡言，她再也不敢有任何梦想了。',
        endingType: 'sad',
        endingTitle: '破碎的梦想'
      },
      'cry-at-grave': {
        id: 'cry-at-grave',
        type: 'normal',
        content: '灰姑娘来到母亲的坟前，伤心地哭了起来。"妈妈，我该怎么办呢？"她的泪水滴在榛树根上。忽然，榛树发出了金色的光芒，一只美丽的小鸟从巢里飞了出来。',
        choices: [
          { id: 'cry-1', text: '听从小鸟的指引，许愿获得舞服', nextNodeId: '榛树-magic' },
          { id: 'cry-2', text: '向小鸟倾诉自己的烦恼，寻求智慧', nextNodeId: 'bird-wisdom' }
        ]
      },
      'argue-stepmother': {
        id: 'argue-stepmother',
        type: 'ending',
        content: '"你太过分了！"灰姑娘第一次鼓起勇气反抗继母。可是她的抗争毫无用处，继母一怒之下把她锁进了柴房。她听着远处传来的舞会音乐，泪水湿透了衣袖。从那天起，她的处境变得更加艰难了。',
        endingType: 'sad',
        endingTitle: '柴房里的夜晚'
      },
      'prepare-more': {
        id: 'prepare-more',
        type: 'normal',
        content: '灰姑娘精心梳洗打扮，当她终于准备好出发时，发现时间已经很晚了。她一路小跑赶往王宫，却在宫门口被卫兵拦住了——"舞会已经开始，闲杂人等不得入内。"灰姑娘焦急地在门外徘徊。',
        choices: [
          { id: 'prepare-1', text: '展示金舞鞋证明自己的身份', nextNodeId: 'show-slipper' },
          { id: 'prepare-2', text: '绕到花园，从后门悄悄进入', nextNodeId: 'sneak-backdoor' }
        ]
      },
      'leave-on-time': {
        id: 'leave-on-time',
        type: 'normal',
        content: '灰姑娘及时离开了王宫，匆忙中遗落了一只金舞鞋在楼梯上。第二天，王子拿着这只金舞鞋全城寻访，发誓要找到它的主人。消息传到了灰姑娘家。',
        choices: [
          { id: 'leave-1', text: '主动站出来说鞋子是自己的', nextNodeId: 'claim-shoe' },
          { id: 'leave-2', text: '默默等待，不主动暴露身份', nextNodeId: 'wait-silently' }
        ]
      },
      'stay-late': {
        id: 'stay-late',
        type: 'normal',
        content: '时钟敲响了十二下！灰姑娘的金色舞服瞬间变回了破旧的灰衣裳。众人惊讶地看着这个突然出现的脏姑娘，继母和姐姐们更是幸灾乐祸地大笑起来。灰姑娘羞愧难当，捂着脸跑出了王宫。',
        choices: [
          { id: 'stay-1', text: '立刻逃离王宫，再也不想见王子', nextNodeId: 'run-away-forever' },
          { id: 'stay-2', text: '在榛树下等王子，告诉他真相', nextNodeId: 'wait-for-prince' }
        ]
      },
      'invite-prince': {
        id: 'invite-prince',
        type: 'normal',
        content: '灰姑娘深吸一口气，走到王子面前："殿下，可以请您跳一支舞吗？"王子被她的勇气和美丽打动了，两人翩翩起舞。舞会结束后，王子问她："你是谁？我要如何再见到你？"',
        choices: [
          { id: 'invite-1', text: '坦诚告诉他自己的真名和住址', nextNodeId: 'tell-truth' },
          { id: 'invite-2', text: '留下一只舞鞋，让他来找自己', nextNodeId: 'leave-shoe' }
        ]
      },
      'give-rose-leave': {
        id: 'give-rose-leave',
        type: 'ending',
        content: '灰姑娘把白玫瑰轻轻放在王子手边的桌上，然后像来时一样悄悄离开了。王子发现玫瑰时，她已经消失在夜色中。那朵白玫瑰被王子珍藏在书房里，而送花的姑娘，却成了他心中永远的谜。',
        endingType: 'neutral',
        endingTitle: '神秘的白玫瑰'
      },
      'bird-wisdom': {
        id: 'bird-wisdom',
        type: 'normal',
        content: '小鸟温柔地说："孩子，命运掌握在你自己手中。你可以选择在这里哭泣，也可以选择勇敢地去追寻自己的幸福。"灰姑娘擦干眼泪，若有所思地点点头。',
        choices: [
          { id: 'wisdom-1', text: '选择勇敢，让小鸟帮助自己获得舞服', nextNodeId: '榛树-magic' },
          { id: 'wisdom-2', text: '选择独立，用自己的方式改变命运', nextNodeId: 'independent-path' }
        ]
      },
      'show-slipper': {
        id: 'show-slipper',
        type: 'normal',
        content: '灰姑娘拿出另一只金舞鞋，卫兵惊讶地瞪大了眼睛，立刻带她去见王子。王子一眼就认出了她——"是你！那个在花园里出现的神秘姑娘！"两人相视而笑。',
        choices: [
          { id: 'slipper-1', text: '和王子一起进入舞会，享受美好夜晚', nextNodeId: 'happy-ending-prince' },
          { id: 'slipper-2', text: '请求王子陪自己回榛树那里，感谢小鸟的帮助', nextNodeId: 'thank-birds' }
        ]
      },
      'sneak-backdoor': {
        id: 'sneak-backdoor',
        type: 'ending',
        content: '灰姑娘蹑手蹑脚地从后门溜进王宫，却不小心撞上了端着点心的仆人。整盘蛋糕洒在了她的金色舞服上，喧闹声引来了所有人的目光。继母认出了她，当众羞辱她。灰姑娘在众人的嘲笑声中狼狈地逃离了王宫。',
        endingType: 'sad',
        endingTitle: '洒落的蛋糕'
      },
      'claim-shoe': {
        id: 'claim-shoe',
        type: 'normal',
        content: '"鞋子是我的。"灰姑娘平静地说。继母和姐姐们尖声嘲笑："就你？也配？"可是王子的侍从坚持让她试穿。灰姑娘从口袋里掏出另一只金舞鞋，两只鞋严丝合缝！',
        choices: [
          { id: 'claim-1', text: '立刻跟王子回王宫，准备婚礼', nextNodeId: 'happy-ending-prince' },
          { id: 'claim-2', text: '请求王子给自己一些时间，安顿好家里的事', nextNodeId: 'prepare-wedding' }
        ]
      },
      'wait-silently': {
        id: 'wait-silently',
        type: 'normal',
        content: '灰姑娘默默站在角落，看着两个姐姐拼命想把脚塞进那只小金鞋里——一个削掉了脚趾，一个削掉了脚后跟，鲜血直流。但她们都穿不上。最后，王子的侍从问："还有别的姑娘吗？"',
        choices: [
          { id: 'wait-1', text: '这时才站出来试穿鞋子', nextNodeId: 'final-reveal' },
          { id: 'wait-2', text: '继续沉默，看着他们离开', nextNodeId: 'miss-chance' }
        ]
      },
      'run-away-forever': {
        id: 'run-away-forever',
        type: 'ending',
        content: '灰姑娘一路狂奔，再也没有回头。她穿过森林，翻过山岭，来到了一个遥远的小镇，在一家面包店当了女工。多年以后，她偶尔会听到路过的旅人讲起王宫的故事——王子一直在寻找一个神秘的姑娘，但那个人永远不会是她了。',
        endingType: 'sad',
        endingTitle: '远方的面包店'
      },
      'wait-for-prince': {
        id: 'wait-for-prince',
        type: 'normal',
        content: '灰姑娘坐在榛树下等待。不久，王子果然追了出来。"我不在乎你的衣服，"王子真诚地说，"我看到了你的眼睛，它们比任何华服都更美丽。"灰姑娘感动得流下了眼泪。',
        choices: [
          { id: 'wait-1', text: '和王子一起回王宫', nextNodeId: 'happy-ending-prince' },
          { id: 'wait-2', text: '邀请王子来家里做客，见见自己的家人', nextNodeId: 'meet-family' }
        ]
      },
      'tell-truth': {
        id: 'tell-truth',
        type: 'normal',
        content: '"我叫灰姑娘，住在城市的另一边。"她坦诚地说出了自己的名字和住址，还讲了继母和姐姐们的故事。王子听完后，温柔地握住她的手："你的善良和勇气比任何东西都更珍贵。"',
        choices: [
          { id: 'truth-1', text: '第二天让王子正式上门提亲', nextNodeId: 'formal-proposal' },
          { id: 'truth-2', text: '今晚就和王子一起回王宫', nextNodeId: 'happy-ending-prince' }
        ]
      },
      'leave-shoe': {
        id: 'leave-shoe',
        type: 'normal',
        content: '灰姑娘留下一只金舞鞋，神秘地笑了笑："如果你能找到我，我就答应你。"第二天，王子全城寻访，终于找到了灰姑娘的家。',
        choices: [
          { id: 'shoe-1', text: '在两个姐姐试穿失败后出现', nextNodeId: 'final-reveal' },
          { id: 'shoe-2', text: '立刻出来与王子相认', nextNodeId: 'claim-shoe' }
        ]
      },
      'independent-path': {
        id: 'independent-path',
        type: 'ending',
        content: '灰姑娘决定不靠魔法，不靠王子，用自己的双手改变命运。她用榛树枝做了一些精美的小木雕，拿到集市上去卖。她的手艺越来越精湛，几年后，她开了一家自己的木艺工坊，成为了一位独立而富有的女工匠。王宫的舞会？她早就不需要了。',
        endingType: 'secret',
        endingTitle: '木艺大师'
      },
      'happy-ending-prince': {
        id: 'happy-ending-prince',
        type: 'ending',
        content: '灰姑娘和王子举行了盛大而隆重的婚礼。整个王国都为他们祝福。她用善良和智慧帮助王子治理国家，成为了深受人民爱戴的王妃。而那棵榛树下，永远有小鸟在歌唱，仿佛在诉说着一个关于勇气和真爱的美丽传说。',
        endingType: 'happy',
        endingTitle: '永远的幸福'
      },
      'thank-birds': {
        id: 'thank-birds',
        type: 'normal',
        content: '王子陪着灰姑娘来到榛树下。他们一起向小鸟道谢，小鸟唱着欢快的歌，从树上扔下更多美丽的礼物。王子被这个女孩的感恩之心深深打动了。',
        choices: [
          { id: 'thanks-1', text: '邀请小鸟们也来参加婚礼', nextNodeId: 'wedding-with-birds' },
          { id: 'thanks-2', text: '和王子一起回王宫', nextNodeId: 'happy-ending-prince' }
        ]
      },
      'prepare-wedding': {
        id: 'prepare-wedding',
        type: 'normal',
        content: '"我需要一些时间和家人告别。"灰姑娘说。王子尊重她的决定，三天后派来华丽的马车。然而继母和姐姐们却另有打算……',
        choices: [
          { id: 'prep-1', text: '带上继母和姐姐们一起去王宫', nextNodeId: 'forgive-family' },
          { id: 'prep-2', text: '独自离开，不再回头', nextNodeId: 'happy-ending-prince' }
        ]
      },
      'final-reveal': {
        id: 'final-reveal',
        type: 'normal',
        content: '"等一下，"灰姑娘从角落走了出来，"让我试试。"继母和姐姐们尖叫起来，但王子的侍从坚持让她试穿。灰姑娘轻轻松松就把脚伸进了金舞鞋——不大不小，正好合适！她又从口袋里掏出另一只，整个房间都安静了。',
        choices: [
          { id: 'final-1', text: '原谅继母和姐姐们', nextNodeId: 'forgive-family' },
          { id: 'final-2', text: '随王子离开，开始新生活', nextNodeId: 'happy-ending-prince' }
        ]
      },
      'miss-chance': {
        id: 'miss-chance',
        type: 'ending',
        content: '灰姑娘始终没有站出来。她看着王子的队伍渐渐远去，泪水无声地滑落。那只金舞鞋被她藏在箱底，成了一个永远的秘密。多年后，她听说王子娶了邻国的公主，而她依然是厨房里的那个灰姑娘。',
        endingType: 'sad',
        endingTitle: '尘封的舞鞋'
      },
      'meet-family': {
        id: 'meet-family',
        type: 'normal',
        content: '第二天，王子亲自登门拜访。继母和姐姐们惊讶得说不出话来。灰姑娘向王子一一介绍了自己的家人，尽管她们曾经那样对待她。',
        choices: [
          { id: 'meet-1', text: '邀请她们来参加婚礼', nextNodeId: 'forgive-family' },
          { id: 'meet-2', text: '礼貌告别，和王子离开', nextNodeId: 'happy-ending-prince' }
        ]
      },
      'formal-proposal': {
        id: 'formal-proposal',
        type: 'normal',
        content: '第二天，王子带着最贵重的聘礼和最隆重的仪仗队来到灰姑娘家。继母和姐姐们看着眼前的排场，下巴都要掉下来了。王子单膝跪地，正式向灰姑娘求婚。',
        choices: [
          { id: 'formal-1', text: '欣然答应，并邀请家人参加婚礼', nextNodeId: 'forgive-family' },
          { id: 'formal-2', text: '答应求婚，但独自离开', nextNodeId: 'happy-ending-prince' }
        ]
      },
      'wedding-with-birds': {
        id: 'wedding-with-birds',
        type: 'ending',
        content: '婚礼那天，榛树上所有的小鸟都飞来了，它们在教堂上空盘旋歌唱，撒下漫天的花瓣。宾客们从未见过如此神奇的景象。灰姑娘成了王妃，但她从未忘记那棵榛树，每年都会亲自去浇水、看望老朋友。她和王子、还有那些小鸟朋友们，幸福地生活了很久很久。',
        endingType: 'secret',
        endingTitle: '小鸟的祝福'
      },
      'forgive-family': {
        id: 'forgive-family',
        type: 'ending',
        content: '灰姑娘原谅了继母和姐姐们，甚至为她们在王宫里安排了住处。起初她们还有些不自在，但灰姑娘的真诚和善良渐渐感化了她们。姐姐们学会了谦逊，继母也变得温和起来。整个王宫都充满了爱与和谐。灰姑娘用她的善良，不仅收获了爱情，还让整个家庭都得到了救赎。',
        endingType: 'happy',
        endingTitle: '爱的救赎'
      }
    }
  },
  {
    id: 'is-2',
    storyId: '5',
    title: '小红帽的十字路口',
    startNodeId: 'lr-start',
    nodes: {
      'lr-start': {
        id: 'lr-start',
        type: 'start',
        content: '从前有一个可爱的小女孩，大家都叫她小红帽，因为她总戴着一顶红色的小帽子。这一天，妈妈对她说："外婆生病了，你把这块蛋糕和这瓶葡萄酒送去给她吧。路上要小心，别走小路哦。"小红帽提着篮子出发了。',
        choices: [
          { id: 'lr-s-1', text: '乖乖走大路，安全第一', nextNodeId: 'lr-main-road' },
          { id: 'lr-s-2', text: '走小路更近，能节省时间', nextNodeId: 'lr-small-path' },
          { id: 'lr-s-3', text: '先去采些鲜花给外婆', nextNodeId: 'lr-pick-flowers' }
        ]
      },
      'lr-main-road': {
        id: 'lr-main-road',
        type: 'normal',
        content: '小红帽沿着大路往前走，路上有来往的马车和行人，很热闹。走了一会儿，她遇到一位扛着猎枪的猎人。"小姑娘，你一个人要去哪里呀？"猎人关切地问。',
        choices: [
          { id: 'lr-mr-1', text: '如实告诉猎人自己要去外婆家', nextNodeId: 'lr-tell-hunter' },
          { id: 'lr-mr-2', text: '礼貌地笑笑，不透露太多', nextNodeId: 'lr-be-cautious' }
        ]
      },
      'lr-small-path': {
        id: 'lr-small-path',
        type: 'normal',
        content: '小红帽走进了森林里的小路。树木茂密，阳光透过树叶洒下斑驳的光影。忽然，一只毛茸茸的大灰狼从树后走了出来！"你好啊，小姑娘。"大灰狼露出了友好的微笑。',
        choices: [
          { id: 'lr-sp-1', text: '礼貌地打招呼，回应大灰狼', nextNodeId: 'lr-talk-wolf' },
          { id: 'lr-sp-2', text: '保持警惕，不说话，快步走开', nextNodeId: 'lr-walk-fast' },
          { id: 'lr-sp-3', text: '大声呼救，吓跑大灰狼', nextNodeId: 'lr-yell-help' }
        ]
      },
      'lr-pick-flowers': {
        id: 'lr-pick-flowers',
        type: 'normal',
        content: '小红帽来到路边的花丛中，采了好多漂亮的野花——有雏菊、虞美人、还有铃兰。她太专注了，没注意到身后有一双眼睛正在盯着她……',
        choices: [
          { id: 'lr-pf-1', text: '采够了就赶紧去外婆家', nextNodeId: 'lr-rush-grandma' },
          { id: 'lr-pf-2', text: '再多采一些，外婆一定很喜欢', nextNodeId: 'lr-pick-more' }
        ]
      },
      'lr-tell-hunter': {
        id: 'lr-tell-hunter',
        type: 'normal',
        content: '"我要去看望生病的外婆，给她送些吃的。"小红帽如实说。猎人皱起了眉头："最近森林里有大灰狼出没，太危险了。这样吧，我正好要去那边打猎，顺路护送你过去。"',
        choices: [
          { id: 'lr-th-1', text: '接受猎人的护送', nextNodeId: 'lr-hunter-escort' },
          { id: 'lr-th-2', text: '婉言谢绝，自己能行', nextNodeId: 'lr-go-alone' }
        ]
      },
      'lr-be-cautious': {
        id: 'lr-be-cautious',
        type: 'normal',
        content: '"我就是随便走走。"小红帽乖巧地回答。猎人点点头："小心一点，最近森林里不太平。"说完就继续赶路了。小红帽独自一人继续往前走。',
        choices: [
          { id: 'lr-bc-1', text: '加快脚步，尽快赶到外婆家', nextNodeId: 'lr-arrive-safe' },
          { id: 'lr-bc-2', text: '顺路去看看森林里的小动物', nextNodeId: 'lr-visit-animals' }
        ]
      },
      'lr-talk-wolf': {
        id: 'lr-talk-wolf',
        type: 'normal',
        content: '"你好，狼先生。"小红帽礼貌地说。"你提着篮子要去哪里呀？"大灰狼问。天真的小红帽回答："我要去外婆家，她生病了，我给她送蛋糕和葡萄酒。"大灰狼眼睛一亮："真是个孝顺的孩子！你外婆住在哪里呀？"',
        choices: [
          { id: 'lr-tw-1', text: '告诉大灰狼外婆的地址', nextNodeId: 'lr-reveal-address' },
          { id: 'lr-tw-2', text: '突然警觉起来，不再多说', nextNodeId: 'lr-stop-talking' }
        ]
      },
      'lr-walk-fast': {
        id: 'lr-walk-fast',
        type: 'normal',
        content: '小红帽不理会大灰狼，加快脚步往前走。可是大灰狼不依不饶地跟了上来："小姑娘，别害怕嘛，我又不会吃了你。你看，那边有好多漂亮的花，要不要去采一些给你外婆？"',
        choices: [
          { id: 'lr-wf-1', text: '听从建议，去采花', nextNodeId: 'lr-follow-wolf' },
          { id: 'lr-wf-2', text: '不理他，继续赶路', nextNodeId: 'lr-keep-going' }
        ]
      },
      'lr-yell-help': {
        id: 'lr-yell-help',
        type: 'normal',
        content: '"救命啊！有大灰狼！"小红帽大声呼喊。大灰狼被吓了一跳，灰溜溜地钻进了树丛里。不远处，一个猎人听到喊声赶了过来。',
        choices: [
          { id: 'lr-yh-1', text: '告诉猎人刚才发生的事', nextNodeId: 'lr-hunter-escort' },
          { id: 'lr-yh-2', text: '说自己没事，让猎人放心离开', nextNodeId: 'lr-arrive-safe' }
        ]
      },
      'lr-rush-grandma': {
        id: 'lr-rush-grandma',
        type: 'normal',
        content: '小红帽捧着漂亮的花束，急匆匆地往外婆家赶。可是她没注意到，大灰狼一直悄悄跟在她身后，而且已经抄近路跑到了前面……',
        choices: [
          { id: 'lr-rg-1', text: '加快脚步，应该很快就到了', nextNodeId: 'lr-wolf-at-house' },
          { id: 'lr-rg-2', text: '总觉得有人在跟着，回头看看', nextNodeId: 'lr-look-back' }
        ]
      },
      'lr-pick-more': {
        id: 'lr-pick-more',
        type: 'normal',
        content: '小红帽越采越多，篮子都快装不下了。等她终于满意时，发现太阳已经高高挂在头顶。"哎呀，我得赶紧走了！"可是她这才发现——自己迷路了！',
        choices: [
          { id: 'lr-pm-1', text: '试着自己辨认方向', nextNodeId: 'lr-lost-woods' },
          { id: 'lr-pm-2', text: '寻找路人帮忙', nextNodeId: 'lr-find-stranger' }
        ]
      },
      'lr-hunter-escort': {
        id: 'lr-hunter-escort',
        type: 'ending',
        content: '在猎人的护送下，小红帽平安到达了外婆家。猎人还顺便帮他们检查了房子四周，确认没有危险。外婆吃了小红帽带来的东西，身体很快就好了。从那以后，小红帽每次出门都会带上猎刀，而且再也不随便和陌生人说话了。',
        endingType: 'happy',
        endingTitle: '平安到达'
      },
      'lr-go-alone': {
        id: 'lr-go-alone',
        type: 'normal',
        content: '"谢谢您的好意，不过我自己可以的。"小红帽礼貌地拒绝了。猎人耸耸肩："好吧，那你自己多小心。"小红帽独自一人继续往前走。走着走着，她听到路边的树丛里有动静。',
        choices: [
          { id: 'lr-ga-1', text: '停下来看看是什么', nextNodeId: 'lr-check-bush' },
          { id: 'lr-ga-2', text: '不理会，继续走', nextNodeId: 'lr-arrive-safe' }
        ]
      },
      'lr-arrive-safe': {
        id: 'lr-arrive-safe',
        type: 'ending',
        content: '小红帽顺利到达了外婆家。外婆吃了蛋糕，喝了葡萄酒，身体很快就恢复了。小红帽在回家的路上想："妈妈说得对，走大路确实更安全。"从此以后，她每次出门都牢牢记住妈妈的话，再也不冒失地走小路了。',
        endingType: 'happy',
        endingTitle: '听话的孩子'
      },
      'lr-visit-animals': {
        id: 'lr-visit-animals',
        type: 'normal',
        content: '小红帽在森林里遇到了一只小松鼠，它的脚受伤了。小红帽放下篮子，帮小松鼠包扎了伤口。小松鼠感激地对她说："谢谢你！作为回报，我要告诉你一件事——有一只大灰狼正埋伏在前面的路上。"',
        choices: [
          { id: 'lr-va-1', text: '听从松鼠的警告，绕路走', nextNodeId: 'lr-detour' },
          { id: 'lr-va-2', text: '不相信，继续往前走', nextNodeId: 'lr-wolf-ambush' }
        ]
      },
      'lr-reveal-address': {
        id: 'lr-reveal-address',
        type: 'normal',
        content: '"我外婆就住在森林尽头那座小屋里，门口有三棵大橡树。"小红帽毫无防备地说。"太好了！"大灰狼心想，"这真是送上门的美味！"他假装友善地说："那你快去吧，别让你外婆等急了。"',
        choices: [
          { id: 'lr-ra-1', text: '开心地继续赶路', nextNodeId: 'lr-wolf-runs-ahead' },
          { id: 'lr-ra-2', text: '突然意识到不对劲，赶紧回头', nextNodeId: 'lr-turn-back' }
        ]
      },
      'lr-stop-talking': {
        id: 'lr-stop-talking',
        type: 'normal',
        content: '小红帽忽然想起妈妈的话——不要和陌生人说话。她闭上嘴巴，快步往前走。大灰狼看她不上当，眼珠一转，又想出了别的主意。',
        choices: [
          { id: 'lr-st-1', text: '继续赶路，不理会大灰狼', nextNodeId: 'lr-keep-going' },
          { id: 'lr-st-2', text: '找个地方躲起来', nextNodeId: 'lr-hide' }
        ]
      },
      'lr-follow-wolf': {
        id: 'lr-follow-wolf',
        type: 'normal',
        content: '小红帽跟着大灰狼来到了一片花丛。"这些花多漂亮啊！"大灰狼说。小红帽放下篮子，开始采花。而大灰狼则趁机悄悄溜走，抄近路往外婆家跑去……',
        choices: [
          { id: 'lr-fw-1', text: '专心采花，没注意到大灰狼走了', nextNodeId: 'lr-wolf-at-house' },
          { id: 'lr-fw-2', text: '发现大灰狼不见了，立刻警觉起来', nextNodeId: 'lr-notice-wolf-gone' }
        ]
      },
      'lr-keep-going': {
        id: 'lr-keep-going',
        type: 'normal',
        content: '小红帽快步往前走，大灰狼被甩在了后面。她很快来到了外婆家附近。远远地，她看到外婆家的门开着……',
        choices: [
          { id: 'lr-kg-1', text: '直接推门进去', nextNodeId: 'lr-enter-house' },
          { id: 'lr-kg-2', text: '先在外面观察一下', nextNodeId: 'lr-observe-house' }
        ]
      },
      'lr-wolf-at-house': {
        id: 'lr-wolf-at-house',
        type: 'normal',
        content: '当小红帽终于到达外婆家时，发现门虚掩着。她推开门走进去，看见"外婆"躺在床上，可是样子怪怪的——耳朵那么大，眼睛那么大，手也那么大！',
        choices: [
          { id: 'lr-wh-1', text: '"外婆，你的耳朵怎么那么大呀？"', nextNodeId: 'lr-classic-dialogue' },
          { id: 'lr-wh-2', text: '立刻意识到这是大灰狼，转身就跑', nextNodeId: 'lr-escape' },
          { id: 'lr-wh-3', text: '假装没察觉，悄悄拿起桌上的剪刀', nextNodeId: 'lr-grab-scissors' }
        ]
      },
      'lr-look-back': {
        id: 'lr-look-back',
        type: 'normal',
        content: '小红帽猛地回头，看见大灰狼正鬼鬼祟祟地跟在后面！她吓了一跳，开始拼命往前跑。大灰狼也不再伪装，张牙舞爪地追了上来。',
        choices: [
          { id: 'lr-lb-1', text: '往人多的大路上跑', nextNodeId: 'lr-run-to-road' },
          { id: 'lr-lb-2', text: '爬上旁边的大树', nextNodeId: 'lr-climb-tree' }
        ]
      },
      'lr-lost-woods': {
        id: 'lr-lost-woods',
        type: 'normal',
        content: '小红帽在森林里转来转去，怎么也找不到路。太阳渐渐西沉，她害怕得哭了起来。就在这时，一只老猫头鹰飞到她面前："孩子，你为什么哭呀？"',
        choices: [
          { id: 'lr-lw-1', text: '请猫头鹰帮忙指路', nextNodeId: 'lr-owl-help' },
          { id: 'lr-lw-2', text: '继续自己寻找出路', nextNodeId: 'lr-night-forest' }
        ]
      },
      'lr-find-stranger': {
        id: 'lr-find-stranger',
        type: 'normal',
        content: '小红帽在森林里遇到了一位披着斗篷的神秘老婆婆。"孩子，你迷路了吗？"老婆婆微笑着问，"我可以带你出去哦。"',
        choices: [
          { id: 'lr-fs-1', text: '跟着老婆婆走', nextNodeId: 'lr-follow-stranger' },
          { id: 'lr-fs-2', text: '婉言拒绝，自己再找找', nextNodeId: 'lr-night-forest' }
        ]
      },
      'lr-check-bush': {
        id: 'lr-check-bush',
        type: 'normal',
        content: '小红帽好奇地拨开树丛，发现里面是一只受了伤的小兔子。她蹲下来，正想看看小兔子的伤势，忽然身后传来一阵低沉的咆哮声……',
        choices: [
          { id: 'lr-cb-1', text: '赶紧抱起小兔子逃跑', nextNodeId: 'lr-run-with-rabbit' },
          { id: 'lr-cb-2', text: '慢慢回头看是什么', nextNodeId: 'lr-face-wolf' }
        ]
      },
      'lr-detour': {
        id: 'lr-detour',
        type: 'ending',
        content: '小红帽听从松鼠的警告，绕了一条远路。虽然多花了一些时间，但她平安到达了外婆家。外婆吃了她带来的东西，又看到了美丽的鲜花，病很快就好了。小松鼠也成了小红帽的好朋友，每次她来森林，松鼠都会陪着她。',
        endingType: 'happy',
        endingTitle: '松鼠的报答'
      },
      'lr-wolf-ambush': {
        id: 'lr-wolf-ambush',
        type: 'ending',
        content: '小红帽不相信小松鼠的话，继续往前走。果然，大灰狼从路边的树丛里跳了出来！可怜的小红帽无处可逃……幸好路过的猎人听到了她的呼救声，及时赶来救了她。但经历了这件事，小红帽吓得生了一场大病，再也不敢独自去森林了。',
        endingType: 'sad',
        endingTitle: '不听劝告'
      },
      'lr-wolf-runs-ahead': {
        id: 'lr-wolf-runs-ahead',
        type: 'normal',
        content: '小红帽毫无防备地在路上慢慢走着，还停下来摘了几朵野花。而大灰狼已经飞快地跑到了外婆家，一口吞掉了外婆，然后穿上外婆的睡衣，躺在床上等小红帽……',
        choices: [
          { id: 'lr-wr-1', text: '小红帽很快就到了外婆家', nextNodeId: 'lr-wolf-at-house' },
          { id: 'lr-wr-2', text: '遇到了邻居王爷爷，聊了一会儿', nextNodeId: 'lr-meet-neighbor' }
        ]
      },
      'lr-turn-back': {
        id: 'lr-turn-back',
        type: 'normal',
        content: '小红帽越想越不对劲，"妈妈说过不要告诉陌生人家里的事！"她转身就往回跑。大灰狼发现她跑了，立刻追了上来。',
        choices: [
          { id: 'lr-tb-1', text: '大声呼救', nextNodeId: 'lr-yell-help' },
          { id: 'lr-tb-2', text: '拼命往大路跑', nextNodeId: 'lr-run-to-road' }
        ]
      },
      'lr-hide': {
        id: 'lr-hide',
        type: 'normal',
        content: '小红帽躲进了一个空心的大树洞里。大灰狼在外面找了半天，没找到她，悻悻地走了。小红帽在树洞里躲了很久很久，直到听到外面有猎人经过的声音。',
        choices: [
          { id: 'lr-hd-1', text: '出来向猎人求助', nextNodeId: 'lr-hunter-escort' },
          { id: 'lr-hd-2', text: '等到天黑再出去', nextNodeId: 'lr-night-forest' }
        ]
      },
      'lr-notice-wolf-gone': {
        id: 'lr-notice-wolf-gone',
        type: 'normal',
        content: '小红帽发现大灰狼不见了，立刻明白了——他一定是去外婆家了！她急急忙忙往外婆家跑，同时在路上捡起了一根结实的木棍。',
        choices: [
          { id: 'lr-ng-1', text: '抄近路，赶在大灰狼之前到达', nextNodeId: 'lr-beat-wolf' },
          { id: 'lr-ng-2', text: '先去找猎人帮忙', nextNodeId: 'lr-get-hunter' }
        ]
      },
      'lr-enter-house': {
        id: 'lr-enter-house',
        type: 'normal',
        content: '小红帽推开门走了进去。"外婆，我给你送蛋糕来了！"她一边说一边走向床边。可是当她看清床上的"外婆"时，她惊呆了——那耳朵、那眼睛、那牙齿……',
        choices: [
          { id: 'lr-eh-1', text: '"外婆，你的牙齿怎么那么大呀？"', nextNodeId: 'lr-classic-dialogue' },
          { id: 'lr-eh-2', text: '尖叫着往外跑', nextNodeId: 'lr-escape' }
        ]
      },
      'lr-observe-house': {
        id: 'lr-observe-house',
        type: 'normal',
        content: '小红帽在窗外偷偷往里看，发现床上躺着的根本不是外婆，而是一只毛茸茸的大灰狼！她倒吸一口凉气，赶紧往后退。',
        choices: [
          { id: 'lr-oh-1', text: '赶紧去找猎人叔叔', nextNodeId: 'lr-get-hunter' },
          { id: 'lr-oh-2', text: '想一个办法自己救出外婆', nextNodeId: 'lr-rescue-plan' }
        ]
      },
      'lr-classic-dialogue': {
        id: 'lr-classic-dialogue',
        type: 'normal',
        content: '"耳朵大，好听你说话呀！""外婆，你的眼睛怎么那么大呀？""眼睛大，好看你呀！""外婆，你的手怎么那么大呀？""手大，好抱你呀！""外婆，你的牙齿怎么那么大呀？""牙齿大，好吃你呀！"大灰狼说完，猛地从床上跳了起来！',
        choices: [
          { id: 'lr-cd-1', text: '拼命往外跑', nextNodeId: 'lr-escape' },
          { id: 'lr-cd-2', text: '勇敢地和大灰狼搏斗', nextNodeId: 'lr-fight-wolf' }
        ]
      },
      'lr-escape': {
        id: 'lr-escape',
        type: 'normal',
        content: '小红帽转身就跑，大灰狼在后面穷追不舍。她冲出大门，拼命往森林外面跑。就在这时，她看到远处有一个熟悉的身影！',
        choices: [
          { id: 'lr-es-1', text: '是猎人叔叔！向他呼救', nextNodeId: 'lr-get-hunter' },
          { id: 'lr-es-2', text: '是邻居王爷爷！向他求助', nextNodeId: 'lr-neighbor-help' }
        ]
      },
      'lr-grab-scissors': {
        id: 'lr-grab-scissors',
        type: 'normal',
        content: '小红帽不动声色地走到桌边，悄悄拿起了裁缝用的大剪刀。"外婆，我给你带了蛋糕。"她一边说一边慢慢靠近床边。大灰狼还在假装睡觉，根本没有察觉。',
        choices: [
          { id: 'lr-gs-1', text: '趁大灰狼不注意，一剪刀扎过去', nextNodeId: 'lr-attack-wolf' },
          { id: 'lr-gs-2', text: '先剪开大灰狼的肚子，救出外婆', nextNodeId: 'lr-cut-open' }
        ]
      },
      'lr-run-to-road': {
        id: 'lr-run-to-road',
        type: 'ending',
        content: '小红帽拼尽全力跑到了大路上。正好有一辆马车经过，车夫把她拉上了车。大灰狼追到大路上，看着远去的马车，只能无奈地返回森林。虽然有惊无险，但小红帽吓得不轻，回到家后大病了一场。从此以后，她比以前更加谨慎了。',
        endingType: 'neutral',
        endingTitle: '侥幸逃脱'
      },
      'lr-climb-tree': {
        id: 'lr-climb-tree',
        type: 'normal',
        content: '小红帽迅速爬上了旁边的大树。大灰狼在树下转来转去，但是不会爬树，只能干瞪眼。"你下来呀！"大灰狼气急败坏地喊。小红帽紧紧抱着树枝，就是不下来。',
        choices: [
          { id: 'lr-ct-1', text: '在树上等到有人路过', nextNodeId: 'lr-wait-in-tree' },
          { id: 'lr-ct-2', text: '寻找机会跳到旁边的另一棵树上', nextNodeId: 'lr-jump-tree' }
        ]
      },
      'lr-owl-help': {
        id: 'lr-owl-help',
        type: 'ending',
        content: '老猫头鹰带着小红帽飞出了森林，把她安全送到了外婆家。虽然天已经黑了，但外婆一直在等她。吃了蛋糕和葡萄酒，又听小红帽讲了今天的冒险，外婆的病竟然好了大半。从此，猫头鹰成了小红帽的森林守护者，每次她来，猫头鹰都会在天上守护着她。',
        endingType: 'happy',
        endingTitle: '猫头鹰的指引'
      },
      'lr-night-forest': {
        id: 'lr-night-forest',
        type: 'ending',
        content: '夜幕降临，小红帽独自在黑暗的森林里又冷又怕。她靠着一棵大树蜷缩着，听着远处传来的狼嚎声，泪水无声地滑落。幸运的是，担心她的家人组织村民连夜搜寻，终于在天亮前找到了她。但这次可怕的经历，让她对森林产生了深深的恐惧。',
        endingType: 'sad',
        endingTitle: '森林的寒夜'
      },
      'lr-follow-stranger': {
        id: 'lr-follow-stranger',
        type: 'ending',
        content: '小红帽跟着神秘老婆婆走进了森林深处。可是走着走着，老婆婆的样子变得越来越奇怪——她的耳朵越来越尖，牙齿越来越长……原来她就是大灰狼变的！可怜的小红帽中计了。从此以后，再也没有人见过她。',
        endingType: 'sad',
        endingTitle: '披着斗篷的狼'
      },
      'lr-run-with-rabbit': {
        id: 'lr-run-with-rabbit',
        type: 'normal',
        content: '小红帽抱起小兔子就跑，大灰狼在后面紧追不舍。她拼命跑啊跑，终于看到了一座小木屋——那是森林看守人的家！',
        choices: [
          { id: 'lr-rwr-1', text: '冲进小木屋求救', nextNodeId: 'lr-keeper-help' },
          { id: 'lr-rwr-2', text: '绕着小木屋跑，甩掉大灰狼', nextNodeId: 'lr-circle-house' }
        ]
      },
      'lr-face-wolf': {
        id: 'lr-face-wolf',
        type: 'normal',
        content: '小红帽慢慢回头，看见了一只龇牙咧嘴的大灰狼！"嘿嘿，小朋友，跟我走吧。"大灰狼狞笑着逼近。',
        choices: [
          { id: 'lr-fw-1', text: '大声呼救', nextNodeId: 'lr-yell-help' },
          { id: 'lr-fw-2', text: '用篮子砸向大灰狼，然后逃跑', nextNodeId: 'lr-throw-basket' }
        ]
      },
      'lr-meet-neighbor': {
        id: 'lr-meet-neighbor',
        type: 'normal',
        content: '"小红帽，你要去哪里呀？"王爷爷亲切地问。"我去看外婆。"小红帽说。王爷爷皱起眉头："刚才我看见一只大灰狼往你外婆家的方向跑了，你一个人太危险了，我陪你一起去吧。"',
        choices: [
          { id: 'lr-mn-1', text: '和王爷爷一起去外婆家', nextNodeId: 'lr-neighbor-rescue' },
          { id: 'lr-mn-2', text: '让王爷爷先去，自己在后面跟着', nextNodeId: 'lr-neighbor-ahead' }
        ]
      },
      'lr-beat-wolf': {
        id: 'lr-beat-wolf',
        type: 'normal',
        content: '小红帽抄近路跑，终于赶在大灰狼之前到了外婆家。她推开门，看见外婆好好地坐在椅子上，松了一口气。"外婆，快把门闩上！大灰狼来了！"',
        choices: [
          { id: 'lr-bw-1', text: '和外婆一起躲在屋里，等大灰狼离开', nextNodeId: 'lr-wait-inside' },
          { id: 'lr-bw-2', text: '和外婆一起设陷阱对付大灰狼', nextNodeId: 'lr-set-trap' }
        ]
      },
      'lr-get-hunter': {
        id: 'lr-get-hunter',
        type: 'normal',
        content: '小红帽找到了正在附近打猎的猎人叔叔，把大灰狼的事情告诉了他。猎人拿起猎枪："走，我们去救你外婆！"',
        choices: [
          { id: 'lr-gh-1', text: '和猎人一起冲进去', nextNodeId: 'lr-hunter-rescue' },
          { id: 'lr-gh-2', text: '在外面等着，让猎人进去', nextNodeId: 'lr-wait-outside' }
        ]
      },
      'lr-rescue-plan': {
        id: 'lr-rescue-plan',
        type: 'normal',
        content: '小红帽灵机一动，想到了一个好主意。她跑到花园里搬来一大桶水，又找了些绳子。她准备从窗户偷偷爬进去……',
        choices: [
          { id: 'lr-rp-1', text: '从窗户泼一桶水进去，趁大灰狼看不见时冲进去', nextNodeId: 'lr-water-attack' },
          { id: 'lr-rp-2', text: '在门口放好绳子陷阱，然后敲门引大灰狼出来', nextNodeId: 'lr-door-trap' }
        ]
      },
      'lr-fight-wolf': {
        id: 'lr-fight-wolf',
        type: 'normal',
        content: '小红帽鼓起勇气，拿起篮子就往大灰狼头上砸！"哎哟！"大灰狼被砸得眼冒金星。但他很快就反应过来，愤怒地扑向小红帽。',
        choices: [
          { id: 'lr-fw-1', text: '继续用篮子里的东西砸他', nextNodeId: 'lr-throw-food' },
          { id: 'lr-fw-2', text: '趁他被砸到的瞬间往外跑', nextNodeId: 'lr-escape' }
        ]
      },
      'lr-attack-wolf': {
        id: 'lr-attack-wolf',
        type: 'ending',
        content: '小红帽鼓起勇气，举起剪刀对准大灰狼的心脏扎了下去！大灰狼惨叫一声，倒在了地上。勇敢的小红帽不仅救了自己，还剪开大灰狼的肚子，救出了外婆。从此以后，森林里的小动物们都称她为"勇敢的小红帽"。',
        endingType: 'happy',
        endingTitle: '勇敢的小红帽'
      },
      'lr-cut-open': {
        id: 'lr-cut-open',
        type: 'normal',
        content: '小红帽轻轻剪开大灰狼的肚子，外婆从里面钻了出来，她还活着！祖孙俩激动地拥抱在一起。可就在这时，大灰狼翻了个身，好像要醒过来了……',
        choices: [
          { id: 'lr-co-1', text: '赶紧往大灰狼肚子里塞石头', nextNodeId: 'lr-stuff-stones' },
          { id: 'lr-co-2', text: '拉着外婆赶紧跑', nextNodeId: 'lr-escape' }
        ]
      },
      'lr-neighbor-help': {
        id: 'lr-neighbor-help',
        type: 'normal',
        content: '"王爷爷，救救我！"小红帽喊道。王爷爷拿起手中的拐杖："别怕！"他抡起拐杖，把大灰狼打跑了。然后他陪着小红帽一起去外婆家。',
        choices: [
          { id: 'lr-nh-1', text: '和王爷爷一起赶到外婆家', nextNodeId: 'lr-neighbor-rescue' },
          { id: 'lr-nh-2', text: '先让王爷爷去看看情况', nextNodeId: 'lr-neighbor-ahead' }
        ]
      },
      'lr-wait-in-tree': {
        id: 'lr-wait-in-tree',
        type: 'ending',
        content: '小红帽在树上等了很久很久，终于等到了路过的猎人。猎人把大灰狼赶走了，还把小红帽送到了外婆家。虽然有惊无险，但小红帽在树上冻得瑟瑟发抖，回家后感冒了好几天。不过她学会了一项新本领——爬树！',
        endingType: 'neutral',
        endingTitle: '树上的等待'
      },
      'lr-jump-tree': {
        id: 'lr-jump-tree',
        type: 'ending',
        content: '小红帽鼓起勇气往旁边的树上跳。可是距离太远了，她没有抓住树枝，重重地摔在了地上。她的腿摔断了，疼得昏了过去。等她醒来时，发现自己躺在医院里，爸爸妈妈和外婆都在床边守着她。虽然大家都很心疼她，但她的腿却留下了永久的残疾。',
        endingType: 'sad',
        endingTitle: '失足坠落'
      },
      'lr-keeper-help': {
        id: 'lr-keeper-help',
        type: 'ending',
        content: '森林看守人听到敲门声，立刻打开了门。他看到小红帽和她怀里的小兔子，还有后面追来的大灰狼，二话不说就拿起了猎枪。"砰！"大灰狼被吓跑了。看守人把她们送到了外婆家，还给了小兔子一些药治伤。小兔子康复后，成了小红帽的宠物，每天都陪伴着她。',
        endingType: 'happy',
        endingTitle: '小兔子的陪伴'
      },
      'lr-circle-house': {
        id: 'lr-circle-house',
        type: 'normal',
        content: '小红帽绕着小木屋跑，大灰狼也跟着绕。跑了几圈后，大灰狼被绳子绊倒了——那是看守人放在门口晾衣的绳子！小红帽趁机冲了进去。',
        choices: [
          { id: 'lr-ch-1', text: '让看守人帮忙', nextNodeId: 'lr-keeper-help' },
          { id: 'lr-ch-2', text: '把门闩上，躲在屋里', nextNodeId: 'lr-lock-house' }
        ]
      },
      'lr-throw-basket': {
        id: 'lr-throw-basket',
        type: 'normal',
        content: '小红帽抡起篮子砸向大灰狼，篮子里的蛋糕和葡萄酒撒了一地。大灰狼被砸得晕头转向，小红帽趁机逃跑了。',
        choices: [
          { id: 'lr-tb-1', text: '往大路上跑', nextNodeId: 'lr-run-to-road' },
          { id: 'lr-tb-2', text: '去找人帮忙', nextNodeId: 'lr-get-hunter' }
        ]
      },
      'lr-neighbor-rescue': {
        id: 'lr-neighbor-rescue',
        type: 'normal',
        content: '王爷爷和小红帽赶到外婆家，发现大灰狼正躺在床上。王爷爷抡起拐杖，狠狠地打了大灰狼几下，大灰狼惨叫着从窗户跳了出去，逃走了。外婆从衣柜里走了出来——原来她听到动静，早就躲起来了！',
        choices: [
          { id: 'lr-nr-1', text: '大家一起喝葡萄酒庆祝', nextNodeId: 'lr-happy-ending' },
          { id: 'lr-nr-2', text: '让王爷爷陪着她们待一会儿', nextNodeId: 'lr-safe-home' }
        ]
      },
      'lr-neighbor-ahead': {
        id: 'lr-neighbor-ahead',
        type: 'normal',
        content: '王爷爷先去了外婆家，小红帽在后面慢慢跟着。当她到达时，看到王爷爷正守在门口。"没事了，"王爷爷笑着说，"大灰狼被我打跑了，你外婆好好的呢。"',
        choices: [
          { id: 'lr-na-1', text: '进去和外婆团聚', nextNodeId: 'lr-happy-ending' },
          { id: 'lr-na-2', text: '谢谢王爷爷，然后自己陪外婆', nextNodeId: 'lr-safe-home' }
        ]
      },
      'lr-wait-inside': {
        id: 'lr-wait-inside',
        type: 'normal',
        content: '小红帽和外婆闩好门，躲在屋里。大灰狼在外面转了好几圈，想破门而入，可是门太结实了。他又想从窗户爬进来，可是小红帽和外婆用棍子把窗户顶住了。',
        choices: [
          { id: 'lr-wi-1', text: '等到大灰狼自己离开', nextNodeId: 'lr-safe-home' },
          { id: 'lr-wi-2', text: '大声呼救，看有没有人能听见', nextNodeId: 'lr-call-for-help' }
        ]
      },
      'lr-set-trap': {
        id: 'lr-set-trap',
        type: 'ending',
        content: '小红帽和外婆在门口挖了一个大坑，上面铺好草皮伪装。然后小红帽大声敲门："大灰狼，快开门！"大灰狼一听，兴奋地冲了出来——"扑通！"他掉进了坑里！祖孙俩用石头把坑填好，然后叫来猎人把大灰狼带走了。从此，小红帽和外婆学会了很多野外生存技巧，再也不怕大灰狼了。',
        endingType: 'happy',
        endingTitle: '智慧的陷阱'
      },
      'lr-hunter-rescue': {
        id: 'lr-hunter-rescue',
        type: 'normal',
        content: '猎人和小红帽冲进屋，大灰狼刚想反抗，猎人已经举起了猎枪。"砰！"大灰狼倒在了地上。猎人剪开大灰狼的肚子，外婆从里面安然无恙地走了出来！',
        choices: [
          { id: 'lr-hr-1', text: '往大灰狼肚子里塞石头，让他沉到井里', nextNodeId: 'lr-stones-well' },
          { id: 'lr-hr-2', text: '大家一起庆祝平安', nextNodeId: 'lr-happy-ending' }
        ]
      },
      'lr-wait-outside': {
        id: 'lr-wait-outside',
        type: 'normal',
        content: '小红帽在外面焦急地等着，很快就听到屋里传来一声枪响。过了一会儿，猎人扶着外婆走了出来。"没事了，大灰狼被打死了。"猎人说。',
        choices: [
          { id: 'lr-wo-1', text: '冲上去和外婆拥抱', nextNodeId: 'lr-happy-ending' },
          { id: 'lr-wo-2', text: '进屋看看大灰狼的下场', nextNodeId: 'lr-stones-well' }
        ]
      },
      'lr-water-attack': {
        id: 'lr-water-attack',
        type: 'normal',
        content: '小红帽从窗户泼进去一大桶冷水，大灰狼被淋得浑身湿透，眼睛也睁不开了。小红帽趁机冲进屋里，拉起外婆就往外跑。',
        choices: [
          { id: 'lr-wa-1', text: '去找猎人帮忙', nextNodeId: 'lr-get-hunter' },
          { id: 'lr-wa-2', text: '把门从外面锁上，把大灰狼困在里面', nextNodeId: 'lr-lock-outside' }
        ]
      },
      'lr-door-trap': {
        id: 'lr-door-trap',
        type: 'ending',
        content: '小红帽在门口布置好绳子陷阱，然后大声敲门："大灰狼，开门！我给你带了更多蛋糕！"大灰狼一听有吃的，兴奋地拉开门——"哗啦！"绳子套住了他的腿，把他倒挂在了房梁上！小红帽和外婆叫来了猎人，把大灰狼带走了。从那以后，聪明的小红帽成了森林里小有名气的"陷阱大师"。',
        endingType: 'happy',
        endingTitle: '陷阱大师'
      },
      'lr-throw-food': {
        id: 'lr-throw-food',
        type: 'normal',
        content: '小红帽抓起蛋糕和葡萄酒就往大灰狼脸上扔！蛋糕糊了大灰狼一脸，葡萄酒洒进了他的眼睛里。大灰狼什么也看不见了，小红帽趁机逃跑了。',
        choices: [
          { id: 'lr-tf-1', text: '跑到外面找人帮忙', nextNodeId: 'lr-escape' },
          { id: 'lr-tf-2', text: '趁机去救外婆', nextNodeId: 'lr-save-grandma' }
        ]
      },
      'lr-stuff-stones': {
        id: 'lr-stuff-stones',
        type: 'normal',
        content: '小红帽和外婆赶紧搬来好多大石头，往大灰狼肚子里塞，然后又把肚子缝上。大灰狼醒来后，觉得口渴，走到井边想喝水，结果肚子里的石头太重了，"扑通"一声掉进了井里！',
        choices: [
          { id: 'lr-ss-1', text: '看着大灰狼被淹死，然后回家', nextNodeId: 'lr-happy-ending' },
          { id: 'lr-ss-2', text: '叫猎人来处理', nextNodeId: 'lr-hunter-rescue' }
        ]
      },
      'lr-lock-house': {
        id: 'lr-lock-house',
        type: 'ending',
        content: '小红帽闩上门，和看守人一起待在屋里。大灰狼在外面转了一会儿，见没办法进去，只好悻悻地走了。第二天一早，看守人把小红帽安全送到了外婆家。虽然蛋糕和葡萄酒都洒了，但外婆看到小红帽平安归来，比什么都高兴。',
        endingType: 'happy',
        endingTitle: '看守人的庇护'
      },
      'lr-call-for-help': {
        id: 'lr-call-for-help',
        type: 'normal',
        content: '小红帽和外婆在屋里大声呼救。幸好有个猎人听到了喊声赶了过来。"砰！"他一枪打死了大灰狼。',
        choices: [
          { id: 'lr-ch2-1', text: '感谢猎人，大家一起庆祝', nextNodeId: 'lr-happy-ending' },
          { id: 'lr-ch2-2', text: '让猎人帮她们检查房子周围', nextNodeId: 'lr-safe-home' }
        ]
      },
      'lr-stones-well': {
        id: 'lr-stones-well',
        type: 'ending',
        content: '小红帽和外婆往大灰狼肚子里塞满了石头，然后把他扔进了井里。从此以后，森林里少了一只作恶多端的大灰狼。猎人夸小红帽是个勇敢聪明的孩子，还送给她一把小小的猎刀作为纪念。从那以后，小红帽每次出门都会带着猎刀，而且变得更加机智勇敢了。',
        endingType: 'happy',
        endingTitle: '勇敢的纪念'
      },
      'lr-happy-ending': {
        id: 'lr-happy-ending',
        type: 'ending',
        content: '小红帽和外婆紧紧拥抱在一起。她们拿出蛋糕和葡萄酒，和帮助她们的人一起分享。外婆的病很快就好了。经过这次历险，小红帽学到了宝贵的一课：既要善良，也要警惕；既要听大人的话，也要在危急时刻勇敢机智。从此以后，她成了一个既善良又聪明的姑娘，森林里的小动物们都喜欢她，大人们也都夸她是个好孩子。',
        endingType: 'happy',
        endingTitle: '圆满的结局'
      },
      'lr-safe-home': {
        id: 'lr-safe-home',
        type: 'ending',
        content: '大灰狼终于悻悻地离开了。小红帽和外婆确认安全后，拿出蛋糕和葡萄酒，一边吃一边聊天。外婆的心情好了很多，身体也恢复了不少。虽然过程惊险，但一切都结束了。小红帽平安地回了家，不过她心里暗暗发誓：以后出门再也不随便和陌生人说话，也不走小路了。',
        endingType: 'happy',
        endingTitle: '平安是福'
      },
      'lr-lock-outside': {
        id: 'lr-lock-outside',
        type: 'ending',
        content: '小红帽从外面把门锁上，把大灰狼困在了屋子里。然后她和外婆一起去找猎人。猎人赶来后，把大灰狼抓住带走了。祖孙俩回到家，享受着劫后余生的温馨时光。外婆吃了小红帽带来的蛋糕，身体很快就恢复了。小红帽也因为这次的机智表现，得到了全村人的夸奖。',
        endingType: 'happy',
        endingTitle: '智取大灰狼'
      },
      'lr-save-grandma': {
        id: 'lr-save-grandma',
        type: 'normal',
        content: '小红帽趁大灰狼看不见，赶紧跑到衣柜前，打开门——外婆果然躲在里面！"外婆，快跟我走！"她拉着外婆就往外跑。',
        choices: [
          { id: 'lr-sg-1', text: '往大路上跑，找人帮忙', nextNodeId: 'lr-escape' },
          { id: 'lr-sg-2', text: '躲进旁边的房间，锁上门', nextNodeId: 'lr-safe-home' }
        ]
      }
    }
  }
];
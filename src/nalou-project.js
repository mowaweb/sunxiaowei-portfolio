const works = [
  ['怎么打起来了，笑～闪身步花絮', '7691211648354356521', '00:16', true],
  ['闪身步还能这样玩', '7690852834274757898', '00:16', true],
  ['手机拿过来！', '7688965347268889898', '00:30', false],
  ['人间琴悠扬，姑娘把谁记心上', '7688552786522311946', '00:59', false],
  ['生活不易，娜楼卖艺', '7688278874140069166', '00:56', false],
  ['一直没找到好工作，直到被“绑架”｜我的甲方是只猫', '7687894255599127835', '02:47', false],
];

const clips = works.map(([title, postId, duration, portrait], index) => {
  const id = 'nalou-' + String(index + 1).padStart(2, '0');
  return {
    id, title, duration, portrait, stage: 'AI 短片',
    video: index === 5 ? './assets/virtual-idol.mp4' : './assets/' + id + '.mp4',
    image: './assets/' + id + '.webp',
    watchUrl: 'https://www.douyin.com/video/' + postId,
  };
});

export const nalouProject = {
  id: 'nalou',
  title: 'Nalou 娜楼 · 虚拟偶像',
  english: 'NALOU',
  category: 'personal',
  nature: '自营抖音账号',
  link: 'https://www.douyin.com/user/MS4wLjABAAAAxyQ0qaMHYivLWBKwihSqlZg2N1sPeUeW1An4ZKD1IeerjmaOTT6uFR6SWEXu8upi',
  tags: ['虚拟偶像', 'AI 短片'],
  description: '虚拟脱口秀演员娜楼的舞步、喜剧与剧情短片。',
  role: '虚拟脱口秀演员 · AI 影像创作',
  image: './assets/nalou-01.webp',
  video: clips[0].video,
  duration: clips[0].duration,
  clips,
  caseStudy: { kind: 'nalou' },
};

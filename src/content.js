import { additionalProjects } from './more-projects.js';
import { graphicProjects } from './graphic-projects.js';
import { friesArt } from './fries-art.js';
import { egretArt, egretCover } from './egret-art.js';
import { unihuiPanels } from './unihui-panels.js';
import { tmallElements } from './tmall-elements.js';
import { nalouProject } from './nalou-project.js';

export const profile = {
  name: '孙晓伟',
  alias: '阿丸',
  email: '13560469209@163.com',
  phone: '13560469209',
  portfolioUrl: 'https://www.yuque.com/mowan-ktbjt/hl9q0l/xgmmxefywzughdf5',
  resume: './assets/resume.pdf',
};

export const projects = [
  {
    id: 'drone',
    number: '01',
    title: '大疆 · 无人机产品视频',
    english: 'BEYOND THE FRAME',
    category: 'commercial',
    nature: '客户委托',
    tags: ['镜头设计', '三维 × AI'],
    duration: '00:10',
    image: './assets/drone-spotlight-cover.webp',
    video: './assets/drone.mp4',
    description: '根据客户需求，结合 C4D 预演、AI 生成与 AE 后期，完成无人机产品视频的相关镜头，包括旧款变新款、产品讲解、雪山转场及开场片段。',
    role: '镜头设计 · C4D 预演 · AI 生成 · AE 后期',
    link: 'https://www.bilibili.com/video/BV135hJ6WETi/',
    clips: [
      { id: 'drone-snow', title: '雪山转场', stage: '作品片段', duration: '00:10', video: './assets/drone.mp4', image: './assets/drone.webp' },
      { id: 'drone-opening', title: '开场镜头', stage: '作品片段', duration: '00:05', video: './assets/dji-opening.mp4', image: './assets/dji-opening.webp' },
      { id: 'drone-morph', title: '旧款变新款', stage: '三维 × AI', duration: '00:18', video: './assets/dji-model-morph-ai.mp4', image: './assets/dji-model-morph-ai.webp', versions: [
        { id: 'previz', label: '白膜预演', duration: '00:06', video: './assets/dji-model-morph-previz.mp4', image: './assets/dji-model-morph-previz.webp' },
        { id: 'ai', label: 'AI 生成', duration: '00:18', video: './assets/dji-model-morph-ai.mp4', image: './assets/dji-model-morph-ai.webp' },
      ] },
      { id: 'drone-explainer', title: '无人机讲解', stage: '三维 × AI', duration: '00:13', video: './assets/dji-explainer-ai.mp4', image: './assets/dji-explainer-ai.webp', versions: [
        { id: 'previz', label: '白膜预演', duration: '00:13', video: './assets/dji-explainer-previz.mp4', image: './assets/dji-explainer-previz.webp' },
        { id: 'ai', label: 'AI 生成', duration: '00:13', video: './assets/dji-explainer-ai.mp4', image: './assets/dji-explainer-ai.webp' },
      ] },
      { id: 'drone-compositing', title: 'AE 后期', stage: '后期片段', duration: '00:06', video: './assets/dji-compositing.mp4', image: './assets/dji-compositing.webp' },
    ],
  },
  {
    id: 'osmo',
    number: '02',
    title: '大疆 Osmo 360 II · 产品影像',
    english: 'A NEW PERSPECTIVE',
    category: 'commercial',
    nature: '客户委托',
    tags: ['产品影像', '三维 × AI'],
    duration: '00:13',
    image: './assets/osmo-cover.webp',
    video: './assets/osmo.mp4',
    description: '用 C4D 白膜预演规划相机登场的镜头，再用 AI 完成开场画面。制作片段还展示了电池容量对比、主角跟随、全景拼缝和文件分段动效。',
    role: '镜头设计 · C4D 预演 · 三维与 AI 制作 · AE 动效',
    link: 'https://www.bilibili.com/video/BV1NSgp6vEEV/',
    clips: [
      { id: 'osmo-opening', title: '产品开场', stage: '三维 × AI', duration: '00:13', video: './assets/osmo.mp4', image: './assets/osmo-cover.webp', versions: [
        { id: 'previz', label: '白膜预演', duration: '00:13', video: './assets/osmo-360-previz.mp4', image: './assets/osmo-360-previz.webp' },
        { id: 'ai', label: 'AI 生成', duration: '00:13', video: './assets/osmo.mp4', image: './assets/osmo-cover.webp' },
      ] },
      { id: 'osmo-battery', title: '电池容量对比', stage: '产品讲解', duration: '00:05', video: './assets/osmo-battery.mp4', image: './assets/osmo-battery.webp' },
      { id: 'osmo-tracking', title: '主角跟随', stage: '功能演示', duration: '00:04', video: './assets/osmo-tracking.mp4', image: './assets/osmo-tracking.webp' },
      { id: 'osmo-stitch', title: '全景拼缝', stage: 'AI 影像', duration: '00:05', video: './assets/osmo-stitch.mp4', image: './assets/osmo-stitch.webp' },
      { id: 'osmo-ae', title: '文件分段动效', stage: 'AE 后期', duration: '00:07', video: './assets/osmo-ae.mp4', image: './assets/osmo-ae.webp' },
    ],
  },
  {
    id: 'bambu-a1',
    number: '03',
    title: '拓竹 A1 · AI 产品影像',
    english: 'IDEAS TAKE SHAPE',
    category: 'commercial',
    nature: '产品项目',
    tags: ['产品表现', 'AI 影像'],
    duration: '00:10',
    image: './assets/bambu-frame.webp',
    video: './assets/bambu-frame.mp4',
    description: '围绕拓竹 A1 的产品展示与打印场景制作 AI 影像，涵盖机型切换、打印取件、创意摆件及比价运镜。这里展示本人制作的项目片段。',
    role: 'AI 影像制作 · 镜头设计',
    link: 'https://www.bilibili.com/video/BV19Z4b6gE7f/',
    autoAdvanceClips: true,
    clips: [
      { id: 'bambu-frame', title: '香蕉相框打印延时', stage: 'AI 影像', duration: '00:10', video: './assets/bambu-frame.mp4', image: './assets/bambu-frame.webp' },
      { id: 'bambu-banana', title: '天价香蕉', stage: 'AI 影像', duration: '00:05', video: './assets/bambu-banana.mp4', image: './assets/bambu-banana.webp' },
      { id: 'bambu-models', title: '机型展示', stage: 'AI 影像', duration: '00:09', video: './assets/bambu-a1.mp4', image: './assets/bambu-a1.webp' },
      { id: 'bambu-camera', title: '价格对比运镜', stage: '视觉片段', duration: '00:04', video: './assets/bambu-comparison-camera.mp4', image: './assets/bambu-comparison-camera.webp' },
      { id: 'bambu-dragon', title: '关节龙打印取件', stage: 'AI 影像', duration: '00:10', video: './assets/bambu-dragon.mp4', image: './assets/bambu-dragon.webp' },
      { id: 'bambu-sword', title: '剑柄打印取件', stage: 'AI 影像', duration: '00:10', video: './assets/bambu-sword.mp4', image: './assets/bambu-sword.webp' },
      { id: 'bambu-sculpture', title: '马克杯', stage: 'AI 影像', duration: '00:08', video: './assets/bambu-sculpture.mp4', image: './assets/bambu-sculpture.webp' },
    ],
  },
  {
    id: 'lotus',
    number: '04',
    title: '莲花汽车 · AI 角色与实拍融合',
    english: 'LIVE-ACTION × AI',
    category: 'commercial',
    nature: '品牌项目',
    tags: ['AI 角色设定', '实拍融合'],
    duration: '00:10',
    image: './assets/lotus-intro.webp',
    video: './assets/lotus-intro.mp4',
    description: '围绕莲花汽车创作 AI 角色与品牌影像，将生成角色融入实拍座舱、车友互动和合影镜头，同时完成品牌开场、人物登场与模型雕刻等创意片段。',
    role: 'AI 角色设定 · 生成式视觉特效 · 实拍融合',
    link: 'https://www.bilibili.com/video/BV1Untc6RETm/',
    characterSheet: {
      image: './assets/lotus-character-turnaround.webp',
      title: '人物三视图与面部特写',
      note: '根据客户创意需求，将莲花汽车创始人柯林·查普曼（Colin Chapman）的 AI 角色形象融入影片叙事。',
      alt: '莲花汽车项目 AI 角色设定，展示人物正面、侧面、背面全身视图和面部特写',
      width: 5404,
      height: 3040,
    },
    clips: [
      { id: 'lotus-intro', title: '品牌开场', stage: 'AI 影像', duration: '00:10', video: './assets/lotus-intro.mp4', image: './assets/lotus-intro.webp' },
      { id: 'lotus-character', title: '人物登场', stage: 'AI 影像', duration: '00:06', video: './assets/lotus-character.mp4', image: './assets/lotus-character.webp' },
      { id: 'lotus-clay', title: '模型雕刻', stage: 'AI 影像', duration: '00:08', video: './assets/lotus-clay.mp4', image: './assets/lotus-clay.webp' },
      { id: 'lotus-interior', title: '座舱镜头', stage: '实拍 × AI 角色融合', duration: '00:05', video: './assets/lotus-interior.mp4', image: './assets/lotus-interior.webp' },
      { id: 'lotus-drivers', title: '车友互动', stage: '实拍 × AI 角色融合', duration: '00:04', video: './assets/lotus-drivers.mp4', image: './assets/lotus-drivers.webp' },
      { id: 'lotus-group-photo', title: '车友合影', stage: '实拍 × AI 角色融合', duration: '00:04', video: './assets/lotus-group-photo.mp4', image: './assets/lotus-group-photo.webp' },
    ],
  },
  {
    id: 'phone-stand',
    medium: 'cg',
    number: '05',
    title: '手机支架 · 品牌宣传视频',
    english: 'FORM IN MOTION',
    category: 'commercial',
    nature: '客户委托',
    tags: ['三维制作', '产品表现'],
    duration: '00:30',
    image: './assets/phone-stand.webp',
    video: './assets/phone-stand.mp4',
    description: '以三维制作完成手机支架品牌宣传视频，用产品、材质与镜头运动组织画面。项目未使用 AI。',
    role: '三维视频制作',
  },
  {
    id: 'kongyiji',
    number: '06',
    title: '《孔乙己》· AI 叙事短片',
    english: 'A STORY REIMAGINED',
    category: 'personal',
    nature: '个人创作',
    tags: ['文学改编', 'AI 影像'],
    duration: '01:34',
    image: './assets/kongyiji.webp',
    video: './assets/kongyiji.mp4',
    description: '以《孔乙己》为基础进行 AI 短视频改编，探索角色、镜头与叙事表达。个人练习作品，独立创作。',
    role: '创意 · AI 制作 · 剪辑合成',
    portrait: true,
  },
  nalouProject,
  ...additionalProjects,
  ...graphicProjects,
].map((project, index) => {
  let item = project;
  if (project.id === 'graphic-tmall-snake') item = {
    ...project, image: './assets/tmall-snake-cover.webp',
    description: '天猫与小蛇的节庆动作、毛绒造型，以及灯笼、鞭炮、花生等新春元素。',
    clips: [...project.clips, ...tmallElements],
    caseStudy: { ...project.caseStudy, sections: [...project.caseStudy.sections, {
      kind: 'elements', title: '新春毛绒元素', english: 'LUNAR NEW YEAR / ELEMENTS',
      items: [...tmallElements.filter(item => item.wide), ...tmallElements.filter(item => !item.wide)]
    }] }
  };
  if (project.id === 'fries-challenge') item = {
    ...project, image: friesArt[0].image,
    clips: project.clips.map(clip => clip.video ? { ...clip, image: friesArt[0].image } : clip),
    caseStudy: { kind: 'fries', art: friesArt }
  };
  if (project.id === 'graphic-egret') item = {
    ...project, image: egretCover,
    caseStudy: { kind: 'poster', theme: 'egret', accent: '#c5d887', art: egretArt }
  };
  if (project.id === 'graphic-unihui') item = {
    ...project, image: './assets/unihui-rainbow-cover.webp',
    caseStudy: { ...project.caseStudy, kind: 'unihui', panels: unihuiPanels }
  };
  return { ...item, number: String(index + 1).padStart(2, '0') };
});

export const heroProjects = [
  { projectId: 'drone', label: '大疆无人机', caption: '雪山转场', video: './assets/hero.mp4', image: './assets/drone-spotlight-cover.webp' },
  { projectId: 'osmo', label: 'Osmo 360 II', caption: '全景相机影像', video: './assets/hero-osmo.mp4', image: './assets/osmo-cover.webp' },
  { projectId: 'bambu-a1', label: '拓竹 A1', caption: '创意打印影像', video: './assets/hero-bambu.mp4', image: './assets/hero-bambu.webp' },
  { projectId: 'lotus', label: '莲花汽车', caption: '品牌开场', video: './assets/hero-lotus.mp4', image: './assets/hero-lotus.webp' },
  { projectId: 'liweike-ar', label: '李未可', caption: '虚拟偶像宣发', video: './assets/hero-liweike.mp4', image: projects.find(project => project.id === 'liweike-ar').image },
].map(item => ({ ...item, project: projects.find(project => project.id === item.projectId) }));

export const experiences = [
  { period: '2025.05 — 至今', company: '自由设计', role: '三维 / AIGC 视频设计师', description: '承接产品视频、三维 KV 与 IP 视觉项目，对接客户需求，并组织 2—3 人协作完成相关制作。' },
  { period: '2024.01 — 2025.04', company: '诚伯信息 · 杭州', role: '3D 设计师', description: '服务淘宝买菜、天猫超市相关业务，完成三维视频、场景渲染与卡通 IP 制作。' },
  { period: '2022.06 — 2023.10', company: '杭州李未可科技', role: '3D 设计师', description: '参与虚拟偶像、产品宣发与 CG 视频制作，负责角色建模、绑定及场景搭建。' },
  { period: '2021.03 — 2022.04', company: '深圳迷你玩科技', role: '3D 设计师', description: '参与花小楼及迷你玩相关 CG 视频，承担三维场景搭建与镜头渲染工作。' },
  { period: '2019.11 — 2020.10', company: '中软国际科技服务', role: '视觉设计师', description: '参与天猫国际相关项目，制作 IP、三维场景、元素与动效。' },
  { period: '2018.08 — 2019.10', company: '广州傲澜生物科技', role: '平面设计师', description: '完成产品海报、效果图、品牌与活动视觉设计。' },
];

export const capabilities = [
  { id: '01', icon: 'cube', title: '三维视觉', english: '3D VISUAL DESIGN', text: '从建模、材质到灯光渲染，建立产品与场景的视觉质感。', tools: 'C4D / OCTANE / UE5' },
  { id: '02', icon: 'lens', title: '三维 × AI 制作', english: 'HYBRID PRODUCTION', text: '根据镜头需求结合三维与 AI，把创意推进到可交付的画面。', tools: '3D / AIGC / COMPOSITING' },
  { id: '03', icon: 'frames', title: '角色与叙事', english: 'CHARACTER & STORY', text: '从角色设计到镜头剪辑，持续探索 IP 动画与 AI 叙事短片。', tools: 'CHARACTER / ANIMATION / EDITING' },
  { id: '04', icon: 'nodes', title: '沟通与协作', english: 'CREATIVE COLLABORATION', text: '理解客户需求，拆分制作任务，组织小团队推进项目与交付。', tools: 'BRIEF / DIRECTION / DELIVERY' },
];

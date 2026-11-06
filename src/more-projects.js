// Additional work from the user's full Yuque portfolio. Source card indices preserve import coverage.
const source = 'https://www.yuque.com/mowan-ktbjt/hl9q0l/xgmmxefywzughdf5';
const videoAssets = {
  "19": {
    "id": "liweike-showreel",
    "video": "./assets/extra-liweike-showreel.mp4",
    "image": "./assets/liweike-orbit-cover.webp",
    "duration": "01:23",
    "portrait": false,
    "sourceCard": 19
  },
  "20": {
    "id": "liweike-clock",
    "video": "./assets/extra-liweike-clock.mp4",
    "image": "./assets/extra-liweike-clock.webp",
    "duration": "00:10",
    "portrait": false,
    "sourceCard": 20
  },
  "22": {
    "id": "liweike-ar-01",
    "video": "./assets/extra-liweike-ar-01.mp4",
    "image": "./assets/extra-liweike-ar-01.webp",
    "duration": "00:04",
    "portrait": false,
    "sourceCard": 22
  },
  "23": {
    "id": "liweike-ar-02",
    "video": "./assets/extra-liweike-ar-02.mp4",
    "image": "./assets/extra-liweike-ar-02.webp",
    "duration": "00:04",
    "portrait": false,
    "sourceCard": 23
  },
  "41": {
    "id": "brand-blindbox",
    "video": "./assets/maicai-local-blindbox.mp4",
    "image": "./assets/maicai-local-blindbox.webp",
    "duration": "00:30",
    "portrait": false,
    "sourceCard": 41
  },
  "49": {
    "id": "maicai-new-year",
    "video": "./assets/maicai-local-new-year.mp4",
    "image": "./assets/maicai-local-new-year.webp",
    "duration": "00:13",
    "portrait": true,
    "sourceCard": 49
  },
  "50": {
    "id": "maicai-platform",
    "video": "./assets/extra-maicai-platform.mp4",
    "image": "./assets/extra-maicai-platform.webp",
    "duration": "00:24",
    "portrait": true,
    "sourceCard": 50
  },
  "51": {
    "id": "maicai-splash",
    "video": "./assets/maicai-local-splash.mp4",
    "image": "./assets/maicai-local-splash.webp",
    "duration": "00:06",
    "portrait": true,
    "sourceCard": 51
  },
  "55": {
    "id": "fries-challenge",
    "video": "./assets/extra-fries-challenge.mp4",
    "image": "./assets/extra-fries-challenge.webp",
    "duration": "00:36",
    "portrait": false,
    "sourceCard": 55
  },
  "59": {
    "id": "robot-abyss",
    "video": "./assets/extra-robot-abyss.mp4",
    "image": "./assets/extra-robot-abyss.webp",
    "duration": "00:29",
    "portrait": false,
    "sourceCard": 59
  },
  "60": {
    "id": "render-challenge-02",
    "video": "./assets/extra-render-challenge-02.mp4",
    "image": "./assets/extra-render-challenge-02.webp",
    "duration": "00:12",
    "portrait": false,
    "sourceCard": 60
  }
};
const imageAssets = {
  "42": {
    "id": "source-image-42",
    "image": "./assets/extra-image-42.webp",
    "poster": "./assets/extra-image-42-cover.webp",
    "animated": false,
    "sourceCard": 42
  },
  "43": {
    "id": "source-image-43",
    "image": "./assets/extra-image-43.gif",
    "poster": "./assets/extra-image-43-cover.webp",
    "animated": true,
    "sourceCard": 43
  },
  "44": {
    "id": "source-image-44",
    "image": "./assets/extra-image-44.gif",
    "poster": "./assets/extra-image-44-cover.webp",
    "animated": true,
    "sourceCard": 44
  },
  "45": {
    "id": "source-image-45",
    "image": "./assets/extra-image-45.gif",
    "poster": "./assets/extra-image-45-cover.webp",
    "animated": true,
    "sourceCard": 45
  },
  "46": {
    "id": "source-image-46",
    "image": "./assets/extra-image-46.gif",
    "poster": "./assets/extra-image-46-cover.webp",
    "animated": true,
    "sourceCard": 46
  },
  "47": {
    "id": "source-image-47",
    "image": "./assets/extra-image-47.gif",
    "poster": "./assets/extra-image-47-cover.webp",
    "animated": true,
    "sourceCard": 47
  },
  "48": {
    "id": "source-image-48",
    "image": "./assets/extra-image-48.gif",
    "poster": "./assets/extra-image-48-cover.webp",
    "animated": true,
    "sourceCard": 48
  },
  "54": {
    "id": "source-image-54",
    "image": "./assets/extra-image-54.webp",
    "poster": "./assets/extra-image-54-cover.webp",
    "animated": false,
    "sourceCard": 54
  },
};
const V = (index, title, stage = '三维制作') => ({ ...videoAssets[index], title, stage });
const I = (index, title, stage = '项目画面') => ({ ...imageAssets[index], title, stage });
const still = (id, title, stage = '独立静帧') => ({ id, title, stage, image: `./assets/${id}.webp` });
const liweikeStills = [
  ['liweike-still-01', 'AR 眼镜 · 角色肖像'],
  ['liweike-still-02', '虚拟偶像 · 室内静帧'],
  ['liweike-still-03', '虚拟偶像 · DJ 特写'],
  ['liweike-still-04', '虚拟偶像 · 霓虹肖像'],
  ['liweike-still-05', '虚拟偶像 · 人物静帧'],
  ['liweike-still-06', 'AR 眼镜 · 角色造型'],
  ['liweike-still-07', '三人角色 · 动态场景'],
  ['liweike-still-08', '虚拟偶像 · 屋顶场景'],
  ['liweike-still-09', '虚拟偶像 · 场景特写'],
].map(([id, title]) => still(id, title));
const project = p => ({ category: 'commercial', medium: 'cg', ...p, image: p.image || p.clips[0].poster || p.clips[0].image, video: p.clips[0].video, duration: p.clips[0].duration || '', link: p.link || source, linkLabel: p.linkLabel || '查看原作品集' });

export const additionalProjects = [
  project({ id: 'liweike-ar', title: '李未可 · AR 眼镜与虚拟偶像宣发', english: 'AR × VIRTUAL IDOL', nature: '任职作品 · 李未可', tags: ['AR 眼镜', '虚拟偶像'], description: '李未可 AR 眼镜与虚拟偶像宣发项目，整合作品合集、角色片段、产品结构拆解与独立渲染静帧。', role: '建模 · 动画 · 产品与场景渲染', caseStudy: { kind: 'liweike' }, link: 'https://www.douyin.com/user/MS4wLjABAAAAKhZbQhmCoM7bgpTd5UbzvtzWB8JYKF0gmqQr4Ph_FTE?from_tab_name=main', linkLabel: '查看抖音视频主页', clips: [V(19, '宣发作品合集', '项目合集'), V(20, '虚拟偶像片段', '三维宣发'), V(22, 'AR 眼镜结构拆解 01', '产品动画'), V(23, 'AR 眼镜结构拆解 02', '产品动画'), ...liweikeStills] }),
  project({ id: 'maicai-blindbox', title: '淘宝买菜 × 天猫超市 · IP 与品牌动效', english: 'BRAND IN EVERYDAY MOTION', nature: '任职作品 · 诚伯信息', tags: ['IP 盲盒', '品牌动效'], description: '围绕品牌 IP 制作盲盒宣传、新年祝福、商家工作台与农场直发开屏动画，并延展系列静帧、动作与表情动图。', role: 'IP 设计 · C4D 动画与场景 · OC 渲染 · 运营动效', image: './assets/maicai-blindbox-family.webp', clips: [V(41, 'IP 盲盒宣传'), V(49, '新年祝福动画'), V(50, '商家工作台运营动效'), V(51, '农场直发开屏动画'), still('maicai-blindbox-design', '小飞鸡 · IP 盲盒设计', '项目画面'), still('maicai-blindbox-family', '小飞鸡 · 系列盲盒静帧', '项目画面'), I(42, '天猫超市 IP 动作延展'), I(43, '小吃货表情 01', '表情动图'), I(44, '小吃货表情 02', '表情动图'), I(45, '小吃货表情 03', '表情动图'), I(46, '小吃货表情 04', '表情动图'), I(47, '小吃货表情 05', '表情动图'), I(48, '小吃货表情 06', '表情动图')] }),
  project({ id: 'fries-challenge', title: '「整点薯条」· 三维角色动画', english: 'A LITTLE CHASE', category: 'personal', nature: '比赛作品', tags: ['角色动画', '三维比赛'], description: '围绕角色与薯条包装展开的三维动画创作，展示成片与制作过程。', role: '模型与场景贴图 · MAYA 动画 · UE 渲染', clips: [V(55, '整点薯条 · 动画与过程', '比赛作品'), I(54, '作品画面与制作流程')] }),
  project({ id: 'render-challenges', title: '世界渲染挑战 · 场景探索', english: 'WORLDS BEYOND THE FRAME', category: 'personal', nature: '比赛作品', tags: ['场景叙事', '三维渲染'], description: '以机械与遗迹场景探索空间、光线与镜头叙事，收录两组渲染挑战作品。', role: '三维场景与渲染', clips: [V(59, 'Robot Abyss', '渲染挑战'), V(60, '遗迹场景', '渲染挑战')] }),
].map(project => project.id === 'maicai-blindbox' ? { ...project, caseStudy: { kind: 'maicai' } } : project);

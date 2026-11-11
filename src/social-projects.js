import { socialAccounts } from './social-account-data.js';
import { socialMedia } from './social-media-data.js';

export const liweikeSocial = socialAccounts.liweike;
export const liweikeExtraClips = socialMedia.filter(clip => clip.project === 'liweike');

const hxlClips = socialMedia.filter(clip => clip.project === 'huaxiaolou');
export const huaxiaolouProject = {
  id: 'huaxiaolou',
  title: '花小楼 · 虚拟偶像与角色影像',
  english: 'HUAXIAOLOU / VIRTUAL IDOL',
  nature: '任职作品 · 迷你玩',
  category: 'commercial',
  medium: 'cg',
  tags: ['虚拟偶像', '三维角色'],
  description: '迷你世界花小楼相关项目，收录角色视频、虚拟偶像直播、平面与动态视觉，以及抖音发布界面与账号数据。',
  role: '项目参与：三维场景搭建与镜头渲染',
  image: './assets/hxl-cover.webp',
  video: hxlClips[0].video,
  duration: hxlClips[0].duration,
  clips: hxlClips,
  caseStudy: { kind: 'huaxiaolou' },
  social: socialAccounts.huaxiaolou,
  socialSummary: socialAccounts.huaxiaolou.summary,
  socialNote: '任职项目账号 · 据所提供的抖音历史截图',
  link: socialAccounts.huaxiaolou.url,
  linkLabel: '查看花小楼抖音主页',
};

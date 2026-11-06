export const egretCover = './assets/egret-plate-cover.webp';

const allArt = [
  {
    "id": "graphic-egret-01",
    "title": "三鸟叠叠乐",
    "stage": "IP 视觉延展",
    "image": "./assets/graphic-egret-01.webp",
    "width": 1080,
    "height": 1080,
    "plate": "./assets/egret-plate-01.webp",
    "plateWidth": 810,
    "plateHeight": 1080
  },
  {
    "id": "graphic-egret-02",
    "title": "叠叠乐 · 四视图",
    "stage": "IP 视觉延展",
    "image": "./assets/graphic-egret-02.webp",
    "width": 2500,
    "height": 1080,
    "plate": "./assets/egret-plate-02.webp",
    "plateWidth": 810,
    "plateHeight": 1080
  },
  {
    "id": "graphic-egret-03",
    "title": "白鹭 · 看书",
    "stage": "IP 视觉延展",
    "image": "./assets/graphic-egret-03.webp",
    "width": 1080,
    "height": 1080,
    "plate": "./assets/egret-plate-03.webp",
    "plateWidth": 810,
    "plateHeight": 1080
  },
  {
    "id": "graphic-egret-04",
    "title": "看书 · 多视图",
    "stage": "IP 视觉延展",
    "image": "./assets/graphic-egret-04.webp",
    "width": 2500,
    "height": 1080,
    "plate": "./assets/egret-plate-04.webp",
    "plateWidth": 810,
    "plateHeight": 1080
  },
  {
    "id": "graphic-egret-05",
    "title": "白鹭 · 喝茶",
    "stage": "IP 视觉延展",
    "image": "./assets/graphic-egret-05.webp",
    "width": 1080,
    "height": 1080,
    "plate": "./assets/egret-plate-05.webp",
    "plateWidth": 810,
    "plateHeight": 1080
  },
  {
    "id": "graphic-egret-06",
    "title": "喝茶 · 多视图",
    "stage": "IP 视觉延展",
    "image": "./assets/graphic-egret-06.webp",
    "width": 2500,
    "height": 800,
    "plate": "./assets/egret-plate-06.webp",
    "plateWidth": 810,
    "plateHeight": 1080
  },
  {
    "id": "graphic-egret-07",
    "title": "白鹭 · 喂鱼",
    "stage": "IP 视觉延展",
    "image": "./assets/graphic-egret-07.webp",
    "width": 1080,
    "height": 1080,
    "plate": "./assets/egret-plate-07.webp",
    "plateWidth": 810,
    "plateHeight": 1080
  },
  {
    "id": "graphic-egret-08",
    "title": "喂鱼 · 多视图",
    "stage": "IP 视觉延展",
    "image": "./assets/graphic-egret-08.webp",
    "width": 2500,
    "height": 1080,
    "plate": "./assets/egret-plate-08.webp",
    "plateWidth": 810,
    "plateHeight": 1080
  },
  {
    "id": "graphic-egret-09",
    "title": "角色设定与草图",
    "stage": "IP 视觉延展",
    "image": "./assets/graphic-egret-09.webp",
    "width": 3757,
    "height": 2020,
    "plate": "./assets/egret-plate-09.webp",
    "plateWidth": 810,
    "plateHeight": 1080
  }
];
// Begin with the cover pose, then show the other actions before the design sheets.
const exhibitOrder = ['07', '03', '05', '01', '09', '08', '04', '06', '02'];
export const egretArt = exhibitOrder.map(number => allArt.find(item => item.id === 'graphic-egret-' + number));

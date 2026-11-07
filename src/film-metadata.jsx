import React from 'react';

export const fullFilms = {
  drone: { title: '它竟然比我想象中更“野”', duration: '08:33', video: '/films/drone.mp4', views: 674103 },
  osmo: { title: '一代用户值得升级吗？大疆Osmo 360 II 全面实测', duration: '06:45', video: '/films/osmo.mp4', views: 1311541 },
  'bambu-a1': { title: '比游戏机便宜！拓竹 A1 用了一年后，说说它到底值不值得买？', duration: '05:52', video: '/films/bambu.mp4', views: 305893 },
  lotus: { title: '纽北老炮，让我重新理解了操控', duration: '10:44', video: '/films/lotus.mp4', views: 1267500 }
};
const checkedOn = '2026-11-06';
export function FilmViews({ film }) {
  return <span className="film-views"><b>B 站正片 · {film.views.toLocaleString('zh-CN')} 次播放</b><time dateTime={checkedOn}>截至 {checkedOn}</time></span>;
}

import React from 'react';
import './tencent-case.css';

const assets = './assets/';
const details = [
  { file: 'tencent-character.webp', width: 831, height: 684, label: '角色与燕子 · 画面细节', alt: '戴黄色帽子的棋牌角色乘坐蓝色燕子，手中提着红色灯笼。' },
  { file: 'tencent-swallow.webp', width: 944, height: 684, label: '燕子 · 多角度展示', alt: '蓝色燕子在飞行中的四个角度。' },
];
const posters = [
  { file: 'tencent-poster-luck.webp', width: 912, height: 1620, label: '开局迎好运 · 万事顺心意，出手即好牌', alt: '橙红色新年海报：棋牌角色与飞舞的纸牌，文案为万事顺心意，出手即好牌。' },
  { file: 'tencent-poster-craft.webp', width: 912, height: 1620, label: '开局迎好运 · 妙手似天成，一子成气运', alt: '橙红色新年海报：木质手掌托起棋子，云纹环绕，文案为妙手似天成，一子成气运。' },
];

function Artwork({ item, eager = false }) {
  return (
    <a className="tencent-artwork" href={`${assets}${item.file}`} target="_blank" rel="noreferrer" aria-label={`查看大图：${item.label}`}>
      <img src={`${assets}${item.file}`} alt={item.alt} width={item.width} height={item.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      <span className="tencent-zoom" aria-hidden="true">查看大图 ↗</span>
    </a>
  );
}

export default function TencentCaseStudy({ project }) {
  return (
    <article className="tencent-case">
      <header className="tencent-intro">
        <div className="tencent-heading">
          <div>
            <p className="tencent-eyebrow">新年海报项目</p>
            <h2 id="dialog-project-title">腾讯棋牌南京欢乐茶馆</h2>
            <p className="tencent-subtitle">主 KV 和系列海报</p>
            <span className="tencent-dash" aria-hidden="true" />
          </div>
          <p className="tencent-English" lang="en">KEY VISUAL<br />&amp; POSTERS</p>
        </div>
        <Artwork eager item={{ file: 'tencent-kv.webp', width: 2074, height: 1166, label: '欢乐金陵有新局 · 主视觉', alt: '欢乐金陵有新局主视觉：南京街巷建筑组成汉字，蓝色燕子载着棋牌角色掠过金色灯笼。' }} />
      </header>

      <section className="tencent-details" aria-label="角色与画面细节">
        {details.map(item => <Artwork key={item.file} item={item} />)}
      </section>

      <section className="tencent-posters" aria-labelledby="tencent-posters-title">
        <div className="tencent-section-heading">
          <h3 id="tencent-posters-title">新年系列海报</h3>
          <span lang="en">NEW YEAR SERIES</span>
        </div>
        <div className="tencent-poster-grid">
          {posters.map(item => <Artwork key={item.file} item={item} />)}
        </div>
      </section>

      <footer className="tencent-footer">
        <span>{project.tags.join(' / ')}</span>
        <a href={`${assets}tencent-case-board.webp`} target="_blank" rel="noreferrer">查看完整高清展板 ↗</a>
      </footer>
    </article>
  );
}

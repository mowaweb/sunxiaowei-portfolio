import React, { useState } from 'react';
import { friesArt } from './fries-art';
import './fries-case.css';

const board = './assets/fries-case-board.webp';
const extras = friesArt.filter(item => item.id === 'fries-character' || item.id === 'fries-production');

export default function FriesCaseStudy({ project, Player }) {
  const [rate, setRate] = useState(1);
  const film = project.clips.find(clip => clip.video);
  return (
    <article className="fries-case">
      <section className="fries-screen" aria-label="整点薯条 · 动画与制作过程">
        <Player project={project} clip={film} autoPlay playbackRate={rate} onPlaybackRateChange={setRate} />
      </section>
      <h2 id="dialog-project-title" className="fries-sr-only">{project.title}</h2>
      <a className="fries-board" href={board} target="_blank" rel="noreferrer" aria-label="打开整点薯条高清作品展板">
        <img src={board} alt="整点薯条原版作品展板，上方介绍角色与制作流程，下方依次展示便利店全景和蓝鸟走过店门的街景。"
          width="3000" height="3397" decoding="async" />
        <span aria-hidden="true">查看高清展板 ↗</span>
      </a>
      <details className="fries-supplement">
        <summary>角色造型与制作过程</summary>
        <div className="fries-supplement-grid">
          {extras.map(item => (
            <a key={item.id} href={item.image} target="_blank" rel="noreferrer" aria-label={`查看大图：${item.title}`}>
              <img src={item.image} width={item.width} height={item.height} loading="lazy" decoding="async" alt="" />
              <span>{item.title} ↗</span>
            </a>
          ))}
        </div>
        {project.link && <a className="fries-source" href={project.link} target="_blank" rel="noreferrer">{project.linkLabel || '查看原作品集'} ↗</a>}
      </details>
    </article>
  );
}

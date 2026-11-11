import React, { useState } from 'react';
import { PlayIcon } from './Icons';
import './xiguashuang-case.css';

const number = value => String(value).padStart(2, '0');

export default function XiguashuangCaseStudy({ project, Player }) {
  const [clipIndex, setClipIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const clips = project.clips.filter(clip => clip.video);
  const clip = clips[clipIndex];
  const art = project.caseStudy.art || [];

  return <article className="xigua-case">
    <section className="xigua-screen" aria-label="桂林三金西瓜霜 · 项目视频">
      <div className="xigua-screen-label">
        <span>桂林三金 · 西瓜霜</span>
        <span>本人负责：片尾 IP 角色绑定与动画</span>
      </div>
      <Player key={clip.id} project={project} clip={clip} autoPlay
        playbackRate={rate} onPlaybackRateChange={setRate}
        onEnded={project.autoAdvanceClips ? () => setClipIndex(index => Math.min(index + 1, clips.length - 1)) : undefined} />
      <div className="xigua-playlist-heading">
        <span>项目视频与动画过程</span>
        <span aria-live="polite" aria-atomic="true">{number(clipIndex + 1)} / {number(clips.length)}</span>
      </div>
      <div className="xigua-clip-list" role="group" aria-label="选择西瓜霜项目视频">
        {clips.map((item, index) => <button type="button" key={item.id}
          className={`xigua-clip${index === clipIndex ? ' is-active' : ''}`}
          aria-pressed={index === clipIndex}
          aria-label={`播放${item.title} · ${item.stage}`}
          onClick={() => setClipIndex(index)}>
          <span className="xigua-clip-image">
            <img src={item.poster || item.image} alt="" loading="lazy" decoding="async" />
            <span className="xigua-clip-play" aria-hidden="true"><PlayIcon /></span>
            <span className="xigua-clip-time">{item.duration}</span>
          </span>
          <span className="xigua-clip-title">{item.title}</span>
          <span className="xigua-clip-stage">{item.stage}</span>
        </button>)}
      </div>
    </section>

    <header className="xigua-intro">
      <div className="xigua-intro-title">
        <span className="xigua-kicker" lang="en">GUILIN SANJIN / CHARACTER ANIMATION</span>
        <h2 id="dialog-project-title">桂林三金<span>西瓜霜 · IP 角色动画</span></h2>
      </div>
      <div className="xigua-intro-copy">
        <p>参与桂林三金西瓜霜广告项目，负责片尾 IP 角色的绑定与动画制作。通过项目视频、动画过程与静帧画面，展示角色在品牌影像中的呈现。</p>
        <dl className="xigua-facts">
          <div><dt>本人职责</dt><dd>片尾 IP 角色绑定与动画</dd></div>
          <div><dt>项目类型</dt><dd>品牌 TVC / 角色动画</dd></div>
        </dl>
      </div>
    </header>

    {art.length > 0 && <section className="xigua-gallery" aria-labelledby="xigua-art-title">
      <header className="xigua-gallery-heading">
        <div><span className="xigua-kicker" lang="en">PROJECT VISUALS</span><h3 id="xigua-art-title">项目画面</h3></div>
        <span>品牌 · 产品 · IP 角色</span>
      </header>
      <div className="xigua-art-grid">
        {art.map((item, index) => <figure key={item.id} className={`xigua-art xigua-art--${item.layout || 'half'}`}>
          <a className="xigua-art-image" href={item.image} target="_blank" rel="noreferrer" aria-label={`查看原图：${item.title}`}>
            <img src={item.image} width={item.width} height={item.height} loading="lazy" decoding="async" alt={item.alt || item.title} />
          </a>
          <figcaption><span aria-hidden="true">{number(index + 1)}</span><strong>{item.title}</strong><span className="xigua-enlarge" aria-hidden="true">查看原图 ↗</span></figcaption>
        </figure>)}
      </div>
    </section>}
  </article>;
}

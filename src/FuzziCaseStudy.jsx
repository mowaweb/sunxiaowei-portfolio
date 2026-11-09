import React, { useRef, useState } from 'react';
import { fuzziArt, fuzziProcess } from './fuzzi-art';
import './fuzzi-case.css';

const number = value => String(value).padStart(2, '0');

function RenderImage({ item, index, process = false }) {
  return <figure className={process ? 'fuzzi-stage-render' : `fuzzi-art fuzzi-art--${item.layout || 'half'}`}>
    <a className="fuzzi-image-link" href={item.image} target="_blank" rel="noreferrer"
      aria-label={`查看原图：${item.title}${process ? ' · 阶段渲染' : ''}`}>
      <img src={item.image} width={item.width} height={item.height}
        loading="lazy" decoding="async" alt={item.description || item.title} />
    </a>
    <figcaption className="fuzzi-caption">
      {!process && <span className="fuzzi-number" aria-hidden="true">{number(index + 1)}</span>}
      <div><strong>{process ? '阶段渲染' : item.title}</strong>
        {!process && item.description && <p>{item.description}</p>}
      </div>
      <span className="fuzzi-enlarge" aria-hidden="true">原图 ↗</span>
    </figcaption>
  </figure>;
}

function ProcessPair({ item, index, project, Player }) {
  const [rate, setRate] = useState(1);
  const clip = {
    id: item.id,
    title: item.title,
    stage: '制作预演',
    video: item.video,
    image: item.poster,
    duration: item.duration,
    portrait: false,
  };
  return <section className="fuzzi-process-pair" aria-labelledby={`fuzzi-process-${item.id}`}>
    <header className="fuzzi-process-label">
      <span className="fuzzi-number" aria-hidden="true">{number(index + 1)}</span>
      <div><h4 id={`fuzzi-process-${item.id}`}>{item.title}</h4>
        {item.description && <p>{item.description}</p>}
      </div>
    </header>
    <div className="fuzzi-process-media">
      <figure className="fuzzi-previz">
        <Player project={project} clip={clip} autoPlay={false}
          playbackRate={rate} onPlaybackRateChange={setRate} />
        <figcaption className="fuzzi-caption"><strong>制作预演</strong><span>点击播放{item.duration ? ` · ${item.duration}` : ''}</span></figcaption>
      </figure>
      <RenderImage item={item} process />
    </div>
  </section>;
}

export default function FuzziCaseStudy({ project, Player }) {
  const [rate, setRate] = useState(1);
  const surface = useRef(null);
  const film = {
    id: `${project.id}-film`,
    title: 'Fuzzi 成片',
    stage: '三维产品影像',
    video: project.video,
    image: project.image,
    duration: '00:30',
    portrait: false,
  };
  function keepOneVideo(event) {
    if (event.target.tagName !== 'VIDEO') return;
    surface.current?.querySelectorAll('video').forEach(video => {
      if (video !== event.target && !video.paused) video.pause();
    });
  }
  return <article className="fuzzi-case" ref={surface} onPlayCapture={keepOneVideo}>
    <section className="fuzzi-screen" aria-label="Fuzzi · 三维产品影像成片">
      <Player project={project} clip={film} autoPlay
        playbackRate={rate} onPlaybackRateChange={setRate} />
    </section>

    <div className="fuzzi-editorial">
      <header className="fuzzi-intro">
        <div>
          <span className="fuzzi-kicker" lang="en">3D PRODUCT FILM</span>
          <h2 id="dialog-project-title">Fuzzi <span>· 三维产品影像</span></h2>
        </div>
        <div className="fuzzi-intro-copy">
          <p>以三维影像呈现 Fuzzi 产品的造型、材质与细节，结合动态成片与静帧渲染，展示产品的不同视角。</p>
          <dl className="fuzzi-facts">
            <div><dt>本人职责</dt><dd>建模 / 渲染</dd></div>
            <div><dt>制作内容</dt><dd>三维视频制作</dd></div>
          </dl>
        </div>
      </header>

      <section className="fuzzi-renders" aria-labelledby="fuzzi-renders-title">
        <header className="fuzzi-section-heading">
          <div><span className="fuzzi-kicker" lang="en">SELECTED RENDERS</span><h3 id="fuzzi-renders-title">精选渲染</h3></div>
          <span className="fuzzi-section-count">{number(fuzziArt.length)} 张静帧</span>
        </header>
        <div className="fuzzi-render-grid">
          {fuzziArt.map((item, index) => <RenderImage key={item.id} item={item} index={index} />)}
        </div>
      </section>

      <section className="fuzzi-process" aria-labelledby="fuzzi-process-title">
        <header className="fuzzi-section-heading">
          <div><span className="fuzzi-kicker" lang="en">WORK IN PROGRESS</span><h3 id="fuzzi-process-title">预演与阶段渲染</h3></div>
          <span className="fuzzi-section-count">{number(fuzziProcess.length)} 组过程</span>
        </header>
        <p className="fuzzi-process-note">预演与渲染来自不同迭代阶段，镜头节奏存在调整。</p>
        <div className="fuzzi-process-list">
          {fuzziProcess.map((item, index) => <ProcessPair key={item.id} item={item} index={index} project={project} Player={Player} />)}
        </div>
      </section>
    </div>
  </article>;
}

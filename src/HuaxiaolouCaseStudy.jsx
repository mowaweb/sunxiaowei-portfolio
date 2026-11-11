import React, { useRef, useState } from 'react';
import { PlayIcon } from './Icons';
import SocialAccountSection from './SocialAccountSection';
import './social-account.css';

const number = value => String(value).padStart(2, '0');
const groupNames = { film: '角色视频', live: '虚拟偶像直播', graphic: '平面与动态视觉' };

export default function HuaxiaolouCaseStudy({ project, Player }) {
  const clips = project.clips || [];
  const films = clips.filter(clip => clip.video);
  const stills = clips.filter(clip => !clip.video);
  const [selectedId, setSelectedId] = useState(films[0]?.id);
  const [group, setGroup] = useState('all');
  const [rate, setRate] = useState(1);
  const screen = useRef(null);
  const selected = films.find(clip => clip.id === selectedId) || films[0];
  const groups = ['film', 'live', 'graphic'].filter(key => films.some(clip => (clip.group || 'film') === key));
  const visibleFilms = group === 'all' ? films : films.filter(clip => (clip.group || 'film') === group);

  function selectFilm(clip, focusPlayer = false) {
    setSelectedId(clip.id);
    if (!focusPlayer) return;
    requestAnimationFrame(() => {
      screen.current?.focus({ preventScroll: true });
      screen.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  }

  function chooseGroup(nextGroup) {
    setGroup(nextGroup);
    if (nextGroup !== 'all' && (selected?.group || 'film') !== nextGroup) {
      const first = films.find(clip => (clip.group || 'film') === nextGroup);
      if (first) setSelectedId(first.id);
    }
  }

  function playNext() {
    if (!project.autoAdvanceClips) return;
    const index = visibleFilms.findIndex(clip => clip.id === selected?.id);
    if (index >= 0 && index < visibleFilms.length - 1) setSelectedId(visibleFilms[index + 1].id);
  }

  return <article className="hxl-case">
    <header className="hxl-opening">
      <div><span className="social-kicker" lang="en">HUAXIAOLOU / VIRTUAL IDOL</span><h2 id="dialog-project-title">花小楼<span>虚拟偶像与角色影像</span></h2></div>
      <p>{project.nature}<span>{films.length} 部视频 · {stills.length} 张项目画面</span></p>
    </header>

    {selected && <section className="hxl-screen" ref={screen} tabIndex="-1" aria-label={`正在播放：${selected.title}`}>
      <div className="hxl-screen-label"><h3>{selected.title}</h3><span>{selected.stage}</span></div>
      <Player key={selected.id} project={project} clip={selected} autoPlay playbackRate={rate} onPlaybackRateChange={setRate} onEnded={playNext} />
    </section>}

    {films.length > 0 && <section className="hxl-film-library" aria-labelledby="hxl-films-title">
      <div className="hxl-library-heading"><h3 id="hxl-films-title">项目视频</h3><span>{number(films.findIndex(clip => clip.id === selected?.id) + 1)} / {number(films.length)}</span></div>
      <div className="hxl-film-filters" role="group" aria-label="筛选项目视频">
        <button type="button" aria-pressed={group === 'all'} onClick={() => chooseGroup('all')}>全部视频 <small>{films.length}</small></button>
        {groups.map(key => <button type="button" key={key} aria-pressed={group === key} onClick={() => chooseGroup(key)}>{groupNames[key]} <small>{films.filter(clip => (clip.group || 'film') === key).length}</small></button>)}
      </div>
      <div className="hxl-film-grid">
        {visibleFilms.map(clip => <button type="button" className={`hxl-film${clip.id === selected?.id ? ' is-current' : ''}`} key={clip.id} onClick={() => selectFilm(clip, true)} aria-pressed={clip.id === selected?.id} aria-label={`播放${clip.title}，${clip.duration || clip.stage}`}>
          <span className={`hxl-film-image${clip.portrait ? ' is-portrait' : ''}`}>
            <img src={clip.poster || clip.image} alt="" loading="lazy" decoding="async" />
            <span className="hxl-play-icon" aria-hidden="true"><PlayIcon /></span>
            <span className="hxl-film-duration">{clip.duration}</span>
          </span>
          <strong>{clip.title}</strong><span className="hxl-film-stage">{clip.stage}</span>
          {clip.socialLikes && <span className="social-clip-likes">视频点赞 {clip.socialLikes}<small>据抖音历史截图</small></span>}
        </button>)}
      </div>
    </section>}

    <SocialAccountSection project={project} />

    {stills.length > 0 && <section className="hxl-art" aria-labelledby="hxl-art-title">
      <header className="social-section-heading"><div><span className="social-kicker" lang="en">VISUALS & BEHIND THE SCENES</span><h3 id="hxl-art-title">平面作品与直播现场</h3></div><p>{number(stills.length)} 张项目画面</p></header>
      <div className="hxl-art-grid">{stills.map(clip => <figure key={clip.id}>
        <a href={clip.image} target="_blank" rel="noreferrer" aria-label={`查看大图：${clip.title}`}><img src={clip.image} alt={clip.title} loading="lazy" decoding="async" width={clip.width} height={clip.height} /></a>
        <figcaption><strong>{clip.title}</strong><span>{clip.stage} ↗</span></figcaption>
      </figure>)}</div>
    </section>}

    <footer className="hxl-footer">
      {project.role && <div><span className="social-kicker" lang="en">MY CONTRIBUTION</span><p>{project.role}</p></div>}
      {project.link && <a href={project.link} target="_blank" rel="noreferrer">{project.linkLabel || '查看花小楼抖音主页'} ↗</a>}
    </footer>
  </article>;
}

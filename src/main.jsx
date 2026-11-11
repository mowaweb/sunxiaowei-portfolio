import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { EntranceHeading, useSectionEntrances } from './SectionEntrances';
import AWanIdentityCard from './AWanIdentityCard';
import PageAtmosphere from './PageAtmosphere';
import { capabilities, experiences, heroProjects, profile, projects } from './content';
import { nalouProject } from './nalou-project';
import NalouFilmRail from './NalouFilmRail';
import { FilmViews, fullFilms } from './film-metadata';
import { Arrow, PlayIcon } from './Icons';
import { coverMedia } from './responsive-media';
import './styles.css';
import './case-studies.css';
import './hero-slide.css';
import './hero-opening.css';
import './about-career.css';

function CapabilityIcon({ type }) {
  return <svg className="capability-icon" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    {type === 'cube' && <><path d="m50 10 35 20v40L50 90 15 70V30L50 10Z" /><path d="m15 30 35 20 35-20M50 50v40M32 20l35 20v40M15 50l35 20 35-20" opacity=".4" /><path d="M50 10v40L15 70m35-20 35 20" opacity=".25" /></>}
    {type === 'lens' && <><circle cx="50" cy="50" r="35" /><circle cx="50" cy="50" r="25" opacity=".4" /><circle cx="50" cy="50" r="12" /><path d="M50 5v12m0 66v12M5 50h12m66 0h12M18 18l9 9m46 46 9 9m0-64-9 9M27 73l-9 9" opacity=".6" /></>}
    {type === 'frames' && <><rect x="14" y="14" width="53" height="53" rx="2" opacity=".3" /><rect x="24" y="24" width="53" height="53" rx="2" opacity=".6" /><rect x="34" y="34" width="53" height="53" rx="2" /><path d="m52 48 18 12-18 12V48Z" /></>}
    {type === 'nodes' && <><path d="m26 28 48 10-18 39-30-49Zm0 0 30 49m18-39L26 28" opacity=".45" /><circle cx="26" cy="28" r="10" /><circle cx="74" cy="38" r="10" /><circle cx="56" cy="77" r="10" /><path d="m21 28 4 4 6-8m38 14h10M56 72v10m-5-5h10" /></>}
  </svg>;
}

function SectionLabel({ number, children }) {
  const [chinese, english] = children.split(' / ');
  return <div className="section-label section-entry-label"><span className="section-index">{number}</span>
    <span className="entrance-label-words"><span className="entrance-language-en" lang="en">{english}</span></span>
    <span className="entrance-language-zh">{chinese}</span><span className="label-rule" /></div>;
}

function Header({ active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let previous;
    const handle = () => {
      const next = window.scrollY > 30;
      if (next !== previous) { previous = next; setScrolled(next); }
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  const links = [{ id: 'about', label: '关于我', n: '01' }, { id: 'work', label: '精选作品', n: '02' }, { id: 'expertise', label: '我的能力', n: '03' }];
  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="header-inner shell">
      <a href="#home" className="brand" aria-label="孙晓伟作品集，返回首页" onClick={() => setOpen(false)}><span className="brand-symbol">s<span>×</span>w</span><span className="brand-caption">孙晓伟<br />DESIGN & MOTION</span></a>
      <nav className={`desktop-nav ${open ? 'is-open' : ''}`} aria-label="主导航" id="main-navigation">
        {links.map(link => <a key={link.id} href={`#${link.id}`} className={active === link.id ? 'active' : ''} aria-current={active === link.id ? 'location' : undefined} onClick={() => setOpen(false)}><span>{link.n}</span>{link.label}</a>)}
        <a className="mobile-contact" href="#contact" onClick={() => setOpen(false)}>联系我 <Arrow /></a>
      </nav>
      <a className="header-contact" href="#contact">聊聊你的想法 <Arrow /></a>
      <button className="menu-toggle" aria-label={open ? '关闭导航' : '打开导航'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span className={open ? 'opened' : ''} /><span className={open ? 'opened' : ''} /></button>
    </div>
  </header>;
}

// Each picture moves only inside its own bay. The two neighboring projects
// on either side cover any jump among five cyclic choices.
const heroWindows = [
  { side: 'left', bays: [1] }, { side: 'right', bays: [2, 3] },
];
const heroLayers = [-2, -1, 0, 1, 2];
const heroIndex = position => (position % heroProjects.length + heroProjects.length) % heroProjects.length;

function Hero({ onPlay, suspended = false }) {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .08 });
    observer.observe(sectionRef.current);
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  const [opening, setOpening] = useState(() =>
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    (!window.location.hash || window.location.hash === '#home')
  );
  useEffect(() => {
    if (!opening) return;
    const finish = () => setOpening(false);
    const timer = window.setTimeout(finish, 1750);
    window.addEventListener('hashchange', finish);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', finish);
    };
  }, [opening]);
  const [position, setPosition] = useState(0);
  const selectedIndex = heroIndex(position);
  const selectProject = index => setPosition(current => {
    const ahead = heroIndex(index - heroIndex(current));
    return current + (ahead > heroProjects.length / 2 ? ahead - heroProjects.length : ahead);
  });
  const selected = heroProjects[selectedIndex];
  const [playing, setPlaying] = useState(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      if (preference.matches) { setOpening(false); setPlaying(false); }
    };
    preference.addEventListener?.('change', onChange);
    return () => preference.removeEventListener?.('change', onChange);
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    let cancelled = false;
    if (inView && pageVisible && playing && !suspended) {
      video.play().catch(error => { if (!cancelled && error.name !== 'AbortError') setPlaying(false); });
    } else video.pause();
    return () => { cancelled = true; video.pause(); };
  }, [inView, pageVisible, playing, selected.projectId, suspended]);
  return <section className="hero hero-editorial" id="home" ref={sectionRef} data-opening={opening || undefined}
    data-motion-active={inView && pageVisible && playing && !suspended}
    onFocusCapture={opening ? () => setOpening(false) : undefined}
    onPointerDownCapture={opening ? () => setOpening(false) : undefined} aria-label="孙晓伟个人作品集首页">
    <div className="hero-media"><video key={selected.projectId} ref={videoRef} src={selected.video} poster={selected.image} muted playsInline preload="none" aria-hidden="true" onEnded={() => { if (playing && !suspended) setPosition(current => current + 1); }} onError={() => setPlaying(false)} /><div className="hero-shade" /></div>
    <div className="hero-grid" aria-hidden="true" />
    <div className="hero-content shell">
      <div className="hero-eyebrow"><span className="status-dot" /><span>孙晓伟 / SUN XIAOWEI</span><span className="eyebrow-separator">—</span><span>独立视觉创作者</span></div>
      <div className="hero-title-block"><span className="hero-project-kicker">CREATIVE MOTION / {String(selectedIndex + 1).padStart(2, '0')} · {selected.label}</span>
      <h1 aria-label="让想象，成为画面。">
        <span className="hero-heading-line"><span className="hero-heading-ink">让想象，</span></span>
        <span className="hero-heading-line"><span className="hero-heading-ink">成为<span className="hero-emphasis">画面<svg viewBox="0 0 340 25" preserveAspectRatio="none" aria-hidden="true"><path d="M2 16C105-1 243 0 337 6M14 23c83-9 207-10 307-8" /></svg></span>。</span></span>
      </h1>
      <div className="hero-intro"><p>以三维为基础，和 AI 一起拓展视觉的边界。<br />专注品牌产品视频、角色动画与创意影像。</p><span className="hero-discipline">3D · AIGC · MOTION</span></div>
      </div>
      <div className="hero-preview-stage hero-slide-stage" role="group" aria-label="接下来的视频项目">
        {heroWindows.map(({ side, bays }) => <div key={side}
          className={`hero-slide-window hero-slide-window-${side}`}>
          {bays.map(bay => <div key={bay} className="hero-slide-bay" data-bay={bay}>
          {heroLayers.map(layer => {
          const sequence = position + bay + layer;
          const index = heroIndex(sequence);
          const item = heroProjects[index];
          const visible = layer === 0;
          return <button key={sequence} type="button" data-slot={layer} data-project={item.projectId}
            className={`hero-slide-card${visible ? ' hero-project-preview' : ''}`}
            style={{ '--hero-side': Math.sign(layer) }}
            tabIndex={visible ? 0 : -1} aria-hidden={!visible || undefined} aria-label={visible ? `预览${item.label}` : undefined}
            onClick={event => {
              if (!visible) return;
              if (!event.detail) sectionRef.current?.querySelectorAll('.hero-project-choice')[index]?.focus({ preventScroll: true });
              selectProject(index);
            }}>
            <img src={item.previewImage || item.image} alt="" width="320" height="180" decoding="async" draggable="false" />
            <span><small>{String(index + 1).padStart(2, '0')} /</small>{item.label}<span aria-hidden="true">↗</span></span>
          </button>;
        })}
          </div>)}
        </div>)}
      </div>
      <div className="hero-actions"><a className="button button-light" href="#work">探索精选作品 <Arrow direction="down" /></a><button className="text-play" onClick={() => onPlay(selected.project)} aria-label={`播放${selected.project.title}`}><span className="play-ring"><PlayIcon /></span>播放当前项目<span className="play-length">{selected.project.duration}</span></button></div>
      <div className="hero-switcher">
        <div className="hero-switcher-heading"><span>{playing ? '自动连播 · 点击切换项目' : '点击切换项目'}</span><span aria-live="polite" aria-atomic="true">{String(selectedIndex + 1).padStart(2, '0')} / {String(heroProjects.length).padStart(2, '0')} · {selected.label}</span></div>
        <div className="hero-projects" role="group" aria-label="切换首页视频项目">{heroProjects.map((item, index) => <button type="button" className="hero-project-choice" key={item.projectId} aria-pressed={selectedIndex === index} aria-label={`切换首页视频：${item.label}`} onClick={() => selectProject(index)}><span>{item.label}</span></button>)}</div>
      </div>
    </div>
    <div className="hero-bottom shell"><a className="scroll-cue" href="#about"><span className="scroll-line" /><span>向下探索<br /><small>SCROLL TO DISCOVER</small></span></a><div className="hero-frame-label"><span className="tiny-cross">+</span><span>画面选自 / {selected.label} · {selected.caption}<br /><small>VISUAL & MOTION DESIGN BY SUN XIAOWEI</small></span></div><button className="background-control" onClick={() => setPlaying(current => !current)} aria-label={playing ? '暂停背景视频' : '播放背景视频'} title={playing ? '暂停背景视频' : '播放背景视频'}>{playing ? <span className="pause-icon"><i /><i /></span> : <PlayIcon />}<span>{playing ? 'PAUSE' : 'PLAY'}</span></button></div>
  </section>;
}

function Experience() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? experiences : experiences.slice(0, 3);
  return <section className="career-history" aria-labelledby="career-history-title">
    <header className="career-history-heading">
      <div><span lang="en">CAREER PATH</span><h3 id="career-history-title">工作经历</h3></div>
      <a href={profile.resume} download="孙晓伟简历.pdf">下载简历 <Arrow /></a>
    </header>
    <ol className="career-timeline" id="career-timeline">
      {visible.map(item => <li className="career-stop" key={item.company}>
        <span className="career-period">{item.period}</span>
        <h4>{item.company}</h4>
        <span className="career-role">{item.role}</span>
        <p>{item.description}</p>
      </li>)}
    </ol>
    {experiences.length > 3 && <button type="button" className="career-expand" aria-expanded={expanded} aria-controls="career-timeline"
      onClick={() => setExpanded(value => !value)}>{expanded ? '收起早期经历' : '查看早期经历'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>}
  </section>;
}

const accountProject = projects.find(project => project.id === nalouProject.id);
const selectedProjects = projects.filter(project => project.id !== nalouProject.id);

function About({ onCopy, onOpen, suspended = false }) {
  const openNalou = () => onOpen(accountProject);
  return <section className="about section shell" id="about">
    <SectionLabel number="01">个人经历 / WORK EXPERIENCE</SectionLabel>
    <div className="about-layout career-profile">
      <AWanIdentityCard />
      <div className="career-copy">
        <span className="career-kicker" lang="en">ABOUT ME</span>
        <EntranceHeading>Hi，我是{profile.name}。</EntranceHeading>
        <p className="career-bio">也可以叫我{profile.alias}。从三维场景与角色制作，到品牌产品视频与 AI 短片，我喜欢把一个想法变成有质感、有叙事的画面。</p>
        <p className="career-bio">做客户项目，也独立创作。用三维控制画面，用 AI 探索可能，让创意落到最后一帧。</p>
        <dl className="career-facts">
          <div><dt>当前身份</dt><dd>独立视觉创作者</dd></div>
          <div><dt>服务方向</dt><dd>品牌影像 / 三维 / AI</dd></div>
          <div><dt>手机</dt><dd><button type="button" onClick={() => onCopy(profile.phone, '电话号码')} aria-label={'复制电话号码 ' + profile.phone}>{profile.phone} <span aria-hidden="true">⧉</span></button></dd></div>
          <div><dt>邮箱</dt><dd><a href={'mailto:' + profile.email}>{profile.email} ↗</a></dd></div>
        </dl>
        <dl className="career-counts">
          <div><dt>精选项目</dt><dd>{selectedProjects.length}<small> 项</small></dd></div>
          <div><dt>商业视频</dt><dd>{selectedProjects.filter(p => p.category === 'commercial').length}<small> 项</small></dd></div>
          <div><dt>平面 / IP</dt><dd>{selectedProjects.filter(p => p.category === 'graphic').length}<small> 项</small></dd></div>
        </dl>
        <div className="career-fields" aria-label="创作领域"><span>产品影像</span><span>角色动画</span><span>AI 叙事短片</span></div>
      </div>
    </div>
    <Experience />
    <div className="account-stats" role="group" aria-label="作品与自营账号数据">
      <NalouFilmRail project={accountProject} onSelect={index => onOpen(accountProject, index)} suspended={suspended}>
        <div className="stats-strip">
          <div><strong>{String(selectedProjects.length).padStart(2, '0')}<span> /</span></strong><span>精选项目案例</span></div>
          <button type="button" onClick={openNalou}><strong>48</strong><span>自营账号作品</span></button>
          <button type="button" onClick={openNalou}><strong>6,204</strong><span>自营账号粉丝</span></button>
          <button type="button" onClick={openNalou}><strong>10<span>万+</span></strong><span>多条作品播放量</span></button>
          <time dateTime="2026-11-06">抖音数据截至 2026.11.06</time>
        </div>
      </NalouFilmRail>
    </div>
  </section>;
}

function ProjectCard({ project, onOpen }) {
  const cover = coverMedia[project.image];
  const videoCount = project.clips?.filter(clip => clip.video).length;
  const countLabel = project.contentLabel || (project.clips ? videoCount ? `${videoCount} 段视频` : `${project.clips.length} 组画面` : project.duration);
  const action = project.video ? '播放' : '查看';
  return <button data-project={project.id} className={`project-card ${project.featured ? 'featured' : ''} ${project.portrait ? 'portrait-project' : ''} ${project.category === 'graphic' ? 'graphic-project' : ''}`} onClick={() => onOpen(project)} aria-label={`${action}${project.title}`}>
    <div className="project-art"><img {...cover} src={cover?.src || project.image} sizes="(max-width: 640px) 50vw, (max-width: 1812px) 48vw, 836px" alt={project.title + '作品画面'} loading="lazy" decoding="async" />{project.portrait && <div className="portrait-cover-type" aria-hidden="true"><span>AI SHORT FILM</span><strong>孔乙己</strong><small>一个熟悉的故事，<br />一次新的影像表达。</small></div>}<div className="project-shade" /><div className="project-topline"><span>{project.number} / {project.nature}</span><span className="project-duration">{project.video ? <PlayIcon /> : <Arrow />}{fullFilms[project.id] ? '正片 + ' : ''}{countLabel}</span></div><div className="project-art-footer"><span>{project.english}</span><span className="project-open"><Arrow /></span></div>{project.featured && <div className="featured-title"><span>三维 × AI · 产品影像制作</span><strong>越过想象的边界。</strong></div>}<span className="project-hover-play">{project.video ? <PlayIcon /> : <Arrow />}{action}作品</span></div>
    <div className="project-meta"><h3>{project.title}</h3><div>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
    {fullFilms[project.id] && <FilmViews film={fullFilms[project.id]} />}
  </button>;
}

function matchesProjectFilter(project, filter) {
  return filter === 'all' || (filter === 'cg' ? project.medium === 'cg' : project.category === filter);
}

function Work({ onOpen }) {
  const [filter, setFilter] = useState('all');
  const filters = [{ id: 'all', name: '全部作品' }, { id: 'commercial', name: '商业视频' }, { id: 'cg', name: '三维 / CG' }, { id: 'graphic', name: '平面 / IP' }, { id: 'personal', name: '个人创作' }].map(filter => ({ ...filter, count: String(selectedProjects.filter(project => matchesProjectFilter(project, filter.id)).length).padStart(2, '0') }));
  const visible = selectedProjects.filter(project => matchesProjectFilter(project, filter));
  return <section className="work section shell" id="work">
    <SectionLabel number="02">精选作品 / SELECTED WORK</SectionLabel>
    <div className="section-heading work-heading"><EntranceHeading>画面，是最好的表达<span className="accent">。</span></EntranceHeading><p>商业制作与个人探索，<br />每一帧，都有自己的来处。</p></div>
    <div className="work-toolbar"><div className="project-filters" aria-label="筛选作品">{filters.map(f => <button key={f.id} aria-pressed={filter === f.id} className={filter === f.id ? 'selected' : ''} onClick={() => setFilter(f.id)}>{f.name}<sup>{f.count}</sup></button>)}</div><span className="work-note">SELECTED FRAMES, SELECTED STORIES.</span></div>
    <div className="project-grid" key={filter}>{visible.map(project => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div>
    <div className="work-bottom"><span>还有更多画面，正在发生。</span><a className="inline-link" href={profile.portfolioUrl} target="_blank" rel="noreferrer">查看完整作品档案 <Arrow /></a></div>
  </section>;
}

function Expertise() {
  return <section className="expertise-wrap" id="expertise"><div className="expertise section shell"><SectionLabel number="03">我的能力 / EXPERTISE</SectionLabel><div className="expertise-layout"><div className="expertise-intro"><EntranceHeading>从一个念头，<br />到最后一帧<span className="accent">。</span></EntranceHeading><p>创意、制作、沟通。<br />让它们在同一条线上，向前走。</p><div className="expertise-signature"><span className="signature-mark">s×w</span><span>IDEA TO IMAGE.<br />FRAME BY FRAME.</span></div></div><div className="capabilities-grid">{capabilities.map(cap => <article className="capability-card" key={cap.id}><div className="capability-top"><span>{cap.id} /</span><CapabilityIcon type={cap.icon} /></div><span className="capability-english">{cap.english}</span><h3>{cap.title}</h3><p>{cap.text}</p><div className="capability-tools">{cap.tools}</div></article>)}</div></div></div></section>;
}

function Contact({ onCopy }) {
  return <section className="contact" id="contact"><div className="contact-inner shell"><SectionLabel number="04">保持联系 / CONTACT</SectionLabel><div className="contact-lead"><div className="contact-eyebrow"><span className="status-dot" />关于工作、项目，或一个新想法。</div><EntranceHeading>下一个画面，<br />一起<span className="accent">创造</span>。</EntranceHeading><a className="contact-orb" href={`mailto:${profile.email}`} aria-label="发送邮件联系孙晓伟"><Arrow /></a></div><div className="contact-actions"><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a><button className="copy-email" onClick={() => onCopy(profile.email, '邮箱地址')} aria-label="复制邮箱地址"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M15 8V4H4v11h4" stroke="currentColor" strokeWidth="1.4" /></svg></button></div><div className="contact-secondary"><div><span>电话 / PHONE</span><button onClick={() => onCopy(profile.phone, '电话号码')}>+86 {profile.phone} <span aria-hidden="true">⧉</span></button></div><div><span>作品 / ARCHIVE</span><a href={profile.portfolioUrl} target="_blank" rel="noreferrer">语雀作品档案 <Arrow /></a></div><div><span>简历 / RÉSUMÉ</span><a href={profile.resume} download="孙晓伟简历.pdf">下载个人简历 <Arrow direction="down" /></a></div></div><footer className="footer"><a className="footer-brand" href="#home">孙晓伟 <span>SUN XIAOWEI</span></a><span>© {new Date().getFullYear()} · DESIGN IN MOTION</span><a href="#home">返回顶部 <Arrow /></a></footer></div></section>;
}

const ProjectContent = lazy(() => import('./ProjectContent'));

class ProjectLoadBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="project-loading" role="alert"><p>作品暂时未能加载，请刷新后重试。</p><button type="button" onClick={() => window.location.reload()}>刷新页面</button></div>;
    return this.props.children;
  }
}

function ProjectDialog({ project, initialClipIndex = 0, onClose, onChange }) {
  const ref = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [project?.id]);
  useEffect(() => {
    if (!project) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    closeButton.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [Boolean(project)]);
  if (!project) return null;
  const index = projects.findIndex(p => p.id === project.id);
  const caseKind = project.caseStudy?.kind;
  const caseClass = { tencent: 'tencent-dialog', xiguashuang: 'xiguashuang-dialog', fuzzi: 'fuzzi-dialog', fries: 'fries-case-dialog', ip: 'ip-case-dialog', nalou: 'nalou-dialog', liweike: 'lw-dialog', poster: 'poster-dialog', unihui: 'unihui-dialog' }[caseKind] || '';
  return <dialog className={`project-dialog ${caseKind ? 'case-dialog' : ''} ${caseClass}`} ref={ref} aria-label={project.title} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="dialog-content">
      <div className="dialog-heading"><span>SELECTED WORK / {project.number}</span><button ref={closeButton} className="dialog-close" onClick={onClose} aria-label="关闭作品视频"><span>关闭</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.5" /></svg></button></div>
      <ProjectLoadBoundary key={project.id}>
        <Suspense fallback={<p className="project-loading" role="status">正在打开作品…</p>}>
          <ProjectContent project={project} initialClipIndex={initialClipIndex} />
        </Suspense>
      </ProjectLoadBoundary>
      <div className="dialog-pagination"><button onClick={() => onChange(projects[(index - 1 + projects.length) % projects.length])}>← 上一个作品</button><span>{project.number} / {String(projects.length).padStart(2, '0')}</span><button onClick={() => onChange(projects[(index + 1) % projects.length])}>下一个作品 →</button></div>
    </div>
  </dialog>;
}

function App() {
  const [selection, setSelection] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    const project = projects.find(item => item.id === query.get('project')) || null;
    const clipIndex = project?.clips?.findIndex(clip => clip.id === query.get('clip')) ?? -1;
    return { project, clipIndex: Math.max(0, clipIndex) };
  });
  const project = selection.project;
  useSectionEntrances(Boolean(project));
  function setProject(next, clipIndex = 0) {
    const url = new URL(window.location.href);
    if (next) url.searchParams.set('project', next.id);
    else url.searchParams.delete('project');
    const clip = next?.clips?.[clipIndex];
    if (next?.caseStudy?.kind === 'nalou' && clip) url.searchParams.set('clip', clip.id);
    else url.searchParams.delete('clip');
    window.history.replaceState(window.history.state, '', url);
    setSelection({ project: next, clipIndex: clip ? clipIndex : 0 });
  }
  const [active, setActive] = useState('home');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.isIntersecting);
      if (entry) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('#home, #about, #work, #expertise, #contact').forEach(section => observer.observe(section));
    return () => { observer.disconnect(); clearTimeout(toastTimer.current); };
  }, []);
  const copy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast(`${label}已复制`);
    } catch {
      setToast(`${label}：${value}`);
    }
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3200);
  };
  return <>
    <a className="skip-link" href="#main-content">跳到主要内容</a>
    <Header active={active} />
    <main id="main-content">
      <Hero onPlay={setProject} suspended={Boolean(project)} />
      <div className="below-hero">
        <PageAtmosphere suspended={Boolean(project)} />
        <About onCopy={copy} onOpen={setProject} suspended={Boolean(project)} />
        <Work onOpen={setProject} />
        <Expertise />
        <Contact onCopy={copy} />
      </div>
    </main>
    <ProjectDialog project={project} initialClipIndex={selection.clipIndex} onClose={() => setProject(null)} onChange={setProject} />
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast && <><span>✓</span>{toast}</>}</div>
  </>;
}

const root = import.meta.hot?.data.root ?? createRoot(document.getElementById('root'));
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<React.StrictMode><App /></React.StrictMode>);

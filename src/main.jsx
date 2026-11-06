import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { capabilities, experiences, profile, projects } from './content';
import './styles.css';

function Arrow({ direction = 'up', ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props} style={{ transform: direction === 'down' ? 'rotate(90deg)' : direction === 'right' ? 'rotate(45deg)' : undefined, ...props.style }}><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function PlayIcon() {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 4 9 6-9 6V4Z" fill="currentColor" /></svg>;
}

function CapabilityIcon({ type }) {
  return <svg className="capability-icon" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    {type === 'cube' && <><path d="m50 10 35 20v40L50 90 15 70V30L50 10Z" /><path d="m15 30 35 20 35-20M50 50v40M32 20l35 20v40M15 50l35 20 35-20" opacity=".4" /><path d="M50 10v40L15 70m35-20 35 20" opacity=".25" /></>}
    {type === 'lens' && <><circle cx="50" cy="50" r="35" /><circle cx="50" cy="50" r="25" opacity=".4" /><circle cx="50" cy="50" r="12" /><path d="M50 5v12m0 66v12M5 50h12m66 0h12M18 18l9 9m46 46 9 9m0-64-9 9M27 73l-9 9" opacity=".6" /></>}
    {type === 'frames' && <><rect x="14" y="14" width="53" height="53" rx="2" opacity=".3" /><rect x="24" y="24" width="53" height="53" rx="2" opacity=".6" /><rect x="34" y="34" width="53" height="53" rx="2" /><path d="m52 48 18 12-18 12V48Z" /></>}
    {type === 'nodes' && <><path d="m26 28 48 10-18 39-30-49Zm0 0 30 49m18-39L26 28" opacity=".45" /><circle cx="26" cy="28" r="10" /><circle cx="74" cy="38" r="10" /><circle cx="56" cy="77" r="10" /><path d="m21 28 4 4 6-8m38 14h10M56 72v10m-5-5h10" /></>}
  </svg>;
}

function SectionLabel({ number, children }) {
  return <div className="section-label"><span className="section-index">{number}</span><span>{children}</span><span className="label-rule" /></div>;
}

function Header({ active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 30);
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

function Hero({ onPlay }) {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [playing, setPlaying] = useState(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const video = videoRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && playing) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.08 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [playing]);
  const toggle = () => {
    const video = videoRef.current;
    if (playing) { video.pause(); setPlaying(false); }
    else video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  return <section className="hero" id="home" ref={sectionRef} aria-label="孙晓伟个人作品集首页">
    <div className="hero-media"><video ref={videoRef} src="./assets/hero.mp4" poster="./assets/drone.webp" muted loop playsInline preload="auto" aria-hidden="true" /><div className="hero-shade" /></div>
    <div className="hero-grid" aria-hidden="true" />
    <div className="hero-content shell">
      <div className="hero-eyebrow"><span className="status-dot" /><span>孙晓伟 / SUN XIAOWEI</span><span className="eyebrow-separator">—</span><span>独立视觉创作者</span></div>
      <h1>让想象，<br />成为<span className="hero-emphasis">画面<svg viewBox="0 0 340 25" preserveAspectRatio="none" aria-hidden="true"><path d="M2 16C105-1 243 0 337 6M14 23c83-9 207-10 307-8" /></svg></span>。</h1>
      <div className="hero-intro"><p>以三维为基础，和 AI 一起拓展视觉的边界。<br />专注品牌产品视频、角色动画与创意影像。</p><span className="hero-discipline">3D · AIGC · MOTION</span></div>
      <div className="hero-actions"><a className="button button-light" href="#work">探索精选作品 <Arrow direction="down" /></a><button className="text-play" onClick={() => onPlay(projects[0])}><span className="play-ring"><PlayIcon /></span>播放作品片段<span className="play-length">00:10</span></button></div>
    </div>
    <div className="hero-bottom shell"><a className="scroll-cue" href="#about"><span className="scroll-line" /><span>向下探索<br /><small>SCROLL TO DISCOVER</small></span></a><div className="hero-frame-label"><span className="tiny-cross">+</span><span>画面选自 / 大疆无人机项目 · 雪山转场<br /><small>VISUAL & MOTION DESIGN BY SUN XIAOWEI</small></span></div><button className="background-control" onClick={toggle} aria-label={playing ? '暂停背景视频' : '播放背景视频'} title={playing ? '暂停背景视频' : '播放背景视频'}>{playing ? <span className="pause-icon"><i /><i /></span> : <PlayIcon />}<span>{playing ? 'PAUSE' : 'PLAY'}</span></button></div>
  </section>;
}

function Experience() {
  const [all, setAll] = useState(false);
  return <div className="experience-block">
    <div className="experience-heading"><span>经历 / EXPERIENCE</span><a href={profile.resume} download="孙晓伟简历.pdf">下载简历 <Arrow /></a></div>
    <div className="experience-list">{experiences.slice(0, all ? experiences.length : 3).map((item, i) => <details className="experience-item" key={item.company} open={i === 0 ? true : undefined}><summary><span className="experience-period">{item.period}</span><span className="experience-company">{item.company}<small>{item.role}</small></span><span className="experience-plus" aria-hidden="true">+</span></summary><p>{item.description}</p></details>)}</div>
    <button className="more-experience" onClick={() => setAll(!all)} aria-expanded={all}>{all ? '收起早期经历' : '查看早期经历'}<span aria-hidden="true">{all ? '−' : '+'}</span></button>
  </div>;
}

function About({ onCopy }) {
  return <section className="about section shell" id="about">
    <SectionLabel number="01">关于我 / ABOUT</SectionLabel>
    <div className="about-layout">
      <div className="identity-panel"><div className="identity-top"><span>THE PERSON<br />BEHIND THE FRAMES</span><span className="identity-cross">✳</span></div><div className="avatar-composition"><span className="avatar-orbit orbit-one" /><span className="avatar-orbit orbit-two" /><div className="avatar-frame"><img src="./assets/avatar.jpg" alt="孙晓伟简历中的手绘头像" width="260" height="260" loading="lazy" /></div><span className="avatar-coordinate">PROFILE / SUN XIAOWEI</span></div><div className="identity-bottom"><span>阿丸 <small>A-WAN</small></span><span>3D & AIGC<br />VISUAL DESIGNER</span></div></div>
      <div className="about-copy"><h2>创意有想法，<br />制作有章法<span className="accent">。</span></h2><h3>我是孙晓伟，也叫阿丸。</h3><p>从三维场景与角色制作，到品牌产品视频与 AI 短片，我喜欢把一个想法，变成有质感、有叙事的画面。</p><p>做客户项目，也独立创作。用三维控制画面，用 AI 探索可能，让创意落到最后一帧。</p><div className="about-links"><a href={`mailto:${profile.email}`}>{profile.email} <Arrow /></a><button onClick={() => onCopy(profile.phone, '电话号码')}>TEL. {profile.phone} <span className="copy-symbol" aria-hidden="true">⧉</span></button></div><Experience /></div>
    </div>
    <div className="stats-strip"><div><strong>{String(projects.length).padStart(2, '0')}<span> /</span></strong><span>精选影像案例</span></div><div><strong>48</strong><span>自营账号作品</span></div><div><strong>6,212</strong><span>自营账号粉丝</span></div><div><strong>10<span>万+</span></strong><span>多条作品播放量</span></div><p>抖音「Nalou 娜楼」<br />账号数据来自历史截图</p></div>
  </section>;
}

function ProjectCard({ project, onOpen }) {
  return <button className={`project-card ${project.featured ? 'featured' : ''} ${project.portrait ? 'portrait-project' : ''}`} onClick={() => onOpen(project)} aria-label={`播放${project.title}`}>
    <div className="project-art"><img src={project.image} alt={project.title + '作品画面'} loading="lazy" decoding="async" />{project.portrait && <div className="portrait-cover-type" aria-hidden="true"><span>AI SHORT FILM</span><strong>孔乙己</strong><small>一个熟悉的故事，<br />一次新的影像表达。</small></div>}<div className="project-shade" /><div className="project-topline"><span>{project.number} / {project.nature}</span><span className="project-duration"><PlayIcon />{project.clips ? `${project.clips.length} 段视频` : project.duration}</span></div><div className="project-art-footer"><span>{project.english}</span><span className="project-open"><Arrow /></span></div>{project.featured && <div className="featured-title"><span>三维 × AI · 产品影像制作</span><strong>越过想象的边界。</strong></div>}<span className="project-hover-play"><PlayIcon />播放作品</span></div>
    <div className="project-meta"><h3>{project.title}</h3><div>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
  </button>;
}

function Work({ onOpen }) {
  const [filter, setFilter] = useState('all');
  const filters = [{ id: 'all', name: '全部作品' }, { id: 'commercial', name: '商业视频' }, { id: 'personal', name: '个人创作' }].map(filter => ({ ...filter, count: String(projects.filter(project => filter.id === 'all' || project.category === filter.id).length).padStart(2, '0') }));
  const visible = projects.filter(p => filter === 'all' || p.category === filter);
  return <section className="work section shell" id="work">
    <SectionLabel number="02">精选作品 / SELECTED WORK</SectionLabel>
    <div className="section-heading work-heading"><h2>画面，是最好的表达<span className="accent">。</span></h2><p>商业制作与个人探索，<br />每一帧，都有自己的来处。</p></div>
    <div className="work-toolbar"><div className="project-filters" aria-label="筛选作品">{filters.map(f => <button key={f.id} aria-pressed={filter === f.id} className={filter === f.id ? 'selected' : ''} onClick={() => setFilter(f.id)}>{f.name}<sup>{f.count}</sup></button>)}</div><span className="work-note">SELECTED FRAMES, SELECTED STORIES.</span></div>
    <div className="project-grid" key={filter}>{visible.map(project => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div>
    <div className="work-bottom"><span>还有更多画面，正在发生。</span><a className="inline-link" href={profile.portfolioUrl} target="_blank" rel="noreferrer">查看完整作品档案 <Arrow /></a></div>
  </section>;
}

function Expertise() {
  return <section className="expertise-wrap" id="expertise"><div className="expertise section shell"><SectionLabel number="03">我的能力 / EXPERTISE</SectionLabel><div className="expertise-layout"><div className="expertise-intro"><h2>从一个念头，<br />到最后一帧<span className="accent">。</span></h2><p>创意、制作、沟通。<br />让它们在同一条线上，向前走。</p><div className="expertise-signature"><span className="signature-mark">s×w</span><span>IDEA TO IMAGE.<br />FRAME BY FRAME.</span></div></div><div className="capabilities-grid">{capabilities.map(cap => <article className="capability-card" key={cap.id}><div className="capability-top"><span>{cap.id} /</span><CapabilityIcon type={cap.icon} /></div><span className="capability-english">{cap.english}</span><h3>{cap.title}</h3><p>{cap.text}</p><div className="capability-tools">{cap.tools}</div></article>)}</div></div></div></section>;
}

function Contact({ onCopy }) {
  return <section className="contact" id="contact"><div className="contact-inner shell"><SectionLabel number="04">保持联系 / CONTACT</SectionLabel><div className="contact-lead"><div className="contact-eyebrow"><span className="status-dot" />关于工作、项目，或一个新想法。</div><h2>下一个画面，<br />一起<span>创造</span>。</h2><a className="contact-orb" href={`mailto:${profile.email}`} aria-label="发送邮件联系孙晓伟"><Arrow /></a></div><div className="contact-actions"><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a><button className="copy-email" onClick={() => onCopy(profile.email, '邮箱地址')} aria-label="复制邮箱地址"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M15 8V4H4v11h4" stroke="currentColor" strokeWidth="1.4" /></svg></button></div><div className="contact-secondary"><div><span>电话 / PHONE</span><button onClick={() => onCopy(profile.phone, '电话号码')}>+86 {profile.phone} <span aria-hidden="true">⧉</span></button></div><div><span>作品 / ARCHIVE</span><a href={profile.portfolioUrl} target="_blank" rel="noreferrer">语雀作品档案 <Arrow /></a></div><div><span>简历 / RÉSUMÉ</span><a href={profile.resume} download="孙晓伟简历.pdf">下载个人简历 <Arrow direction="down" /></a></div></div><footer className="footer"><a className="footer-brand" href="#home">孙晓伟 <span>SUN XIAOWEI</span></a><span>© {new Date().getFullYear()} · DESIGN IN MOTION</span><a href="#home">返回顶部 <Arrow /></a></footer></div></section>;
}

function ProjectPlayer({ project }) {
  const [clipIndex, setClipIndex] = useState(0);
  const clips = project.clips || [{ id: project.id, title: project.title, stage: '作品片段', video: project.video, image: project.image }];
  const clip = clips[clipIndex];
  return <>
    <div className={`dialog-player ${project.portrait ? 'vertical-player' : ''}`}>
      <video key={clip.id} src={clip.video} poster={clip.image} controls autoPlay playsInline preload="metadata" aria-label={`${project.title}：${clip.title} · ${clip.stage}视频`} />
    </div>
    {clips.length > 1 && <section className="project-clips" aria-label={`${project.title}的片段与制作过程`}>
      <div className="clips-heading"><span>片段与制作过程</span><span>{String(clipIndex + 1).padStart(2, '0')} / {String(clips.length).padStart(2, '0')}</span></div>
      <div className="clip-list" role="group" aria-label="选择视频片段">
        {clips.map((item, i) => <button key={item.id} className={`clip-button ${i === clipIndex ? 'is-active' : ''}`} aria-pressed={i === clipIndex} aria-label={`播放${item.title} · ${item.stage}`} onClick={() => setClipIndex(i)}>
          <span className="clip-thumbnail"><img src={item.image} alt="" loading="lazy" /><span className="clip-duration">{item.duration}</span><span className="clip-play"><PlayIcon /></span></span>
          <span className="clip-title">{item.title}</span><span className="clip-stage">{item.stage}</span>
        </button>)}
      </div>
    </section>}
  </>;
}

function ProjectDialog({ project, onClose, onChange }) {
  const ref = useRef(null);
  const closeButton = useRef(null);
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
  return <dialog className="project-dialog" ref={ref} aria-labelledby="dialog-project-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="dialog-content">
      <div className="dialog-heading"><span>SELECTED WORK / {project.number}</span><button ref={closeButton} className="dialog-close" onClick={onClose} aria-label="关闭作品视频"><span>关闭</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.5" /></svg></button></div>
      <ProjectPlayer key={project.id} project={project} />
      <div className="dialog-info"><div><span className="dialog-nature">{project.nature} / {project.tags.join(' · ')}</span><h2 id="dialog-project-title">{project.title}</h2><p>{project.description}</p><span className="dialog-role">我的工作：{project.role}</span></div>{project.link && <a className="inline-link" href={project.link} target="_blank" rel="noreferrer">查看发布视频 <Arrow /></a>}</div>
      <div className="dialog-pagination"><button onClick={() => onChange(projects[(index - 1 + projects.length) % projects.length])}>← 上一个作品</button><span>{project.number} / {String(projects.length).padStart(2, '0')}</span><button onClick={() => onChange(projects[(index + 1) % projects.length])}>下一个作品 →</button></div>
    </div>
  </dialog>;
}

function App() {
  const [project, setProject] = useState(null);
  const [active, setActive] = useState('home');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.isIntersecting);
      if (entry) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
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
  return <><a className="skip-link" href="#main-content">跳到主要内容</a><Header active={active} /><main id="main-content"><Hero onPlay={setProject} /><About onCopy={copy} /><Work onOpen={setProject} /><Expertise /><Contact onCopy={copy} /></main><ProjectDialog project={project} onClose={() => setProject(null)} onChange={setProject} /><div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast && <><span>✓</span>{toast}</>}</div></>;
}

const root = import.meta.hot?.data.root ?? createRoot(document.getElementById('root'));
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<React.StrictMode><App /></React.StrictMode>);

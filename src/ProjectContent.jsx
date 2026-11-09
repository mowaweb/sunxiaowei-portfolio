import React, { useEffect, useRef, useState } from 'react';
import { Arrow, PlayIcon } from './Icons';
import { FilmEditions } from './FullFilm';
import { IPCaseStudy, MaicaiCaseStudy } from './CaseStudies';
import LiweikeCaseStudy from './LiweikeCaseStudy';
import PosterCaseStudy from './PosterCaseStudy';
import UniCaseStudy from './UniCaseStudy';
import FriesCaseStudy from './FriesCaseStudy';
import NalouCaseStudy from './NalouCaseStudy';
import FuzziCaseStudy from './FuzziCaseStudy';
import VideoTimeline from './VideoTimeline';
import './liweike-case.css';
import './poster-case.css';
import './unihui-case.css';

function ClipPlayer({ project, clip, onEnded, playbackRate, onPlaybackRateChange, autoPlay = true }) {
  const [version, setVersion] = useState('ai');
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const versions = clip.versions || [];
  const media = versions.find(item => item.id === version) || versions[0] || clip;
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [media.video, playbackRate]);
  const updateDuration = event => {
    const seconds = event.currentTarget.duration;
    setDuration(Number.isFinite(seconds) ? Math.max(0, seconds) : 0);
  };
  const seekBy = seconds => {
    const video = videoRef.current;
    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    }
  };
  return <div className={`dialog-player ${(clip.portrait ?? project.portrait) ? 'vertical-player' : ''}`}>
    {media.video ? <><video ref={videoRef} key={`${clip.id}-${media.id}`} src={media.video} poster={media.image} controls autoPlay={autoPlay} playsInline preload="metadata" onEnded={onEnded} onLoadedMetadata={event => { updateDuration(event); event.currentTarget.playbackRate = playbackRate; }} onDurationChange={updateDuration} onRateChange={event => { if (event.currentTarget.playbackRate !== playbackRate) onPlaybackRateChange(event.currentTarget.playbackRate); }} aria-label={`${project.title}：${clip.title} · ${media.label || clip.stage}视频`} />
      <div className="video-transport" role="group" aria-label="视频播放控制">
        <VideoTimeline key={media.video} videoRef={videoRef} duration={duration} />
        <div className="video-seek-actions"><button type="button" onClick={() => seekBy(-5)} disabled={!duration} aria-label="快退5秒">← 快退 5 秒</button><button type="button" onClick={() => seekBy(5)} disabled={!duration} aria-label="快进5秒">快进 5 秒 →</button></div>
        <label className="video-speed">倍速<select aria-label="播放速度" value={playbackRate} onChange={event => onPlaybackRateChange(Number(event.target.value))}>{[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => <option value={rate} key={rate}>{rate === 1 ? '1× 正常' : `${rate}×`}</option>)}</select></label>
      </div></> : <a className="dialog-image-link" href={media.image} target="_blank" rel="noreferrer" aria-label={`打开${clip.title}原图`}><img className="dialog-still" src={media.image} alt={`${project.title}：${clip.title}`} decoding="async" /><span>查看原图 <Arrow /></span></a>}
    {versions.length > 1 && <div className="player-version-switch" role="group" aria-label="切换制作版本">
      {versions.map(item => <button key={item.id} aria-pressed={media.id === item.id} onClick={() => { if (media.id !== item.id) { setDuration(0); setVersion(item.id); } }}>{item.label}</button>)}
    </div>}
  </div>;
}

function ProjectPlayer({ project, autoPlay = true, playlistFirst = false }) {
  const [clipIndex, setClipIndex] = useState(0);
  const [hasSelectedClip, setHasSelectedClip] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const clips = project.clips || [{ id: project.id, title: project.title, stage: '作品片段', video: project.video, image: project.image }];
  const clip = clips[clipIndex];
  const hasImages = clips.some(item => !item.video);
  const hasVideos = clips.some(item => item.video);
  const playlist = clips.length > 1 && <section className="project-clips" aria-label={`${project.title}的片段与制作过程`}>
      <div className="clips-heading"><span>{project.autoAdvanceClips ? '片段顺序 · 自动连播' : hasImages ? hasVideos ? '视频与项目画面' : '项目画面' : '片段与制作过程'}</span><span aria-live="polite" aria-atomic="true">{String(clipIndex + 1).padStart(2, '0')} / {String(clips.length).padStart(2, '0')}</span></div>
      <div className="clip-list" role="group" aria-label={hasImages ? '选择项目内容' : '选择视频片段'}>
        {clips.map((item, i) => <button key={item.id} className={`clip-button ${i === clipIndex ? 'is-active' : ''}`} aria-pressed={i === clipIndex} aria-label={`${item.video ? '播放' : '查看'}${project.autoAdvanceClips ? String(i).padStart(2, '0') + ' ' : ''}${item.title} · ${item.stage}`} onClick={() => { setClipIndex(i); setHasSelectedClip(true); }}>
          <span className="clip-thumbnail"><img src={item.poster || item.image} alt="" loading="lazy" /><span className="clip-duration">{item.duration || (item.animated ? 'GIF' : '画面')}</span><span className="clip-play">{item.video ? <PlayIcon /> : <Arrow />}</span></span>
          <span className="clip-title">{project.autoAdvanceClips && <span className="clip-order">{String(i).padStart(2, '0')}</span>}{item.title}</span><span className="clip-stage">{item.stage}</span>
        </button>)}
      </div>
    </section>;
  return <>
    {playlistFirst && playlist}
    <ClipPlayer key={clip.id} project={project} clip={clip} playbackRate={playbackRate} onPlaybackRateChange={setPlaybackRate} autoPlay={autoPlay || hasSelectedClip} onEnded={project.autoAdvanceClips ? () => setClipIndex(current => Math.min(current + 1, clips.length - 1)) : undefined} />
    {!playlistFirst && playlist}
  </>;
}

export default function ProjectContent({ project, initialClipIndex = 0 }) {
  const caseKind = project.caseStudy?.kind;
  let caseContent = null;
  if (caseKind === 'fuzzi') {
    caseContent = <FuzziCaseStudy key={project.id} project={project} Player={ClipPlayer} />;
  } else if (caseKind === 'maicai') {
    const videos = { ...project, clips: project.clips.filter(clip => clip.video).map(clip => clip.id === 'brand-blindbox' ? { ...clip, image: './assets/maicai-case-video-poster.webp' } : clip) };
    caseContent = <MaicaiCaseStudy project={project}><ProjectPlayer key={project.id} project={videos} /></MaicaiCaseStudy>;
  } else if (caseKind === 'fries') {
    caseContent = <FriesCaseStudy project={project} Player={ClipPlayer} />;
  } else if (caseKind === 'ip') {
    caseContent = <IPCaseStudy project={project} />;
  } else if (caseKind === 'nalou') {
    caseContent = <NalouCaseStudy key={project.id} project={project} Player={ClipPlayer} initialClipIndex={initialClipIndex} />;
  } else if (caseKind === 'liweike') {
    caseContent = <LiweikeCaseStudy project={project} Player={ClipPlayer} />;
  } else if (caseKind === 'poster') {
    caseContent = <PosterCaseStudy key={project.id} project={project} Player={ClipPlayer} />;
  } else if (caseKind === 'unihui') {
    caseContent = <UniCaseStudy project={project} />;
  }
  return <>
      {caseContent || <><FilmEditions key={project.id} project={project} Player={ClipPlayer}><ProjectPlayer key={project.id} project={project} /></FilmEditions>
      <div className="dialog-info"><div><span className="dialog-nature">{project.nature} / {project.tags.join(' · ')}</span><h2 id="dialog-project-title">{project.title}</h2><p>{project.description}</p><span className="dialog-role">我的工作：{project.role}</span></div>{project.link && <a className="inline-link" href={project.link} target="_blank" rel="noreferrer">{project.linkLabel || '查看发布视频'} <Arrow /></a>}</div>
      {project.characterSheet && <figure className="character-sheet">
        <figcaption><div><span>AI 角色设定 / CHARACTER TURNAROUND</span><h3>{project.characterSheet.title}</h3></div><a className="inline-link" href={project.characterSheet.image} target="_blank" rel="noreferrer">查看原图 <Arrow /></a></figcaption>
        <a className="character-sheet-image" href={project.characterSheet.image} target="_blank" rel="noreferrer" aria-label="打开人物三视图原图"><img src={project.characterSheet.image} alt={project.characterSheet.alt} width={project.characterSheet.width} height={project.characterSheet.height} loading="lazy" decoding="async" /></a>
        <p>正面 · 侧面 · 背面 · 面部特写</p>
        {project.characterSheet.note && <p className="character-sheet-note">{project.characterSheet.note}</p>}
      </figure>}</>}
  </>;
}

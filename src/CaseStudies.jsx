import React from 'react';

function Artwork({ image, title, width, height, className = '' }) {
  return <a className={`case-artwork ${className}`} href={image} target="_blank" rel="noreferrer" aria-label={`查看${title}大图`}><img src={image} alt={title} width={width} height={height} loading="lazy" decoding="async" /></a>;
}

const maicaiCards = ['小飞鸡', '肱二头鸡', '花花鸡', '锦鸡', '菜鸡', '老司机', '龙鸡', 'CAICAI 品牌卡'].map((title, index) => ({ title, image: `./assets/maicai-case-card-${String(index + 1).padStart(2, '0')}.webp`, width: 473, height: 632 }));

export function MaicaiCaseStudy({ project, children }) {
  const extraImages = project.clips.filter(clip => !clip.video && !clip.id.startsWith('maicai-blindbox-'));
  return <article className="maicai-case">
    <header className="maicai-case-header">
      <div className="maicai-case-intro">
        <img className="maicai-case-mark" src="./assets/maicai-case-mark.webp" alt="" width="120" height="76" />
        <h2 id="dialog-project-title"><span>淘宝买菜</span><i>×</i><span>天猫超市</span></h2>
        <p>根据要求设计 IP 盲盒，制作 IP 宣发视频，<br />延展猫超品牌周边视觉。</p>
        <p className="maicai-case-english">IP character design and production</p>
        <div className="maicai-case-process"><strong>IP 盲盒视频</strong><p>工作流：模型与场景贴图 → C4D 动画与场景搭建 → OC 渲染</p></div>
      </div>
      <Artwork image="./assets/maicai-blindbox-design.webp" title="淘宝买菜小飞鸡 IP 盲盒主视觉" className="maicai-case-hero" />
    </header>
    <div className="maicai-case-board">
      <Artwork image="./assets/maicai-blindbox-family.webp" title="小飞鸡系列盲盒全家福" width="1920" height="1080" className="maicai-case-family" />
      <section className="maicai-case-posters" aria-label="CAICAI 系列角色卡片">{maicaiCards.map(card => <Artwork key={card.image} {...card} />)}</section>
      {extraImages.length > 0 && <details className="maicai-case-extra"><summary>IP 动作与表情延展 <span>{extraImages.length} 组画面 ＋</span></summary><div className="maicai-extra-grid">{extraImages.map(clip => <Artwork key={clip.id} {...clip} />)}</div></details>}
      <section className="maicai-case-video" aria-label="项目视频"><h3>IP 盲盒与品牌视频 <span>点击播放 / 切换片段</span></h3>{children}</section>
    </div>
  </article>;
}

export function IPCaseStudy({ project }) {
  return <article className="ip-case" style={{ '--case-accent': project.caseStudy.accent }}>
    <header className="ip-case-header"><div><span>平面 / IP · CHARACTER DESIGN</span><h2 id="dialog-project-title">{project.title}</h2><p className="ip-case-english">{project.english}</p></div><div><p>{project.description}</p><span>{project.role}</span></div></header>
    {project.caseStudy.sections.map((section, sectionIndex) => <section className="ip-case-section" key={section.title} aria-label={section.title}>
      <div className="ip-section-heading"><div><span>0{sectionIndex + 1} /</span><h3>{section.title}</h3><p>{section.english}</p></div><span>{String(section.items.length).padStart(2, '0')} 组画面</span></div>
      <div className={`ip-art-grid ${section.items.length <= 4 ? 'ip-art-grid-compact' : ''}`}>{section.items.map((item, index) => <a href={item.image} target="_blank" rel="noreferrer" className={`ip-art ${item.wide ? 'is-wide' : ''}`} key={item.id} aria-label={`查看${item.title}大图`}><span className="ip-art-index">{String(index + 1).padStart(2, '0')}<small>/{String(section.items.length).padStart(2, '0')}</small></span><img src={item.image} alt={item.title} width={item.width} height={item.height} loading="lazy" decoding="async" /><span className="ip-art-title">{item.title}<small>↗ 查看大图</small></span></a>)}</div>
    </section>)}
  </article>;
}

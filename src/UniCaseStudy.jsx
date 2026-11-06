import React from 'react';

const panelDescriptions = [
  '睡眠派对系列角色的正面、侧面与背面造型。',
  '蓝色冰景主题装置与黄色角色挂件。',
  '粉色圣诞场景、节日装置与圣诞树。',
];

export default function UniCaseStudy({ project }) {
  const { panels, sections } = project.caseStudy;
  const total = sections.reduce((sum, section) => sum + section.items.length, 0);
  return (
    <article className="unihui-case">
      <h2 className="uni-sr-only" id="dialog-project-title">{project.title}</h2>
      <div className="uni-board">
        {panels.map((panel, index) => (
          <section key={panel.id} className="uni-panel" aria-labelledby={`uni-panel-${panel.id}`}>
            <h3 id={`uni-panel-${panel.id}`} className="uni-panel-heading">{panel.title}</h3>
            <a href={panel.image} target="_blank" rel="noreferrer" aria-label={`打开高清展板：${panel.title}`}>
              <img src={panel.image} width={panel.width} height={panel.height}
                alt={panelDescriptions[index] || panel.title} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
              <span className="uni-enlarge" aria-hidden="true">查看大图 ↗</span>
            </a>
          </section>
        ))}
      </div>
      <details className="uni-archive">
        <summary><strong>单张作品</strong><span>{total} 张图</span></summary>
        {sections.map(section => (
          <section key={section.title} className="uni-group" aria-label={section.title}>
            <h3>{section.title}</h3>
            <div className="uni-group-grid">
              {section.items.map(item => (
                <a key={item.id} href={item.image} target="_blank" rel="noreferrer" aria-label={`查看大图：${item.title}`}>
                  <img src={item.image} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </details>
    </article>
  );
}

import React from 'react';
import './egret-proposal.css';

const pages = [
  { page: '06', title: '形象配色', description: '从湿地环境提取绿色与芦苇色，搭配明亮的辅助色。' },
  { page: '08', title: '动作延展', description: '角色的日常动作与亲子互动，形成完整的彩色动作系列。' },
  { page: '10', title: '酒店功能区形象', description: '围绕茶空间、健身房、餐厅与手工活动等场景延展主题动作。' },
  { page: '13', title: '酒店物料应用', description: '从抱枕、手册到门挂与包装，让角色进入日常用品。' },
  { page: '14', title: '导视图形与空间应用', description: '提炼白鹭轮廓与湿地配色，延展楼层、酒店标识和停车场导视。' },
];

export default function EgretProposal() {
  return <section className="egret-proposal" aria-labelledby="egret-proposal-title">
    <div className="poster-section-title"><h3 id="egret-proposal-title">从角色设定到酒店应用</h3><span>DESIGN PROPOSAL / 05</span></div>
    <p className="egret-proposal-intro">御海杭州湾国家湿地酒店品牌白鹭 IP 设计提案选页，展示配色、动作延展、物料与导视应用。</p>
    <div className="egret-proposal-pages">
      {pages.map((page, index) => <figure className="egret-proposal-page" key={page.page}>
        <figcaption><span className="egret-proposal-number">{String(index + 1).padStart(2, '0')}</span><div><h4>{page.title}</h4><p>{page.description}</p></div><span className="egret-proposal-enlarge" aria-hidden="true">查看大图 ↗</span></figcaption>
        <a href={`./assets/egret-proposal-${page.page}.webp`} target="_blank" rel="noreferrer" aria-label={`查看完整设计页：${page.title}`}>
          <img src={`./assets/egret-proposal-${page.page}.webp`} alt={`白鹭 IP 设计提案：${page.title}。${page.description}`} width="1800" height="1013" loading="lazy" decoding="async" />
        </a>
      </figure>)}
    </div>
  </section>;
}

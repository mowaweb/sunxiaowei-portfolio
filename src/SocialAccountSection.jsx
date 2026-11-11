import React, { useId } from 'react';
import './social-account.css';

function EvidenceCard({ item, profile = false }) {
  return <figure className={`social-evidence${profile ? ' social-evidence--profile' : ''}`}>
    <a href={item.image} target="_blank" rel="noreferrer" aria-label={`查看大图：${item.title || '抖音界面截图'}`}>
      <img src={item.image} alt={item.title || '抖音界面截图'} width={item.width} height={item.height} loading="lazy" decoding="async" />
      <span className="social-evidence-zoom" aria-hidden="true">查看大图 ↗</span>
    </a>
    <figcaption>
      <span>{item.title || (profile ? '账号主页' : '视频发布界面')}</span>
      {item.likes != null && <strong><span>视频点赞</span> {item.likes}</strong>}
      {item.samePost && <small>同一视频的另一画面</small>}
    </figcaption>
  </figure>;
}

/** All figures are supplied evidence, not a live platform counter. */
export default function SocialAccountSection({ project }) {
  const headingId = useId();
  const accounts = project.socialAccounts || (project.social ? [project.social] : []);
  if (!accounts.length) return null;

  return <section className="social-account-section" aria-labelledby={headingId}>
    <header className="social-section-heading">
      <div><span className="social-kicker" lang="en">ON DOUYIN / ACCOUNT & WORKS</span><h3 id={headingId}>从作品到账号现场</h3></div>
      <p>抖音主页 · 视频发布界面</p>
    </header>
    {accounts.map((account, index) => {
      const screenshots = account.screenshots || [];
      const profiles = screenshots.filter(item => item.kind === 'profile');
      const videos = screenshots.filter(item => item.kind !== 'profile');
      return <article className="social-account" key={account.id || account.accountName || index}>
        <div className={`social-account-overview${profiles.length ? ' has-profile' : ''}`}>
          <div className="social-account-copy">
            <span className="social-kicker">账号 / {String(index + 1).padStart(2, '0')}</span>
            <h4>{account.accountName}</h4>
            <dl className="social-account-stats">
              {account.followers != null && <div><dt>账号粉丝</dt><dd>{account.followers}</dd></div>}
              {account.likes != null && <div><dt>账号累计获赞</dt><dd>{account.likes}</dd></div>}
            </dl>
            <p className="social-data-note">{account.note || '数据来源：所提供的抖音界面截图，为历史数据。'}</p>
            {account.url && <a className="social-account-link" href={account.url} target="_blank" rel="noreferrer">查看抖音主页 <span aria-hidden="true">↗</span></a>}
          </div>
          {profiles.length > 0 && <div className="social-profile-evidence">
            {profiles.map(item => <EvidenceCard key={item.id || item.image} item={item} profile />)}
          </div>}
        </div>
        {videos.length > 0 && <div className="social-video-evidence">
          <div className="social-evidence-heading"><h5>视频发布与互动记录</h5><span>{String(videos.length).padStart(2, '0')} 张界面截图</span></div>
          <div className="social-evidence-grid">{videos.map(item => <EvidenceCard key={item.id || item.image} item={item} />)}</div>
        </div>}
      </article>;
    })}
  </section>;
}

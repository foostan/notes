import React from 'react';
import { Issue } from '../types';

type Props = {
  issues: Array<Issue>
};

const Entries = ({ issues }: Props) => {
  return (
    <div className="entries">
      {issues.map((issue, idx) => {
        const body = issue.bodyText.length > 100 ?
          issue.bodyText.slice(0, 100) + '...' :
          issue.bodyText;
        return (
          <div key={idx} className="entries-item">
            <h3><span className="entry-pub-date">{issue.pubDate}</span><a href={`/entry/${issue.id}`}>{issue.title}</a></h3>
            <p>{body}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Entries;

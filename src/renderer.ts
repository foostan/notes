import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {getIssues, findIssue, getIssue} from './api_client';
import { getFeed } from './feed';
import { getStyles } from './styles';
import Index from './components/index';
import Archive from './components/archive';
import Show from './components/show';
import { NotFoundError } from './errors';
import {Config, Issue, Site} from './types';

const renderIndex = async (uri: string, config: Config): Promise<string> => {
  const issues = await getIssues(config.github);
  const content = ReactDOMServer.renderToString(
    React.createElement(Index, { issues: issues.slice(0, 5), site: config.site })
  );
  return toHTML(config.site, uri, config.site.title, content);
};

const renderArchive = async (uri: string, config: Config): Promise<string> => {
  const issues = await getIssues(config.github);
  const content = ReactDOMServer.renderToString(
    React.createElement(Archive, { issues, site: config.site })
  );
  return toHTML(config.site, uri, `一覧 - ${config.site.title}`, content);
};

const renderShow = async (uri: string, title: string, config: Config): Promise<string> => {
  const issue = await ((): Promise<Issue | null> => {
    if (title.match(/^\d+$/)) {
      return getIssue(Number(title), config.github);
    } else {
      return findIssue(title, config.github);
    }
  })()
  if (issue === null) {
    throw new NotFoundError();
  }
  const content = ReactDOMServer.renderToString(
    React.createElement(Show, { issue, site: config.site })
  );
  return toHTML(config.site, uri, `${issue.title} - ${config.site.title}`, content);
};

const renderFeed = async (config: Config): Promise<string> => {
  const issues = await getIssues(config.github);
  const xml = getFeed(issues.slice(0, 20), config.site);
  return xml;
};

const renderRobots = (): string => {
  return `User-agent: *
  Disallow:`;
};

const renderNotFound = (config: Config): string => {
  return toHTML(config.site, config.site.siteURL, config.site.title, '404 Not Found');
};

const toHTML = (site: Site, uri: string, title: string, content: string): string => {
  const styles = getStyles();
  const html = `<!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta httpEquiv="content-type" content="text/html" charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="${site.description}">
      <meta property="description" content="${site.description}">
      <meta property="og:description" content="${site.description}">
      <meta property="og:type" content="website">
      <meta property="og:title" content="${title}">
      <meta property="og:url" content="${uri}">
      <meta property="og:image" content="${site.iconURL}">
      <meta property="twitter:card" content="summary">
      <title>${title}</title>
      <link rel="alternate" type="application/atom+xml" href="/feed.xml" />
      <link rel="icon" href="${site.faviconURL}" />
      <style>${styles}</style>
    </head>
    <body>${content}</body>
  </html>`;
  return html;
};

export {
  renderIndex,
  renderArchive,
  renderShow,
  renderFeed,
  renderRobots,
  renderNotFound
};

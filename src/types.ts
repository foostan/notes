export interface Site {
  title: string,
  description: string,
  author: string,
  lastBuildDate: string,
  siteURL: string,
  faviconURL: string,
  iconURL: string
};

export interface GitHub {
  accessToken: string,
  repository: string,
  author: string,
  labels: string[]
};

export interface Config {
  site: Site,
  github: GitHub
};

export interface Issue {
  id: number,
  title: string,
  bodyHTML: string,
  bodyText: string,
  labels: string[],
  url: string,
  pubDate: string,
  editDate: string,
};

interface LabelNode {
  name: string
};

export interface IssueNode {
  number: number,
  title: string,
  bodyHTML: string,
  bodyText: string,
  labels: { nodes: LabelNode[] }
  url: string,
  createdAt: string,
  lastEditedAt: string
};

interface Edge {
  node: IssueNode
}

export interface PageInfo {
  endCursor: string | null,
  hasNextPage: boolean
};

export interface IssuesResponse {
  search: {
    edges: Edge[],
    pageInfo: PageInfo
  }
};

export interface IssueFindResponse {
  search: {
    edges: Edge[]
  }
};

export interface IssueGetResponse {
  repository: {
    issue: IssueNode;
  };
};

export type Response = { contentType: string, response: string, status: number };

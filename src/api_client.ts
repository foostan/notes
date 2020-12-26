import { graphql } from '@octokit/graphql';
import {
  GitHub,
  Issue,
  IssueNode,
  IssuesResponse,
  IssueGetResponse,
  IssueFindResponse,
  PageInfo,
} from './types';

const ISSUES_QUERY = `
  query issues($q: String!, $cursor: String) { 
    search(
      type: ISSUE,
      query: $q,
      first: 100,
      after: $cursor
    ) {
      edges {
        node {
          ... on Issue {
            number,
            title,
            bodyHTML,
            bodyText,
            labels(first:5) {
              nodes { name }
            },
            url,
            createdAt,
            lastEditedAt
          }
        }
      },
      pageInfo {
        endCursor,
        hasNextPage
      }
    }
  }
`;

const ISSUE_FIND_QUERY = `
  query issue($q: String!) { 
    search(
      type: ISSUE,
      query: $q,
      first: 1
    ) {
      edges {
        node {
          ... on Issue {
            number,
            title,
            bodyHTML,
            bodyText,
            labels(first:5) {
              nodes { name }
            },
            url,
            createdAt,
            lastEditedAt
          }
        }
      }
    }
  }
`;

const ISSUE_GET_QUERY = `
query issue($owner: String!, $repo: String!, $id: Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $id) {
      number,
      title,
      bodyHTML,
      bodyText,
      labels(first: 5) {
        nodes { name }
      },
      url,
      createdAt
    }
  }
}
`;

const getIssues = async (github: GitHub): Promise<Issue[]> => {
  const issues = [];
  const page: PageInfo = { endCursor: null, hasNextPage: true };

  let q = `repo:${github.repository} author:${github.author} state:open`;
  github.labels.forEach(function (label){
    q += ` label:"${label}"`;
  })

  while (page.hasNextPage) {
    const { search: { edges, pageInfo } }: IssuesResponse = await graphql(ISSUES_QUERY, {
      q,
      cursor: page.endCursor,
      headers: { authorization: `token ${github.accessToken}` }
    });
    for (const { node } of edges) {
      const issue = nodeToIssue(node);
      issues.push(issue);
    }
    page.endCursor = pageInfo.endCursor;
    page.hasNextPage = pageInfo.hasNextPage;
  }

  // sort id desc
  return issues.sort((a, b) => (a.id > b.id ? -1 : 1));
};

const getIssue = async (issueId: number, github: GitHub): Promise<Issue | null> => {
  const [owner, repo] = github.repository.split("/");
  const issue: IssueGetResponse = await graphql(ISSUE_GET_QUERY, {
    owner: owner,
    repo: repo,
    id: issueId,
    headers: { authorization: `token ${github.accessToken}` }
  });
  return issue.repository.issue ? nodeToIssue(issue.repository.issue) : null;
};

const findIssue = async (title: string, github: GitHub): Promise<Issue | null> => {
  let q = `repo:${github.repository} author:${github.author} state:open ${title} in:title`;
  github.labels.forEach(function (label){
    q += ` label:"${label}"`;
  })

  const { search: { edges } }: IssueFindResponse = await graphql(ISSUE_FIND_QUERY, {
    q,
    headers: { authorization: `token ${github.accessToken}` }
  });
  return edges[0] ? nodeToIssue(edges[0].node) : null;
};

const nodeToIssue = (node: IssueNode): Issue => {
  const pubDate = (new Date(node.createdAt)).toDateString();
  const editDate = (new Date(node.lastEditedAt)).toDateString();
  return {
    id: node.number,
    title: node.title,
    bodyHTML: node.bodyHTML,
    bodyText: node.bodyText,
    labels: node.labels.nodes.map(n => n.name),
    url: node.url,
    pubDate,
    editDate
  };
};

export { getIssues, getIssue, findIssue };

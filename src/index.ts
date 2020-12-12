import { handleRequest } from './proxy';
import { Config } from './types';

const getConfig = (): Config => {
  const lastBuildDate = process.env.BUILD_DATE;
  if (!lastBuildDate) {
    throw new Error('BUILD_DATE must be required.');
  }
  const accessToken = process.env.GH_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('GH_ACCESS_TOKEN must be required.');
  }

  return {
    site: {
      title: 'Notes',
      description: 'Notes for developers',
      author: 'foostan',
      lastBuildDate,
      siteURL: 'https://fstn.dev',
      faviconURL: 'https://raw.githubusercontent.com/foostan/notes/master/assets/favicon.ico',
      iconURL: 'https://raw.githubusercontent.com/foostan/notes/master/assets/foostan.png'
    },
    github: {
      accessToken,
      repository: 'foostan/notes',
      author: 'foostan',
      labels: ['public']
    }
  };
};

const getResponse = async (request: Request): Promise<Response> => {
  try {
    const config = getConfig();
    const {
      contentType,
      response,
      status
    } = await handleRequest(request.url, config);
    return new Response(response, {
      status,
      headers: { 'content-type': contentType }
    });
  } catch (e) {
    return new Response(e.message, {
      status: 500,
      headers: { 'content-type': 'text/html' }
    });
  }
};

addEventListener(
  'fetch',
  (event: FetchEvent) => event.respondWith(getResponse(event.request))
);

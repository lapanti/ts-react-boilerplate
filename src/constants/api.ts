export const BASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost:9966'
    : 'https://hacker-news.firebaseio.com/v0';

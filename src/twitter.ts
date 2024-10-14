import type { tweetsRecentSearch } from 'twitter-api-sdk/dist/types';
import { qs } from './utils';

type RecentSearchResponse =
  tweetsRecentSearch['responses']['200']['content']['application/json'];

export class MyClient {
  constructor(private token: string) {}

  // 検索
  search(query: string, sinceId?: string): SearchResult[] {
    const url = `https://api.x.com/2/tweets/search/recent`;
    const params = {
      query,
      // since_id は undefiendが許容されないので、存在する場合のみプロパティ追加
      ...(sinceId ? { since_id: sinceId } : {}),
      max_results: 10,
      'tweet.fields': ['id', 'created_at', 'author_id', 'entities'],
    };
    const res = UrlFetchApp.fetch(url + '?' + qs(params), {
      headers: this.requestHeaders,
    });
    const data = JSON.parse(res.getContentText()) as RecentSearchResponse;
    return (
      data?.data?.reverse().map<SearchResult>((tweet) => ({
        id: tweet.id,
        createdAt: tweet.created_at!,
        userId: String(tweet.author_id!),
        tags:
          tweet.entities?.hashtags?.map(({ tag }) => `#${tag}` as HashTag) ??
          [],
      })) ?? []
    );
  }

  // リポスト
  repost(userId: string, id: string) {
    const url = `https://api.x.com/2/users/${userId}/retweets`;
    const res = this.post(url, { tweet_id: id });
    return canExecuteMore(res.getAllHeaders());
  }

  // いいね
  like(userId: string, id: string) {
    const url = `https://api.x.com/2/users/${userId}/likes`;
    const res = this.post(url, { tweet_id: id });
    return canExecuteMore(res.getAllHeaders());
  }

  // POSTアクセス共通関数
  private post(url: string, payload: Object) {
    return UrlFetchApp.fetch(url, {
      method: 'post',
      headers: this.requestHeaders,
      payload: JSON.stringify(payload),
    });
  }

  // 共通リクエストヘッダー
  private get requestHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
  }
}

// RateLimitの情報を元に、追加でリクエストを送れるかどうかを判定
function canExecuteMore(headers: Object) {
  if ('x-rate-limit-remaining' in headers) {
    const limit = Number(headers['x-rate-limit-remaining']);
    return limit > 0;
  }
  console.warn('RateLimitの情報が取得できませんでした');
  return false;
}

// リフレッシュトークンを使ってアクセストークンを取得
export function getTokenByRefreshToken({
  clientId,
  clientSecret,
  refreshToken,
}: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}) {
  const authUrl = 'https://api.twitter.com/2/oauth2/token';
  const authString = Utilities.base64Encode(`${clientId}:${clientSecret}`);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${authString}`,
  };

  const payload = {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    client_id: clientId,
  };

  const res = UrlFetchApp.fetch(authUrl, {
    method: 'post',
    headers,
    payload,
  });

  const resData = JSON.parse(res.getContentText());
  return {
    refreshToken: resData.refresh_token as string,
    accessToken: resData.access_token as string,
  };
}

type SearchResult = {
  id: string;
  createdAt: string;
  userId: string;
  tags: HashTag[];
};

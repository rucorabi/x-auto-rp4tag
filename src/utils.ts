export function isHashTag(tag: string): tag is HashTag {
  return tag.startsWith('#');
}

// いずれかのタグを含む かつ リツイートを除外 するクエリを生成する
export function genAnyTagAndExcludeRetweetQuery(tags: HashTag[]) {
  return `(${tags.map((tag) => `${tag}`).join(' OR ')}) -is:retweet`;
}

// クエリストリングを生成
export function qs(queries: Object) {
  return Object.entries(queries)
    .map(([key, value]) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .join('&');
}

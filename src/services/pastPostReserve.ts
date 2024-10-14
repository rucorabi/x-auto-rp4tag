import type { PostsSheet, ReservedSheet } from '../sheets';

type Params = {
  postsSheet: PostsSheet;
  reservedSheet: ReservedSheet;
};

export function pastPostReserve({ postsSheet, reservedSheet }: Params) {
  const allPostIds = postsSheet.getAllIds();
  const reservedIds = reservedSheet.getAllIds();

  // すでに投稿 or 予約済みのIDを除外
  const targetIds = allPostIds.filter((id) => !reservedIds.includes(id));
  const idx = Math.floor(Math.random() * targetIds.length);
  const taretId = targetIds[idx];

  console.log(`過去ポストID: ${taretId}`);

  reservedSheet.writePosts(taretId);
}

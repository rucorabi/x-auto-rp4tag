import type { PostRepository, ReservedPostRepository } from '../repositories';

type Params = {
  postRepos: PostRepository;
  reservedRepos: ReservedPostRepository;
};

export function pastPostReserve({ postRepos, reservedRepos }: Params) {
  const allPostIds = postRepos.findAllIds();
  const reservedIds = reservedRepos.findAllIds();

  // すでに投稿 or 予約済みのIDを除外
  const targetIds = allPostIds.filter((id) => !reservedIds.includes(id));
  const idx = Math.floor(Math.random() * targetIds.length);
  const taretId = targetIds[idx];

  console.log(`過去ポストID: ${taretId}`);

  reservedRepos.save(taretId);
}

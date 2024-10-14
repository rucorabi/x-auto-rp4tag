import type { ScriptProperties } from '../configs';
import { getTokenByRefreshToken, MyClient } from '../twitter';
import type { ReservedPostRepository } from '../repositories';

type Params = {
  reservedRepos: ReservedPostRepository;
};

export function repostFromReserved(
  props: ScriptProperties,
  { reservedRepos }: Params,
) {
  const targetIds = reservedRepos.findReadyIds();
  if (targetIds.length === 0) {
    console.info('リポスト対象がありませんでした');
    return;
  }

  const newTokens = getTokenByRefreshToken({
    clientId: props.client_id,
    clientSecret: props.client_secret,
    refreshToken: props.refresh_token,
  });

  // 取得したトークンを保存
  props.updateRefreshToken(newTokens.refreshToken);

  const client = new MyClient(newTokens.accessToken);
  for (const id of targetIds) {
    console.log(`id=${id}`);
    const canMore = client.repost(props.user_id, id);

    reservedRepos.markAsPosted(id);

    // いいねもするが、エラーが起きた時には処理済みとなるようにする
    //   リポストが目的なので、いいねができなくても問題ない
    client.like(id, props.user_id);

    if (!canMore) {
      console.warn('リポスト回数の上限に達したため処理を終了します');
      break;
    }
  }
}

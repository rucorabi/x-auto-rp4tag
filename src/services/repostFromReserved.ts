import { getConfigs, ScriptProperties } from '../configs';
import { getTokenByRefreshToken, MyClient } from '../twitter';
import type { ReservedSheet } from '../sheets';

type Params = {
  reservedSheet: ReservedSheet;
};

export function repostFromReserved(
  props: ScriptProperties,
  { reservedSheet }: Params,
) {
  const newTokens = getTokenByRefreshToken({
    clientId: props.client_id,
    clientSecret: props.client_secret,
    refreshToken: props.refresh_token,
  });

  // 取得したトークンを保存
  props.updateRefreshToken(newTokens.refreshToken);

  const client = new MyClient(newTokens.accessToken);
  for (const [id, postedAtCell] of reservedSheet.getReadyIdWithPostedAtCell()) {
    const canMore = client.repost(props.user_id, id);
    postedAtCell.setValue(new Date());

    if (!canMore) {
      console.log('リポスト回数の上限に達したため処理を終了します');
      break;
    }
  }
}

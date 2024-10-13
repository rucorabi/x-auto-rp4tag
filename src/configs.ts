// 有効なキー一覧
type PropertyKeys =
  | 'app_token'
  | 'refrech_token'
  | 'client_id'
  | 'client_secret'
  | 'user_id';

export type ScriptProperties = Record<PropertyKeys, string>;

// スクリプト変数から設定を取得
export function getConfigs(): ScriptProperties {
  const p = (key: string) =>
    PropertiesService.getScriptProperties().getProperty(key)!;
  return {
    app_token: p('app_token'),
    refrech_token: p('refrech_token'),
    client_id: p('client_id'),
    client_secret: p('client_secret'),
    user_id: p('user_id'),
  };
}

export function updateRefreshToken(refreshToken: string) {
  PropertiesService.getScriptProperties().setProperty(
    'refrech_token',
    refreshToken,
  );
}

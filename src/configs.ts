// 有効なキー一覧
type PropertyKeys =
  | 'app_token'
  | 'refresh_token'
  | 'client_id'
  | 'client_secret'
  | 'user_id';

export type ScriptProperties = Record<PropertyKeys, string> & {
  updateRefreshToken: (refreshToken: string) => void;
};

// スクリプト変数から設定を取得
export function getConfigs(): ScriptProperties {
  const p = (key: string) =>
    PropertiesService.getScriptProperties().getProperty(key)!;
  return {
    app_token: p('app_token'),
    refresh_token: p('refresh_token'),
    client_id: p('client_id'),
    client_secret: p('client_secret'),
    user_id: p('user_id'),
    updateRefreshToken: (newToken) => {
      PropertiesService.getScriptProperties().setProperty(
        'refresh_token',
        newToken,
      );
    },
  };
}

export function updateRefreshToken(refreshToken: string) {
  PropertiesService.getScriptProperties().setProperty(
    'refrech_token',
    refreshToken,
  );
}

# はじめに

このプロジェクトはVSCode上でのdev contaienrでの開発を想定しています。

# 開発手順

## GASの開発準備
### Claspでアカウントへログイン
```sh
npx clasp login
```

### スプレッドシートと紐付け
Googleドライブで空のスプレッドシートを作成する。
作成したスプレッドシートのIDを取得する。
`https://docs.google.com/spreadsheets/d/<スプレッドシートID>/edit`

### セットアップスクリプトを実行する

```sh
./setup.sh <スプレッドシートID>
```
※ 事前に https://script.google.com/home/usersettings へアクセスし、設定をONにしておくこと

## デプロイ
以下のコマンドを実行
```sh
npm run deploy
```

初回は設定の上書き確認が出るので y を押して実行(y/N形式)

# GASプロジェクトの設定について
スクリプト変数として以下を設定する

キー | 概要
---|---
app_token | 検索を実施するアプリのトークン
user_id | リポスト/いいねを行うユーザID(数値のやつ)
refrech_token | リポスト/いいねを行うユーザのリフレッシュトークン。一度設定したら自動で更新される。
client_id | アプリのCLIENT_ID
client_secret | アプリのCLIENT_SECRET


# スプレッドシートの準備

4つのシートを用意する
- manage
- posts
- reserved
- tags

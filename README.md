# はじめに
このシステムはX(旧Twitter)のAPIを利用して、
特定のハッシュタグが付いたポストを自動でリポストすることを目的としています。

実行環境はGoogleスプレッドシート with GoogleAppScriptです。
また、TwitterDeveloperAPIを利用するため事前のBasicプラン以上の契約が必要となります。

# 処理の流れ
3つのハンドラ関数を定義しています。
- searchAndSaveAndReserve
- repostFromReserved
- pastPostReserve

それぞれは独立したトリガーで動かす想定です。
ドキュメントロックを取得しており排他制御実装済みです。

フローとして `searchAndSaveAndReserve` でマスタへの追加と新規FAの投稿予約を実施し、
`repostFromReserved`で予約済みのポストをリポストします。

それとは独立して過去FAを予約シートへ追加することで、上記フローに乗ってリポストされます。
過去ポストの抽出はこのシステムのスコープ外となるので何らかの形で設定してください。
(設定は後述するpostsシートへ規定の形で設定となります)

過去FAの投稿を対象としない場合は `pastPostReserve` をトリガーに含めなければ動作しません。

# 開発手順

このプロジェクトはVSCode上でのdev contaienrでの開発を想定しています。

## GASの開発準備
### 必要なモジュールのインストール

```sh
npm install
```

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

## manageシート
B2 に Boolの値を設定する（チェックボックスを想定）

チェックをいれるとメンテナンスモードとなりすべての処理が空振りするようになる

## reservedシート
リポストの対象となるポストを管理する。
カラムは下記の3列でヘッダーあり
- tweet_id
- reserved_at
- posted_at

posted_atの有無でリポスト済みか判定する

## postsシート
FAのポスト情報のマスタデータ。
カラムは下記の3列でヘッダーあり
- id
- user_id
- created_at
  - ISO8601形式
- hashtags
  - カンマ区切り

## tagsシート
検索対象のタグを管理する。
カラムは下記の3列でヘッダーあり
- no
- tag
- disable

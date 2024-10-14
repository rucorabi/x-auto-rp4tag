#!/bin/sh

rm .clasp.json

# 引数からスプレッドシートIDを取得
SPREADSHEET_ID=$1

# IDが見つからない場合はエラー
if [ -z ${SPREADSHEET_ID} ]; then
  echo "スプレッドシートIDが指定されていません"
  echo "Usage: ./setup.sh <SPREADSHEET_ID>"
  exit 1
fi

npx clasp create --parentId=${SPREADSHEET_ID}

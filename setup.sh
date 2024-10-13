#!/bin/sh

rm .clasp.json

# 引数からスプレッドシートIDを取得
SPREADSHEET_ID=$1

npx clasp create --parentId=${SPREADSHEET_ID}

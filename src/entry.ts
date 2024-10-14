import { getConfigs } from './configs';

import { ManageSheet } from './sheets/ManageSheet';
import { PostsSheet } from './sheets/PostsSheet';
import { ReservedSheet } from './sheets/ReservedSheet';
import { TagsSheet } from './sheets/TagsSheet';

import { searchAndSaveAndReserved } from './services/searchAndSaveAndReserved';
import { pastPostReserve } from './services/pastPostReserve';

// @ts-ignore
declare let global: any;

// 各シートのインスタンスを取得&作成
function getSheets() {
  const ssheat = SpreadsheetApp.getActiveSpreadsheet();
  const s = (sheetName: string) => ssheat.getSheetByName(sheetName)!;
  return {
    Manage: new ManageSheet(s('manage'))!,
    Tags: new TagsSheet(s('tags')!),
    Posts: new PostsSheet(s('posts')!),
    Reserved: new ReservedSheet(s('reserved')!),
  } as const;
}

global.myFunction = function () {
  const configs = getConfigs();
  const sheets = getSheets();

  if (sheets.Manage.isMaintenaneMode()) {
    console.log('メンテナンスモード中のため処理をスキップします');
    return;
  }

  // 新しいFAを検索してシートに書き込む
  searchAndSaveAndReserved(configs, {
    postsSheet: sheets.Posts,
    reservedSheet: sheets.Reserved,
    tagsSheet: sheets.Tags,
  });

  // フラグが経っている場合のみ処理を実行
  // フラグを立てるのは別のJOBで行う
  if (sheets.Manage.needPickPastPost()) {
    console.log('過去のFAのリポスト処理を実施します');
    pastPostReserve({
      postsSheet: sheets.Posts,
      reservedSheet: sheets.Reserved,
    });
    // 処理済みとしてマーク
    sheets.Manage.runPastPostProcessMarkAs(false);
  }
};

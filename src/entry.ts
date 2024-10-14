import { getConfigs } from './configs';
import { getSheets } from './sheets';

import { searchAndSaveAndReserved } from './services/searchAndSaveAndReserved';
import { pastPostReserve } from './services/pastPostReserve';
import { repostFromReserved } from './services/repostFromReserved';

// @ts-ignore
declare let global: any;

global.myFunction = function () {
  const configs = getConfigs();
  const sheets = getSheets(SpreadsheetApp.getActiveSpreadsheet());

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

  // 予約済みのFAポストをリポストする
  repostFromReserved(configs, {
    reservedSheet: sheets.Reserved,
  });
};

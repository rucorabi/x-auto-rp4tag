import { getConfigs } from './configs';

import { searchAndSaveAndReserved } from './services/searchAndSaveAndReserved';
import { pastPostReserve } from './services/pastPostReserve';
import { repostFromReserved } from './services/repostFromReserved';
import * as repositories from './repositories';

function getRepositories() {
  const ssheet = SpreadsheetApp.getActiveSpreadsheet();
  const s = (sn: string) => ssheet.getSheetByName(sn)!;
  return {
    Post: new repositories.PostRepositoryImpl(s('posts')),
    Tag: new repositories.TagRepositoryImpl(s('tags')),
    Reserved: new repositories.ReservedPostRepositoryImpl(s('reserved')),
  };
}

// @ts-ignore
declare let global: any;

// 検索とリポスト
global.searchAndSaveReserved = jobWrapper(() => {
  const configs = getConfigs();
  const repos = getRepositories();

  // 新しいFAを検索してシートに書き込む
  searchAndSaveAndReserved(configs, {
    tagRepos: repos.Tag,
    postRepos: repos.Post,
    reservedRepos: repos.Reserved,
  });
});

// 予約済みのFAポストをリポストする
global.repostFromReserved = jobWrapper(() => {
  const configs = getConfigs();
  const repos = getRepositories();

  // 予約済みのFAをリポストする
  repostFromReserved(configs, {
    reservedRepos: repos.Reserved,
  });
});

// 過去のFAを予約する
//   posts -> reserved の処理を行う
global.pastPostJob = jobWrapper(() => {
  const repos = getRepositories();
  pastPostReserve({
    postRepos: repos.Post,
    reservedRepos: repos.Reserved,
  });
});

// ジョブの共通実行判定
//   メンテナンスモード中は処理をスキップする
//   他の処理が実行中の場合はスキップする
function jobWrapper(callback: () => void) {
  return () => {
    const manageSheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('manage');

    if (manageSheet?.getRange('B2').getValue()) {
      console.info('メンテナンスモード中のため処理をスキップします');
      return;
    }

    const lock = LockService.getDocumentLock();
    if (lock.tryLock(10000)) {
      try {
        callback();
      } catch (e) {
        console.error(e);
      } finally {
        lock.releaseLock();
      }
    } else {
      console.info('他の処理が実行中のためスキップします');
    }
  };
}

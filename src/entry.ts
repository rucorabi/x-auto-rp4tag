import { getTokenByRefreshToken, MyClient } from './twitter';
import { getConfigs, ScriptProperties } from './configs';
import { ManageSheet } from './sheets/ManageSheet';
import { PostsSheet } from './sheets/PostsSheet';
import { TagsSheet } from './sheets/TagsSheet';
import { genAnyTagAndExcludeRetweetQuery } from './utils';

const SheetNames = {
  Manage: 'manage',
  Tags: 'tags',
  Posts: 'posts',
};

// @ts-ignore
declare let global: any;

global.myFunction = function () {
  const configs = getConfigs();
  const ssheat = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = (sheetName: string) => ssheat.getSheetByName(sheetName)!;

  const manageSheet = new ManageSheet(sheet(SheetNames.Manage)!);
  if (manageSheet.isMaintenaneMode()) {
    console.log('メンテナンスモード中のため処理をスキップします');
    return;
  }

  const postsSheet = new PostsSheet(sheet(SheetNames.Posts)!);

  // 新しいFAを検索してシートに書き込む
  searchAndWrite(configs, {
    manageSheet,
    tagsSheet: new TagsSheet(sheet(SheetNames.Tags)!),
    postsSheet,
  });

  if (manageSheet.needRunPastPostProcess()) {
    // 過去のFAを検索してリポストする
    pastPostProcess({ postsSheet });
  }
};

function searchAndWrite(
  configs: ScriptProperties,
  {
    manageSheet,
    tagsSheet,
    postsSheet,
  }: {
    manageSheet: ManageSheet;
    tagsSheet: TagsSheet;
    postsSheet: PostsSheet;
  },
) {
  const searchClient = new MyClient(configs.app_token);

  const sinceId = manageSheet.getLatestTweetId();
  const query = genAnyTagAndExcludeRetweetQuery(tagsSheet.enableTags());
  const searchResult = searchClient.search(query, sinceId);

  if (searchResult.length === 0) {
    console.log('新しいFAは見つかりませんでした');
    return;
  }

  postsSheet.writePosts(searchResult);
  manageSheet.setLatestTweetId(searchResult[0].id);
}

function pastPostProcess({}: { postsSheet: PostsSheet }) {}

export class PostsSheet {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  writePosts(post: DraftPost) {
    const row: PostRowValues = [
      post.id,
      post.userId,
      post.tags.join(','),
      post.createdAt,
      new Date(),
    ];
    this.sheet.appendRow(row);
  }

  // すべてのツイートIDを取得
  getAllIds(): string[] {
    const ids = this.sheet.getRange('A2:A').getValues().flat();
    return ids.filter((id) => id !== ''); // 空文字は除外
  }

  latestPostId(): string {
    const lastRow = this.sheet.getLastRow();
    if (lastRow === 1) {
      return '';
    }
    const ret = this.sheet.getRange(lastRow, 1).getValue();
    if (!ret) {
      throw new Error('最新のツイートIDが取得できませんでした');
    }
    return ret;
  }
}

// 行を扱いやすくするラッパー
class PostRowRange {
  private range: GoogleAppsScript.Spreadsheet.Range;

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number) {
    this.range = sheet.getRange(row, 1, 1, 5);
  }

  isProcessed() {
    return this.range.getValues()[0][1] as boolean;
  }
}

export type DraftPost = {
  id: string;
  userId: string;
  tags: HashTag[];
  createdAt: string;
};

type PostRowValues = [
  string, // tweet_id
  string, // user_id
  string, // created_at
  string, // tags カンマ区切り
  Date, // added_at(シート記述日時)
];

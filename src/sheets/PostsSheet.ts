export class PostsSheet {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  writePosts(posts: DraftPost[]) {
    for (const post of posts) {
      const row: PostRowValues = [
        post.id,
        false, // posted
        false, // liked
        post.userId,
        post.tags.join(','),
        post.createdAt,
        new Date(),
      ];
      this.sheet.appendRow(row);
    }
  }

  // リポストもしくはいいねがされていないポストを取得
  getReadyPostRowRange(): PostRowRange[] {
    const lastRow = this.sheet.getLastRow();
    const ranges: PostRowRange[] = [];
    for (let i = 2; i <= lastRow; i++) {
      const range = new PostRowRange(this.sheet, i);
      if (range.isReady()) ranges.push(range);
    }
    return ranges;
  }
}

// 行を扱いやすくするラッパー
class PostRowRange {
  private range: GoogleAppsScript.Spreadsheet.Range;

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number) {
    this.range = sheet.getRange(row, 1, 1, 7);
  }

  // リポストもしくはいいねがされていないポストかどうか
  isReady() {
    return !this.isReposted() && !this.isLiked();
  }

  isReposted() {
    return this.range.getValues()[0][1] as boolean;
  }

  isLiked() {
    return this.range.getValues()[0][2] as boolean;
  }
}

export type DraftPost = {
  id: string;
  userId: string;
  tags: HashTag[];
  createdAt: string;
};

type PostRowValues = [
  string,
  boolean,
  boolean,
  string,
  string, // カンマ区切り
  string,
  Date,
];

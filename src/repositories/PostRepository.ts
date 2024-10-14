export interface PostRepository {
  save(draft: DraftPost): void;
  findAllIds(): string[];
  getLatestId(): string;
}

type Post = {
  id: string;
  userId: string;
  tags: HashTag[];
  createdAt: string;
  addedAt: Date;
};

type DraftPost = Omit<Post, 'addedAt'>;

// GoogleSpreadSheetを使ったPostRepositoryの実装
export class PostRepositoryImpl implements PostRepository {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  save(post: DraftPost) {
    const row: PostRowValues = [
      post.id,
      post.userId,
      post.createdAt,
      post.tags.join(','),
      new Date(),
    ];
    this.sheet.appendRow(row);
  }

  // すべてのツイートIDを取得
  findAllIds(): string[] {
    const ids = this.sheet.getRange('A2:A').getValues().flat();
    return ids.filter((id) => id !== ''); // 空文字は除外
  }

  // 最も新しいツイートIDを取得
  getLatestId(): string {
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

type PostRowValues = [
  string, // tweet_id
  string, // user_id
  string, // created_at
  string, // tags カンマ区切り
  Date, // added_at(シート記述日時)
];

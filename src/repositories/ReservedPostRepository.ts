export interface ReservedPostRepository {
  save(tweetId: string): void;
  findAllIds(): string[];
  findReadyIds(): string[];
  markAsPosted(tweetId: string): void;
}

// GoogleSpreadSheetを使ったReservedPostRepositoryの実装
export class ReservedPostRepositoryImpl implements ReservedPostRepository {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  save(tweetId: string) {
    this.sheet.appendRow([tweetId, new Date()]);
  }

  findAllIds(): string[] {
    const ids = this.sheet.getRange('A2:A').getValues().flat();
    return ids.filter((id) => id !== ''); // 空文字は除外
  }

  // リポストしていないIDを取得
  findReadyIds(): string[] {
    return this.sheet
      .getRange('A2:C')
      .getValues()
      .filter(([id, , postedAt]) => id && !postedAt)
      .map(([id]) => id);
  }

  // リポスト済みにマーク
  //    findReadyIdsとPairでCellの参照を返しても良いが規律のために分離している
  markAsPosted(tweetId: string) {
    const ids = this.sheet.getRange('A2:A').getValues().flat();
    const index = ids.findIndex((id) => id === tweetId);
    if (index === -1) {
      throw new Error('指定されたツイートIDが見つかりませんでした');
    }
    // gerRangeのindexは1始まりなので+2(ヘッダ分)
    this.sheet.getRange(index + 2, 3).setValue(new Date());
  }
}

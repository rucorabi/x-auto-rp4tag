export class ReservedSheet {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  writePosts(tweetId: string) {
    this.sheet.appendRow([tweetId, new Date()]);
  }

  // すべてのツイートIDを取得
  getAllIds(): string[] {
    const ids = this.sheet.getRange('A2:A').getValues().flat();
    return ids.filter((id) => id !== ''); // 空文字は除外
  }

  // リポストしていないIDと紐づくpostedAtセルを取得
  getReadyIdWithPostedAtCell(): [string, GoogleAppsScript.Spreadsheet.Range][] {
    const ret: [string, GoogleAppsScript.Spreadsheet.Range][] = [];
    for (let i = 2; i <= this.sheet.getLastRow(); i++) {
      const range = this.sheet.getRange(i, 1, 1, 3);
      const id = range.getCell(1, 1).getValue();
      const postedAtCell = range.getCell(1, 3);
      if (postedAtCell.isBlank()) {
        ret.push([id, postedAtCell]);
      }
    }
    return ret;
  }
}

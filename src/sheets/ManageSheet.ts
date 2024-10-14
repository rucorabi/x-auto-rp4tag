export class ManageSheet {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  getLatestTweetId() {
    return this.sheet.getRange('B5').getValue();
  }

  setLatestTweetId(id: string) {
    this.sheet.getRange('B5').setValue(id);
  }

  needPickPastPost() {
    return this.sheet.getRange('B4').getValue();
  }

  runPastPostProcessMarkAs(flag: boolean) {
    this.sheet.getRange('B4').setValue(flag);
  }

  isMaintenaneMode() {
    return this.sheet.getRange('B2').getValue();
  }
}

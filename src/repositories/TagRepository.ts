import { isHashTag } from '../utils';

export interface TagRepository {
  findAll(): HashTag[];
}

// GoogleSpreadSheetを使ったTagRepositoryの実装
export class TagRepositoryImpl implements TagRepository {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  findAll(): HashTag[] {
    const values = this.sheet.getRange('A2:C').getValues() as TagRow[];
    return values
      .filter(([id, tag, disable]) => id && tag && !disable)
      .map<HashTag>(([, tag]) =>
        // 念の為 # を補完 (誤爆するとRateLimitを消費するので予防)
        isHashTag(tag) ? tag : `#${tag}`,
      );
  }
}

type TagRow = [
  string, // id
  string, // tag
  boolean, // disable
];

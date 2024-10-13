export class TagsSheet {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  // #が付いている前提
  enableTags(): HashTag[] {
    const values = this.sheet.getRange('A2:C').getValues() as TagRow[];
    return values
      .filter(([id, tag, disable]) => id && tag && !disable)
      .map<HashTag>(([, tag]) =>
        // 念の為 # を補完 (誤爆するとRateLimitを消費するので予防)
        isHashTag(tag) ? tag : `#${tag}`,
      );
  }
}

function isHashTag(tag: string): tag is HashTag {
  return tag.startsWith('#');
}

type TagRow = [
  string, // id
  string, // tag
  boolean, // disable
];

import { ManageSheet } from './ManageSheet';
import { PostsSheet } from './PostsSheet';
import { ReservedSheet } from './ReservedSheet';
import { TagsSheet } from './TagsSheet';

export function getSheets(ssheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
  const s = (sheetName: string) => ssheet.getSheetByName(sheetName)!;
  return {
    Manage: new ManageSheet(s('manage'))!,
    Tags: new TagsSheet(s('tags')!),
    Posts: new PostsSheet(s('posts')!),
    Reserved: new ReservedSheet(s('reserved')!),
  } as const;
}

export { ManageSheet, PostsSheet, ReservedSheet, TagsSheet };

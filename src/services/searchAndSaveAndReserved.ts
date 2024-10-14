import type { PostsSheet } from '../sheets/PostsSheet';
import type { TagsSheet } from '../sheets/TagsSheet';
import { ReservedSheet } from '../sheets/ReservedSheet';

import { ScriptProperties } from '../configs';
import { MyClient } from '../twitter';
import { genAnyTagAndExcludeRetweetQuery } from '../utils';

type Params = {
  tagsSheet: TagsSheet;
  postsSheet: PostsSheet;
  reservedSheet: ReservedSheet;
};

export function searchAndSaveAndReserved(
  props: ScriptProperties,
  { tagsSheet, postsSheet, reservedSheet }: Params,
) {
  const searchClient = new MyClient(props.app_token);

  const sinceId = postsSheet.latestPostId();
  const query = genAnyTagAndExcludeRetweetQuery(tagsSheet.enableTags());
  const searchResult = searchClient.search(query, sinceId);

  if (searchResult.length === 0) {
    console.log('新しいFAは見つかりませんでした');
    return;
  }

  for (const post of searchResult) {
    postsSheet.writePosts(post);
    reservedSheet.writePosts(post.id);
  }
  return searchResult;
}

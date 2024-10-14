import { ScriptProperties } from '../configs';
import { MyClient } from '../twitter';
import { genAnyTagAndExcludeRetweetQuery } from '../utils';

import type { PostsSheet, TagsSheet, ReservedSheet } from '../sheets';

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
  console.log(`sinceId: ${sinceId}`);
  const query = genAnyTagAndExcludeRetweetQuery(tagsSheet.enableTags());
  const searchResult = searchClient.search(query, sinceId);

  if (searchResult.length === 0) {
    console.log('新しいFAは見つかりませんでした');
    return;
  }

  for (const post of searchResult) {
    console.log(
      `新しいFAを見つけました: id=${post.id}, tags=${post.tags.join(',')}`,
    );
    postsSheet.writePosts(post);
    reservedSheet.writePosts(post.id);
  }
  return searchResult;
}

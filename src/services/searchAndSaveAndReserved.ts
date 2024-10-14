import type { ScriptProperties } from '../configs';
import { MyClient } from '../twitter';
import { genAnyTagAndExcludeRetweetQuery } from '../utils';

import type {
  PostRepository,
  ReservedPostRepository,
  TagRepository,
} from '../repositories';

type Params = {
  tagRepos: TagRepository;
  postRepos: PostRepository;
  reservedRepos: ReservedPostRepository;
};

export function searchAndSaveAndReserved(
  props: ScriptProperties,
  { tagRepos, postRepos, reservedRepos }: Params,
) {
  const searchClient = new MyClient(props.app_token);

  const sinceId = postRepos.getLatestId();
  console.log(`sinceId: ${sinceId}`);
  const query = genAnyTagAndExcludeRetweetQuery(tagRepos.findAll());
  const searchResult = searchClient.search(query, sinceId);

  if (searchResult.length === 0) {
    console.log('新しいFAは見つかりませんでした');
    return;
  }

  for (const post of searchResult) {
    console.log(
      `新しいFAを見つけました: id=${post.id}, tags=${post.tags.join(',')}`,
    );
    postRepos.save(post);
    reservedRepos.save(post.id);
  }
  return searchResult;
}

import { AppManager } from './app_manager';
import { Thought } from './responses';
import { makeReplyContainer } from './reply';
import { makeThoughtContainer } from './thought';
import { parseCurrentURL } from './params';
import { ThoughtEntity, ReplyEntity } from './entity/entities';
import { ThoughtParams, ReplyParams } from './params';
import { makeNewReplyContainer } from './new_reply';

export async function startingDraw(appManager: AppManager) {
  const params = await parseCurrentURL(appManager.ensLooker);

  if (params instanceof ThoughtParams) {
    let thoughts: Thought[] = new Array();

    if (params.thoughtID) {
      const thought = await appManager.fetcher.getThoughtByID(params.thoughtID);
      if (thought) {
        thoughts = new Array(thought);
      }
    } else if (params.hashtag) {
      const data = await appManager.fetcher.getThoughtsByHashtag(params.hashtag, params.skip);
      if (data) {
        thoughts = data;
      }
    } else if (params.displayName || params.address) {
      const data = await appManager.fetcher.getThoughtsByAuthor(
        params.displayName,
        params.address,
        params.skip
      );
      if (data) {
        thoughts = data;
      }
    } else {
      const data = await appManager.fetcher.getRecentThoughts(params.skip);
      if (data) {
        thoughts = data;
      }
    }

    const entities = thoughts.map((t) => {
      const entity = new ThoughtEntity(t);
      appManager.entityStore.thoughts.set(t.id, entity);
      return entity;
    });

    const thoughtsContainer = document.getElementById('thoughts-container');

    entities.forEach((t) => {
      thoughtsContainer!.appendChild(makeThoughtContainer(t, appManager));
    });
  } else if (params instanceof ReplyParams) {
    const fetchedReply = await appManager.fetcher.getReplyByID(params.replyID);
    if (fetchedReply) {
      const entity = new ReplyEntity(fetchedReply);
      appManager.entityStore.replies.set(fetchedReply.id, entity);

      const thoughtsContainer = document.getElementById('thoughts-container');
      const thought = entity.thought;
      const container = makeReplyContainer(entity, true, appManager, true);

      const repliesContainer = document.createElement('div');
      repliesContainer.classList.add('thought-replies-container');
      repliesContainer.id = `replies-${thought}`;
      repliesContainer!.appendChild(container);
      repliesContainer.appendChild(makeNewReplyContainer(thought, appManager));
      thoughtsContainer!.appendChild(repliesContainer);
    }
  }
}

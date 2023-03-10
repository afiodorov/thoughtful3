import { AppManager } from './app_manager';
import { fetchReplies } from './reply';
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

    if (params.thoughtID) {
      const replyContainer = document.getElementById(`replies-${params.thoughtID}`)!;

      fetchReplies(params.thoughtID, appManager).then((replies) => {
        const newReply = document.getElementById(`new-reply-${params.thoughtID}`)!;
        replyContainer.innerHTML = '';

        replies.forEach((reply) => {
          replyContainer.appendChild(reply);
        });

        replyContainer.appendChild(newReply);
      });
    }
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

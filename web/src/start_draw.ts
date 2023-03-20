import { AppManager } from './app_manager';
import { fetchReplies } from './reply';
import { Thought } from './responses';
import { makeReplyContainer } from './reply';
import { makeThoughtContainer } from './thought';
import { parseCurrentURL } from './params';
import { ThoughtEntity, ReplyEntity } from './entity/entities';
import { ThoughtParams, ReplyParams } from './params';
import { makeNewReplyContainer } from './new_reply';
import { pageSize } from './config';

export async function startingDraw(appManager: AppManager) {
  const params = await parseCurrentURL(appManager.ensLooker);

  if (params instanceof ThoughtParams) {
    let thoughts: Thought[] = new Array();
    let numThoughts: bigint | null = null;

    if (params.thoughtID) {
      const thought = await appManager.fetcher.getThoughtByID(params.thoughtID);
      if (thought) {
        thoughts = new Array(thought);
      }
    } else if (params.hashtag) {
      const data = await appManager.fetcher.getThoughtsByHashtag(params.hashtag, params.from);
      if (data) {
        thoughts = data.thoughts;
        numThoughts = data.from;
      }
    } else if (params.displayName || params.address) {
      const data = await appManager.fetcher.getThoughtsByAuthor(
        params.displayName,
        params.address,
        params.from
      );
      if (data) {
        thoughts = data.thoughts;
        numThoughts = data.from;
      }
    } else {
      const data = await appManager.fetcher.getRecentThoughts(params.from);
      if (data) {
        thoughts = data.thoughts;
        numThoughts = data.from;
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

    if (numThoughts) {
      const from = params.from || numThoughts;
      const pagesContainer = document.getElementById('pages-container')!;

      let prevFrom = from - BigInt(pageSize);

      if (prevFrom > 0) {
        const prev = document.createElement('a');
        prev.classList.add('prev-page');
        prev.href = `?${params.shiftFrom(prevFrom).url()}`;
        prev.innerHTML = '<span class="icon-pagination"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-p"><polyline points="15 18 9 12 15 6"></polyline></svg> <span>Prev</span></span>';

        pagesContainer.appendChild(prev);
      }

      if (from < numThoughts) {
        const next = document.createElement('a');
        next.classList.add('next-page');
        next.href = `?${params.shiftFrom(from + BigInt(pageSize)).url()}`;
        next.innerHTML = '<span class="icon-pagination" > <span>Next</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-p"><polyline points="9 18 15 12 9 6"></polyline></svg> </span>';

        pagesContainer.appendChild(next);
      }
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

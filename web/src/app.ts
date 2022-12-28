import { Thought, Reply } from './responses';
import { makeReplyContainer } from './reply';
import { makeThoughtContainer } from './thought';
import { AppManager } from './app_manager';
import { parseCurrentURL } from './params';
import {
  allRecentThoughts,
  thoughtByID,
  replyByID,
  thoughtsByHashtag,
  thoughtsByAuthor
} from './queries';
import { ThoughtEntity, ReplyEntity } from './entity/entities';
import { ThoughtParams, ReplyParams } from './params';
import { init } from './handlers/init';
import { makeNewReplyContainer } from './new_reply';

const appManager = new AppManager();

init(appManager);

const params = parseCurrentURL();

if (params instanceof ThoughtParams) {
  let query: string;

  if (params.thoughtID) {
    query = thoughtByID(params.thoughtID);
  } else if (params.hashtag) {
    query = thoughtsByHashtag(params.hashtag, params.skip);
  } else if (params.displayName || params.address) {
    query = thoughtsByAuthor(params.displayName, params.address, params.skip);
  } else {
    query = allRecentThoughts(params.skip);
  }

  const thoughts = (await appManager.queryDispatcher.fetch(query))['newTweets'] as Thought[];

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
  const query = replyByID(params.replyID);
  const fetchedReplies = (await appManager.queryDispatcher.fetch(query))['newReplies'] as Reply[];
  const entities = fetchedReplies.map((r) => {
    const entity = new ReplyEntity(r);
    appManager.entityStore.replies.set(r.id, entity);
    return entity;
  });

  const thoughtsContainer = document.getElementById('thoughts-container');

  let thought: string | null = null;

  entities
    .map((reply) => {
      thought = reply.tweet;
      return makeReplyContainer(reply, true, appManager, true);
    })
    .forEach((reply) => {
      const repliesContainer = document.createElement('div');
      repliesContainer.classList.add('thought-replies-container');
      repliesContainer.id = `replies-${thought}`;
      repliesContainer!.appendChild(reply);
      repliesContainer.appendChild(makeNewReplyContainer(thought!, appManager));
      thoughtsContainer!.appendChild(repliesContainer);
    });
}

export {};

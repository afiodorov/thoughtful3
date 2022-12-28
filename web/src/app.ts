import { Thought, Reply } from './responses';
import { makeReplyContainer } from './reply';
import { makeThoughtContainer } from './thought';
import { AppManager } from './app_manager';
import { parseCurrentURL } from './params';
import { allRecentThoughts, thoughtByID, replyByID } from './queries';
import { ThoughtEntity } from './entity_store';
import { ThoughtParams, ReplyParams } from './params';
import { init } from './handlers/init';
import { ReplyEntity } from './entity_store';

const appManager = new AppManager();

init(appManager);

const params = parseCurrentURL();

if (params instanceof ThoughtParams) {
  let query: string;

  if (params.thoughtID) {
    query = thoughtByID(params.thoughtID);
  } else {
    query = allRecentThoughts;
  }

  const thoughts = (await appManager.queryDispatcher.fetch(query))['newTweets'] as Thought[];

  thoughts.forEach((t) => {
    appManager.entityStore.thoughts.set(t.id, new ThoughtEntity(t));
  });

  const thoughtsContainer = document.getElementById('thoughts-container');

  thoughts.forEach((t) => {
    thoughtsContainer!.appendChild(makeThoughtContainer(t, appManager));
  });
} else if (params instanceof ReplyParams) {
  const query = replyByID(params.replyID);
  const fetchedReplies = (await appManager.queryDispatcher.fetch(query))['newReplies'] as Reply[];
  fetchedReplies.forEach((r) => appManager.entityStore.replies.set(r.id, new ReplyEntity(r)));

  const thoughtsContainer = document.getElementById('thoughts-container');

  fetchedReplies
    .map((reply) => {
      return makeReplyContainer(reply, true, appManager, true);
    })
    .forEach((reply) => {
      thoughtsContainer!.appendChild(reply);
    });
}

export {};

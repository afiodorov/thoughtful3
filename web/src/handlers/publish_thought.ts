import { MetaMask } from '../meta_mask';
import { AppManager } from '../app_manager';
import { ThoughtEntity } from '../entity/entities';
import { makeThoughtContainer } from '../thought';

let publishThoughtLock = false;

export async function publishThought(
  event: Event,
  metaMask: MetaMask,
  appManager: AppManager
): Promise<void> {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (publishThoughtLock) {
    return;
  }

  publishThoughtLock = true;
  event.target.textContent = '🕑';

  const thoughtID = event!.target!.getAttribute('thought-id');
  const replyID = event!.target!.getAttribute('reply-id');

  const text = document.getElementById('new-thought-text')!.textContent!;
  const hashtag = document.getElementById('new-thought-hashtag')!.textContent!;
  const displayName = document.getElementById('new-thought-author')!.textContent!;

  let quoteText = '';
  let quoteDisplayName = '';
  let quoteHashtag = '';
  let quoteSender = '';

  let quoteID: string | null;

  if (thoughtID) {
    quoteID = thoughtID;
    quoteHashtag = hashtag;
    quoteText = appManager.entityStore.thoughts.get(thoughtID)!.text;
    quoteDisplayName = appManager.entityStore.thoughts.get(thoughtID)!.displayName;
    quoteSender = appManager.entityStore.thoughts.get(thoughtID)!.sender;
  } else if (replyID) {
    quoteID = replyID;
    quoteHashtag = hashtag;
    quoteText = appManager.entityStore.replies.get(replyID)!.text;
    quoteDisplayName = appManager.entityStore.replies.get(replyID)!.displayName;
    quoteSender = appManager.entityStore.replies.get(replyID)!.sender;
  } else {
    quoteID = null;
  }

  const newThought = await metaMask.newThought(
    text,
    displayName,
    hashtag,
    quoteID,
    replyID !== null
  );

  if (!newThought) {
    publishThoughtLock = false;
    event.target.textContent = '📧';
    return;
  }

  const t = new ThoughtEntity({
    id: newThought.value,
    sender: newThought.sender,
    text: text,
    displayName: displayName,
    hashtag: hashtag,
    blockTimestamp: newThought.blockTimestamp,
    numLikes: 0,
    numReplies: 0,
    numRetweets: 0,
    quoteText: quoteText,
    quoteDisplayName: quoteDisplayName,
    quoteSender: quoteSender,
    quoteHashtag: quoteHashtag,
    retweetOf: quoteID || '0',
    isReplyRetweet: replyID !== null
  });

  appManager.entityStore.thoughts.set(newThought.value, t);
  const container = makeThoughtContainer(t, appManager);

  const allThoughts = document.getElementById('thoughts-container')!;
  const firstChild = allThoughts.firstChild;
  if (firstChild) {
    allThoughts.insertBefore(container, firstChild);
  } else {
    allThoughts.append(container);
  }

  document.getElementById('overlay')!.style.display = 'none';
  document.getElementById('dialogue')!.style.display = 'none';

  if (thoughtID) {
    appManager.entityStore.thoughts.get(thoughtID)!.numQuotes += 1;
    document.getElementById(`thought-${thoughtID}-quotes`)!.textContent = `${
      appManager.entityStore.thoughts.get(thoughtID)!.numQuotes
    }`;
    appManager.queryDispatcher.invalidateCache();
  } else if (replyID) {
    appManager.entityStore.replies.get(replyID)!.numQuotes += 1;
    document.getElementById(`reply-${replyID}-quotes`)!.textContent = `${
      appManager.entityStore.replies.get(replyID)!.numQuotes
    }`;
    appManager.queryDispatcher.invalidateCache();
  }

  event.target.textContent = '📧';
  publishThoughtLock = false;
}

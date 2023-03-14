import { MetaMask } from '../meta_mask';
import { AppManager } from '../app_manager';
import { ThoughtEntity } from '../entity/entities';
import { makeThoughtContainer } from '../thought';

let publishThoughtLock = false;

export const publishButton = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
`;

export async function publishThought(
  event: Event,
  thoughtID: string | null,
  replyID: string | null,
  metaMask: MetaMask,
  appManager: AppManager
): Promise<void> {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (publishThoughtLock) {
    return;
  }

  const parent = event.target.parentElement!;

  publishThoughtLock = true;
  parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';

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
    parent.innerHTML = publishButton;
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
    appManager.fetcher.invalidateCache();
  } else if (replyID) {
    appManager.entityStore.replies.get(replyID)!.numQuotes += 1;
    document.getElementById(`reply-${replyID}-quotes`)!.textContent = `${
      appManager.entityStore.replies.get(replyID)!.numQuotes
    }`;
    appManager.fetcher.invalidateCache();
  }

  parent.innerHTML = publishButton;
  publishThoughtLock = false;
}

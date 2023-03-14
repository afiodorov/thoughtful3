import { MetaMask } from '../meta_mask';
import { AppManager } from '../app_manager';
import { ReplyEntity } from '../entity/entities';
import { makeReplyContainer } from '../reply';
import { publishButton } from './publish_thought';

let lock: Map<string, boolean> = new Map();

export async function publishReply(
  event: Event,
  thoughtID: string,
  metaMask: MetaMask,
  appManager: AppManager
): Promise<void> {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (lock.get(thoughtID)) {
    return;
  }

  const parent = event.target.parentElement!;

  const text = document.getElementById(`new-reply-text-${thoughtID}`)!.textContent!;
  const displayName = document.getElementById(`new-reply-author-${thoughtID}`)!.textContent!;

  lock.set(thoughtID, true);
  parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';

  const newReply = await metaMask.newReply(text, displayName, thoughtID, 0);

  if (!newReply) {
    lock.set(thoughtID, false);
    parent.innerHTML = publishButton;
    return;
  }

  const r = new ReplyEntity({
    id: newReply.value,
    sender: newReply.sender,
    text: text,
    displayName: displayName,
    blockTimestamp: newReply.blockTimestamp,
    numLikes: 0,
    numRetweets: 0,
    seq_num: 0,
    tweet: thoughtID
  });

  appManager.entityStore.replies.set(newReply.value, r);

  const container = makeReplyContainer(r, true, appManager, true);

  const allReplies = document.getElementById(`replies-${thoughtID}`)!;
  const newReplyElement = document.getElementById(`new-reply-${thoughtID}`)!;
  allReplies.insertBefore(container, newReplyElement);
  newReplyElement.style.display = 'none';

  const thoughtEntity = appManager.entityStore.thoughts.get(thoughtID);

  if (thoughtEntity) {
    thoughtEntity.numReplies += 1;

    const replyLink = document.getElementById(`thought-${thoughtID}-new-reply`)!;
    replyLink.textContent = `${thoughtEntity.numReplies}`;
    replyLink.style.display = 'inline';
  }

  appManager.fetcher.invalidateCache();

  lock.set(thoughtID, false);
  parent.innerHTML = publishButton;
}

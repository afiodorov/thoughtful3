import { EntityStore } from '../entity/store';
import { MetaMask } from '../meta_mask';
import { QueryDispatcher } from '../query';

const likeThoughtLock: Map<string, boolean> = new Map();
const likeReplyLock: Map<string, boolean> = new Map();

export async function likeThought(
  event: Event,
  metaMask: MetaMask,
  entityStore: EntityStore,
  queryDispatcher: QueryDispatcher
): Promise<void> {
  if (!(event.target instanceof Element)) {
    return;
  }

  const thoughtID: string = event!.target!.getAttribute('thought-id')!;

  if (likeThoughtLock.get(thoughtID)) {
    return;
  }

  likeThoughtLock.set(thoughtID, true);

  const tx = await metaMask.newLike(thoughtID, false);

  if (!tx) {
    likeThoughtLock.set(thoughtID, false);
    return;
  }

  entityStore.thoughts.get(thoughtID)!.numLikes += 1;
  const curLikesElement = document.getElementById(`thought-${thoughtID}-likes`)!;
  curLikesElement.textContent = `${entityStore.thoughts.get(thoughtID)!.numLikes}`;
  queryDispatcher.invalidateCache();

  likeThoughtLock.set(thoughtID, false);
}

export async function likeReply(
  event: Event,
  metaMask: MetaMask,
  entityStore: EntityStore,
  queryDispatcher: QueryDispatcher
): Promise<void> {
  if (!(event.target instanceof Element)) {
    return;
  }

  const replyID: string = event!.target!.getAttribute('reply-id')!;

  if (likeReplyLock.get(replyID)) {
    return;
  }

  likeReplyLock.set(replyID, true);

  const tx = await metaMask.newLike(replyID, false);

  if (!tx) {
    likeReplyLock.set(replyID, false);
    return;
  }

  entityStore.replies.get(replyID)!.numLikes += 1;
  const curLikesElement = document.getElementById(`reply-${replyID}-likes`)!;
  curLikesElement.textContent = `${entityStore.replies.get(replyID)!.numLikes}`;
  queryDispatcher.invalidateCache();

  likeReplyLock.set(replyID, false);
}

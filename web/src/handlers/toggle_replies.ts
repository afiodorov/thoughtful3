import { fetchReplies } from '../reply';
import { AppManager } from '../app_manager';

const toggledLock: Map<string, boolean> = new Map();

export function toggleReplies(event: Event, appManager: AppManager): void {
  if (!(event.target instanceof Element)) {
    return;
  }

  const thoughtID: string = event!.target!.getAttribute('thought-id')!;

  if (toggledLock.get(thoughtID)) {
    return;
  }

  toggledLock.set(thoughtID, true);
  const replyContainer = document.getElementById(thoughtID)!;

  if (replyContainer.children.length > 0) {
    replyContainer.innerHTML = '';
    toggledLock.set(thoughtID, false);
    return;
  }

  fetchReplies(thoughtID, appManager).then((replies) => {
    replies.forEach((reply) => {
      replyContainer.appendChild(reply);
    });

    toggledLock.set(thoughtID, false);
  });
}

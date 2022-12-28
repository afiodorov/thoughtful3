import { AppManager } from '../app_manager';

const toggledLock: Map<string, boolean> = new Map();

export function toggleNewReply(event: Event, appManager: AppManager): void {
  if (!(event.target instanceof Element)) {
    return;
  }

  const thoughtID: string = event!.target!.getAttribute('thought-id')!;

  if (toggledLock.get(thoughtID)) {
    return;
  }

  toggledLock.set(thoughtID, true);

  const newReply = document.getElementById(`new-reply-${thoughtID}`)!;
  if (newReply.style.display === 'none') {
    newReply.style.display = 'flex';
  } else {
    newReply.style.display = 'none';
  }

  toggledLock.set(thoughtID, false);
}

import { AppManager } from '../app_manager';
import { setDomain } from '../utils';

const toggledLock: Map<string, boolean> = new Map();

export async function toggleNewReply(thoughtID: string, appManager: AppManager): Promise<void> {
  if (toggledLock.get(thoughtID)) {
    return;
  }

  toggledLock.set(thoughtID, true);

  const newReply = document.getElementById(`new-reply-${thoughtID}`)!;

  if (newReply.style.display === 'flex') {
    newReply.style.display = 'none';
    toggledLock.set(thoughtID, false);
    return;
  }

  const me = await appManager.metaMask!.selectedAddress();

  if (!me) {
    toggledLock.set(thoughtID, false);
    return;
  }

  await setDomain(me, appManager, thoughtID);

  newReply.style.display = 'flex';
  toggledLock.set(thoughtID, false);
}

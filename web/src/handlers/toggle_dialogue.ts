import { AppManager } from '../app_manager';
import { MetaMask } from '../meta_mask';
import { formatSingleLineText, formatMultiLineText } from '../formatters';
import { setDomain } from '../utils';

let dialogueVisibleLock = false;

export async function toggleDialogue(
  event: Event,
  metaMask: MetaMask,
  appManager: AppManager
): Promise<void> {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (dialogueVisibleLock) {
    return;
  }

  dialogueVisibleLock = true;

  const me = await metaMask.selectedAddress();

  if (!me) {
    dialogueVisibleLock = false;
    return;
  }

  await setDomain(me, appManager);

  const dialogue = document.getElementById('dialogue')!;
  const overlay = document.getElementById('overlay')!;

  if (dialogue.style.display !== 'flex') {
    dialogue.style.display = 'flex';
    overlay.style.display = 'flex';
  } else {
    dialogue.style.display = 'none';
    overlay.style.display = 'none';
  }

  const thoughtID = event!.target!.getAttribute('thought-id');
  const replyID = event!.target!.getAttribute('reply-id');

  if (thoughtID) {
    const newHashtagElement = document.getElementById('new-thought-hashtag')!;
    newHashtagElement.removeAttribute('contenteditable');
    newHashtagElement.textContent = formatSingleLineText(
      appManager.entityStore.thoughts.get(thoughtID)!.hashtag
    );

    const publishButton = document.getElementById('new-thought-publish')!;
    publishButton.setAttribute('thought-id', thoughtID);
    publishButton.removeAttribute('reply-id');

    document.getElementById('quote-author')!.textContent = formatSingleLineText(
      appManager.entityStore.thoughts.get(thoughtID)!.displayName
    );

    (
      document.getElementById('quote-author-link')! as HTMLAnchorElement
    ).href = `?thought-id=${thoughtID}`;

    document.getElementById('quote-text')!.innerHTML = formatMultiLineText(
      appManager.entityStore.thoughts.get(thoughtID)!.text
    );

    const sender = appManager.entityStore.thoughts.get(thoughtID)!.sender;
    const domain = await appManager.ensLooker.reverseLookup(sender);

    if (domain !== null) {
      document.getElementById('quote-domain')!.textContent = `@${domain}`;
    } else {
      document.getElementById('quote-domain')!.textContent = `@${sender}`;
    }

    document.getElementById('quote-container')!.style.display = 'flex';
  } else if (replyID) {
    const newHashtagElement = document.getElementById('new-thought-hashtag')!;
    newHashtagElement.removeAttribute('contenteditable');
    newHashtagElement.textContent = formatSingleLineText(
      appManager.entityStore.thoughts.get(appManager.entityStore.replies.get(replyID)!.tweet)!
        .hashtag
    );

    const publishButton = document.getElementById('new-thought-publish')!;
    publishButton.setAttribute('reply-id', replyID);
    publishButton.removeAttribute('thought-id');

    document.getElementById('quote-author')!.textContent = formatSingleLineText(
      appManager.entityStore.replies.get(replyID)!.displayName
    );

    (
      document.getElementById('quote-author-link')! as HTMLAnchorElement
    ).href = `?reply-id=${replyID}`;

    document.getElementById('quote-text')!.innerHTML = formatMultiLineText(
      appManager.entityStore.replies.get(replyID)!.text
    );

    const sender = appManager.entityStore.replies.get(replyID)!.sender;
    const domain = await appManager.ensLooker.reverseLookup(sender);

    if (domain !== null) {
      document.getElementById('quote-domain')!.textContent = `@${domain}`;
    } else {
      document.getElementById('quote-domain')!.textContent = sender;
    }

    document.getElementById('quote-container')!.style.display = 'flex';
  } else {
    const newHashtagElement = document.getElementById('new-thought-hashtag')!;
    newHashtagElement.setAttribute('contenteditable', 'true');

    const publishButton = document.getElementById('new-thought-publish')!;
    publishButton.removeAttribute('reply-id');
    publishButton.removeAttribute('thought-id');

    document.getElementById('quote-container')!.style.display = 'none';
  }

  dialogueVisibleLock = false;
}

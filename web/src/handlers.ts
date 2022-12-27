import { AppManager } from './app_manager';
import { MetaMask } from './meta_mask';
import { fetchReplies } from './reply';
import { formatSingleLineText, formatMultiLineText } from './formatters';
import { defaultHashtag, defaultName, defaultText } from './config';
import { toUTF8Array } from './utils';
import { NewThought } from './responses';
import { makeThoughtContainer } from './thought';

export class InteractionState {
  private toggledLock: Map<string, boolean> = new Map();
  private likeThoughtLock: Map<string, boolean> = new Map();
  private likeReplyLock: Map<string, boolean> = new Map();
  private dialogueVisibleLock = false;
  private toggleAccountsLock = false;

  toggleReplies(event: Event, appManager: AppManager): void {
    if (!(event.target instanceof Element)) {
      return;
    }

    const thoughtID: string = event!.target!.getAttribute('thought-id')!;
    const thoughtDisplayName = appManager.entityStore.thoughts.get(thoughtID)!.displayName;
    const thoughtSender = appManager.entityStore.thoughts.get(thoughtID)!.sender;

    if (this.toggledLock.has(thoughtID) && this.toggledLock.get(thoughtID)) {
      return;
    }

    this.toggledLock.set(thoughtID, true);
    const replyContainer = document.getElementById(thoughtID)!;

    if (replyContainer.children.length > 0) {
      replyContainer.innerHTML = '';
      this.toggledLock.set(thoughtID, false);
      return;
    }

    fetchReplies(thoughtID, thoughtDisplayName, thoughtSender, appManager).then((replies) => {
      replies.forEach((reply) => {
        replyContainer.appendChild(reply);
      });

      this.toggledLock.set(thoughtID, false);
    });
  }

  async likeThought(event: Event, metaMask: MetaMask): Promise<void> {
    if (!(event.target instanceof Element)) {
      return;
    }

    const thoughtID: string = event!.target!.getAttribute('thought-id')!;
    const curLikesElement = document.getElementById(`thought-${thoughtID}-likes`);
    if (curLikesElement === null) {
      return;
    }

    let numLikes: number;

    try {
      numLikes = parseInt(curLikesElement.textContent!) || 0;
    } catch (e) {
      numLikes = 0;
    }

    if (this.likeThoughtLock.has(thoughtID) && this.likeThoughtLock.get(thoughtID)) {
      return;
    }

    this.likeThoughtLock.set(thoughtID, true);

    const tx = await metaMask.newLike(thoughtID, false);

    if (tx !== null) {
      // we'll just assume it's succeeded for now
      curLikesElement.textContent = `${numLikes + 1}`;
    }

    this.likeThoughtLock.set(thoughtID, false);
  }

  async likeReply(event: Event, metaMask: MetaMask): Promise<void> {
    if (!(event.target instanceof Element)) {
      return;
    }

    const replyID: string = event!.target!.getAttribute('reply-id')!;
    const curLikesElement = document.getElementById(`reply-${replyID}-likes`);
    if (curLikesElement === null) {
      return;
    }

    let numLikes: number;

    try {
      numLikes = parseInt(curLikesElement.textContent!) || 0;
    } catch (e) {
      numLikes = 0;
    }

    if (this.likeReplyLock.has(replyID) && this.likeReplyLock.get(replyID)) {
      return;
    }

    this.likeReplyLock.set(replyID, true);

    const tx = await metaMask.newLike(replyID, true);

    if (tx !== null) {
      // we'll just assume it's succeeded for now
      curLikesElement.textContent = `${numLikes + 1}`;
    }

    this.likeReplyLock.set(replyID, false);
  }

  async toggleDialogue(event: Event, metaMask: MetaMask, appManager: AppManager): Promise<void> {
    if (!(event.target instanceof Element)) {
      return;
    }

    if (this.dialogueVisibleLock) {
      return;
    }

    this.dialogueVisibleLock = true;

    const me = await metaMask.selectedAddress();

    if (me === null) {
      this.dialogueVisibleLock = false;
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

      document.getElementById('quote-author')!.textContent = `>${formatSingleLineText(
        appManager.entityStore.thoughts.get(thoughtID)!.displayName
      )}`;

      document.getElementById('quote-text')!.innerHTML = formatMultiLineText(
        appManager.entityStore.thoughts.get(thoughtID)!.text
      );

      const sender = appManager.entityStore.thoughts.get(thoughtID)!.sender;
      const domain = await appManager.ensLooker.reverseLookup(sender);

      if (domain !== null) {
        document.getElementById('quote-domain')!.textContent = `@${domain}`;
      } else {
        document.getElementById('quote-domain')!.textContent = sender;
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

      document.getElementById('quote-author')!.textContent = `>${formatSingleLineText(
        appManager.entityStore.replies.get(replyID)!.displayName
      )}`;

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

    this.dialogueVisibleLock = false;
  }

  async toggleAccounts(accounts: string[], appManager: AppManager) {
    if (this.toggleAccountsLock) {
      return;
    }

    const domainElement = document.getElementById('new-domain')!;

    if (accounts.length === 0) {
      domainElement.textContent = 'not connected';
      return;
    }

    this.toggleAccountsLock = true;

    await setDomain(accounts[0], appManager);

    this.toggleAccountsLock = false;
  }

  private newThoughtTextWasFocused = false;
  focusNewThoughtText(_: Event) {
    if (this.newThoughtTextWasFocused) {
      return;
    }

    this.newThoughtTextWasFocused = true;
    const newThoughtTextElement = document.getElementById('new-thought-text')!;
    if (newThoughtTextElement.textContent == defaultText) {
      newThoughtTextElement.textContent = '';
    }
  }

  private newThoughtAuthorWasFocused = false;
  focusNewThoughtAuthor(_: Event) {
    if (this.newThoughtAuthorWasFocused) {
      return;
    }

    this.newThoughtAuthorWasFocused = true;
    const newThoughtAuthorElement = document.getElementById('new-thought-author')!;
    if (newThoughtAuthorElement.textContent == defaultName) {
      newThoughtAuthorElement.textContent = '';
    }
  }

  focusNewThoughtHashtag(event: Event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const newThoughtHashtagElement = document.getElementById('new-thought-hashtag')!;
    if (newThoughtHashtagElement.textContent == defaultHashtag) {
      const range = document.createRange();
      range.selectNodeContents(event.target);

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  maxLength(limit: number, event: KeyboardEvent) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const element = event.target;
    if (
      toUTF8Array(element.textContent!).length >= limit &&
      !event.ctrlKey &&
      !event.metaKey &&
      event.keyCode !== 8 &&
      event.keyCode !== 46
    ) {
      event.preventDefault();
    }
  }

  private publishThoughtLock = false;
  async publishThought(event: Event, metaMask: MetaMask, appManager: AppManager): Promise<void> {
    if (!(event.target instanceof Element)) {
      return;
    }

    if (this.publishThoughtLock) {
      return;
    }

    this.publishThoughtLock = true;

    const thoughtID = event!.target!.getAttribute('thought-id');
    const replyID = event!.target!.getAttribute('reply-id');

    const text = document.getElementById('new-thought-text')!.textContent!;
    const hashtag = document.getElementById('new-thought-hashtag')!.textContent!;
    const displayName = document.getElementById('new-thought-author')!.textContent!;

    let quoteText = '';
    let quoteDisplayName = '';
    let quoteHashtag = '';

    let quoteID: string | null;

    if (thoughtID) {
      quoteID = thoughtID;
      quoteHashtag = hashtag;
      quoteText = appManager.entityStore.thoughts.get(thoughtID)!.text;
      quoteDisplayName = appManager.entityStore.thoughts.get(thoughtID)!.displayName;
    } else if (replyID) {
      quoteID = replyID;
      quoteHashtag = hashtag;
      quoteText = appManager.entityStore.replies.get(replyID)!.text;
      quoteDisplayName = appManager.entityStore.replies.get(replyID)!.displayName;
    } else {
      quoteID = null;
    }

    const newThoughtID = await metaMask.newThought(
      text,
      displayName,
      hashtag,
      quoteID,
      replyID !== null
    );

    if (newThoughtID !== null) {
      const t = new NewThought({
        id: newThoughtID![0] as string,
        sender: newThoughtID![2],
        text: text,
        displayName: displayName,
        hashtag: hashtag,
        blockTimestamp: newThoughtID![1],
        numLikes: 0,
        numReplies: 0,
        numRetweets: 0,
        quoteText: quoteText,
        quoteDisplayName: quoteDisplayName,
        quoteHashtag: quoteHashtag
      });

      appManager.entityStore.thoughts.set(newThoughtID![0], t);
      const container = makeThoughtContainer(t, appManager);

      const allThoughts = document.getElementById('thoughts-container')!;
      const firstChild = allThoughts.firstChild;
      if (firstChild) {
        allThoughts.insertBefore(container, firstChild);
      } else {
        allThoughts.append(container);
      }

      const overlay = document.getElementById('overlay')!;
      const dialogue = document.getElementById('dialogue')!;

      dialogue.style.display = 'none';
      overlay.style.display = 'none';
    }

    this.publishThoughtLock = false;
  }
}

async function findLatestName(account: string, appManager: AppManager): Promise<string | null> {
  const query = `
{
  newTweets(
    first: 1
    orderBy: blockNumber
    orderDirection: desc
    where: {sender: "${account.toLowerCase()}"}
  ) {
    displayName
    blockNumber
  }
  newReplies(
    first: 1
    orderBy: blockNumber
    orderDirection: desc
    where: {sender: "${account.toLowerCase()}"}
  ) {
    displayName
    blockNumber
  }
}`;

  const data = await appManager.queryDispatcher.fetch(query);

  let latestThoughtDisplayName: string | undefined;
  let latestThoughtBlockNumber: number | undefined;

  if (data['newTweets'].length > 0) {
    latestThoughtDisplayName = data['newTweets'][0]['displayName'];
    latestThoughtBlockNumber = data['newTweets'][0]['blockNumber'];
  }

  let latestReplyDisplayName: string | undefined;
  let latestReplyBlockNumber: number | undefined;

  if (data['newReplies'].length > 0) {
    latestReplyDisplayName = data['newReplies'][0]['displayName'];
    latestReplyBlockNumber = data['newReplies'][0]['blockNumber'];
  }

  if (latestThoughtBlockNumber && latestReplyBlockNumber) {
    if (latestThoughtBlockNumber > latestReplyBlockNumber) {
      return latestThoughtDisplayName!;
    }

    return latestReplyDisplayName!;
  }

  if (latestThoughtDisplayName) {
    return latestThoughtDisplayName;
  }

  if (latestReplyDisplayName) {
    return latestReplyDisplayName;
  }

  return null;
}

async function setDomain(account: string, appManager: AppManager) {
  const domainElement = document.getElementById('new-domain')!;

  const domain = await appManager.ensLooker.reverseLookup(account);
  if (domain) {
    domainElement.textContent = `@${domain}`;
  } else {
    domainElement.textContent = account;
  }

  const authorElement = document.getElementById('new-thought-author')!;

  if (
    !authorElement.textContent ||
    (authorElement.textContent && authorElement.textContent === defaultName)
  ) {
    const name = await findLatestName(account, appManager);

    if (name) {
      authorElement.textContent = formatSingleLineText(name);
    }
  }
}

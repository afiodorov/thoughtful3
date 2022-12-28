import { AppManager } from './app_manager';
import { fetchReplies } from './reply';
import { defaultHashtag, defaultName, defaultText } from './config';
import { toUTF8Array } from './utils';
import { setDomain } from './utils';

export class InteractionState {
  private toggledLock: Map<string, boolean> = new Map();
  private toggleAccountsLock = false;

  toggleReplies(event: Event, appManager: AppManager): void {
    if (!(event.target instanceof Element)) {
      return;
    }

    const thoughtID: string = event!.target!.getAttribute('thought-id')!;

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

    fetchReplies(thoughtID, appManager).then((replies) => {
      replies.forEach((reply) => {
        replyContainer.appendChild(reply);
      });

      this.toggledLock.set(thoughtID, false);
    });
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
}

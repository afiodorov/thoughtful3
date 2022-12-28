import { defaultHashtag, defaultName, defaultText } from './config';
import { toUTF8Array } from './utils';

export class InteractionState {
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

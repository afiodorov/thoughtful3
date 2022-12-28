import { AppManager } from './app_manager';
import { defaultName, defaultText } from './config';
import { toUTF8Array } from './utils';

export function makeNewReplyContainer(thoughtID: string, appManager: AppManager) {
  const newReplyContainer = document.createElement('div');
  newReplyContainer.id = `new-reply-${thoughtID}`;
  newReplyContainer.classList.add('reply-container');
  newReplyContainer.style.display = 'none';
  newReplyContainer.setAttribute('acc-update-thought-id', thoughtID);

  const leftQuoteElement = document.createElement('div');
  leftQuoteElement.classList.add('reply-left-quote');
  leftQuoteElement.innerHTML = `<a href="?thought-id=${thoughtID}">&gt;</a>`;

  const textElement = document.createElement('div');
  textElement.classList.add('reply-text');
  textElement.id = `new-reply-text-${thoughtID}`;
  textElement.innerText = defaultText;
  textElement.setAttribute('contenteditable', 'true');

  const counter = document.createElement('div');
  counter.classList.add('new-reply-counter');
  counter.textContent = '600';

  textElement.addEventListener('input', () => {
    counter.textContent = `${600 - toUTF8Array(textElement.textContent!).length}`;
  });

  textElement.addEventListener('keydown', appManager.interactionState.disableEnterAllowShift);
  textElement.addEventListener('focus', (event) =>
    appManager.interactionState.focusNewReplyText(event, thoughtID)
  );
  textElement.addEventListener('keydown', (event) =>
    appManager.interactionState.maxLength(600, event)
  );

  const textContainer = document.createElement('div');
  textContainer.classList.add('reply-text-container');
  textContainer.appendChild(leftQuoteElement);
  textContainer.appendChild(textElement);

  const authorElement = document.createElement('div');
  authorElement.classList.add('reply-author');
  authorElement.textContent = defaultName;
  authorElement.setAttribute('contenteditable', 'true');
  authorElement.id = `new-reply-author-${thoughtID}`;

  authorElement.addEventListener('keydown', appManager.interactionState.disableEnter);
  authorElement.addEventListener('focus', (event) =>
    appManager.interactionState.focusNewReplyAuthor(event, thoughtID)
  );
  authorElement.addEventListener('keydown', (event) =>
    appManager.interactionState.maxLength(40, event)
  );

  const domainElement = document.createElement('div');
  domainElement.classList.add('reply-domain');
  domainElement.textContent = 'sender';
  domainElement.id = `new-reply-domain-${thoughtID}`;

  const authorContainer = document.createElement('div');
  authorContainer.classList.add('reply-author-container');
  authorContainer.appendChild(authorElement);
  authorContainer.appendChild(domainElement);

  const restContainer = document.createElement('div');
  restContainer.classList.add('new-thought-rest-container');

  const publishContainer = document.createElement('div');
  publishContainer.classList.add('new-thought-publish-link');

  const publish = document.createElement('a');
  publish.classList.add('new-reply-publish');
  publish.href = '#';
  publish.textContent = '📧';
  publish.id = `new-reply-publish-${thoughtID}`;

  publishContainer.appendChild(publish);

  restContainer.appendChild(counter);
  restContainer.appendChild(publishContainer);

  newReplyContainer.appendChild(authorContainer);
  newReplyContainer.appendChild(textContainer);
  newReplyContainer.appendChild(restContainer);

  return newReplyContainer;
}

import { formatSingleLineText, formatMultiLineText, formatDate, cropAddress } from './formatters';
import { AppManager } from './app_manager';
import { makeQuoteContainer } from './quote';
import { likeThought } from './handlers/like';
import { ThoughtEntity } from './entity/entities';
import { toggleDialogue } from './handlers/toggle_dialogue';
import { toggleReplies } from './handlers/toggle_replies';
import { toggleNewReply } from './handlers/toggle_new_reply';
import { makeNewReplyContainer } from './new_reply';

export function makeThoughtContainer(t: ThoughtEntity, appManager: AppManager): HTMLDivElement {
  const text = t.text;
  const formattedText = formatMultiLineText(text);
  const author = formatSingleLineText(t.displayName);

  const leftQuoteElement = document.createElement('div');
  leftQuoteElement.classList.add('thought-left-quote');
  leftQuoteElement.innerText = '❝';

  const rightQuoteElement = document.createElement('div');
  rightQuoteElement.classList.add('thought-right-quote');
  rightQuoteElement.innerText = '❞';

  const textElement = document.createElement('div');
  textElement.classList.add('thought-text');
  textElement.innerHTML = formattedText;

  const textContainer = document.createElement('div');
  textContainer.classList.add('thought-text-container');
  textContainer.appendChild(leftQuoteElement);
  textContainer.appendChild(textElement);
  textContainer.appendChild(rightQuoteElement);

  const restContainer = document.createElement('div');
  restContainer.classList.add('thought-rest-container');

  const authorElement = document.createElement('div');
  authorElement.classList.add('thought-author');
  const authorLink = document.createElement('a');
  authorLink.href = `?displayName=${encodeURIComponent(t.displayName)}&address=${t.sender}`;
  authorLink.textContent = `${author}`;
  authorElement.appendChild(authorLink);

  const domainContainer = document.createElement('div');
  domainContainer.classList.add('thought-domain-container');

  const domainElement = document.createElement('a');
  domainElement.classList.add('thought-domain');
  domainElement.textContent = `@${cropAddress(t.sender)}`;
  domainElement.href = `?address=${t.sender}`;

  const hashtagElement = document.createElement('div');
  hashtagElement.classList.add('thought-hashtag');

  const hashtagLink = document.createElement('a');
  hashtagLink.textContent = `#${formatSingleLineText(t.hashtag)}`;
  hashtagLink.href = `?hashtag=${encodeURIComponent(t.hashtag)}`;

  hashtagElement.appendChild(hashtagLink);

  domainContainer.appendChild(domainElement);
  domainContainer.appendChild(hashtagElement);

  appManager.ensLooker.reverseLookup(t.sender).then((result) => {
    if (result === null) {
      return;
    }
    domainElement.textContent = `@${result}`;
  });

  const authorContainer = document.createElement('div');
  authorContainer.classList.add('thought-author-container');
  authorContainer.appendChild(authorElement);
  authorContainer.appendChild(domainContainer);

  const dateElement = document.createElement('div');
  dateElement.classList.add('thought-date');

  const dateElementText = document.createElement('div');
  dateElementText.classList.add('thought-date-text');
  dateElementText.textContent = `${formatDate(t.blockTimestamp)}`;

  const dateElementLink = document.createElement('div');
  dateElementLink.classList.add('thought-date-link');
  dateElementLink.innerHTML = `<a href='?thought-id=${t.id}'>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
  </a>`;

  dateElement.appendChild(dateElementLink);
  dateElement.appendChild(dateElementText);

  const likeElement = document.createElement('div');
  likeElement.classList.add('thought-like');
  if (appManager.metaMask == null) {
    likeElement.textContent = `❤`;
  } else {
    const likeElementLink = document.createElement('a');
    likeElementLink.href = '#';
    likeElementLink.textContent = `❤`;
    likeElementLink.classList.add('thought-like-link');
    likeElementLink.setAttribute('thought-id', t.id);
    likeElementLink.addEventListener('click', (event) =>
      likeThought(event, appManager.metaMask!, appManager.entityStore, appManager.fetcher)
    );

    likeElement.appendChild(likeElementLink);
  }

  const likeElementText = document.createElement('div');
  if (t.numLikes > 0) {
    likeElementText.textContent = `${t.numLikes}`;
  }
  likeElementText.id = `thought-${t.id}-likes`;
  likeElement.appendChild(likeElementText);

  const replyElement = document.createElement('div');
  replyElement.classList.add('thought-reply');

  const replyElementIcon = document.createElement('div');

  if (!appManager.metaMask) {
    replyElementIcon.textContent = '💬';
  } else {
    const replyElementLink = document.createElement('a');
    replyElementLink.href = `#new-reply-${t.id}`;
    replyElementLink.textContent = `💬`;
    replyElementLink.classList.add('thought-reply-icon');
    replyElementLink.setAttribute('thought-id', t.id);
    replyElementLink.addEventListener('click', (event) => toggleNewReply(event, appManager));

    replyElementIcon.appendChild(replyElementLink);
  }

  replyElement.appendChild(replyElementIcon);

  const replyLink = document.createElement('a');
  replyLink.href = `#thought-${t.id}`;
  replyLink.textContent = `${t.numReplies}`;
  replyLink.id = `thought-${t.id}-new-reply`;
  replyLink.classList.add('thought-reply-link');
  replyLink.setAttribute('thought-id', t.id);
  replyLink.addEventListener('click', (event) => toggleReplies(event, appManager));
  if (!t.numReplies) {
    replyLink.style.display = 'none';
  }

  replyElement.appendChild(replyLink);

  const quoteElement = document.createElement('div');
  quoteElement.classList.add('thought-quote');

  if (appManager.metaMask) {
    const quoteElementLink = document.createElement('a');
    quoteElementLink.href = '#';
    quoteElementLink.textContent = '🔄';
    quoteElementLink.setAttribute('thought-id', t.id);
    quoteElementLink.addEventListener('click', (event) =>
      toggleDialogue(event, appManager.metaMask!, appManager)
    );

    quoteElement.appendChild(quoteElementLink);
  } else {
    const quoteElementNoLink = document.createElement('div');
    quoteElementNoLink.textContent = '🔄';

    quoteElement.appendChild(quoteElementNoLink);
  }

  const quoteElementText = document.createElement('div');
  quoteElementText.classList.add('thought-quote-text');
  quoteElementText.id = `thought-${t.id}-quotes`;
  if (t.numQuotes > 0) {
    quoteElementText.textContent = `${t.numQuotes}`;
  }

  quoteElement.appendChild(quoteElementText);

  const repliesContainer = document.createElement('div');
  repliesContainer.classList.add('thought-replies-container');
  repliesContainer.id = `replies-${t.id}`;
  repliesContainer.appendChild(makeNewReplyContainer(t.id, appManager));

  const thoughtContainer = document.createElement('div');
  thoughtContainer.classList.add('thought-container');
  thoughtContainer.id = `thought-${t.id}`;

  restContainer.appendChild(replyElement);
  restContainer.appendChild(likeElement);
  restContainer.appendChild(quoteElement);
  restContainer.appendChild(dateElement);

  thoughtContainer.appendChild(authorContainer);
  thoughtContainer.appendChild(textContainer);
  if (t.quoteOf !== '0') {
    thoughtContainer!.appendChild(makeQuoteContainer(t, appManager));
  }

  thoughtContainer.appendChild(restContainer);
  thoughtContainer.appendChild(repliesContainer);

  return thoughtContainer;
}

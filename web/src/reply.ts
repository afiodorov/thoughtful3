import { Reply } from './responses';
import { ReplyEntity } from './entity/entities';
import { formatSingleLineText, formatDate, formatMultiLineText, cropAddress } from './formatters';
import { AppManager } from './app_manager';
import { likeReply } from './handlers/like';
import { toggleDialogue } from './handlers/toggle_dialogue';
import { toggleNewReply } from './handlers/toggle_new_reply';

export function makeReplyContainer(
  r: ReplyEntity,
  shouldShowName: boolean,
  appManager: AppManager,
  isLast: boolean
): HTMLDivElement {
  const text = r.text;
  const formattedText = formatMultiLineText(text);
  const author = shouldShowName ? formatSingleLineText(r.displayName) : '';

  const leftQuoteElement = document.createElement('div');
  leftQuoteElement.classList.add('reply-left-quote');
  leftQuoteElement.innerHTML = `<a href="?thought-id=${r.thought}">&gt;</a>`;

  const textElement = document.createElement('div');
  textElement.classList.add('reply-text');
  textElement.innerHTML = formattedText;

  const textContainer = document.createElement('div');
  textContainer.classList.add('reply-text-container');
  textContainer.appendChild(leftQuoteElement);
  textContainer.appendChild(textElement);

  const restContainer = document.createElement('div');
  restContainer.classList.add('reply-rest-container');

  const replyContainer = document.createElement('div');
  replyContainer.classList.add('reply-container');

  if (shouldShowName) {
    const authorElement = document.createElement('div');
    authorElement.classList.add('thought-author');
    const authorLink = document.createElement('a');
    authorLink.href = `?displayName=${encodeURIComponent(r.displayName)}&address=${r.sender}`;
    authorLink.textContent = `${author}`;
    authorElement.appendChild(authorLink);

    const domainElement = document.createElement('a');
    domainElement.classList.add('reply-domain');
    domainElement.textContent = `@${cropAddress(r.sender)}`;
    domainElement.href = `?address=${r.sender}`;

    const authorContainer = document.createElement('div');
    authorContainer.classList.add('reply-author-container');
    authorContainer.appendChild(authorElement);
    authorContainer.appendChild(domainElement);

    appManager.ensLooker.reverseLookup(r.sender).then((result) => {
      if (result === null) {
        return;
      }
      domainElement.textContent = `@${result}`;
    });

    replyContainer.appendChild(authorContainer);
  }

  const dateElement = document.createElement('div');
  dateElement.classList.add('reply-date');

  const dateElementText = document.createElement('div');
  dateElementText.classList.add('reply-date-text');
  dateElementText.textContent = `${formatDate(r.blockTimestamp)}`;

  const dateElementLink = document.createElement('div');
  dateElementLink.classList.add('reply-date-link');
  dateElementLink.innerHTML = `<a href='?reply-id=${r.id}'>
  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
  </a>`;

  dateElement.appendChild(dateElementLink);
  dateElement.appendChild(dateElementText);

  const likeElement = document.createElement('div');
  likeElement.classList.add('reply-like');
  if (appManager.metaMask == null) {
    likeElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"   stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
  } else {
    const likeElementLink = document.createElement('a');
    likeElementLink.href = '#';
    likeElementLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"   stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    likeElementLink.classList.add('reply-like-link');
    likeElementLink.setAttribute('reply-id', r.id);
    likeElementLink.addEventListener('click', (_) =>
      likeReply(r.id, appManager.metaMask!, appManager.entityStore, appManager.fetcher)
    );

    likeElement.appendChild(likeElementLink);
  }

  const likeElementText = document.createElement('div');
  if (r.numLikes > 0) {
    likeElementText.textContent = `${r.numLikes}`;
  }
  likeElementText.id = `reply-${r.id}-likes`;
  likeElement.appendChild(likeElementText);

  const quoteElement = document.createElement('div');
  quoteElement.classList.add('reply-quote');

  if (appManager.metaMask) {
    const quoteElementLink = document.createElement('a');
    quoteElementLink.href = '#';
    quoteElementLink.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-ccw"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>';
    quoteElementLink.setAttribute('reply-id', r.id);
    quoteElementLink.addEventListener('click', (_) =>
      toggleDialogue(null, r.id, appManager.metaMask!, appManager)
    );

    quoteElement.appendChild(quoteElementLink);
  } else {
    const quoteElementNoLink = document.createElement('div');
    quoteElementNoLink.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24" fill="none"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-ccw"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>';

    quoteElement.appendChild(quoteElementNoLink);
  }

  const quoteElementText = document.createElement('div');
  quoteElementText.classList.add('reply-quote-text');
  quoteElementText.id = `reply-${r.id}-quotes`;
  if (r.numQuotes > 0) {
    quoteElementText.textContent = `${r.numQuotes}`;
  }

  quoteElement.appendChild(quoteElementText);

  const replyElement = document.createElement('div');
  replyElement.classList.add('thought-reply');
  if (isLast) {
    if (!appManager.metaMask) {
      replyElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> `;
    } else {
      const replyElementLink = document.createElement('a');
      replyElementLink.href = `#new-reply-${r.thought}`;
      replyElementLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
      replyElementLink.classList.add('thought-reply-icon');
      replyElementLink.setAttribute('thought-id', r.thought);
      replyElementLink.addEventListener('click', (_) => toggleNewReply(r.thought, appManager));

      replyElement.appendChild(replyElementLink);
    }
  }

  restContainer.appendChild(replyElement);
  restContainer.appendChild(likeElement);
  restContainer.appendChild(quoteElement);
  restContainer.appendChild(dateElement);

  replyContainer.appendChild(textContainer);
  replyContainer.appendChild(restContainer);

  return replyContainer;
}

export async function fetchReplies(
  thoughtID: string,
  appManager: AppManager
): Promise<Array<HTMLDivElement>> {
  const fetchedReplies: Reply[] =
    (await appManager.fetcher.getRecentReplies(thoughtID, BigInt(0))) || new Array();

  const entities = fetchedReplies.map((r) => {
    const entity = new ReplyEntity(r);
    appManager.entityStore.replies.set(r.id, entity);
    return entity;
  });

  const thought = appManager.entityStore.thoughts.get(thoughtID);
  const thoughtDisplayName = thought?.displayName;
  const thoughtSender = thought?.sender;

  const replies = processReplies(entities, thoughtDisplayName, thoughtSender);
  return replies.map((reply, i, replies) => {
    return makeReplyContainer(reply[0], reply[1], appManager, replies.length - 1 === i);
  });
}

export function processReplies(
  replies: Array<ReplyEntity>,
  thoughtDisplayName: string | undefined,
  thoughtSender: string | undefined
): [ReplyEntity, boolean][] {
  const res: Array<[ReplyEntity, boolean]> = new Array();

  let lastDisplayName = thoughtDisplayName;
  let lastSender = thoughtSender;

  replies.forEach((reply) => {
    if (reply.sender === lastSender && reply.displayName == lastDisplayName) {
      res.push([reply, false]);

      return;
    }

    res.push([reply, true]);
  });

  return res;
}

import { AppManager } from './app_manager';
import { QuoteEntity } from './entity/entities';
import { formatSingleLineText, formatMultiLineText } from './formatters';

export function makeQuoteContainer(q: QuoteEntity, appManager: AppManager): HTMLDivElement {
  const quoteContainer = document.createElement('div');
  quoteContainer.classList.add('quote-container');

  const quoteAuthorContainer = document.createElement('quote-author-container');
  quoteAuthorContainer.classList.add('quote-author-container');

  const quoteAuthor = document.createElement('div');
  quoteAuthor.classList.add('quote-author');

  const quoteAuthorLink = document.createElement('a');
  quoteAuthorLink.textContent = '>';
  quoteAuthorLink.href = q.isReplyQuote ? `?reply-id=${q.quoteOf}` : `?thought-id=${q.quoteOf}`;

  const quoteAuthorText = document.createElement('div');
  quoteAuthorText.classList.add('quote-author-text');
  quoteAuthorText.textContent = formatSingleLineText(q.quoteDisplayName);

  quoteAuthor.appendChild(quoteAuthorLink);
  quoteAuthor.appendChild(quoteAuthorText);

  const quoteDomainContainer = document.createElement('div');
  quoteDomainContainer.classList.add('quote-domain-container');

  const quoteDomain = document.createElement('div');
  quoteDomain.classList.add('quote-domain');
  quoteDomain.textContent = `${q.quoteSender}`;
  appManager.ensLooker.reverseLookup(q.quoteSender).then((result) => {
    if (result === null) {
      return;
    }

    quoteDomain.textContent = `@${result}`;
  });

  const quoteTextContainer = document.createElement('div');
  quoteTextContainer.classList.add('quote-text-container');

  const quoteText = document.createElement('div');
  quoteText.classList.add('quote-text');
  quoteText.innerHTML = formatMultiLineText(q.quoteText);

  quoteTextContainer.appendChild(quoteText);

  quoteDomainContainer.appendChild(quoteDomain);

  quoteAuthorContainer.appendChild(quoteAuthor);
  quoteAuthorContainer.appendChild(quoteDomainContainer);

  quoteContainer.appendChild(quoteAuthorContainer);
  quoteContainer.appendChild(quoteText);

  return quoteContainer;
}

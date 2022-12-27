import { Quote } from './responses';
import { formatSingleLineText, formatMultiLineText } from './formatters';

export function makeQuoteContainer(q: Quote): HTMLDivElement {
  const quoteContainer = document.createElement('div');
  quoteContainer.classList.add('quote-container');

  const quoteAuthorContainer = document.createElement('quote-author-container');
  quoteAuthorContainer.classList.add('quote-author-container');

  const quoteAuthor = document.createElement('div');
  quoteAuthor.classList.add('quote-author');
  quoteAuthor.textContent = `>${formatSingleLineText(q.quoteDisplayName)}`;

  const quoteDomainContainer = document.createElement('div');
  quoteDomainContainer.classList.add('quote-domain-container');

  const quoteDomain = document.createElement('div');
  quoteDomain.classList.add('quote-domain');

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

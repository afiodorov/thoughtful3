import { formatSingleLineText } from './formatters';
import { AppManager } from './app_manager';
import { defaultName } from './config';

export function toUTF8Array(str: string): number[] {
  var utf8 = [];
  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    }
    // surrogate pair
    else {
      i++;
      charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff);
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }
  return utf8;
}

export async function setDomain(account: string, appManager: AppManager, thoughtID: string | null) {
  let domainElement: HTMLElement;
  let authorElement: HTMLElement;

  if (!thoughtID) {
    domainElement = document.getElementById('new-thought-domain')!;
    authorElement = document.getElementById('new-thought-author')!;
  } else {
    domainElement = document.getElementById(`new-reply-domain-${thoughtID}`)!;
    authorElement = document.getElementById(`new-reply-author-${thoughtID}`)!;
  }

  const domain = await appManager.ensLooker.reverseLookup(account);
  if (domain) {
    domainElement.textContent = `@${domain}`;
  } else {
    domainElement.textContent = `@${account}`;
  }

  if (
    !authorElement.textContent ||
    (authorElement.textContent && authorElement.textContent === defaultName)
  ) {
    const name = await appManager.fetcher.getLatestName(account);

    if (name) {
      authorElement.textContent = formatSingleLineText(name);
    }
  }
}

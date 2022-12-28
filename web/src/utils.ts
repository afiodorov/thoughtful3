import { formatSingleLineText, formatMultiLineText } from './formatters';
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

export async function setDomain(account: string, appManager: AppManager) {
  const domainElement = document.getElementById('new-domain')!;

  const domain = await appManager.ensLooker.reverseLookup(account);
  if (domain) {
    domainElement.textContent = `@${domain}`;
  } else {
    domainElement.textContent = `@${account}`;
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

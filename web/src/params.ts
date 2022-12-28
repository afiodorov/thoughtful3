export class ThoughtParams {
  thoughtID: string | null;
  hashtag: string | null;
  skip: number;
  displayName: string | null;
  address: string | null;

  constructor(
    thoughtID: string | null,
    hashtag: string | null,
    skip: number,
    displayName: string | null,
    address: string | null
  ) {
    this.thoughtID = thoughtID;
    this.hashtag = hashtag ? decodeURIComponent(hashtag) : null;
    this.displayName = displayName ? decodeURIComponent(displayName) : null;
    this.address = address;
    this.skip = skip;
  }
}

export class ReplyParams {
  replyID: string;

  constructor(replyID: string) {
    this.replyID = replyID;
  }
}

export function parseCurrentURL(): ThoughtParams | ReplyParams {
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  const replyID = searchParams.get('reply-id');

  if (replyID) {
    return new ReplyParams(replyID);
  }

  const skipPar = searchParams.get('skip');
  let skip: number = 0;

  try {
    if (skipPar) {
      skip = parseInt(skipPar, 10);
    }
  } catch {}

  return new ThoughtParams(
    searchParams.get('thought-id'),
    searchParams.get('hashtag'),
    skip,
    searchParams.get('displayName'),
    searchParams.get('address')
  );
}

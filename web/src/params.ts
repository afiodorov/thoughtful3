export class ThoughtParams {
  thoughtID: string | null;
  hashtag: string | null;

  constructor(thoughtID: string | null, hashtag: string | null) {
    this.thoughtID = thoughtID;
    this.hashtag = hashtag ? decodeURIComponent(hashtag) : null;
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

  return new ThoughtParams(searchParams.get('thought-id'), searchParams.get('hashtag'));
}

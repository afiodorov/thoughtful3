export class ThoughtParams {
  thoughtID: string | null;

  constructor(thoughtID: string | null) {
    this.thoughtID = thoughtID;
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

  const thoughtID = searchParams.get('thought-id');
  const replyID = searchParams.get('reply-id');

  if (replyID) {
    return new ReplyParams(replyID);
  }

  return new ThoughtParams(thoughtID);
}

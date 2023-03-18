import { EnsLooker } from './ens';

export class ThoughtParams {
  thoughtID: string | null;
  hashtag: string | null;
  from: bigint | null;
  displayName: string | null;
  address: string | null;

  constructor(
    thoughtID: string | null,
    hashtag: string | null,
    from: bigint | null,
    displayName: string | null,
    address: string | null
  ) {
    this.thoughtID = thoughtID;
    this.hashtag = hashtag ? decodeURIComponent(hashtag) : null;
    this.displayName = displayName ? decodeURIComponent(displayName) : null;
    this.address = address;
    this.from = from;
  }
}

export class ReplyParams {
  replyID: string;

  constructor(replyID: string) {
    this.replyID = replyID;
  }
}

export async function parseCurrentURL(ensLooker: EnsLooker): Promise<ThoughtParams | ReplyParams> {
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  const replyID = searchParams.get('reply-id');

  if (replyID) {
    return new ReplyParams(replyID);
  }

  const fromPar = searchParams.get('from');
  let from: bigint | null = null;

  try {
    if (fromPar) {
      from = BigInt(fromPar);
    }
  } catch {}

  var address = searchParams.get('address');
  var resolved: string | null = null;

  if (address) {
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(address)) {
      resolved = await ensLooker.lookup(address);
    }
  }

  return new ThoughtParams(
    searchParams.get('thought-id'),
    searchParams.get('hashtag'),
    from,
    searchParams.get('displayName'),
    resolved || address
  );
}

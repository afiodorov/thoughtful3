export interface Thought {
  readonly id: string;
  readonly sender: string;
  readonly text: string;
  readonly displayName: string;
  readonly hashtag: string;
  readonly blockTimestamp: number;
  readonly numLikes: number;
  readonly numReplies: number;
  readonly numRetweets: number;
  readonly quoteText: string;
  readonly quoteDisplayName: string;
  readonly quoteHashtag: string;
}

export interface Reply {
  readonly id: string;
  readonly sender: string;
  readonly text: string;
  readonly displayName: string;
  readonly blockTimestamp: number;
  readonly numLikes: number;
  readonly numRetweets: number;
  readonly seq_num: number;
  readonly tweet: string;
}

export interface Quote {
  readonly quoteText: string;
  readonly quoteDisplayName: string;
  readonly quoteHashtag: string;
}

export class NewThought implements Thought {
  readonly id: string;
  readonly sender: string;
  readonly text: string;
  readonly displayName: string;
  readonly hashtag: string;
  readonly blockTimestamp: number;
  readonly numLikes: number;
  readonly numReplies: number;
  readonly numRetweets: number;
  readonly quoteText: string;
  readonly quoteDisplayName: string;
  readonly quoteHashtag: string;

  constructor({
    id,
    sender,
    text,
    displayName,
    hashtag,
    blockTimestamp,
    numLikes,
    numReplies,
    numRetweets,
    quoteText,
    quoteDisplayName,
    quoteHashtag
  }: Thought) {
    this.id = id;
    this.sender = sender;
    this.text = text;
    this.displayName = displayName;
    this.hashtag = hashtag;
    this.blockTimestamp = blockTimestamp;
    this.numLikes = numLikes;
    this.numReplies = numReplies;
    this.numRetweets = numRetweets;
    this.quoteText = quoteText;
    this.quoteDisplayName = quoteDisplayName;
    this.quoteHashtag = quoteHashtag;
  }
}

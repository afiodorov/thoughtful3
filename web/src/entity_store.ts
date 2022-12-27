import { Thought, Reply } from './responses';

export class EntityStore {
  private _thoughts: Map<string, ThoughtEntity> = new Map();
  private _replies: Map<string, ReplyEntity> = new Map();

  get thoughts(): Map<string, ThoughtEntity> {
    return this._thoughts;
  }

  get replies(): Map<string, ReplyEntity> {
    return this._replies;
  }
}

export class ThoughtEntity implements Thought {
  id: string;
  sender: string;
  text: string;
  displayName: string;
  hashtag: string;
  blockTimestamp: number;
  numLikes: number;
  numReplies: number;
  numRetweets: number;
  quoteText: string;
  quoteDisplayName: string;
  quoteHashtag: string;

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

export class ReplyEntity implements Reply {
  id: string;
  sender: string;
  text: string;
  displayName: string;
  blockTimestamp: number;
  numLikes: number;
  numRetweets: number;
  seq_num: number;
  tweet: string;
  constructor({
    id,
    sender,
    text,
    displayName,
    blockTimestamp,
    numLikes,
    numRetweets,
    seq_num,
    tweet
  }: Reply) {
    this.id = id;
    this.sender = sender;
    this.text = text;
    this.displayName = displayName;
    this.blockTimestamp = blockTimestamp;
    this.numLikes = numLikes;
    this.numRetweets = numRetweets;
    this.seq_num = seq_num;
    this.tweet = tweet;
  }
}

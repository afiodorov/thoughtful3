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
  readonly quoteSender: string;
  readonly quoteHashtag: string;
  readonly retweetOf: string;
  readonly isReplyRetweet: boolean;
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

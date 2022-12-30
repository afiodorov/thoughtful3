import { Thought, Reply } from '../responses';

export class ThoughtEntity {
  id: string;
  sender: string;
  text: string;
  displayName: string;
  hashtag: string;
  blockTimestamp: number;
  numLikes: number;
  numReplies: number;
  numQuotes: number;
  quoteText: string;
  quoteDisplayName: string;
  quoteSender: string;
  quoteHashtag: string;
  quoteOf: string;
  isReplyQuote: boolean;

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
    quoteSender,
    quoteHashtag,
    retweetOf,
    isReplyRetweet
  }: Thought) {
    this.id = id;
    this.sender = sender;
    this.text = text;
    this.displayName = displayName;
    this.hashtag = hashtag;
    this.blockTimestamp = blockTimestamp;
    this.numLikes = numLikes;
    this.numReplies = numReplies;
    this.numQuotes = numRetweets;
    this.quoteText = quoteText;
    this.quoteDisplayName = quoteDisplayName;
    this.quoteSender = quoteSender;
    this.quoteHashtag = quoteHashtag;
    this.quoteOf = retweetOf;
    this.isReplyQuote = isReplyRetweet;
  }
}

export class ReplyEntity {
  id: string;
  sender: string;
  text: string;
  displayName: string;
  blockTimestamp: number;
  numLikes: number;
  numQuotes: number;
  seq_num: number;
  thought: string;
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
    this.numQuotes = numRetweets;
    this.seq_num = seq_num;
    this.thought = tweet;
  }
}

export class QuoteEntity {
  quoteText: string;
  quoteDisplayName: string;
  quoteSender: string;
  quoteHashtag: string;
  quoteOf: string;
  isReplyQuote: boolean;

  constructor({
    quoteText,
    quoteDisplayName,
    quoteSender,
    quoteHashtag,
    retweetOf,
    isReplyRetweet
  }: Thought) {
    this.quoteText = quoteText;
    this.quoteDisplayName = quoteDisplayName;
    this.quoteSender = quoteSender;
    this.quoteHashtag = quoteHashtag;
    this.quoteOf = retweetOf;
    this.isReplyQuote = isReplyRetweet;
  }
}

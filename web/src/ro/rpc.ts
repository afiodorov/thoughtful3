import { Thought, Reply } from '../responses';
import { Fetcher, Thoughts } from './fetcher';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import abi from '../../../contracts/v2/abi.json';
import { RPCReply, RPCTweet } from './rpc_responses';
import { pageSize } from '../config';

const invalidAddress = '0x0000000000000000000000000000000000000000';

const max = (a: bigint, b: bigint): bigint => {
  if (a > b) {
    return a;
  }

  return b;
};

class AbiReply implements Reply {
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
    text,
    display_name,
    pk,
    sender,
    likes,
    retweets,
    seq_num,
    tweet,
    block_timestamp
  }: RPCReply) {
    this.id = pk;
    this.sender = sender;
    this.text = text;
    this.displayName = display_name;
    this.numLikes = parseInt(likes, 10);
    this.numRetweets = parseInt(retweets, 10);
    this.seq_num = parseInt(seq_num, 10);
    this.tweet = tweet;
    this.blockTimestamp = block_timestamp ? parseInt(block_timestamp, 10) : 0;
  }
}

class AbiThought implements Thought {
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
  quoteSender: string;
  quoteHashtag: string;
  retweetOf: string;
  isReplyRetweet: boolean;

  constructor(
    tweet: RPCTweet,
    numReplies: string,
    quoteText = '',
    quoteSender = '',
    quoteDisplayName = '',
    quoteHashtag = ''
  ) {
    this.id = tweet.pk;
    this.sender = tweet.sender;
    this.text = tweet.text;
    this.displayName = tweet.display_name;
    this.hashtag = tweet.hashtag;
    this.numLikes = parseInt(tweet.likes, 10);
    this.numReplies = parseInt(numReplies, 10);
    this.numRetweets = parseInt(tweet.retweets, 10);
    this.quoteText = quoteText;
    this.quoteDisplayName = quoteDisplayName;
    this.quoteSender = quoteSender;
    this.quoteHashtag = quoteHashtag;
    this.retweetOf = tweet.retweet_of;
    this.isReplyRetweet = tweet.is_reply_retweet;
    this.blockTimestamp = tweet.block_timestamp ? parseInt(tweet.block_timestamp, 10) : 0;
  }
}

export class RPCFetcher implements Fetcher {
  private _contract: Contract;

  constructor(web3: Web3, contractAddress: string) {
    this._contract = new web3.eth.Contract(abi as AbiItem[], contractAddress);
  }

  async getThoughtByID(thoughtID: string): Promise<Thought | null> {
    var tweet: RPCTweet | null = null;

    try {
      tweet = await this._contract.methods.tweets(thoughtID).call();
    } catch (error) {
      console.error(error);
    }

    if (!tweet || tweet.sender === invalidAddress) {
      return null;
    }

    let numReplies: string | null = null;

    try {
      numReplies = await this._contract.methods.num_replies_per_tweet(thoughtID).call();
    } catch (error) {
      console.error(error);
    }

    if (!numReplies) {
      return null;
    }

    if (tweet.retweet_of !== '0' && !tweet.is_reply_retweet) {
      let quoteTweet: RPCTweet | null = null;

      try {
        quoteTweet = await this._contract.methods.tweets(tweet.retweet_of).call();
      } catch (error) {
        console.error(error);
      }

      if (!quoteTweet || quoteTweet.sender === invalidAddress) {
        return null;
      }

      return new AbiThought(
        tweet,
        numReplies,
        quoteTweet.text,
        quoteTweet.sender,
        quoteTweet.display_name,
        quoteTweet.hashtag
      );
    } else if (tweet.retweet_of !== '0' && tweet.is_reply_retweet) {
      let quoteReply: RPCReply | null = null;

      try {
        quoteReply = await this._contract.methods.replies(tweet.retweet_of).call();
      } catch (error) {
        console.error(error);
      }

      if (!quoteReply || quoteReply.sender === invalidAddress) {
        return null;
      }

      const hashtag = (await this.getHashtagByThoughtID(quoteReply.tweet)) || '';

      return new AbiThought(
        tweet,
        numReplies,
        quoteReply.text,
        quoteReply.sender,
        quoteReply.display_name,
        hashtag
      );
    }

    return new AbiThought(tweet, numReplies);
  }

  async getThoughtsByHashtag(hashtag: string, from: bigint | null): Promise<Thoughts | null> {
    let numThoughts: bigint | null = null;

    try {
      numThoughts = BigInt(await this._contract.methods.num_tweets_per_hashtag(hashtag).call());
    } catch (error) {
      console.error(error);
    }

    if (!numThoughts) {
      return null;
    }

    const tweets: Thought[] = new Array();

    for (
      let tweetNum = from || numThoughts;
      tweetNum > max(BigInt(0), (from || numThoughts) - BigInt(pageSize));
      tweetNum--
    ) {
      let tweetID: string | null = null;

      try {
        tweetID = await this._contract.methods
          .tweets_per_hashtag(hashtag, tweetNum.toString())
          .call();
      } catch (error) {
        console.error(error);
      }

      if (!tweetID || tweetID === '0') {
        continue;
      }

      const tweet = await this.getThoughtByID(tweetID);

      if (!tweet || tweet.sender == invalidAddress) {
        continue;
      }

      tweets.push(tweet);
    }

    return new Thoughts(tweets, numThoughts);
  }

  async getThoughtsByAuthor(
    displayName: string | null,
    address: string | null,
    from: bigint | null
  ): Promise<Thoughts | null> {
    let numThoughts: bigint | null = null;

    try {
      numThoughts = BigInt(await this._contract.methods.num_tweets_per_sender(address).call());
    } catch (error) {
      console.error(error);
    }

    if (numThoughts === null) {
      return null;
    }

    const tweets: Thought[] = new Array();

    for (
      let tweetNum = from || numThoughts;
      tweetNum > max(BigInt(0), (from || numThoughts) - BigInt(pageSize));
      tweetNum--
    ) {
      let tweetID: string | null = null;

      try {
        tweetID = await this._contract.methods
          .tweets_per_sender(address, tweetNum.toString())
          .call();
      } catch (error) {
        console.error(error);
      }

      if (!tweetID || tweetID === '0') {
        continue;
      }

      const tweet = await this.getThoughtByID(tweetID);

      if (!tweet || tweet.sender == invalidAddress) {
        continue;
      }

      if (displayName && tweet.displayName !== displayName) {
        continue;
      }

      tweets.push(tweet);

      if (tweets.length === pageSize) {
        break;
      }
    }

    return new Thoughts(tweets, numThoughts);
  }

  async getRecentThoughts(from: bigint | null): Promise<Thoughts | null> {
    var numThoughts: bigint | null = null;

    try {
      numThoughts = BigInt(await this._contract.methods.num_tweets().call());
    } catch (error) {
      console.error(error);
    }

    if (numThoughts === null) {
      return null;
    }

    const thoughts: Thought[] = new Array();

    for (
      let tweetNum = from || numThoughts;
      tweetNum > max(BigInt(0), (from || numThoughts) - BigInt(pageSize));
      tweetNum--
    ) {
      const tweet = await this.getThoughtByID(`${tweetNum}`);
      if (!tweet || tweet.sender === invalidAddress) {
        continue;
      }

      thoughts.push(tweet);
    }

    return new Thoughts(thoughts, numThoughts);
  }

  async getHashtagByThoughtID(thoughtID: string): Promise<string | null> {
    var tweet: RPCTweet | null = null;

    try {
      tweet = await this._contract.methods.tweets(thoughtID).call();
    } catch (error) {
      console.error(error);
    }

    if (!tweet || tweet.sender === invalidAddress) {
      return null;
    }

    return tweet.hashtag;
  }

  async getLatestName(address: string): Promise<string | null> {
    var numThoughts: string | null = null;

    try {
      numThoughts = await this._contract.methods.num_tweets_per_sender(address).call();
    } catch (error) {
      console.error(error);
    }

    if (!numThoughts) {
      return null;
    }

    var tweetID: string | null = null;

    try {
      tweetID = await this._contract.methods.tweets_per_sender(address, numThoughts).call();
    } catch (error) {
      console.error(error);
    }

    if (!tweetID || tweetID === '0') {
      return null;
    }

    var tweet: RPCTweet | null = null;

    try {
      tweet = await this._contract.methods.tweets(tweetID).call();
    } catch (error) {
      console.error(error);
    }

    if (!tweet || tweet.sender === invalidAddress) {
      return null;
    }

    return tweet.display_name;
  }

  async getReplyByID(replyID: string): Promise<Reply | null> {
    let r: RPCReply | null = null;

    try {
      r = await this._contract.methods.replies(replyID).call();
    } catch (error) {
      console.error(error);
    }

    if (!r || r.sender === invalidAddress) {
      return null;
    }

    const res = new AbiReply(r);

    return res;
  }

  async getRecentReplies(thoughtID: string, from: bigint | null): Promise<Reply[] | null> {
    let numReplies: bigint | null = from;

    if (!numReplies) {
      try {
        numReplies = BigInt(await this._contract.methods.num_replies_per_tweet(thoughtID).call());
      } catch (error) {
        console.error(error);
      }
    }

    if (!numReplies) {
      return null;
    }

    const replies: Reply[] = new Array();

    for (
      let replyNum = max(BigInt(1), numReplies - BigInt(pageSize - 1));
      replyNum <= numReplies;
      replyNum++
    ) {
      let replyID: string | null = null;

      try {
        replyID = await this._contract.methods
          .replies_per_tweet(thoughtID, replyNum.toString())
          .call();
      } catch (error) {
        console.error(error);
      }

      if (!replyID) {
        continue;
      }

      let reply = await this.getReplyByID(replyID);

      if (!reply) {
        continue;
      }

      replies.push(reply);
    }

    return replies;
  }

  invalidateCache(): void {}
}

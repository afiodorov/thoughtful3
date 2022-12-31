import { Thought, Reply } from '../responses';
import { Fetcher } from './fetcher';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import abi from '../../../contracts/abi.json';
import { RPCReply, RPCTweet } from './rpc_responses';

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

  constructor({ text, display_name, pk, sender, likes, retweets, seq_num, tweet }: RPCReply) {
    this.id = pk;
    this.sender = sender;
    this.text = text;
    this.displayName = display_name;
    this.numLikes = parseInt(likes, 10);
    this.numRetweets = parseInt(retweets, 10);
    this.seq_num = parseInt(seq_num, 10);
    this.tweet = tweet;
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
    numReplies: number,
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
    this.blockTimestamp = 0;
    this.numLikes = parseInt(tweet.likes, 10);
    this.numReplies = numReplies;
    this.numRetweets = parseInt(tweet.retweets, 10);
    this.quoteText = quoteText;
    this.quoteDisplayName = quoteDisplayName;
    this.quoteSender = quoteSender;
    this.quoteHashtag = quoteHashtag;
    this.retweetOf = tweet.retweet_of;
    this.isReplyRetweet = tweet.is_reply_retweet;
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
      console.log(error);
    }

    if (!tweet || tweet.sender === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    let numReplies: number | null = null;

    try {
      numReplies = await this._contract.methods.num_replies_per_tweet(thoughtID).call();
    } catch (error) {
      console.log(error);
    }

    if (numReplies === null) {
      return null;
    }

    if (tweet.retweet_of !== '0' && !tweet.is_reply_retweet) {
      let quoteTweet: RPCTweet | null = null;

      try {
        quoteTweet = await this._contract.methods.tweets(tweet.retweet_of).call();
      } catch (error) {
        console.log(error);
      }

      if (!quoteTweet || quoteTweet.sender === '0x0000000000000000000000000000000000000000') {
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
        console.log(error);
      }

      if (!quoteReply || quoteReply.sender === '0x0000000000000000000000000000000000000000') {
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

  async getThoughtsByHashtag(hashtag: string, skip: number): Promise<Thought[] | null> {
    return null;
  }
  async getThoughtsByAuthor(
    displayName: string | null,
    adress: string | null,
    skip: number
  ): Promise<Thought[] | null> {
    return null;
  }

  async getRecentThoughts(skip: number): Promise<Thought[] | null> {
    var numTweets: number | null = null;

    try {
      numTweets = await this._contract.methods.num_tweets().call();
    } catch (error) {
      console.log(error);
    }

    if (numTweets === null) {
      return null;
    }

    const thoughts: Thought[] = new Array();

    for (
      let tweetNum = numTweets - skip;
      tweetNum > Math.max(0, numTweets - 30 - skip);
      tweetNum--
    ) {
      const tweet = await this.getThoughtByID(`${tweetNum}`);
      if (tweet) {
        thoughts.push(tweet);
      }
    }

    return thoughts;
  }

  async getHashtagByThoughtID(thoughtID: string): Promise<string | null> {
    var tweet: RPCTweet | null = null;

    try {
      tweet = await this._contract.methods.tweets(thoughtID).call();
    } catch (error) {
      console.log(error);
    }

    if (!tweet || tweet.sender === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    return tweet.hashtag;
  }

  async getLatestName(address: string): Promise<string | null> {
    return null;
  }

  async getReplyByID(replyID: string): Promise<Reply | null> {
    let r: RPCReply | null = null;

    try {
      r = await this._contract.methods.replies(replyID).call();
    } catch (error) {
      console.log(error);
    }

    if (!r || r.sender === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    const res = new AbiReply(r);
    res.blockTimestamp = 0;

    return res;
  }

  async getRecentReplies(thoughtID: string, skip: number): Promise<Reply[] | null> {
    return null;
  }

  invalidateCache(): void {}
}

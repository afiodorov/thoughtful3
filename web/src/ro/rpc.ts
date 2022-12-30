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
    tweetRPC: RPCTweet,
    numReplies: number,
    quoteText = '',
    quoteSender = '',
    quoteDisplayName = '',
    quoteHashtag = ''
  ) {
    this.id = tweetRPC.pk;
    this.sender = tweetRPC.sender;
    this.text = tweetRPC.text;
    this.displayName = tweetRPC.display_name;
    this.hashtag = tweetRPC.hashtag;
    this.blockTimestamp = 0;
    this.numLikes = parseInt(tweetRPC.likes, 10);
    this.numReplies = numReplies;
    this.numRetweets = parseInt(tweetRPC.retweets, 10);
    this.quoteText = quoteText;
    this.quoteDisplayName = quoteDisplayName;
    this.quoteSender = quoteSender;
    this.quoteHashtag = quoteHashtag;
    this.retweetOf = tweetRPC.retweet_of;
    this.isReplyRetweet = tweetRPC.is_reply_retweet;
  }
}

export class RPCFetcher implements Fetcher {
  private _contract: Contract;

  constructor(web3: Web3, contractAddress: string) {
    this._contract = new web3.eth.Contract(abi as AbiItem[], contractAddress);
  }

  async getThoughtByID(thoughtID: string): Promise<Thought | null> {
    return null;
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
    var numTweetsAny: any = null;

    try {
      numTweetsAny = await this._contract.methods.num_tweets().call();
    } catch (error) {
      console.log(error);
    }

    if (!numTweetsAny) {
      return null;
    }

    const numTweets: number = numTweetsAny;

    const thoughts: Thought[] = new Array();

    for (let tweet = numTweets - skip; tweet > Math.max(0, numTweets - 30 - skip); tweet--) {
      var tweetAny: any = null;

      try {
        tweetAny = await this._contract.methods.tweets(tweet).call();
      } catch (error) {
        console.log(error);
      }

      if (!tweetAny || tweetAny.sender === '0x0000000000000000000000000000000000000000') {
        continue;
      }

      const tweetRPC: RPCTweet = tweetAny;

      let numRepliesAny: any = null;

      try {
        numRepliesAny = await this._contract.methods.num_replies_per_tweet(tweet).call();
      } catch (error) {
        console.log(error);
        continue;
      }

      const numReplies: number = numRepliesAny;

      if (tweetRPC.retweet_of !== '0' && !tweetRPC.is_reply_retweet) {
        let quoteTweetAny: any;

        try {
          quoteTweetAny = await this._contract.methods.tweets(tweetRPC.retweet_of).call();
        } catch (error) {
          console.log(error);
          continue;
        }

        if (!quoteTweetAny) {
          continue;
        }

        const quoteTweetRPC: RPCTweet = quoteTweetAny;

        thoughts.push(
          new AbiThought(
            tweetRPC,
            numReplies,
            quoteTweetRPC.text,
            quoteTweetRPC.sender,
            quoteTweetRPC.display_name,
            quoteTweetRPC.hashtag
          )
        );
      } else if (tweetRPC.retweet_of !== '0' && tweetRPC.is_reply_retweet) {
        let quoteReplyAny: any;

        try {
          quoteReplyAny = await this._contract.methods.replies(tweetRPC.retweet_of).call();
        } catch (error) {
          console.log(error);
          continue;
        }

        if (!quoteReplyAny) {
          continue;
        }

        const quoteReplyRPC: RPCReply = quoteReplyAny;

        thoughts.push(
          new AbiThought(
            tweetRPC,
            numReplies,
            quoteReplyRPC.text,
            quoteReplyRPC.sender,
            quoteReplyRPC.display_name,
            ''
          )
        );
      } else {
        thoughts.push(new AbiThought(tweetRPC, numReplies));
      }
    }

    return thoughts;
  }

  async getHashtagByThoughtID(thoughtID: string): Promise<string | null> {
    return null;
  }
  async getLatestName(address: string): Promise<string | null> {
    return null;
  }

  async getReplyByID(replyID: string): Promise<Reply | null> {
    let r: any = null;
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

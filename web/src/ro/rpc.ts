import { Thought, Reply } from '../responses';
import { Fetcher } from './fetcher';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import abi from '../../../contracts/abi.json';

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
    return null;
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

    class R implements Reply {
      id: string;
      sender: string;
      text: string;
      displayName: string;
      blockTimestamp: number;
      numLikes: number;
      numRetweets: number;
      seq_num: number;
      tweet: string;

      constructor({ text, display_name, pk, sender, likes, retweets, seq_num, tweet }: any) {
        this.id = pk;
        this.sender = sender;
        this.text = text;
        this.displayName = display_name;
        this.numLikes = likes;
        this.numRetweets = retweets;
        this.seq_num = seq_num;
        this.tweet = tweet;
      }
    }

    const res = new R(r);
    res.blockTimestamp = 0;

    return res;
  }

  async getRecentReplies(thoughtID: string, skip: number): Promise<Reply[] | null> {
    return null;
  }

  invalidateCache(): void {}
}

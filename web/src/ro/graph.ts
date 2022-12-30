import {
  allRecentThoughts,
  hashtagByThoughtID,
  latestNameByAddress,
  thoughtByID,
  thoughtsByAuthor,
  thoughtsByHashtag,
  replyByID,
  repliesByThought
} from '../queries';
import { Fetcher } from './fetcher';
import { Thought, Reply } from '../responses';
import { QueryDispatcher } from '../query';

export class GraphFetcher implements Fetcher {
  private _queryDispatcher: QueryDispatcher;

  async getThoughtByID(thoughtID: string): Promise<Thought | null> {
    let data: any = null;
    try {
      data = await this._queryDispatcher.fetch(thoughtByID(thoughtID));
    } catch (error) {
      console.log(error);
    }

    if (!data) {
      return null;
    }

    const thoughts: Thought[] = data['newTweets'];

    if (!thoughts) {
      return null;
    }

    return thoughts[0];
  }

  async getThoughtsByHashtag(hashtag: string, skip: number): Promise<Thought[] | null> {
    let data: any = null;
    try {
      data = await this._queryDispatcher.fetch(thoughtsByHashtag(hashtag, skip));
    } catch (error) {
      console.log(error);
    }

    if (!data) {
      return null;
    }

    const thoughts: Thought[] = data['newTweets'];

    return thoughts;
  }

  async getThoughtsByAuthor(
    displayName: string | null,
    adress: string | null,
    skip: number
  ): Promise<Thought[] | null> {
    let data: any = null;
    try {
      data = await this._queryDispatcher.fetch(thoughtsByAuthor(displayName, adress, skip));
    } catch (error) {
      console.log(error);
    }

    if (!data) {
      return null;
    }

    const thoughts: Thought[] = data['newTweets'];

    return thoughts;
  }

  async getRecentThoughts(skip: number): Promise<Thought[] | null> {
    let data: any = null;
    try {
      data = await this._queryDispatcher.fetch(allRecentThoughts(skip));
    } catch (error) {
      console.log(error);
    }

    if (!data) {
      return null;
    }

    const thoughts: Thought[] = data['newTweets'];

    return thoughts;
  }

  async getHashtagByThoughtID(thoughtID: string): Promise<string | null> {
    let data: any = null;
    try {
      data = await this._queryDispatcher.fetch(hashtagByThoughtID(thoughtID));
    } catch (error) {
      console.log(error);
    }

    if (!data) {
      return null;
    }

    interface withHashtag {
      hashtag: string;
    }

    const h = data['newTweets'] as withHashtag[];

    if (!h) {
      return null;
    }

    return h[0].hashtag;
  }

  async getLatestName(address: string): Promise<string | null> {
    let data: any = null;
    try {
      data = await this._queryDispatcher.fetch(latestNameByAddress(address));
    } catch (error) {
      console.log(error);
    }

    if (!data) {
      return null;
    }

    let latestThoughtDisplayName: string | undefined;
    let latestThoughtBlockNumber: number | undefined;

    if (data['newTweets'].length > 0) {
      latestThoughtDisplayName = data['newTweets'][0]['displayName'];
      latestThoughtBlockNumber = data['newTweets'][0]['blockNumber'];
    }

    let latestReplyDisplayName: string | undefined;
    let latestReplyBlockNumber: number | undefined;

    if (data['newReplies'].length > 0) {
      latestReplyDisplayName = data['newReplies'][0]['displayName'];
      latestReplyBlockNumber = data['newReplies'][0]['blockNumber'];
    }

    if (latestThoughtBlockNumber && latestReplyBlockNumber) {
      if (latestThoughtBlockNumber > latestReplyBlockNumber) {
        return latestThoughtDisplayName!;
      }

      return latestReplyDisplayName!;
    }

    if (latestThoughtDisplayName) {
      return latestThoughtDisplayName;
    }

    if (latestReplyDisplayName) {
      return latestReplyDisplayName;
    }

    return null;
  }

  async getReplyByID(replyID: string): Promise<Reply | null> {
    let data: any = null;
    try {
      data = await this._queryDispatcher.fetch(replyByID(replyID));
    } catch (error) {
      console.log(error);
    }

    if (!data) {
      return null;
    }

    const replies: Reply[] = data['newReplies'];

    if (!replies) {
      return null;
    }

    return replies[0];
  }

  async getRecentReplies(thoughtID: string, skip: number): Promise<Reply[] | null> {
    let data: any = null;
    try {
      data = await this._queryDispatcher.fetch(repliesByThought(thoughtID, skip));
    } catch (error) {
      console.log(error);
    }

    if (!data) {
      return null;
    }

    const replies: Reply[] = data['newReplies'];

    return replies;
  }

  constructor(queryDispatcher: QueryDispatcher) {
    this._queryDispatcher = queryDispatcher;
  }

  invalidateCache(): void {
    this._queryDispatcher.invalidateCache();
  }
}

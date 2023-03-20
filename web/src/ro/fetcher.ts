import { Thought, Reply } from '../responses';

export class Thoughts {
  thoughts: Thought[];
  from: bigint;

  constructor(thoughts: Thought[], from: bigint) {
    this.thoughts = thoughts;
    this.from = from;
  }
}

export interface Fetcher {
  getThoughtByID(thoughtID: string): Promise<Thought | null>;
  getThoughtsByHashtag(hashtag: string, from: bigint | null): Promise<Thoughts | null>;
  getThoughtsByAuthor(
    displayName: string | null,
    address: string | null,
    from: bigint | null
  ): Promise<Thoughts | null>;
  getRecentThoughts(from: bigint | null): Promise<Thoughts | null>;
  getHashtagByThoughtID(thoughtID: string): Promise<string | null>;
  getLatestName(address: string): Promise<string | null>;
  getReplyByID(replyID: string): Promise<Reply | null>;
  getRecentReplies(thoughtID: string, from: bigint | null): Promise<Reply[] | null>;

  invalidateCache(): void;
}

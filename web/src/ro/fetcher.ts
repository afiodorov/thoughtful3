import { Thought, Reply } from '../responses';

export interface Fetcher {
  getThoughtByID(thoughtID: string): Promise<Thought | null>;
  getThoughtsByHashtag(hashtag: string, skip: number): Promise<Thought[] | null>;
  getThoughtsByAuthor(
    displayName: string | null,
    address: string | null,
    skip: number
  ): Promise<Thought[] | null>;
  getRecentThoughts(skip: number): Promise<Thought[] | null>;
  getHashtagByThoughtID(thoughtID: string): Promise<string | null>;
  getLatestName(address: string): Promise<string | null>;
  getReplyByID(replyID: string): Promise<Reply | null>;
  getRecentReplies(thoughtID: string, skip: number): Promise<Reply[] | null>;

  invalidateCache(): void;
}

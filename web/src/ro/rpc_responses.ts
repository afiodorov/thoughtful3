export interface RPCReply {
  display_name: string;
  likes: string;
  pk: string;
  retweets: string;
  sender: string;
  seq_num: string;
  text: string;
  tweet: string;
  block_timestamp?: string;
}

export interface RPCTweet {
  display_name: string;
  hashtag: string;
  is_reply_retweet: boolean;
  likes: string;
  pk: string;
  retweet_of: string;
  retweets: string;
  sender: string;
  text: string;
  block_timestamp?: string;
}

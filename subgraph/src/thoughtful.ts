import {
  Thoughtful,
  NewTweet as NewTweetEvent,
  NewReply as NewReplyEvent,
  NewLike as NewLikeEvent,
  NewReplyLike as NewReplyLikeEvent,
} from "../generated/Thoughtful/Thoughtful";
import { NewTweet, NewReply, NewLike, NewReplyLike } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

function incrementReplies(pk: BigInt): void {
  let entity = NewTweet.load(pk.toString());
  entity!.numReplies = entity!.numReplies + 1;
  entity!.save();
}

function incrementLikes(pk: BigInt, isReplyLike: boolean): void {
  if (!isReplyLike) {
    let entity = NewTweet.load(pk.toString());
    entity!.numLikes = entity!.numLikes + 1;
    entity!.save();
    return;
  }

  let entity = NewReply.load(pk.toString());
  entity!.numLikes = entity!.numLikes + 1;
  entity!.save();
  return;
}

function incrementRetweets(pk: BigInt, isReplyRetweet: boolean): void {
  if (!isReplyRetweet) {
    let entity = NewTweet.load(pk.toString());
    entity!.numRetweets = entity!.numRetweets + 1;
    entity!.save();
  }

  let entity = NewReply.load(pk.toString());
  entity!.numRetweets = entity!.numRetweets + 1;
  entity!.save();
}

export function handleNewTweet(event: NewTweetEvent): void {
  let entity = new NewTweet(event.params.pk.toString());
  let contract = Thoughtful.bind(event.address);
  let tweet = contract.tweets(event.params.pk);

  entity.sender = event.params.sender;
  entity.text = event.params.text;
  entity.displayName = tweet.displayName;
  entity.hashtag = tweet.hashtag;
  entity.retweetOf = event.params.retweetOf;
  entity.isReplyRetweet = event.params.isReplyRetweet;
  entity.numReplies = 0;
  entity.numLikes = 0;
  entity.numRetweets = 0;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  if (event.params.retweetOf.notEqual(BigInt.fromI32(0))) {
    incrementRetweets(event.params.retweetOf, event.params.isReplyRetweet);

    if (event.params.isReplyRetweet) {
      const quote = contract.replies(event.params.retweetOf);
      const quoteOf = contract.tweets(quote.tweet);

      entity.quoteText = quote.text;
      entity.quoteDisplayName = quote.displayName;
      entity.quoteHashtag = quoteOf.hashtag;
      entity.quoteSender = quote.sender;
    } else {
      const quote = contract.tweets(event.params.retweetOf);

      entity.quoteText = quote.text;
      entity.quoteDisplayName = quote.displayName;
      entity.quoteHashtag = quote.hashtag;
      entity.quoteSender = quote.sender;
    }
  } else {
    entity.quoteText = "";
    entity.quoteDisplayName = "";
    entity.quoteHashtag = "";
    entity.quoteSender = Bytes.fromUTF8("");
  }

  entity.save();
}

export function handleNewReply(event: NewReplyEvent): void {
  let entity = new NewReply(event.params.pk.toString());
  let contract = Thoughtful.bind(event.address);
  let reply = contract.replies(event.params.pk);

  entity.sender = event.params.sender;
  entity.text = event.params.text;
  entity.displayName = reply.displayName;
  entity.tweet = event.params.tweet;
  entity.seq_num = event.params.seq_num;
  entity.numLikes = 0;
  entity.numRetweets = 0;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  incrementReplies(event.params.tweet);
}

export function handleNewLike(event: NewLikeEvent): void {
  let entity = new NewLike(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.pk = event.params.pk;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  incrementLikes(event.params.pk, false);
}

export function handleNewReplyLike(event: NewReplyLikeEvent): void {
  let entity = new NewReplyLike(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.pk = event.params.pk;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  incrementLikes(event.params.pk, true);
}

import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  NewTweet,
  NewReply,
  NewLike,
  NewReplyLike
} from "../generated/Thoughtful/Thoughtful"

export function createNewTweetEvent(
  pk: BigInt,
  sender: Address,
  text: string,
  displayName: string,
  hashtag: string,
  retweetOf: BigInt,
  isReplyRetweet: boolean
): NewTweet {
  let newTweetEvent = changetype<NewTweet>(newMockEvent())

  newTweetEvent.parameters = new Array()

  newTweetEvent.parameters.push(
    new ethereum.EventParam("pk", ethereum.Value.fromUnsignedBigInt(pk))
  )
  newTweetEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  newTweetEvent.parameters.push(
    new ethereum.EventParam("text", ethereum.Value.fromString(text))
  )
  newTweetEvent.parameters.push(
    new ethereum.EventParam(
      "displayName",
      ethereum.Value.fromString(displayName)
    )
  )
  newTweetEvent.parameters.push(
    new ethereum.EventParam("hashtag", ethereum.Value.fromString(hashtag))
  )
  newTweetEvent.parameters.push(
    new ethereum.EventParam(
      "retweetOf",
      ethereum.Value.fromUnsignedBigInt(retweetOf)
    )
  )
  newTweetEvent.parameters.push(
    new ethereum.EventParam(
      "isReplyRetweet",
      ethereum.Value.fromBoolean(isReplyRetweet)
    )
  )

  return newTweetEvent
}

export function createNewReplyEvent(
  pk: BigInt,
  sender: Address,
  text: string,
  displayName: string,
  tweet: BigInt,
  seq_num: i32
): NewReply {
  let newReplyEvent = changetype<NewReply>(newMockEvent())

  newReplyEvent.parameters = new Array()

  newReplyEvent.parameters.push(
    new ethereum.EventParam("pk", ethereum.Value.fromUnsignedBigInt(pk))
  )
  newReplyEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  newReplyEvent.parameters.push(
    new ethereum.EventParam("text", ethereum.Value.fromString(text))
  )
  newReplyEvent.parameters.push(
    new ethereum.EventParam(
      "displayName",
      ethereum.Value.fromString(displayName)
    )
  )
  newReplyEvent.parameters.push(
    new ethereum.EventParam("tweet", ethereum.Value.fromUnsignedBigInt(tweet))
  )
  newReplyEvent.parameters.push(
    new ethereum.EventParam(
      "seq_num",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(seq_num))
    )
  )

  return newReplyEvent
}

export function createNewLikeEvent(pk: BigInt, sender: Address): NewLike {
  let newLikeEvent = changetype<NewLike>(newMockEvent())

  newLikeEvent.parameters = new Array()

  newLikeEvent.parameters.push(
    new ethereum.EventParam("pk", ethereum.Value.fromUnsignedBigInt(pk))
  )
  newLikeEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return newLikeEvent
}

export function createNewReplyLikeEvent(
  pk: BigInt,
  sender: Address
): NewReplyLike {
  let newReplyLikeEvent = changetype<NewReplyLike>(newMockEvent())

  newReplyLikeEvent.parameters = new Array()

  newReplyLikeEvent.parameters.push(
    new ethereum.EventParam("pk", ethereum.Value.fromUnsignedBigInt(pk))
  )
  newReplyLikeEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return newReplyLikeEvent
}

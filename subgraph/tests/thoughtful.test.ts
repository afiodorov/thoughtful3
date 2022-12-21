import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { NewTweet } from "../generated/schema"
import { NewTweet as NewTweetEvent } from "../generated/Thoughtful/Thoughtful"
import { handleNewTweet } from "../src/thoughtful"
import { createNewTweetEvent } from "./thoughtful-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let pk = BigInt.fromI32(234)
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let text = "Example string value"
    let displayName = "Example string value"
    let hashtag = "Example string value"
    let retweetOf = BigInt.fromI32(234)
    let isReplyRetweet = "boolean Not implemented"
    let newNewTweetEvent = createNewTweetEvent(
      pk,
      sender,
      text,
      displayName,
      hashtag,
      retweetOf,
      isReplyRetweet
    )
    handleNewTweet(newNewTweetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NewTweet created and stored", () => {
    assert.entityCount("NewTweet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NewTweet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pk",
      "234"
    )
    assert.fieldEquals(
      "NewTweet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "NewTweet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "text",
      "Example string value"
    )
    assert.fieldEquals(
      "NewTweet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "displayName",
      "Example string value"
    )
    assert.fieldEquals(
      "NewTweet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "hashtag",
      "Example string value"
    )
    assert.fieldEquals(
      "NewTweet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "retweetOf",
      "234"
    )
    assert.fieldEquals(
      "NewTweet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "isReplyRetweet",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
} from "@graphprotocol/graph-ts";

export class NewTweet extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    store.set("NewTweet", this.id, this);
  }

  static load(id: string): NewTweet | null {
    return changetype<NewTweet | null>(store.get("NewTweet", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get pk(): BigInt {
    let value = this.get("pk");
    return value!.toBigInt();
  }

  set pk(value: BigInt) {
    this.set("pk", Value.fromBigInt(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    return value!.toBytes();
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get text(): string {
    let value = this.get("text");
    return value!.toString();
  }

  set text(value: string) {
    this.set("text", Value.fromString(value));
  }

  get displayName(): string {
    let value = this.get("displayName");
    return value!.toString();
  }

  set displayName(value: string) {
    this.set("displayName", Value.fromString(value));
  }

  get hashtag(): string {
    let value = this.get("hashtag");
    return value!.toString();
  }

  set hashtag(value: string) {
    this.set("hashtag", Value.fromString(value));
  }

  get retweetOf(): BigInt {
    let value = this.get("retweetOf");
    return value!.toBigInt();
  }

  set retweetOf(value: BigInt) {
    this.set("retweetOf", Value.fromBigInt(value));
  }

  get quoteHashtag(): string {
    let value = this.get("quoteHashtag");
    return value!.toString();
  }

  set quoteHashtag(value: string) {
    this.set("quoteHashtag", Value.fromString(value));
  }

  get quoteText(): string {
    let value = this.get("quoteText");
    return value!.toString();
  }

  set quoteText(value: string) {
    this.set("quoteText", Value.fromString(value));
  }

  get quoteDisplayName(): string {
    let value = this.get("quoteDisplayName");
    return value!.toString();
  }

  set quoteDisplayName(value: string) {
    this.set("quoteDisplayName", Value.fromString(value));
  }

  get quoteSender(): Bytes {
    let value = this.get("quoteSender");
    return value!.toBytes();
  }

  set quoteSender(value: Bytes) {
    this.set("quoteSender", Value.fromBytes(value));
  }

  get isReplyRetweet(): boolean {
    let value = this.get("isReplyRetweet");
    return value!.toBoolean();
  }

  set isReplyRetweet(value: boolean) {
    this.set("isReplyRetweet", Value.fromBoolean(value));
  }

  get numReplies(): i32 {
    let value = this.get("numReplies");
    return value!.toI32();
  }

  set numReplies(value: i32) {
    this.set("numReplies", Value.fromI32(value));
  }

  get numLikes(): i32 {
    let value = this.get("numLikes");
    return value!.toI32();
  }

  set numLikes(value: i32) {
    this.set("numLikes", Value.fromI32(value));
  }

  get numRetweets(): i32 {
    let value = this.get("numRetweets");
    return value!.toI32();
  }

  set numRetweets(value: i32) {
    this.set("numRetweets", Value.fromI32(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class NewReply extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    store.set("NewReply", this.id, this);
  }

  static load(id: string): NewReply | null {
    return changetype<NewReply | null>(store.get("NewReply", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get pk(): BigInt {
    let value = this.get("pk");
    return value!.toBigInt();
  }

  set pk(value: BigInt) {
    this.set("pk", Value.fromBigInt(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    return value!.toBytes();
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get text(): string {
    let value = this.get("text");
    return value!.toString();
  }

  set text(value: string) {
    this.set("text", Value.fromString(value));
  }

  get displayName(): string {
    let value = this.get("displayName");
    return value!.toString();
  }

  set displayName(value: string) {
    this.set("displayName", Value.fromString(value));
  }

  get tweet(): BigInt {
    let value = this.get("tweet");
    return value!.toBigInt();
  }

  set tweet(value: BigInt) {
    this.set("tweet", Value.fromBigInt(value));
  }

  get seq_num(): i32 {
    let value = this.get("seq_num");
    return value!.toI32();
  }

  set seq_num(value: i32) {
    this.set("seq_num", Value.fromI32(value));
  }

  get numLikes(): i32 {
    let value = this.get("numLikes");
    return value!.toI32();
  }

  set numLikes(value: i32) {
    this.set("numLikes", Value.fromI32(value));
  }

  get numRetweets(): i32 {
    let value = this.get("numRetweets");
    return value!.toI32();
  }

  set numRetweets(value: i32) {
    this.set("numRetweets", Value.fromI32(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class NewLike extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save NewLike entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type NewLike must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("NewLike", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): NewLike | null {
    return changetype<NewLike | null>(store.get("NewLike", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get pk(): BigInt {
    let value = this.get("pk");
    return value!.toBigInt();
  }

  set pk(value: BigInt) {
    this.set("pk", Value.fromBigInt(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    return value!.toBytes();
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class NewReplyLike extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save NewReplyLike entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type NewReplyLike must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("NewReplyLike", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): NewReplyLike | null {
    return changetype<NewReplyLike | null>(
      store.get("NewReplyLike", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get pk(): BigInt {
    let value = this.get("pk");
    return value!.toBigInt();
  }

  set pk(value: BigInt) {
    this.set("pk", Value.fromBigInt(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    return value!.toBytes();
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

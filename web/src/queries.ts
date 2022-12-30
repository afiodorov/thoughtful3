export const allRecentThoughts = (skip: number) => `
{
  newTweets(orderBy: id, orderDirection: desc, first: 30, skip: ${skip}) {
    id
    sender
    text
    displayName
    hashtag
    blockTimestamp
    numLikes
    numReplies
    numRetweets
    quoteText
    quoteDisplayName
    quoteSender
    quoteHashtag
    retweetOf
    isReplyRetweet
  }
}
`;

export const thoughtByID = (id: string) => `
{
  newTweets(first: 1, where:{id: "${id}"}) {
    id
    sender
    text
    displayName
    hashtag
    blockTimestamp
    numLikes
    numReplies
    numRetweets
    quoteText
    quoteDisplayName
    quoteSender
    quoteHashtag
    retweetOf
    isReplyRetweet
  }
}
`;

export const repliesByThought = (thoughtID: string, skip: number) => `
{
  newReplies(first: 30, orderBy: blockNumber, where:{tweet: "${thoughtID}"}, skip: ${skip}) {
    id
    sender
    text
    displayName
    tweet
    blockTimestamp
    numLikes
    numRetweets
    seq_num
  }
}
`;

export const replyByID = (replyID: string) => `
{
  newReplies(first: 1, where:{id: "${replyID}"}) {
    id
    sender
    text
    displayName
    tweet
    blockTimestamp
    numLikes
    numRetweets
    seq_num
  }
}
`;

export const hashtagByThoughtID = (thoughtID: string) => `
{
  newTweets(first: 1, where:{id: "${thoughtID}"}) {
    hashtag
  }
}
`;

export const thoughtsByHashtag = (hashtag: string, skip: number) => `
{
  newTweets(orderBy: id, orderDirection: desc, first: 30, where:{hashtag: "${hashtag}"}, skip: ${skip}) {
    id
    sender
    text
    displayName
    hashtag
    blockTimestamp
    numLikes
    numReplies
    numRetweets
    quoteText
    quoteDisplayName
    quoteSender
    quoteHashtag
    retweetOf
    isReplyRetweet
  }
}
`;

export const thoughtsByAuthor = (
  displayName: null | string,
  address: null | string,
  skip: number
) => {
  let res: Array<string> = new Array();

  if (displayName) {
    res.push(`displayName: "${displayName}"`);
  }

  if (address) {
    res.push(`sender: "${address}"`);
  }

  const filter = res.join(', ');

  return `{
  newTweets(orderBy: id, orderDirection: desc, first: 30, where:{${filter}}, skip: ${skip}) {
    id
    sender
    text
    displayName
    hashtag
    blockTimestamp
    numLikes
    numReplies
    numRetweets
    quoteText
    quoteDisplayName
    quoteSender
    quoteHashtag
    retweetOf
    isReplyRetweet
  }
}
`;
};

export const latestNameByAddress = (address: string) => `
{
  newTweets(
    first: 1
    orderBy: blockNumber
    orderDirection: desc
    where: {sender: "${address.toLowerCase()}"}
  ) {
    displayName
    blockNumber
  }
  newReplies(
    first: 1
    orderBy: blockNumber
    orderDirection: desc
    where: {sender: "${address.toLowerCase()}"}
  ) {
    displayName
    blockNumber
  }
}
`;

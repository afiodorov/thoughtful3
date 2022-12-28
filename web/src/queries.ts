export const allRecentThoughts = `
{
  newTweets(orderBy: id, orderDirection: desc, first: 30) {
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
    quoteHashtag
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
    quoteHashtag
  }
}
`;

export const repliesByThought = (thoughtID: string) => `
{
  newReplies(first: 30, orderBy: blockNumber, where:{tweet: "${thoughtID}"}) {
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

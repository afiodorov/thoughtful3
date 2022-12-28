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
    quoteHashtag
    retweetOf
    isReplyRetweet
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

export const hashtagByThoughtID = (thoughtID: string) => {
  return `
{
  newTweets(first: 1, where:{id: "${thoughtID}"}) {
    hashtag
  }
}
`;
};

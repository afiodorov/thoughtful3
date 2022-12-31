interface Env {
  graphURL: string | null;
  rpcURL: string;
  contractAddress: string;
  chainID: string;
}

export const chainValues: Map<string, Env> = new Map();

chainValues.set('0x1', {
  graphURL: 'https://api.thegraph.com/subgraphs/name/afiodorov/thoughtful3',
  rpcURL: 'https://eth.public-rpc.com/',
  contractAddress: '0xA8DF0077656a861395529E9BFC9aDC6f67fEEB4A',
  chainID: '0x1'
});

chainValues.set('0x2a', {
  graphURL: null,
  rpcURL: 'http://127.0.0.1:8545',
  contractAddress: '0x9f718CE6E91616d27F51959F940ee3230e48f929',
  chainID: '0x2a'
});

chainValues.set('0x89', {
  graphURL: null,
  rpcURL: 'https://polygon-rpc.com',
  contractAddress: '0xdafd1E56D7ee1B1d46C560eB97b39Ad8839E4a56',
  chainID: '0x89'
});

export const ttl = 5 * 60;
export const defaultName = 'Your Name';
export const defaultHashtag = 'hashtag';
export const defaultText = 'Make Every Word Count';
export const pageSize = 30;

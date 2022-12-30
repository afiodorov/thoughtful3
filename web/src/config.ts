const env = process.env.THOUGHTFUL_ENV || 'production';

interface Env {
  graphURL: string | null;
  rpcURL: string;
  contractAddress: string;
  chainID: string;
}

const values: Map<string, Env> = new Map();

values.set('production', {
  graphURL: 'https://api.thegraph.com/subgraphs/name/afiodorov/thoughtful3',
  rpcURL: 'https://eth.public-rpc.com/',
  contractAddress: '0xA8DF0077656a861395529E9BFC9aDC6f67fEEB4A',
  chainID: '0x1'
});

values.set('development', {
  graphURL: null,
  rpcURL: 'http://127.0.0.1:8545',
  contractAddress: '0x9f718CE6E91616d27F51959F940ee3230e48f929',
  chainID: '0x2A'
});

export const { graphURL, rpcURL, contractAddress, chainID } = values.get(env)!;

export const ttl = 5 * 60;
export const defaultName = 'Your Name';
export const defaultHashtag = 'hashtag';
export const defaultText = 'Make Every Word Count';

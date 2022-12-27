const env = process.env.THOUGHTFUL_ENV || 'production';

interface Env {
  graphURL: string;
  rpcURL: string;
  contractAddress: string;
}

const values: Map<string, Env> = new Map();

values.set('production', {
  graphURL: 'https://api.thegraph.com/subgraphs/name/afiodorov/thoughtful3',
  rpcURL: 'https://eth.public-rpc.com/',
  contractAddress: '0xA8DF0077656a861395529E9BFC9aDC6f67fEEB4A'
});

values.set('development', {
  graphURL: '',
  rpcURL: '',
  contractAddress: ''
});

export const { graphURL, rpcURL, contractAddress } = values.get(env)!;

export const ttl = 5 * 60;
export const defaultName = 'Your Name';
export const defaultHashtag = 'hashtag';
export const defaultText = 'Make Every Word Count';

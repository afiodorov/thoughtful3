interface Env {
  graphURL: string | null;
  rpcURL: string;
  contractAddress: string;
  chainID: string;
  contractVersion: string;
}

export const chainValues: Map<string, Env> = new Map();

chainValues.set('0x1', {
  graphURL: 'https://api.thegraph.com/subgraphs/name/afiodorov/thoughtful3',
  rpcURL: 'https://eth.public-rpc.com/',
  contractAddress: '0xA8DF0077656a861395529E9BFC9aDC6f67fEEB4A',
  chainID: '0x1',
  contractVersion: 'v1'
});

chainValues.set('0x2a', {
  graphURL: null,
  rpcURL: 'http://127.0.0.1:8545',
  contractAddress: '0x4666259f52F7721CaF007ddC8d67535452972CC7',
  chainID: '0x2a',
  contractVersion: 'v2'
});

chainValues.set('0x89', {
  graphURL: null,
  rpcURL: 'https://polygon-rpc.com',
  contractAddress: '0xdEFf831D0E5BD79eEE7D36977ef6158bf10a2CC8',
  chainID: '0x89',
  contractVersion: 'v2'
});

export const ttl = 5 * 60;
export const defaultName = 'Your Name';
export const defaultHashtag = 'hashtag';
export const defaultText = 'Make Every Word Count';
export const pageSize = 30;

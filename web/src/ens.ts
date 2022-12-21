import Web3 from 'web3';

export class EnsLooker {
  private cache: Map<string, string | null> = new Map();
  private _web3: Web3;

  constructor(web3: Web3) {
    this._web3 = web3;
  }

  async reverseLookup(address: string): Promise<string | null> {
    let res: string | null = null;

    if (this.cache.has(address)) {
      return this.cache.get(address)!;
    }

    try {
      const ensReverseRegistar = '0x084b1c3c81545d370f3634392de611caabff8148';
      const ensDefaultResolver = '0xa2c122be93b0074270ebee7f6b7292c7deb45047';

      const namehash = await this._web3.eth.call({
        to: ensReverseRegistar,
        data: this._web3.eth.abi.encodeFunctionCall(
          {
            name: 'node',
            type: 'function',
            inputs: [{ type: 'address', name: 'addr' }]
          },
          [address]
        )
      });

      const r = this._web3.eth.abi.decodeParameter(
        'string',
        await this._web3.eth.call({
          to: ensDefaultResolver,
          data: this._web3.eth.abi.encodeFunctionCall(
            {
              name: 'name',
              type: 'function',
              inputs: [{ type: 'bytes32', name: 'hash' }]
            },
            [namehash]
          )
        })
      );

      if (r) {
        res = `${r}`;
      }
    } catch (err) {}

    this.cache.set(address, res);

    return res;
  }
}

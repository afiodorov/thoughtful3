import { AbiItem, AbiInput } from 'web3-utils';
import Web3 from 'web3';
import abi from '../../contracts/abi.json';

interface Ethereum {
  request(t: object): Promise<string | null>;
  selectedAddress: string;
  on(k: string, fn: (a: any) => void): void;
}

export class MetaMask {
  private _deployedContract: string;
  private _ethereum: Ethereum;
  private _web3: Web3;
  private _abi: Map<string, AbiItem> = new Map();

  constructor(web3: Web3, contractAddress: string) {
    this._deployedContract = contractAddress;
    this._ethereum = (window as any).ethereum;
    this._web3 = web3;

    abi.forEach((rawAbiItem) => {
      const item = rawAbiItem as AbiItem;
      this._abi.set(item.name!, item);
    });
  }

  async newLike(id: string, isReplyLike: boolean): Promise<string | null> {
    try {
      await this._ethereum.request({ method: 'eth_requestAccounts' });
    } catch {
      return null;
    }

    const abiName = isReplyLike ? 'like_reply' : 'like';
    const txData = this._web3.eth.abi.encodeFunctionCall(this._abi.get(abiName)!, [id]);
    const transactionParameters = {
      to: this._deployedContract,
      from: this._ethereum.selectedAddress,
      data: txData,
      chainId: '0x1'
    };

    let resolved: string | null = null;

    try {
      resolved = await this._ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      });
    } catch (error) {}

    return resolved;
  }

  async selectedAddress(): Promise<string | null> {
    try {
      await this._ethereum.request({ method: 'eth_requestAccounts' });
    } catch {
      return null;
    }

    return this._ethereum.selectedAddress;
  }

  registerAccountChangeListener(f: (a: string[]) => void) {
    this._ethereum.on('accountsChanged', f);
  }

  async newThought(
    text: string,
    displayName: string,
    hashtag: string,
    retweetOf: string | null,
    isReplyQuote: boolean
  ): Promise<[string, number, string] | null> {
    try {
      await this._ethereum.request({ method: 'eth_requestAccounts' });
    } catch {
      return null;
    }

    let txData: string;

    if (!retweetOf) {
      txData = this._web3.eth.abi.encodeFunctionCall(this._abi.get('tweet')!, [
        text,
        displayName,
        hashtag
      ]);
    } else if (!isReplyQuote) {
      txData = this._web3.eth.abi.encodeFunctionCall(this._abi.get('retweet')!, [
        retweetOf,
        text,
        displayName
      ]);
    } else {
      txData = this._web3.eth.abi.encodeFunctionCall(this._abi.get('retweet_reply')!, [
        retweetOf,
        text,
        displayName
      ]);
    }

    const transactionParameters = {
      to: this._deployedContract,
      from: this._ethereum.selectedAddress,
      data: txData,
      chainId: '0x1'
    };

    let txHash: string | null = null;

    try {
      txHash = await this._ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      });
    } catch (error) {}

    if (!txHash) {
      return null;
    }

    var newThought: [string, string] | null = null;

    try {
      newThought = await this.getNewThoughtID(txHash);
    } catch (error) {}

    if (!newThought) {
      return null;
    }

    var blockTimestamp: number | null = null;

    try {
      blockTimestamp = await this.getBlockTimestamp(newThought[1]);
    } catch (error) {}

    if (!blockTimestamp) {
      return null;
    }

    return [newThought[0], blockTimestamp, this._ethereum.selectedAddress];
  }

  async getNewThoughtID(txHash: string): Promise<[string, string] | null> {
    const myAbi = abi[0]['inputs'] as AbiInput[];

    let receipt: any = null;

    try {
      receipt = await this._ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      });
    } catch (error) {}

    if (!receipt) {
      return null;
    }

    if (receipt.status !== '0x1') {
      return null;
    }

    const decodedLogs = this._web3.eth.abi.decodeLog(
      myAbi,
      receipt.logs[0].data,
      receipt.logs[0].topics.slice(1)
    );

    const decoded = decodedLogs[0] as string;
    const blockNumber = receipt['blockNumber'] as string;

    return [decoded, blockNumber];
  }

  async getBlockTimestamp(blockNumber: string): Promise<number | null> {
    let timestamp: number | null = null;

    try {
      const block = this._web3.eth.getBlock(blockNumber);
      const t = (await block).timestamp;
      if (typeof t == 'number') {
        timestamp = t;
      } else {
        timestamp = parseInt(t);
      }
    } catch (error) {}

    return timestamp;
  }
}

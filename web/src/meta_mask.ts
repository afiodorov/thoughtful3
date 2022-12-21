import { AbiItem } from 'web3-utils';
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
      gas: '0xB009',
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
  ): Promise<string | null> {
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
      // gas: '0xB009',
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
}

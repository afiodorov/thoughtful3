import { AbiItem, AbiInput } from 'web3-utils';
import Web3 from 'web3';
import abi_v1 from '../../contracts/v1/abi.json';
import abi_v2 from '../../contracts/v2/abi.json';

interface Ethereum {
  request(t: object): Promise<any | null>;
  selectedAddress: string;
  on(k: string, fn: (a: any) => void): void;
}

class Success<T> {
  value: T;
  sender: string;
  blockTimestamp: number;

  constructor(value: T, sender: string, blockTimestamp: number) {
    this.value = value;
    this.sender = sender;
    this.blockTimestamp = blockTimestamp;
  }
}

export class MetaMask {
  private _deployedContract: string;
  private _ethereum: Ethereum;
  private _web3: Web3;
  private _abi: Map<string, AbiItem> = new Map();
  private _chainID: string;

  constructor(web3: Web3, contractAddress: string, chainID: string, version: string) {
    this._deployedContract = contractAddress;
    this._ethereum = (window as any).ethereum;
    this._web3 = web3;
    this._chainID = chainID;

    if (version == 'v1') {
      abi_v1.forEach((rawAbiItem) => {
        const item = rawAbiItem as AbiItem;
        this._abi.set(item.name!, item);
      });
    } else if (version == 'v2') {
      abi_v2.forEach((rawAbiItem) => {
        const item = rawAbiItem as AbiItem;
        this._abi.set(item.name!, item);
      });
    }
  }

  async newLike(id: string, isReplyLike: boolean): Promise<string | null> {
    try {
      await this._ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
      return null;
    }

    const abiName = isReplyLike ? 'like_reply' : 'like';
    const txData = this._web3.eth.abi.encodeFunctionCall(this._abi.get(abiName)!, [id]);
    const transactionParameters = {
      to: this._deployedContract,
      from: this._ethereum.selectedAddress,
      data: txData,
      chainId: this._chainID
    };

    let txHash: string | null = null;

    try {
      txHash = await this._ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      });
    } catch (error) {
      console.error(error);
    }

    if (!txHash) {
      return null;
    }

    let receipt: any;

    while (true) {
      try {
        receipt = await this._ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
      } catch (error) {
        console.error(error);
        break;
      }

      if (receipt) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!receipt) {
      return null;
    }

    if (receipt.status !== '0x1') {
      console.log('receipt not successfull');
      console.log(receipt);

      return null;
    }

    return txHash;
  }

  async selectedAddress(): Promise<string | null> {
    try {
      await this._ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
      return null;
    }

    return this._ethereum.selectedAddress;
  }

  registerAccountChangeListener(f: (a: string[]) => void) {
    this._ethereum.on('accountsChanged', f);
  }

  registerChainChangeListener(f: (chainID: string) => void) {
    this._ethereum.on('chainChanged', f);
  }

  async newThought(
    text: string,
    displayName: string,
    hashtag: string,
    retweetOf: string | null,
    isReplyQuote: boolean
  ): Promise<Success<string> | null> {
    try {
      await this._ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);

      return null;
    }

    let txData: string;

    if (!retweetOf) {
      txData = this._web3.eth.abi.encodeFunctionCall(this._abi.get('tweet')!, [
        text,
        displayName,
        hashtag
      ]);

      console.log(`calling tweet(${text},${displayName},${hashtag})`);
    } else if (!isReplyQuote) {
      txData = this._web3.eth.abi.encodeFunctionCall(this._abi.get('retweet')!, [
        retweetOf,
        text,
        displayName
      ]);

      console.log(`calling retweet(${retweetOf},${text},${displayName})`);
    } else {
      txData = this._web3.eth.abi.encodeFunctionCall(this._abi.get('retweet_reply')!, [
        retweetOf,
        text,
        displayName
      ]);

      console.log(`calling retweet_reply(${retweetOf},${text},${displayName})`);
    }

    const transactionParameters = {
      to: this._deployedContract,
      from: this._ethereum.selectedAddress,
      data: txData,
      chainId: this._chainID
    };

    let txHash: string | null = null;

    try {
      txHash = await this._ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      });
    } catch (error) {
      console.error(error);
    }

    if (!txHash) {
      return null;
    }

    console.log(`submitted ${txHash}`);

    let newThought: [string, string] | null = null;

    try {
      newThought = await this.getNewThoughtID(txHash);
    } catch (error) {
      console.error(error);
    }

    if (!newThought) {
      return null;
    }

    const [newThoughtID, blockNumber] = newThought;

    var blockTimestamp: number | null = null;

    try {
      blockTimestamp = await this.getBlockTimestamp(blockNumber);
    } catch (error) {
      console.error(error);
    }

    if (!blockTimestamp) {
      return null;
    }

    return new Success<string>(newThoughtID, this._ethereum.selectedAddress, blockTimestamp);
  }

  async getNewThoughtID(txHash: string): Promise<[string, string] | null> {
    const myAbi = this._abi.get('NewTweet')!['inputs'] as AbiInput[];

    let receipt: any = null;

    while (true) {
      try {
        receipt = await this._ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
      } catch (error) {
        console.error(error);
        break;
      }

      if (receipt) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!receipt) {
      console.log("couldn't get the receipt");
    }

    if (receipt.status !== '0x1') {
      console.log('receipt not successfull');
      console.log(receipt);

      return null;
    }

    if (receipt.logs.length === 0) {
      console.log('receipt missing logs');
      console.log(receipt);
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
      const block = await this._ethereum.request({
        method: 'eth_getBlockByNumber',
        params: [blockNumber, false]
      });
      timestamp = parseInt(block.timestamp.slice(2), 16);
    } catch (error) {
      console.error(error);
    }

    return timestamp;
  }

  async newReply(
    text: string,
    displayName: string,
    thoughtID: string,
    seq_num: number
  ): Promise<Success<string> | null> {
    try {
      await this._ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);

      return null;
    }

    const txData = this._web3.eth.abi.encodeFunctionCall(this._abi.get('reply')!, [
      text,
      displayName,
      thoughtID,
      `${seq_num}`
    ]);

    console.log(`calling reply(${text},${displayName},${thoughtID},${seq_num})`);
    const transactionParameters = {
      to: this._deployedContract,
      from: this._ethereum.selectedAddress,
      data: txData,
      chainId: this._chainID
    };

    let txHash: string | null = null;

    try {
      txHash = await this._ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      });
    } catch (error) {
      console.error(error);
    }

    if (!txHash) {
      return null;
    }

    console.log(`submitted ${txHash}`);

    let newReply: [string, string] | null = null;

    try {
      newReply = await this.getNewReplyID(txHash);
    } catch (error) {
      console.error(error);
    }

    if (!newReply) {
      return null;
    }

    const [newReplyID, blockNumber] = newReply;

    var blockTimestamp: number | null = null;

    try {
      blockTimestamp = await this.getBlockTimestamp(blockNumber);
    } catch (error) {
      console.error(error);
    }

    if (!blockTimestamp) {
      return null;
    }

    return new Success<string>(newReplyID, this._ethereum.selectedAddress, blockTimestamp);
  }

  async getNewReplyID(txHash: string): Promise<[string, string] | null> {
    const myAbi = this._abi.get('NewReply')!['inputs'] as AbiInput[];

    let receipt: any = null;

    while (true) {
      try {
        receipt = await this._ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
      } catch (error) {
        console.error(error);
        break;
      }

      if (receipt) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!receipt) {
      console.log("couldn't get the receipt");
    }

    if (receipt.status !== '0x1') {
      console.log('receipt not successfull');
      console.log(receipt);

      return null;
    }

    if (receipt.logs.length === 0) {
      console.log('receipt missing logs');
      console.log(receipt);
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
}

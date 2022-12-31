import { InteractionState } from './handlers';
import { EnsLooker } from './ens';
import { MetaMask } from './meta_mask';
import { ttl, chainValues } from './config';
import { QueryDispatcher } from './query';
import Web3 from 'web3';
import { EntityStore } from './entity/store';
import { toggleAccounts } from './handlers/toggle_accounts';
import { Fetcher } from './ro/fetcher';
import { GraphFetcher } from './ro/graph';
import { RPCFetcher } from './ro/rpc';
import { registerHandlers } from './handlers/init';
import { startingDraw } from './start_draw';

export class AppManager {
  private _ensLooker: EnsLooker;
  private _intereractionState: InteractionState;
  private _metaMask: MetaMask | null;
  private _web3: Web3;
  private _entityStore: EntityStore;
  private _fetcher: Fetcher;

  constructor(chainID: string) {
    const graphURL: string | null = chainValues.get(chainID)!.graphURL;
    const rpcURL: string = chainValues.get(chainID)!.rpcURL;
    const contractAddress: string = chainValues.get(chainID)!.contractAddress;

    this._web3 = new Web3(rpcURL);
    this._ensLooker = new EnsLooker(this._web3);
    this._intereractionState = new InteractionState();
    this._entityStore = new EntityStore();

    if (graphURL) {
      this._fetcher = new GraphFetcher(new QueryDispatcher(graphURL, ttl));
    } else {
      this._fetcher = new RPCFetcher(this._web3, contractAddress);
    }

    if (typeof (window as any).ethereum !== 'undefined') {
      this._metaMask = new MetaMask(this._web3, contractAddress, '0x1');
      this._metaMask.registerAccountChangeListener((accounts) => {
        toggleAccounts(accounts, this);
      });
      this._metaMask.registerChainChangeListener(async (_: string) => {
        window.location.reload();
      });

      document.getElementById('instruction')!.style.display = 'none';
    } else {
      this._metaMask = null;
    }
  }

  get ensLooker(): EnsLooker {
    return this._ensLooker;
  }

  get interactionState(): InteractionState {
    return this._intereractionState;
  }

  get metaMask(): MetaMask | null {
    return this._metaMask;
  }

  get entityStore(): EntityStore {
    return this._entityStore;
  }

  get fetcher(): Fetcher {
    return this._fetcher;
  }

  async init() {
    registerHandlers(this);
    await startingDraw(this);
  }
}

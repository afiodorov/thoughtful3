import { InteractionState } from './handlers';
import { EnsLooker } from './ens';
import { MetaMask } from './meta_mask';
import { rpcURL, contractAddress, graphURL, ttl } from './config';
import { QueryDispatcher } from './query';
import Web3 from 'web3';
import { EntityStore } from './entity/store';
import { toggleAccounts } from './handlers/toggle_accounts';

export class AppManager {
  private _ensLooker: EnsLooker;
  private _intereractionState: InteractionState;
  private _metaMask: MetaMask | null;
  private _web3: Web3;
  private _queryDispatcher: QueryDispatcher;
  private _entityStore: EntityStore;

  constructor() {
    this._web3 = new Web3(rpcURL);
    this._ensLooker = new EnsLooker(this._web3);
    this._intereractionState = new InteractionState();
    this._queryDispatcher = new QueryDispatcher(graphURL, ttl);
    this._entityStore = new EntityStore();

    if (typeof (window as any).ethereum !== 'undefined') {
      this._metaMask = new MetaMask(this._web3, contractAddress);
      this._metaMask.registerAccountChangeListener((accounts) => {
        toggleAccounts(accounts, this);
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

  get queryDispatcher(): QueryDispatcher {
    return this._queryDispatcher;
  }

  get entityStore(): EntityStore {
    return this._entityStore;
  }
}

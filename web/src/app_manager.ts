import { InteractionState } from './handlers';
import { EnsLooker } from './ens';
import { MetaMask } from './meta_mask';
import { chainValues } from './config';
import Web3 from 'web3';
import { EntityStore } from './entity/store';
import { toggleAccounts } from './handlers/toggle_accounts';
import { Fetcher } from './ro/fetcher';
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
    const rpcURL: string = chainValues.get(chainID)!.rpcURL;
    const contractAddress: string = chainValues.get(chainID)!.contractAddress;
    const contractVersion: string = chainValues.get(chainID)!.contractVersion;

    this._web3 = new Web3(rpcURL);
    this._ensLooker = new EnsLooker(new Web3(chainValues.get('0x1')!.rpcURL));
    this._intereractionState = new InteractionState();
    this._entityStore = new EntityStore();
    this._fetcher = new RPCFetcher(this._web3, contractAddress);

    if (typeof (window as any).ethereum !== 'undefined') {
      this._metaMask = new MetaMask(this._web3, contractAddress, chainID, contractVersion);
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

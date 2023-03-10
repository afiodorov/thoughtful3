import { AppManager } from './app_manager';
import { chainValues } from './config';

if (typeof (window as any).ethereum !== 'undefined') {
  const chainID = await (window as any).ethereum.request({ method: 'eth_chainId' });

  if (chainValues.has(chainID) && chainValues.get(chainID)?.enabled) {
    new AppManager(chainID).init();
  } else {
    const thoughtsContainer = document.getElementById('thoughts-container')!;
    thoughtsContainer.innerHTML = '<h1>Unsupported network: switch to Polygon</h1>';
  }
} else {
  new AppManager('0x89').init();
}

export {};

import { AppManager } from './app_manager';
import { chainValues } from './config';

if (typeof (window as any).ethereum !== 'undefined') {
  const chainID = await (window as any).ethereum.request({ method: 'eth_chainId' });

  if (chainValues.has(chainID) && chainValues.get(chainID)?.enabled) {
    new AppManager(chainID).init();
  } else {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }]
      });

      new AppManager('0x89').init();
    } catch (switchError) {
      const thoughtsContainer = document.getElementById('thoughts-container')!;
      thoughtsContainer.innerHTML = '<h1>Unsupported network: switch to Polygon</h1>';

      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        console.log('This network is not available in your metamask, please add it');
      }
      console.log('Failed to switch to the network');
    }
  }
} else {
  new AppManager('0x89').init();
}

export {};

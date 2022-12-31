import { AppManager } from './app_manager';

if (typeof (window as any).ethereum !== 'undefined') {
  const chainID = await (window as any).ethereum.request({ method: 'eth_chainId' });
  try {
    new AppManager(chainID).init();
  } catch (error) {
    const thoughtsContainer = document.getElementById('thoughts-container')!;
    thoughtsContainer.innerHTML = '<h1>Unsupported network</h1>';
  }
} else {
  new AppManager('0x1').init();
}

export {};

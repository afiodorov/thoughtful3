import { setDomain } from '../utils';
import { AppManager } from '../app_manager';

let toggleAccountsLock = false;

export async function toggleAccounts(accounts: string[], appManager: AppManager) {
  if (toggleAccountsLock) {
    return;
  }

  const domainElement = document.getElementById('new-domain')!;

  if (accounts.length === 0) {
    domainElement.textContent = 'not connected';
    return;
  }

  toggleAccountsLock = true;

  await setDomain(accounts[0], appManager);

  toggleAccountsLock = false;
}

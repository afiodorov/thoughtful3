import { setDomain } from '../utils';
import { AppManager } from '../app_manager';

let toggleAccountsLock = false;

export async function toggleAccounts(accounts: string[], appManager: AppManager) {
  if (toggleAccountsLock) {
    return;
  }

  const domainElement = document.getElementById('new-thought-domain')!;

  if (accounts.length === 0) {
    domainElement.textContent = 'not connected';
    return;
  }

  toggleAccountsLock = true;

  await setDomain(accounts[0], appManager, null);

  const elements = document.querySelectorAll('[id^="new-reply-"]');
  for (const element of elements) {
    const attr = element.getAttribute('acc-update-thought-id');
    if (!attr) {
      continue;
    }
    await setDomain(accounts[0], appManager, attr);
  }

  toggleAccountsLock = false;
}

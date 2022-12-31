import { AppManager } from '../app_manager';
import { toUTF8Array } from '../utils';
import { defaultName, defaultText, defaultHashtag } from '../config';
import { publishThought } from './publish_thought';
import { toggleDialogue } from './toggle_dialogue';

export function registerHandlers(appManager: AppManager) {
  const overlay = document.getElementById('overlay')!;
  const dialogue = document.getElementById('dialogue')!;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      dialogue.style.display = 'none';
      overlay.style.display = 'none';
    }
  });

  overlay.addEventListener('click', function () {
    overlay.style.display = 'none';
    dialogue.style.display = 'none';
  });

  dialogue.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  const newThought = document.getElementById('new-thought-text')!;
  const counter = document.getElementById('new-thought-counter')!;

  newThought.addEventListener('input', () => {
    counter.textContent = `${300 - toUTF8Array(newThought.textContent!).length}`;
  });

  newThought.addEventListener('keydown', appManager.interactionState.disableEnterAllowShift);
  newThought.addEventListener('focus', (event) =>
    appManager.interactionState.focusNewThoughtText(event)
  );
  newThought.addEventListener('keydown', (event) =>
    appManager.interactionState.maxLength(300, event)
  );

  const newAuthor = document.getElementById('new-thought-author')!;
  newAuthor.addEventListener('keydown', appManager.interactionState.disableEnter);
  newAuthor.addEventListener('focus', (event) =>
    appManager.interactionState.focusNewThoughtAuthor(event)
  );
  newAuthor.addEventListener('keydown', (event) =>
    appManager.interactionState.maxLength(40, event)
  );

  const newHashtag = document.getElementById('new-thought-hashtag')!;
  newHashtag.addEventListener('keydown', appManager.interactionState.disableEnter);
  newHashtag.addEventListener('focus', (event) =>
    appManager.interactionState.focusNewThoughtHashtag(event)
  );
  newHashtag.addEventListener('keydown', (event) =>
    appManager.interactionState.maxLength(30, event)
  );

  newAuthor.textContent = defaultName;
  newHashtag.textContent = defaultHashtag;
  newThought.textContent = defaultText;

  if (appManager.metaMask !== null) {
    const closeButton = document.getElementById('close-button');
    closeButton!.addEventListener('click', (event) =>
      toggleDialogue(event, appManager.metaMask!, appManager)
    );

    const logo = document.getElementById('logo')!;
    logo.addEventListener('click', (event) =>
      toggleDialogue(event, appManager.metaMask!, appManager)
    );
    logo.classList.add('link');

    const newThoughtPublish = document.getElementById('new-thought-publish')!;
    newThoughtPublish.addEventListener('click', (event) =>
      publishThought(event, appManager.metaMask!, appManager)
    );
  }
}

import { Thought } from './responses';
import { makeThoughtContainer } from './thought';
import { AppManager } from './app_manager';
import { toUTF8Array } from './utils';
import { defaultName, defaultText, defaultHashtag } from './config';
import { parseCurrentURL } from './params';
import { allRecentThoughts, thoughtByID } from './queries';

const appManager = new AppManager();

if (appManager.metaMask !== null) {
  const closeButton = document.getElementById('close-button');
  closeButton!.addEventListener('click', (event) =>
    appManager.interactionState.toggleDialogue(event, appManager.metaMask!, appManager)
  );

  const logo = document.getElementById('logo')!;
  logo.addEventListener('click', (event) =>
    appManager.interactionState.toggleDialogue(event, appManager.metaMask!, appManager)
  );
  logo.classList.add('link');

  const newThoughtPublish = document.getElementById('new-thought-publish')!;
  newThoughtPublish.addEventListener('click', (event) =>
    appManager.interactionState.publishThought(event, appManager.metaMask!, appManager)
  );
}

const params = parseCurrentURL();

let query: string;

if (params.thoughtID) {
  query = thoughtByID(params.thoughtID);
} else {
  query = allRecentThoughts;
}

const thoughts = (await appManager.queryDispatcher.fetch(query))['newTweets'] as Thought[];

thoughts.forEach((t) => {
  appManager.entityStore.thoughts.set(t.id, t);
});

const thoughtsContainer = document.getElementById('thoughts-container');

thoughts.forEach((t) => {
  thoughtsContainer!.appendChild(makeThoughtContainer(t, appManager));
});

function init() {
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

  const disableEnterAllowShift = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }
  };

  const disableEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const newThought = document.getElementById('new-thought-text')!;
  const counter = document.getElementById('counter')!;

  newThought.addEventListener('input', () => {
    counter.textContent = `${300 - toUTF8Array(newThought.textContent!).length}`;
  });

  newThought.addEventListener('keydown', disableEnterAllowShift);
  newThought.addEventListener('focus', (event) =>
    appManager.interactionState.focusNewThoughtText(event)
  );
  newThought.addEventListener('keydown', (event) =>
    appManager.interactionState.maxLength(300, event)
  );

  const newAuthor = document.getElementById('new-thought-author')!;
  newAuthor.addEventListener('keydown', disableEnter);
  newAuthor.addEventListener('focus', (event) =>
    appManager.interactionState.focusNewThoughtAuthor(event)
  );
  newAuthor.addEventListener('keydown', (event) =>
    appManager.interactionState.maxLength(40, event)
  );

  const newHashtag = document.getElementById('new-thought-hashtag')!;
  newHashtag.addEventListener('keydown', disableEnter);
  newHashtag.addEventListener('focus', (event) =>
    appManager.interactionState.focusNewThoughtHashtag(event)
  );
  newHashtag.addEventListener('keydown', (event) =>
    appManager.interactionState.maxLength(30, event)
  );

  newAuthor.textContent = defaultName;
  newHashtag.textContent = defaultHashtag;
  newThought.textContent = defaultText;
}

init();

console.log(parseCurrentURL());

export {};

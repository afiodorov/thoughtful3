class Params {
  thoughtID: string | null;

  constructor(thoughtID: string | null) {
    this.thoughtID = thoughtID;
  }
}

export function parseCurrentURL(): Params {
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  return new Params(searchParams.get('thought-id'));
}

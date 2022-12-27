type timestamp = number;

export class QueryDispatcher {
  private _graphURL: string;
  private _cache: Map<string, [timestamp, JSON]> = new Map();
  private _ttl: number;

  constructor(graphURL: string, ttl: number) {
    this._graphURL = graphURL;
    this._ttl = ttl;
  }

  async fetch(query: string): Promise<any> {
    const compactQuery = query.replace(/\n/g, '');
    const current = this._cache.get(compactQuery);

    if (current && current[1]) {
      const elapsed = (Date.now() - current[0]) / 1000;
      if (elapsed < this._ttl) {
        return current[1];
      }
    }

    const response = await fetch(this._graphURL, {
      method: 'POST',
      body: JSON.stringify({ query: compactQuery })
    });

    if (!response.ok) {
      console.log('problem querying' + response.status);
      return null;
    }

    const res = await response.json();

    this._cache.set(compactQuery, [Date.now(), res['data']]);

    return res['data'];
  }

  invalidateCache() {
    this._cache.clear();
  }
}

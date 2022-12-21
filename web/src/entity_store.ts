import { Thought, Reply } from './responses';

export class EntityStore {
  private _thoughts: Map<string, Thought> = new Map();
  private _replies: Map<string, Reply> = new Map();

  get thoughts(): Map<string, Thought> {
    return this._thoughts;
  }

  get replies(): Map<string, Reply> {
    return this._replies;
  }
}

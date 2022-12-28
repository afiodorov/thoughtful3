import { Thought, Reply } from '../responses';
import { ThoughtEntity, ReplyEntity } from './entities';

export class EntityStore {
  private _thoughts: Map<string, ThoughtEntity> = new Map();
  private _replies: Map<string, ReplyEntity> = new Map();

  get thoughts(): Map<string, ThoughtEntity> {
    return this._thoughts;
  }

  get replies(): Map<string, ReplyEntity> {
    return this._replies;
  }
}

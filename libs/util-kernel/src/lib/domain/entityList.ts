import { WatchedList } from '../core';
import { Entity } from './entity';

export class EntityList<T extends Entity<any>> extends WatchedList<T> {
  compareItems(a: T, b: T): boolean {
    return a.equals(b);
  }
}

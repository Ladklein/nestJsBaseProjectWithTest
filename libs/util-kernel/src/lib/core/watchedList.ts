export abstract class WatchedList<T> {
  private currentItems: T[];

  private initial: T[];

  private new: T[];

  private removed: T[];

  get items(): T[] {
    return this.currentItems;
  }

  get newItems(): T[] {
    return this.new;
  }

  get removedItems(): T[] {
    return this.removed;
  }

  protected constructor(initialItems: T[] = []) {
    this.currentItems = initialItems;
    this.initial = initialItems;
    this.new = [];
    this.removed = [];
  }

  abstract compareItems(a: T, b: T): boolean;

  exists(item: T): boolean {
    return this.isCurrentItem(item);
  }

  add(item: T): void {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item);
    }

    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.new.push(item);
    }

    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item);
    }
  }

  remove(item: T): void {
    this.removeFromCurrent(item);

    if (this.isNewItem(item)) {
      this.removeFromNew(item);
      return;
    }

    if (!this.isRemovedItem(item)) {
      this.removed.push(item);
    }
  }

  private isCurrentItem(item: T): boolean {
    return (
      this.currentItems.find((v: T) => this.compareItems(item, v)) !== undefined
    );
  }

  private isNewItem(item: T): boolean {
    return this.new.find((v: T) => this.compareItems(item, v)) !== undefined;
  }

  private isRemovedItem(item: T): boolean {
    return (
      this.removed.find((v: T) => this.compareItems(item, v)) !== undefined
    );
  }

  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(v, item));
  }

  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v),
    );
  }

  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v));
  }

  private wasAddedInitially(item: T): boolean {
    return (
      this.initial.find((v: T) => this.compareItems(item, v)) !== undefined
    );
  }
}

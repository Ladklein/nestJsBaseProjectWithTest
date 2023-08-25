import { Uuid } from './uuid';

export abstract class Entity<T> {
  public static isEntity(v: any): v is Entity<any> {
    return v instanceof Entity;
  }

  protected readonly internalId: Uuid;

  public readonly props: Required<T>;

  get id(): Uuid {
    return this.internalId;
  }

  constructor(props: Required<T>, id?: Uuid) {
    this.internalId = id ?? new Uuid();
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (!object) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!Entity.isEntity(object)) {
      return false;
    }

    return this.internalId.equals(object.internalId);
  }
}

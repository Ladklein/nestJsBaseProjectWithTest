export interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public props: Required<T>;

  protected constructor(props: Required<T>) {
    this.props = {
      ...props,
    };
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (!vo) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}

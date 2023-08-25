import * as uuid from 'uuid';
import { Identifier } from './identifier';
import { Nullable } from 'libs/data-generic/src';

export class Uuid extends Identifier<string> {
  constructor(id?: Nullable<string>) {
    super(id || uuid.v4());
  }
}

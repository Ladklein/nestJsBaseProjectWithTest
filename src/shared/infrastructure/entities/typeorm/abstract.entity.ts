import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class DateFields {
  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}

export abstract class AbstractEntity extends DateFields {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
}

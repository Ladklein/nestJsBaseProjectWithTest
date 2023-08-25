import 'module-alias/register';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../../../shared/infrastructure/entities/typeorm/abstract.entity';

@Entity('user_user')
export class UserEntity extends AbstractEntity {
  @Column({ nullable: false, type: 'text' })
  public pseudo: string;
}

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Field, Root, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  name(@Root() parent: User): string | null {
    return parent.firstName && parent.lastName
      ? `${parent.firstName} ${parent.lastName}`
      : null;
  }

  @Column('int', { default: 0 })
  tokenVersion: number;
}

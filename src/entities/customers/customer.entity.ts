import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Customer {
  @Column()
  name: string;

  @PrimaryColumn()
  email: string;

  @Column()
  address: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'datetime' })
  emailScheduleTime: Date;

  @Column()
  emailBodyTemplate: string;
}

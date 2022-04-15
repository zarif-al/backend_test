import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Customer {
  @Column()
  name: string;

  @PrimaryColumn()
  email: string;

  @Column()
  address: string;

  @Column()
  enabled: boolean;

  @Column({ type: 'datetime' })
  emailScheduleTime: Date;

  @Column()
  emailBodyTemplate: string;
}

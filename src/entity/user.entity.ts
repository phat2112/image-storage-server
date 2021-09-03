import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @Column({ length: 50 })
  userName!: string;

  @Column({ length: 254 })
  email!: string;

  @Column({ length: 500 })
  password!: string;

  @Column()
  birthday?: string;

  @Column()
  firstDayMet?: string;

  @Column()
  loverId?: string;

  @Column()
  loverName?: string;

  @Column()
  isStorageFamily?: boolean;

  @Column()
  isStorageFriend?: boolean;

  @Column()
  isStorageLove?: boolean;

  @Column()
  isUpdateInfo?: boolean;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('r_style_config')
export class StyleConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column()
  config: string;
}

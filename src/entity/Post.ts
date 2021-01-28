import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "Post" })
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { nullable: false })
  title!: string;

  @Column("varchar", { nullable: false })
  text!: string;

  @OneToOne(() => User)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @OneToOne(() => User, (user) => user.id, {
    cascade: true,
  })
  @JoinColumn({
    name: "userID",
  })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "User" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { unique: true, nullable: false })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

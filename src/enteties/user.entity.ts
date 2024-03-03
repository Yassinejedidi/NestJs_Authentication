import { BaseEntity, CreateDateColumn,Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt'


@Entity()
@Unique(['username'])
export class User extends BaseEntity{
 @PrimaryGeneratedColumn()   
id: number;
@Column()
username: string;
@Column()
role: string;
@Column()
email: string;

@CreateDateColumn()
createdAt: Date;
}
import { Exclude } from "class-transformer";
import { IsEmail, Min, MinLength } from "class-validator";
import { Role } from "src/role/entities/role.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, ManyToMany } from "typeorm";
@Entity()
export class User extends AbstractEntity {

    @Column()
    @MinLength(3)
    firstname: string;

    @Column()
    @MinLength(3)
    lastname: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    username: string;

    @Column({ nullable: true })
    phone: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    birthday: Date;

    @Column({ nullable: true })
    role_id: number

    @Column({ nullable: true })
    room_id: number

    @Column({ nullable: true })
    job_title: string

    @Column({ nullable: true })
    note: string
    @ManyToMany(() => Role, (role) => role.users)
    roles: Role[]

}

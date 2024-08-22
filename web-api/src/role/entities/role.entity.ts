import { MinLength } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class Role extends AbstractEntity {

    @Column()
    @MinLength(3)
    name: string;

    @Column()
    @MinLength(3)
    description: string;

    @Column()
    @MinLength(3)
    permissions: string;
    @ManyToMany(() => User, (user) => user.roles)
    @JoinTable()
    users: User[]
}

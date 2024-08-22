import { Expose, Exclude } from "class-transformer";
import { User } from "src/user/entities/user.entity";
import { JoinTable, ManyToMany } from "typeorm";

export class RoleDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    description: string;
}
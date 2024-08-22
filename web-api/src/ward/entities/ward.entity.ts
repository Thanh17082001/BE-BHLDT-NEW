import { Exclude } from "class-transformer";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
@Entity()
export class Ward extends AbstractEntity {
    @Column()
    @Index()
    name: string;
    @Column()
    code: number;
    @Column()
    district: number;
}

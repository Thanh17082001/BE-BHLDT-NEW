import { Exclude } from "class-transformer";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
@Entity()
export class Supplier extends AbstractEntity {
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    phone: string;
    @Column()
    email: string;
    @Column({
        nullable: true
    })
    role: string;
    @Column({
        nullable: true
    })
    company_name: string;
    @Column({
        nullable: true
    })
    company_address: string;
    @Column({
        nullable: true
    })
    tax_number: string;
}

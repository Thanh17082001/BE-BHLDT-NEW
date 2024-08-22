import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Generated} from "typeorm";

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    public id:number;

    @CreateDateColumn()
    public createdAt:Date;

    @UpdateDateColumn()
    public updatedAt:Date;

    @Column()
    @Generated("uuid")
    uuid: string;


    @Column({
        default: 1
    }
    )
    public status: number;
}
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity } from "typeorm";


@Entity()
export class ElearningVideo extends AbstractEntity {
    @Column()
    name: string;
    @Column({
        nullable: true
    })
    path: string;
    @Column({
        nullable: true
    })
    elearning_id: number;
    @Column({
        nullable: true
    })
    page: number;
}

import { Exclude } from "class-transformer";
import { Image } from "src/image/entities/image.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from "typeorm";
@Entity()
export class File extends AbstractEntity {
    @Column()
    name: string;
    @Column({
        nullable: true
    })
    path: string;
    @Column({
        nullable: true
    })
    previewImage: string;
    @Column({
        nullable: true
    })
    filetype_id: number;
    @Column({
        nullable: true
    })
    topic_id: number;
    @Column({
        default: true
    })
    isFolder: boolean;
    @Column({
        nullable: true
    })
    parent_id?: number;
     @Column({
        nullable: true
    })
    subject_id?: number;
    @OneToMany(() => Image, (image) => image.file, { cascade: true , onDelete: 'CASCADE'})
    images:Image[]
}

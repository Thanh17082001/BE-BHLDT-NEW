import { File } from "src/file/entities/file.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";

@Entity()
export class Image extends AbstractEntity {
    @Column()
    name: string;
    @Column()
    path: string;
    @ManyToOne(() => File, (file) => file.images, {  onDelete: 'SET NULL', nullable: true })
    @JoinColumn()
    file: File;
 }

import { Book } from "src/book/entities/book.entity";
import { Grade } from "src/grade/entities/grade.entity";
import { Subject } from "src/subject/entities/subject.entity";
import { Topic } from "src/topic/entities/topic.entity";
import { TypeLibrary } from "src/type-library/entities/type-library.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Library extends AbstractEntity {
    @Column()
    name: string;
    @Column()
    size: number;
    @Column()
    path: string;
    @Column()
    linkImage: String;
    
    @OneToOne(() => Subject)
    @JoinColumn()
    subject: Subject

    @OneToOne(() => Grade)
    @JoinColumn()
    grade: Grade

     @OneToOne(() => Book)
    @JoinColumn()
    book: Book

     @OneToOne(() => Topic)
    @JoinColumn()
    topic: Topic

    @OneToOne(() => TypeLibrary)
    @JoinColumn()
    type:TypeLibrary
 }

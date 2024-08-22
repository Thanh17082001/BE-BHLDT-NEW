import { Book } from "src/book/entities/book.entity";
import { Subject } from "src/subject/entities/subject.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity()
export class LessonPlan extends AbstractEntity {
    @Column()
        name:string
    @Column()
    // size: number;
     @Column()
    path: string;

     @Column({nullable:true})
    previewImage: string;


    @Column({nullable:true})
    topic: number;
    
    @Column({nullable:true})
    subjectId: number;

    @Column({nullable:true})
    fileType:number

}

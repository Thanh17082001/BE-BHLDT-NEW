import { LessonPlan } from "src/lesson-plan/entities/lesson-plan.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class Book extends AbstractEntity {
    @Column()
    name: string;
     @Column()
    linkFile: string;
}

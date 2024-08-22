import { LessonPlan } from "src/lesson-plan/entities/lesson-plan.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";

export interface BookInterface extends AbstractEntity{
    name: string,
    linkFile: string
}
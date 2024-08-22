import { School } from "src/school/entities/school.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";

export interface PositionInterface extends AbstractEntity{
    name: string,
    school:School
}
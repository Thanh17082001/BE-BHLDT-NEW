import { Grade } from "src/grade/entities/grade.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";

export interface SchoolInterface extends AbstractEntity{
    code: string;
    
    name: string;
    
    address: string;
    
    description: string;

    grades:Grade[]
}
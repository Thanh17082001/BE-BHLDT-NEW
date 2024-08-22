import { Grade } from "src/grade/entities/grade.entity";
import { SchoolYear } from "src/school-year/entities/school-year.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Class extends AbstractEntity{
    @Column()
    name: string;
    @Column()
    suffixes: string;
    @ManyToOne(() => Grade, (grade) => grade,  {  onDelete: 'SET NULL', nullable: true })
    @JoinColumn()
    grade?: Grade;
    @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear)
    @JoinColumn()
    schoolYear:SchoolYear
 }

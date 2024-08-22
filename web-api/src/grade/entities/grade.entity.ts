
import { Class } from "src/class/entities/class.entity";
import { School } from "src/school/entities/school.entity";
import { Subject } from "src/subject/entities/subject.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToMany, ManyToOne, JoinColumn, OneToMany } from "typeorm";
@Entity()
export class Grade extends AbstractEntity {
  @Column()
  name: string;
  @ManyToOne(() => School, school => school.grades, {  onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  school?: School
  @OneToMany(() => Class, (class2) => class2.grade, { cascade: true , onDelete: 'CASCADE'})
  classes: Class[]
  @OneToMany(() => Subject, (subject) => subject.grade, { cascade: true , onDelete: 'CASCADE'})
  subjects:Subject[]
}

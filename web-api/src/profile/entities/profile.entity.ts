import { Exclude } from "class-transformer";
import { Student } from "src/student/entities/student.entity";
import { User } from "src/user/entities/user.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne } from "typeorm";
@Entity()
export class Profile extends AbstractEntity {
    @Column({ nullable:true})
    code: string;
    @Column({ nullable: true })
    email?: string= null;
    @Column()
    fullname: string;
    @Column()
    gender: string;
    @Column()
    phone: string;
    @Column()
    street: string;
    @Column()
    birthday: Date;
    @Column()
    ward_id: number;
    @Column()
    district_id: number;
    @Column()
    province_id: number;
    //  @Column({ nullable: true })
    // account_id?: number;
    // @OneToOne(()=> Student, student =>student.id)
    studentId?: number;
    //  @OneToOne(()=> User, user =>user.id)
    // userId?: number;

}

import { Class } from "src/class/entities/class.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { User } from "src/user/entities/user.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Student extends AbstractEntity {
    @Column({nullable:true})
    classId: number
     @Column({nullable:true, default:false})
    isChange: boolean
    @ManyToOne(() => Profile, profile => profile, { cascade: true })
    @JoinColumn()
    profile?:Profile
 }

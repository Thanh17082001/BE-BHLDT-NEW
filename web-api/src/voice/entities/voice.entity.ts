import { File } from "src/file/entities/file.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Voice extends AbstractEntity {
   @Column({nullable:true})
  name: string;
    @Column()
  fileId: number;
   @Column()
    typeVoiceId: number;
    @Column()
   link: string
   @Column()
   order: number
   @Column()
   isGeneral:boolean
 }

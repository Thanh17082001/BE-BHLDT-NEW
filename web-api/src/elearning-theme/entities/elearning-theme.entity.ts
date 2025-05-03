 
 import { AbstractEntity } from "src/utils/AbstractEntity";
 import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
 @Entity()
 export class ElearningTheme extends AbstractEntity {
     @Column()
     content: string;
     @Column()
     title: string;
     @Column({
         nullable: true
     })
     @Column({ nullable: true })
     path: string = null;
     
 }
 
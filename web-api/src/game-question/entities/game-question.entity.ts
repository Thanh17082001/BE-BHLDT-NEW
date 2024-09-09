import { Game } from "src/game/entities/game.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class GameQuestion extends AbstractEntity { 
    @Column()
    suggest:string;
    @Column()
    answer: string;
    @ManyToMany(() => Game, (game) => game.questions, {
        onDelete: 'CASCADE',  // Xóa quan hệ khi gameQuestion bị xóa
    })
    games: Game[];
}

import { GameQuestion } from "src/game-question/entities/game-question.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
@Entity()
export class Game extends AbstractEntity {

    @Column()
    name: string;

    @ManyToMany(() => GameQuestion, (gameQuestion) => gameQuestion.games, {
        cascade: true,   // Thêm cascade để tự động quản lý quan hệ
        onDelete: 'CASCADE',  // Xóa quan hệ khi xóa Game
    })
    @JoinTable() 
    questions: GameQuestion[];
}

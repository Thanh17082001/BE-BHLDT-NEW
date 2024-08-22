import { Book } from 'src/book/entities/book.entity';
import { AbstractEntity } from 'src/utils/AbstractEntity';
export interface LessonPlanInterFace extends AbstractEntity {
    name: string
    // size: number;
    path: string;
    previewImage:string;
    subjectId: number;
    fileType: number;
    topic: number;
}
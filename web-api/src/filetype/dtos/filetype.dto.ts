import { Expose, Exclude } from "class-transformer";

export class FileTypeDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
}
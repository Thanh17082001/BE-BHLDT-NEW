import { Expose, Exclude } from "class-transformer";

export class FileDto {
    @Expose()
    file: string;
    @Expose()
    previewImage: string;
}
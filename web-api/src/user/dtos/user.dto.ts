import { Expose, Exclude } from "class-transformer";

export class UserDto {
    @Expose()
    id: number;
    @Exclude()
    email: string;
    @Expose()
    fullname: string;
    @Expose()
    gender: string;
    @Expose()
    birthday: Date;
}
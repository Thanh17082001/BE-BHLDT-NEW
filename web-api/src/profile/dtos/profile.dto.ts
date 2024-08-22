import { Expose, Exclude } from "class-transformer";

export class ProfileDto {
    @Expose()
    email: string;
    @Expose()
    fullname: string;
    @Expose()
    phone: string;
    @Expose()
    street: string;
    @Expose()
    birthday: Date;
    @Expose()
    ward_id: number;
    @Expose()
    district_id: number;
    @Expose()
    province_id: number;
    @Expose()
    account_id: number;
}
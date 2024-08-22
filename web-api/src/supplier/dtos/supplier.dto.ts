import { Expose, Exclude } from "class-transformer";

export class SupplierDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    description: string;
    @Expose()
    phone: string;
    @Expose()
    email: string;
    @Expose()
    role: string;
    @Expose()
    company_name: string;
    @Expose()
    company_address: string;
    @Expose()
    tax_number: string;
}
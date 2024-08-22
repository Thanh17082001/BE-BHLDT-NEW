import {ApiProperty} from "@nestjs/swagger";
import { PageMetaDtoParameters } from "./pagemetaparams-dto";
export class PageMetaDto {
    @ApiProperty()
    readonly page:number;
     
    @ApiProperty()
    readonly take: number;

    @ApiProperty()
    readonly itemCount: number;

    @ApiProperty()
    readonly pageCount: number;

    @ApiProperty()
    readonly hasPreviousPage: boolean;

    @ApiProperty()
    readonly hasNextPage: boolean;

    constructor({pageOptionsDto, itemCount}: PageMetaDtoParameters) {
        this.page = pageOptionsDto.page ?? 0;
        this.take = pageOptionsDto.take ?? 0;
        this.itemCount = itemCount ?? 0;
        this.pageCount = Math.ceil(this.itemCount / this.take) ?? 0;
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
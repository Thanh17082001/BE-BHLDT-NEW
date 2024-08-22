import { Controller } from '@nestjs/common';
import { DataService } from './data.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('data')
@ApiTags('data')
export class DataController {
    constructor(private readonly dataService: DataService) { }
}

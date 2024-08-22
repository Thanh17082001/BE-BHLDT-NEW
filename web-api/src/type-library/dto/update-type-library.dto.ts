import { PartialType } from '@nestjs/swagger';
import { CreateTypeLibraryDto } from './create-type-library.dto';

export class UpdateTypeLibraryDto extends PartialType(CreateTypeLibraryDto) {}

import { Test, TestingModule } from '@nestjs/testing';
import { TypeLibraryService } from './type-library.service';

describe('TypeLibraryService', () => {
  let service: TypeLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeLibraryService],
    }).compile();

    service = module.get<TypeLibraryService>(TypeLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

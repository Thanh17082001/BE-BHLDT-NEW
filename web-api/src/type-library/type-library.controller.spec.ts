import { Test, TestingModule } from '@nestjs/testing';
import { TypeLibraryController } from './type-library.controller';
import { TypeLibraryService } from './type-library.service';

describe('TypeLibraryController', () => {
  let controller: TypeLibraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeLibraryController],
      providers: [TypeLibraryService],
    }).compile();

    controller = module.get<TypeLibraryController>(TypeLibraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CovertFileController } from './covert-file.controller';
import { CovertFileService } from './covert-file.service';

describe('CovertFileController', () => {
  let controller: CovertFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CovertFileController],
      providers: [CovertFileService],
    }).compile();

    controller = module.get<CovertFileController>(CovertFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

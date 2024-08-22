import { Test, TestingModule } from '@nestjs/testing';
import { CovertFileService } from './covert-file.service';

describe('CovertFileService', () => {
  let service: CovertFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CovertFileService],
    }).compile();

    service = module.get<CovertFileService>(CovertFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FacebookInsightService } from './facebook-insight.service';

describe('FacebookInsightService', () => {
  let service: FacebookInsightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacebookInsightService],
    }).compile();

    service = module.get<FacebookInsightService>(FacebookInsightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

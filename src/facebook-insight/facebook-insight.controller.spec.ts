import { Test, TestingModule } from '@nestjs/testing';
import { FacebookInsightController } from './facebook-insight.controller';
import { FacebookInsightService } from './facebook-insight.service';

describe('FacebookInsightController', () => {
  let controller: FacebookInsightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacebookInsightController],
      providers: [FacebookInsightService],
    }).compile();

    controller = module.get<FacebookInsightController>(FacebookInsightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

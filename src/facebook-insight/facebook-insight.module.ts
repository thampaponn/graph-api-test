import { Module } from '@nestjs/common';
import { FacebookInsightService } from './facebook-insight.service';
import { FacebookInsightController } from './facebook-insight.controller';

@Module({
  controllers: [FacebookInsightController],
  providers: [FacebookInsightService],
})
export class FacebookInsightModule {}

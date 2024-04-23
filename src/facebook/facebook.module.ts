import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { FacebookController } from './facebook.controller';
import { HttpModule } from '@nestjs/axios'; 

@Module({
  imports: [HttpModule],
  controllers: [FacebookController],
  providers: [FacebookService],
})
export class FacebookModule {}

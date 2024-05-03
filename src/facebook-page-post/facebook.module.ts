import { Module } from '@nestjs/common';
import { FacebookPageService } from './services/facebook-page.service';
import { FacebookController } from './facebook.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { PageSchema } from 'src/schemas/page.schema';
import { PostSchema } from 'src/schemas/post.schema';
import { FacebookPostService } from './services/facebook-post.service';
import { FacebookStrategy } from 'src/facebook.strategy';
import { FacebookInsightService } from './services/facebook-insight.service';
import { InsightSchema } from 'src/schemas/insight.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Page', schema: PageSchema }]),
  MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]), MongooseModule.forFeature([{ name: 'Insight', schema: InsightSchema }]), HttpModule],
  controllers: [FacebookController],
  providers: [FacebookPageService, FacebookPostService, FacebookStrategy, FacebookInsightService],
})
export class FacebookModule { }
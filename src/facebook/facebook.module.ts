import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { FacebookController } from './facebook.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { PageSchema } from 'src/schemas/page.schema';
import { PostSchema } from 'src/schemas/post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Page', schema: PageSchema }]),
  MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]), HttpModule],
  controllers: [FacebookController],
  providers: [FacebookService],
})
export class FacebookModule { }
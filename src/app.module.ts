import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FacebookModule } from './facebook/facebook.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/social-insights'), FacebookModule, AuthModule,],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

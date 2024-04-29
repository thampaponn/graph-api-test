import { Injectable } from '@nestjs/common';
import { CreateFacebookInsightDto } from './dto/create-facebook-insight.dto';
import { UpdateFacebookInsightDto } from './dto/update-facebook-insight.dto';

@Injectable()
export class FacebookInsightService {
  create(createFacebookInsightDto: CreateFacebookInsightDto) {
    return 'This action adds a new facebookInsight';
  }

  findAll() {
    return `This action returns all facebookInsight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} facebookInsight`;
  }

  update(id: number, updateFacebookInsightDto: UpdateFacebookInsightDto) {
    return `This action updates a #${id} facebookInsight`;
  }

  remove(id: number) {
    return `This action removes a #${id} facebookInsight`;
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FacebookInsightService } from './facebook-insight.service';
import { CreateFacebookInsightDto } from './dto/create-facebook-insight.dto';
import { UpdateFacebookInsightDto } from './dto/update-facebook-insight.dto';

@Controller('facebook-insight')
export class FacebookInsightController {
  constructor(private readonly facebookInsightService: FacebookInsightService) {}

  @Post()
  create(@Body() createFacebookInsightDto: CreateFacebookInsightDto) {
    return this.facebookInsightService.create(createFacebookInsightDto);
  }

  @Get()
  findAll() {
    return this.facebookInsightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facebookInsightService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacebookInsightDto: UpdateFacebookInsightDto) {
    return this.facebookInsightService.update(+id, updateFacebookInsightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facebookInsightService.remove(+id);
  }
}

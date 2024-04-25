import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { ApiTags } from '@nestjs/swagger';
import { FacebookPageQuery } from './dto/facebook-page.dto';

@ApiTags('facebook-insight')
@Controller('')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) { }

  @Post('save-page-to-db')
  async savePage(@Query() FacebookPageQuery: FacebookPageQuery) {
    return this.facebookService.savePage(FacebookPageQuery);
  }

  @Get('/:pageId')
  async getFacebookPage(@Param('pageId') pageId: string) {
    return this.facebookService.findById(pageId);
  }
  //update
  //delete
}

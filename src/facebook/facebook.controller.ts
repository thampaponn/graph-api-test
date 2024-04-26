import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacebookService } from './facebook-page.service';
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

  @Get('get-all-pages')
  async getAllPages() {
    return this.facebookService.getAllPages();
  }

  @Get('/:pageId')
  async getFacebookPage(@Param('pageId') pageId: string) {
    return this.facebookService.findById(pageId);
  }

  @Patch('/:pageId')
  async updateFacebookPage(@Query() FacebookPageQuery: FacebookPageQuery) {
    return this.facebookService.updatePage(FacebookPageQuery);
  }

  @Delete('/:pageId')
  async deleteFacebookPage(@Param('pageId') pageId: string){
    return this.facebookService.deletePage(pageId);
  }
}

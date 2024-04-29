import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacebookPageService } from './services/facebook-page.service';
import { ApiTags } from '@nestjs/swagger';
import { FacebookPageQuery } from './dto/facebook-page.dto';
import { FacebookPostService } from './services/facebook-post.service';
import { FacebookPostQuery } from './dto/facebook-post.dto';

@ApiTags('facebook-insight')
@Controller('')
export class FacebookController {
  constructor(
    private readonly facebookPageService: FacebookPageService,
    private readonly facebookPostService: FacebookPostService,
  ) { }

  @Post('save-page-to-db')
  async savePage(@Query() FacebookPageQuery: FacebookPageQuery) {
    return this.facebookPageService.savePage(FacebookPageQuery);
  }

  @Get('get-all-pages')
  async getAllPages() {
    return this.facebookPageService.getAllPages();
  }

  @Get('/:pageId')
  async getFacebookPage(@Param('pageId') pageId: string) {
    return this.facebookPageService.findById(pageId);
  }

  @Patch('/:pageId')
  async updateFacebookPage(@Query() facebookPageQuery: FacebookPageQuery) {
    return this.facebookPageService.updatePage(facebookPageQuery);
  }

  @Delete('/:pageId')
  async deleteFacebookPage(@Param('pageId') pageId: string) {
    return this.facebookPageService.deletePage(pageId);
  }

  @Post('save-post-to-db')
  async savePost(@Query() facebookPageQuery: FacebookPageQuery) {
    return this.facebookPostService.savePost(facebookPageQuery);
  }
}

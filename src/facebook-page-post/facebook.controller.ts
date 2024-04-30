import { Controller, Get, Post, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacebookPageService } from './services/facebook-page.service';
import { ApiTags } from '@nestjs/swagger';
import { FacebookPageQuery } from './dto/facebook-page.dto';
import { FacebookPostService } from './services/facebook-post.service';
import { FacebookPostQuery } from './dto/facebook-post.dto';
import { FacebookPostDate } from './dto/facebook-post-date.dto';
import { FacebookInsightQuery } from './dto/facebook-insight.dto';
import { FacebookInsightService } from './services/facebook-insight.service';

@ApiTags('facebook-page-post-insight')
@Controller('')
export class FacebookController {
  constructor(
    private readonly facebookPageService: FacebookPageService,
    private readonly facebookPostService: FacebookPostService,
    private readonly facebookInsightService: FacebookInsightService
  ) { }

  @Get('get-access-token')
  async getAccessToken(@Query() facebookPageQuery: FacebookPageQuery) {
    return this.facebookPageService.getAccessToken(facebookPageQuery);
  }

  @Post('save-page-to-db')
  async savePage(@Query() FacebookPageQuery: FacebookPageQuery) {
    return this.facebookPageService.savePage(FacebookPageQuery);
  }

  @Patch('/:pageId')
  async updateFacebookPage(@Query() facebookPageQuery: FacebookPageQuery) {
    return this.facebookPageService.updatePage(facebookPageQuery);
  }

  @Get('/:pageId')
  async getFacebookPageById(@Param('pageId') pageId: string) {
    return this.facebookPageService.findById(pageId);
  }

  @Get('get-all-pages')
  async getAllPages() {
    return this.facebookPageService.getAllPages();
  }


  @Delete('/:pageId')
  async deleteFacebookPage(@Param('pageId') pageId: string) {
    return this.facebookPageService.deletePage(pageId);
  }

  @Post('save-post-to-db')
  async savePost(@Query() facebookPageQuery: FacebookPageQuery) {
    return this.facebookPostService.savePost(facebookPageQuery);
  }

  @Patch('/:pageId/posts')
  async updatePosts(@Query() facebookPageQuery: FacebookPageQuery) {
    return this.facebookPostService.updatePagePosts(facebookPageQuery);
  }

  @Get('/:pageId/posts')
  async getAllPostsById(@Param('pageId') pageId: string) {
    return this.facebookPostService.getAllPostsId(pageId);
  }

  @Get('/:pageId/date')
  async findPostByDate(@Query() facebookPostDate: FacebookPostDate) {
    return this.facebookPostService.findPostByDate(facebookPostDate);
  }

  @Delete('/:postId')
  async deleteOnePost(@Param('postId') postId: string) {
    return this.facebookPostService.deleteOnePost(postId);
  }

  @Get('/insights')
  async getFacebookInsights(@Query() query: FacebookInsightQuery) {    
    return this.facebookInsightService.getFacebookInsights(query)
  }
}

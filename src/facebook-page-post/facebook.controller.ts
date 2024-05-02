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
@Controller()
export class FacebookController {
  constructor(
    private readonly facebookPageService: FacebookPageService,
    private readonly facebookPostService: FacebookPostService,
    private readonly facebookInsightService: FacebookInsightService
  ) { }

  @Get('get-access-token')
  async getAccessToken(@Query() facebookPageQuery: FacebookPageQuery) {
    console.log('get access token');
    return this.facebookPageService.getAccessToken(facebookPageQuery);
  }

  @Post('save-page-to-db')
  async savePage(@Query() FacebookPageQuery: FacebookPageQuery) {
    console.log('save page to db');
    return this.facebookPageService.savePage(FacebookPageQuery);
  }

  @Patch('/:pageId')
  async updateFacebookPage(@Query() facebookPageQuery: FacebookPageQuery) {
    console.log('update page by id');
    return this.facebookPageService.updatePage(facebookPageQuery);
  }

  @Get('/:pageId')
  async getFacebookPageById(@Query() facebookPageQuery: FacebookPageQuery) {
    console.log('get page by id');
    return this.facebookPageService.findById(facebookPageQuery);
  }

  @Get()
  async getAllPages() {
    console.log('get all pages');
    return this.facebookPageService.getAllPages();
  }

  @Delete('/page/:pageId')
  async deleteFacebookPage(@Query() facebookPageQuery: FacebookPageQuery) {
    console.log('delete page by id');
    return this.facebookPageService.deletePage(facebookPageQuery);
  }

  @Post('save-post-to-db')
  async savePost(@Query() facebookPageQuery: FacebookPageQuery) {
    console.log('save post to db');
    return this.facebookPostService.savePost(facebookPageQuery);
  }

  @Patch('/:pageId/posts')
  async updatePosts(@Query() facebookPageQuery: FacebookPageQuery) {
    console.log('update all posts');
    return this.facebookPostService.updatePagePosts(facebookPageQuery);
  }

  @Get('/:pageId/posts')
  async getAllPostsById(@Query() facebookPageQuery: FacebookPageQuery) {
    console.log('get all posts by page id');
    return this.facebookPostService.getAllPostsId(facebookPageQuery);
  }

  @Get('/:pageId/date')
  async findPostByDate(@Query() facebookPostDate: FacebookPostDate) {
    console.log('filter 2 post by date');
    return this.facebookPostService.findPostByDate(facebookPostDate);
  }

  @Delete('/:postId')
  async deleteOnePost(@Query() facebookPostQuery: FacebookPostQuery) {
    console.log('delete one post by id');
    return this.facebookPostService.deleteOnePost(facebookPostQuery);
  }

  @Get('/page/insights')
  async getFacebookInsights(@Query() facebookInsightQuery: FacebookInsightQuery) {
    console.log('get page insights');
    return this.facebookInsightService.getFacebookInsights(facebookInsightQuery)
  }
}

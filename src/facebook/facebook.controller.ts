import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { ApiTags } from '@nestjs/swagger';
import { FacebookPageQuery } from './dto/facebook-page.dto';
import { FacebookInsightQuery } from './dto/facebook-insight.dto';

@ApiTags('facebook-insight')
@Controller('')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) { }
  // get page
  @Get('get-facebook-page-likes')
  async getFacebookPageLikes(@Query() FacebookPageQuery: FacebookPageQuery){
    return this.facebookService.getFacebookPageLikes(FacebookPageQuery);
  }

  @Get('get-facebook-page-post-count')
  async getFacebookPagePostCount(@Query() FacebookPageQuery: FacebookPageQuery) {
    return this.facebookService.getFacebookPagePostCount(FacebookPageQuery);
  }

  @Get('get-facebook-page')
  async getFacebookPage(@Query() FacebookInsightQuery: FacebookPageQuery) {
    return this.facebookService.getFacebookPage(FacebookInsightQuery);
  }

  @Get('get-facebook-page-access-token')
  async getFacebookPageAccessToken(@Query('pageId') pageId: string, @Query('access_token') accessToken: string) {
    return this.facebookService.getFacebookPageAccessToken(pageId, accessToken);
  }
  // get post
  @Get('get-facebook-post-comments')
  async getFacebookPostComments(@Query('postId') postId: string, @Query('access_token') accessToken: string) {
    return this.facebookService.getFacebookPostComments(postId, accessToken);
  }

  @Get('get-facebook-post-likes')
  async getFacebookPostLikes(@Query('postId') postId: string, @Query('access_token') accessToken: string) {
    return this.facebookService.getFacebookPostLikes(postId, accessToken);
  }

  @Get('get-facebook-post-reactions')
  async getFacebookPostReactions(@Query('postId') postId: string, @Query('access_token') accessToken: string) {
    return this.facebookService.getFacebookPostReactions(postId, accessToken);
  }

  @Post('save-page-to-database')
  async savePage(@Query () FacebookPageQuery: FacebookPageQuery) {
    return this.facebookService.savePage(FacebookPageQuery);
  }
}

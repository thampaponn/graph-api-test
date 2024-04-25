import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { FacebookPageQuery } from './dto/facebook-page.dto';
import { HttpService } from "@nestjs/axios";
import { FacebookInsightQuery } from './dto/facebook-insight.dto';
import { IFacebookInsightResponse } from './entities/facebook-insight.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Page } from 'src/schemas/page.schema';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/post.schema';

@Injectable()
export class FacebookService {
  private readonly logger = new Logger(FacebookService.name)
  constructor(
    protected readonly httpService: HttpService,
    @InjectModel(Page.name) private pageModel: Model<Page>,
    @InjectModel(Post.name) private postModel: Model<Post>
  ) { }

  async savePage(query: FacebookPageQuery) {
    try {
      const page = await this.getFacebookPagePostCount(query)
      const dto = {
        pageId: query.pageId,
        likes: (await this.getFacebookPageLikes(query)).todayLikes,
        postCount: page.length,
        post: page.map(post => post.id),
        albums: await this.getPageAlbums(query),
        events: await this.getPageEvents(query),
        feed: await this.getPageFeed(query),
      }
      return await this.pageModel.create(dto)
    } catch (error) {
      return error
    }
  }

  async getSingleLineAddress(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}`, {
      params: {
        fields: 'single_line_address',
        access_token: query.accessToken
      }
    })
    const singleLineAddress = axiosResponse.data
    return singleLineAddress
  }

  async getPageFeed(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/feed`, {
      params: {
        access_token: query.accessToken
      }
    })
    const feed = axiosResponse.data
    return feed
  }

  async getPageEvents(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/events`, {
      params: {
        access_token: query.accessToken
      }
    })
    const events = axiosResponse.data
    return events
  }

  async getPageAlbums(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/albums`, {
      params: {
        access_token: query.accessToken
      }
    })
    const albums = axiosResponse.data
    return albums
  }

  async getFacebookPageLikes(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights/page_fans`, {
      params: {
        access_token: query.accessToken
      }
    })
    const facebookInsights = axiosResponse.data
    const todayLikes = facebookInsights.data[0].values[1].value
    const yesterdayLikes = facebookInsights.data[0].values[0].value
    const likesChanged = facebookInsights.data[0].values[1].value - facebookInsights.data[0].values[0].value
    const result = { yesterdayLikes, todayLikes, likesChanged }
    return result
  }

  async getFacebookPagePostCount(query: FacebookPageQuery) {
    let allPosts = [];
    let url = `https://graph.facebook.com/${query.pageId}/posts`;

    while (url) {
      const axiosResponse = await axios.get(url, {
        params: {
          fields: 'created_time,message,id',
          access_token: query.accessToken,
          limit: 100
        }
      });

      const data = axiosResponse.data;
      allPosts = allPosts.concat(data.data);

      // check if next is null or not
      url = data.paging && data.paging.next ? data.paging.next : null;
    } while (url);

    return allPosts;
  }

  async getFacebookInsight(query: FacebookInsightQuery): Promise<IFacebookInsightResponse> {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights`, {
      params: {
        metric: Array.isArray(query.metrics) ? query.metrics.join(',') : query.metrics,
        date_preset: query?.datePreset,
        period: query?.period,
        since: query?.since,
        until: query?.until,
        access_token: query?.accessToken
      }
    })
    const facebookInsights: IFacebookInsightResponse = axiosResponse.data
    return facebookInsights
  }

  async getFacebookPage(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}`, {
      params: {
        access_token: query.accessToken
      }
    })
    const pageInformation = axiosResponse.data
    return pageInformation
  }

  async getFacebookPageAccessToken(pageId: string, accessToken: string) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${pageId}`, {
      params: {
        fields: 'access_token',
        access_token: accessToken
      }
    })
    const facebookResponse = axiosResponse.data
    return facebookResponse
  }

  async getFacebookPostComments(postId: string, accessToken: string) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${postId}/comments`, {
      params: {
        access_token: accessToken
      }
    })
    const facebookResponse = axiosResponse.data
    return facebookResponse
  }

  async getFacebookPostLikes(postId: string, accessToken: string) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${postId}/likes`, {
      params: {
        access_token: accessToken
      }
    })
    const facebookResponse = axiosResponse.data
    return facebookResponse
  }

  async getFacebookPostReactions(postId: string, accessToken: string) {
    let allReactions = [];
    let url = `https://graph.facebook.com/${postId}/reactions`;

    while (url) {
      const axiosResponse = await axios.get(url, {
        params: {
          fields: 'id,name,type',
          access_token: accessToken,
          limit: 100
        }
      });

      const data = axiosResponse.data;
      allReactions = allReactions.concat(data.data);

      // check if next is null or not
      url = data.paging && data.paging.next ? data.paging.next : null;
    } while (url);

    return allReactions.length;
  }
}

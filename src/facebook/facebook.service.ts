import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { FacebookPageQuery } from './dto/facebook-page.dto';
import { HttpService } from "@nestjs/axios";
import { FacebookInsightQuery } from './dto/facebook-insight.dto';
import { IFacebookInsightResponse } from './entities/facebook-insight.interface';
import { Cron } from '@nestjs/schedule';
import { FacebookInsightMetricArray } from './entities/facebook.entity';

@Injectable()
export class FacebookService {
  private readonly logger = new Logger(FacebookService.name)
  constructor(
    protected readonly httpService: HttpService,
  ) { }

  async getFacebookPageLikes(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights/page_fans`, {
      params: {
        fields: Array.isArray(query?.fields) ? query.fields.join(',') : query.fields,
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
  
      // Update the URL for the next page
      url = data.paging && data.paging.next ? data.paging.next : null;
    } while (url);  // Continue as long as there is a 'next' page
  
    return allPosts.length;
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
        fields: Array.isArray(query?.fields) ? query.fields.join(',') : query.fields,
        access_token: query.accessToken
      }
    })
    const pageInformation = axiosResponse.data
    return pageInformation
  }

  async getFacebookPageFeed(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/feed`, {
      params: {
        fields: query?.fields,
        access_token: query.accessToken
      }
    })
    const pageFeedInformation = axiosResponse.data
    return pageFeedInformation
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
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${postId}/reactions`, {
      params: {
        access_token: accessToken
      }
    })
    const facebookResponse = axiosResponse.data
    return facebookResponse
  }
}

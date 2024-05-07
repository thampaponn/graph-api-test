import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { FacebookInsightQuery } from "../dto/facebook-insight.dto";
import { IFacebookInsight, IFacebookInsightResponse, } from "../entities/facebook-insight.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Insight } from "src/schemas/insight.schema";
import { Model } from "mongoose";
import axios from 'axios';
import { FacebookPageQuery } from "../dto/facebook-page.dto";
import { Post } from "src/schemas/post.schema";

@Injectable()
export class FacebookInsightService {
  private readonly logger = new Logger(FacebookInsightService.name)
  constructor(
    protected readonly httpService: HttpService,
    @InjectModel(Insight.name) private insightModel: Model<Insight>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) { }

  async getFacebookInsights(query: FacebookInsightQuery): Promise<IFacebookInsightResponse> {
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
    const facebookInsights = axiosResponse.data
    this.logger.debug('Facebook insights fetched: ' + facebookInsights)
    return facebookInsights
  }

  async getFacebookPageLikes(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights/page_fans`, {
      params: {
        access_token: query.accessToken
      }
    })
    const facebookInsights = axiosResponse.data
    const todayLikes = facebookInsights.data[0].values[0].value
    const yesterdayLikes = facebookInsights.data[0].values[1].value
    const likesChanged = todayLikes - yesterdayLikes
    const result = { todayLikes, yesterdayLikes, likesChanged }
    this.logger.debug('Today likes: ' + result.todayLikes + ', Yesterday likes: ' + result.yesterdayLikes + ', Changes: ' + result.likesChanged)
    return result
  }

  async getFacebookPagePostCount(query: FacebookPageQuery) {
    return (await this.postModel.find({ pageId: query.pageId }))
  }

  async saveInsight(query: FacebookPageQuery) {
    const likesCount = await this.getFacebookPageLikes(query);
    const postsCount = (await this.getFacebookPagePostCount(query)).length;
    let photoType = 0;
    let videoType = 0;
    let captionType = 0;
    let like = 0;
    let love = 0;
    let care = 0;
    let wow = 0;
    let haha = 0;
    let sad = 0;
    let angry = 0;
    let totalComments = 0;
    let totalShares = 0;
    for (const post of await this.postModel.find({ pageId: query.pageId })) {
      if (post.postType === 'photo') {
        photoType++;
      } else if (post.postType === 'video') {
        videoType++;
      } else {
        captionType++;
      }
    }
    for (const post of await this.postModel.find({ pageId: query.pageId })) {
      like += post.reactions?.like ?? 0;
      love += post.reactions?.love ?? 0;
      care += post.reactions?.care ?? 0;
      wow += post.reactions?.wow ?? 0;
      haha += post.reactions?.haha ?? 0;
      sad += post.reactions?.sad ?? 0;
      angry += post.reactions?.angry ?? 0;
    }
    for (const post of await this.postModel.find({ pageId: query.pageId })) {
      totalComments += post.comments ?? 0;
    }
    for (const post of await this.postModel.find({ pageId: query.pageId })) {
      totalShares += post.shares ?? 0;
    }
    const totalReactions = { like, love, care, wow, haha, sad, angry }
    const postsTypeTotal = { photo: photoType, video: videoType, caption: captionType }
    const result = { pageId: query.pageId, pageFans: likesCount.todayLikes, postsCount, postsTypeTotal, totalReactions, totalComments, totalShares }
    this.logger.debug('Insight info: ' + likesCount.todayLikes + ', Total comments: ' + totalComments + ', Total Shares: ' + totalShares + ', Posts count: ' + postsCount + ', Posts type total: ' + JSON.stringify((postsTypeTotal)) + ', Total reactions: ' + JSON.stringify(totalReactions))
    return await this.insightModel.create(result);
  }
}
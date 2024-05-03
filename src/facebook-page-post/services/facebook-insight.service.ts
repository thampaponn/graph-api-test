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
        // metric: Array.isArray(query.metrics) ? query.metrics.join(',') : query.metrics,
        metric: 'page_fans',
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
    for (const post of await this.postModel.find({ pageId: query.pageId })) {
      if (post.postType === 'photo') {
        photoType++;
      } else if (post.postType === 'video') {
        videoType++;
      } else {
        captionType++;
      }
    }
    const postsTypeTotal = { photo: photoType, video: videoType, caption: captionType }
    this.logger.debug('Insight info: ' + likesCount.todayLikes + ', Posts count: ' + postsCount + ', Posts type total: { photo: ' + postsTypeTotal.photo + ', video: ' + postsTypeTotal.video + ', caption: ' + postsTypeTotal.caption + ' }')
    return likesCount;
  }
}
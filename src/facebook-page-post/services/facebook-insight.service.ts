import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable, Logger } from "@nestjs/common";
// import { FacebookInsightQuery } from "../dto/facebook-insight.dto";
import { IFacebookInsight, IFacebookInsightResponse, } from "../entities/facebook-insight.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Insight } from "src/schemas/insight.schema";
import { Model } from "mongoose";
import axios from 'axios';
import { FacebookPageQuery } from "../dto/facebook-page.dto";
import { Post } from "src/schemas/post.schema";
import { FacebookPostQuery } from "../dto/facebook-post.dto";

@Injectable()
export class FacebookInsightService {
  private readonly logger = new Logger(FacebookInsightService.name)
  constructor(
    protected readonly httpService: HttpService,
    @InjectModel(Insight.name) private insightModel: Model<Insight>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) { }

  // async getFacebookInsights(query: FacebookInsightQuery): Promise<IFacebookInsightResponse> {
  //   const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights`, {
  //     params: {
  //       metric: Array.isArray(query.metrics) ? query.metrics.join(',') : query.metrics,
  //       // metric: 'post_video_views_15s',
  //       date_preset: query?.datePreset,
  //       period: query?.period,
  //       since: query?.since,
  //       until: query?.until,
  //       access_token: query?.accessToken
  //     }
  //   })
  //   const facebookInsights = axiosResponse.data
  //   this.logger.debug('Facebook insights fetched: ' + facebookInsights)
  //   return facebookInsights
  // }

  async getFacebookPageLikes(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights/page_fans`, {
      params: {
        access_token: query.accessToken
      }
    })
    const pageLikes = axiosResponse.data
    const todayLikes = pageLikes.data[0].values[0].value
    const yesterdayLikes = pageLikes.data[0].values[1].value
    const likesChanged = todayLikes - yesterdayLikes
    const result = { todayLikes, yesterdayLikes, likesChanged }
    this.logger.debug('Today likes: ' + result.todayLikes + ', Yesterday likes: ' + result.yesterdayLikes + ', Changes: ' + result.likesChanged)
    return result
  }

  async getFacebookPageImpressions(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights/page_impressions`, {
      params: {
        // date_preset: query?.datePreset,
        period: 'day',
        // since: query?.since,
        // until: query?.until,
        access_token: query?.accessToken
      }
    })
    const pageImpressions = axiosResponse.data
    this.logger.debug('Facebook insights fetched: ' + pageImpressions)
    return pageImpressions.data[0]
  }

  async getFacebookPageImpressionsUnique(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights/page_impressions_unique`, {
      params: {
        // date_preset: query?.datePreset,
        period: 'day',
        // since: query?.since,
        // until: query?.until,
        access_token: query?.accessToken
      }
    })
    const pageImpressions = axiosResponse.data
    this.logger.debug('Facebook insights fetched: ' + pageImpressions)
    return pageImpressions.data[0]
  }

  async getFacebookPageVideoViewTime(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights`, {
      params: {
        metric: 'page_video_view_time',
        // date_preset: query?.datePreset,
        period: 'day',
        // since: query?.since,
        // until: query?.until,
        access_token: query?.accessToken
      }
    })
    const videoViewTime = axiosResponse.data
    this.logger.debug('Facebook insights fetched: ' + videoViewTime)
    return videoViewTime.data[0]
  }

  async getFacebookPageVideoViewsDay(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights`, {
      params: {
        metric: 'page_video_views',
        // date_preset: query?.datePreset,
        period: 'day',
        // since: query?.since,
        // until: query?.until,
        access_token: query?.accessToken
      }
    })
    const videoViewsDay = axiosResponse.data
    this.logger.debug('Facebook insights fetched: ' + videoViewsDay)
    return videoViewsDay.data[0]
  }

  async getFacebookPageVideoViewsWeek(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights`, {
      params: {
        metric: 'page_video_views',
        // date_preset: query?.datePreset,
        period: 'week',
        // since: query?.since,
        // until: query?.until,
        access_token: query?.accessToken
      }
    })
    const videoViewsWeek = axiosResponse.data
    this.logger.debug('Facebook insights fetched: ' + videoViewsWeek)
    return videoViewsWeek.data[0]
  }

  async getFacebookPageVideoViewsDay28(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights`, {
      params: {
        metric: 'page_video_views',
        // date_preset: query?.datePreset,
        period: 'days_28',
        // since: query?.since,
        // until: query?.until,
        access_token: query?.accessToken
      }
    })
    const videoViewsDay28 = axiosResponse.data
    this.logger.debug('Facebook insights fetched: ' + videoViewsDay28)
    return videoViewsDay28.data[0]
  }

  async getLinksClicks(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/insights`, {
      params: {
        metric: 'page_consumptions_by_consumption_type',
        // date_preset: query?.datePreset,
        period: 'day',
        // since: query?.since,
        // until: query?.until,
        access_token: query?.accessToken
      }
    })
    const insightsData = axiosResponse.data;
    this.logger.debug('Facebook insights fetched: ' + JSON.stringify(insightsData));
    const latestData = insightsData.data[0].values[0];
    const linkClicksCount = latestData.value.link_clicks || 0;

    return linkClicksCount;
  }

  async getFacebookPagePostCount(query: FacebookPageQuery) {
    return (await this.postModel.find({ pageId: query.pageId }))
  }

  async getPagePostsInsight(query: FacebookPageQuery) {
    let start = Date.now();
    try {
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
      let totalClicks = 0;
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
      for (const post of await this.postModel.find({ pageId: query.pageId })) {
        totalClicks += post.postClicked ?? 0;
      }
      const linkClicks = await this.getLinksClicks(query);
      const allReactionsType = { like, love, care, wow, haha, sad, angry }
      const totalReactions = like + love + care + wow + haha + sad + angry
      const postsTypeTotal = { photo: photoType, video: videoType, caption: captionType }
      const result = { postsCount, postsTypeTotal, allReactionsType, totalReactions, totalComments, totalShares, totalClicks, linkClicks }
      this.logger.debug(JSON.stringify(result))
      let timeTaken = Date.now() - start;
      console.log("Total time taken : " + timeTaken/1000 + " seconds");
      return result
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async saveInsight(query: FacebookPageQuery) {
    let start = Date.now();
    try {
      const likesCount = await this.getFacebookPageLikes(query);
      const pageImpressions = await this.getFacebookPageImpressions(query);
      const pageImpressionsUnique = await this.getFacebookPageImpressionsUnique(query);
      const pageVideoViewTime = (await this.getFacebookPageVideoViewTime(query)).values;
      const pageVideoViewsDay = (await this.getFacebookPageVideoViewsDay(query)).values;
      const pageVideoViewsWeek = (await this.getFacebookPageVideoViewsWeek(query)).values;
      const pageVideoViewsDay28 = (await this.getFacebookPageVideoViewsDay28(query)).values;
      const result = { pageId: query.pageId, pageFans: likesCount.todayLikes, pageImpressions, pageImpressionsUnique, pageVideoViewTime, pageVideoViewsDay, pageVideoViewsWeek, pageVideoViewsDay28 }
      this.logger.debug('Insight info: ' + likesCount.todayLikes + ', Page Impression/Unique: ' + JSON.stringify(pageImpressions) + '/ ' + JSON.stringify(pageImpressionsUnique) + ', Page video view time: ' + JSON.stringify(pageVideoViewTime) + ', Page video views day: ' + JSON.stringify(pageVideoViewsDay) + ', Page video views week: ' + JSON.stringify(pageVideoViewsWeek) + ', Page video views day 28: ' + JSON.stringify(pageVideoViewsDay28))
      let timeTaken = Date.now() - start;
      console.log("Total time taken : " + timeTaken/1000 + " milliseconds");
      return await this.insightModel.create(result);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async updateInsight(query: FacebookPageQuery) {
    let start = Date.now();
    try {
      const post = await this.insightModel.findOne({ pageId: query.pageId })
      if (!post) {
        throw new HttpException('Page not found', 404)
      }
      const likesCount = await this.getFacebookPageLikes(query);
      const pageImpressions = await this.getFacebookPageImpressions(query);
      const pageImpressionsUnique = await this.getFacebookPageImpressionsUnique(query);
      const pageVideoViewTime = (await this.getFacebookPageVideoViewTime(query)).values;
      const pageVideoViewsDay = (await this.getFacebookPageVideoViewsDay(query)).values;
      const pageVideoViewsWeek = (await this.getFacebookPageVideoViewsWeek(query)).values;
      const pageVideoViewsDay28 = (await this.getFacebookPageVideoViewsDay28(query)).values;
      const result = { pageFans: likesCount.todayLikes, pageImpressions, pageImpressionsUnique, pageVideoViewTime, pageVideoViewsDay, pageVideoViewsWeek, pageVideoViewsDay28 }
      this.logger.debug('Updated insight info: ' + likesCount.todayLikes + ', Page Impression/Unique: ' + JSON.stringify(pageImpressions) + '/ ' + JSON.stringify(pageImpressionsUnique) + ', Page video view time: ' + JSON.stringify(pageVideoViewTime) + ', Page video views day: ' + JSON.stringify(pageVideoViewsDay) + ', Page video views week: ' + JSON.stringify(pageVideoViewsWeek) + ', Page video views day 28: ' + JSON.stringify(pageVideoViewsDay28))
      await this.insightModel.updateOne({ pageId: query.pageId }, result)
      let timeTaken = Date.now() - start;
      console.log("Total time taken : " + timeTaken/1000 + " seconds");
      return `Insight with id ${query.pageId} updated successfully`
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { FacebookInsightQuery } from "../dto/facebook-insight.dto";
import { IFacebookInsight, IFacebookInsightResponse,  } from "../entities/facebook-insight.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Insight } from "src/schemas/insight.schema";
import { Model } from "mongoose";

@Injectable()
export class FacebookInsightService {
  private readonly logger = new Logger(FacebookInsightService.name)
  constructor(
    protected readonly httpService: HttpService,
    @InjectModel(Insight.name) private insightModel: Model<Insight>,
  ){}

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
    const facebookInsights: IFacebookInsightResponse = axiosResponse.data
    this.logger.debug('Facebook insights fetched: ' + facebookInsights)
    return facebookInsights
  }

  async saveInsight(){}
}
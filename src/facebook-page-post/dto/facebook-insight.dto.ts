import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FacebookInsightDatePreset, FacebookInsightMetric, FacebookInsightPeriod } from "../entities/facebook-insight.interface";
import { IFacebookSubscribePage } from "../entities/facebook-subscribe-page.interface";
import { FacebookCommonQuery } from "src/common/common.dto";

export class FacebookInsightQuery implements Pick<IFacebookSubscribePage, 'pageId'>, FacebookCommonQuery {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pageId: string;
  
  // @ApiProperty({
  //   enum: FacebookInsightMetric,
  //   enumName: "Metric",
  //   isArray: true,
  //   example: [FacebookInsightMetric.PAGE_ACTIONS_POST_REACTIONS_TOTAL]
  // })
  // @IsEnum(FacebookInsightMetric, { each: true })
  // @IsNotEmpty()
  // metrics: FacebookInsightMetric[]

  @ApiProperty({
    required: false,
    enum: FacebookInsightDatePreset,
    enumName: "Date Preset",
    example: FacebookInsightDatePreset.THIS_MONTH
  })
  @IsEnum(FacebookInsightDatePreset)
  @IsOptional()
  datePreset: FacebookInsightDatePreset

  @ApiProperty({
    required: false,
    enum: FacebookInsightPeriod,
    enumName: "Period",
    example: FacebookInsightPeriod.DAY
  })
  @IsEnum(FacebookInsightPeriod)
  @IsOptional()
  period: FacebookInsightPeriod

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  since: string

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  until: string
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

}
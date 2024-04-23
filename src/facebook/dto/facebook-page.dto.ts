import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IFacebookSubscribePage } from "../entities/facebook-subscribe-page.interface";
import { FacebookCommonQuery } from "src/common/common.dto";

export class FacebookPageQuery implements Pick<IFacebookSubscribePage, 'pageId'>, FacebookCommonQuery {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pageId: string

  @ApiProperty({
    isArray: true,
    required: false
  })
  @IsString({ each: true })
  @IsOptional()
  fields: string[]

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

}
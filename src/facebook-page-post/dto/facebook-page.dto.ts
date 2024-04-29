import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { FacebookCommonQuery } from "src/common/common.dto";
import { IPage } from "../entities/facebook-page-post.interface";

export class FacebookPageQuery implements Pick<IPage, 'pageId'>, FacebookCommonQuery {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pageId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

}
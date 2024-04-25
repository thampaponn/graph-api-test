import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
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
  name: string;

  @ApiProperty(
    { isArray: true }
  )
  @IsOptional()
  events: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  emails: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  likes: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postCount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

}
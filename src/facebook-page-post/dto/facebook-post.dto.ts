import { FacebookCommonQuery } from "src/common/common.dto";
import { IPost } from "../entities/facebook-page-post.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FacebookPostQuery implements Pick<IPost, 'postId'>, FacebookCommonQuery {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    postId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}
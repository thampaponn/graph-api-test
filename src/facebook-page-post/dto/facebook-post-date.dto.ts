import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { FacebookCommonQuery } from "src/common/common.dto";

export class FacebookPostDate implements FacebookCommonQuery {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    pageId: string[];

    @ApiProperty()
    @IsString()
    accessToken: string;

    @ApiProperty({
        example: '2021-09-24'
    })
    @IsString()
    startDate: string;

    @ApiProperty({
        example: '2021-09-30'
    })
    @IsString()
    endDate: string;
}
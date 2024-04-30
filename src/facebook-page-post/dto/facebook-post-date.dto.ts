import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsString } from "class-validator";
import { FacebookCommonQuery } from "src/common/common.dto";

export class FacebookPostDate {
    @ApiProperty({ required: true })
    @IsArray()
    pageId: string[];

    @ApiProperty({
        example: '2016-01-01'
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({
        example: '2016-12-31'
    })
    @IsDateString()
    endDate: string;
}
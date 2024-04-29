import { PartialType } from '@nestjs/swagger';
import { CreateFacebookInsightDto } from './create-facebook-insight.dto';

export class UpdateFacebookInsightDto extends PartialType(CreateFacebookInsightDto) {}

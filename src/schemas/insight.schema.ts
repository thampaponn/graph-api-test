import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";
import { FacebookReactionType } from "src/facebook-page-post/entities/facebook-page-post.interface";

@Schema({ timestamps: true, versionKey: false })
export class Insight {
    @Prop({ type: Object, index: true })
    insightId: ObjectId;

    @Prop({ type: String, index: true })
    pageId: string;

    @Prop({ type: String, index: true })
    pageFans: string;

    @Prop({ type: Object })
    pageImpressions: object;

    @Prop({ type: Object })
    pageImpressionsUnique: object;

    @Prop({ type: Object })
    pageVideoViewsDay: object;

    @Prop({ type: Object })
    pageVideoViewsWeek: object;

    @Prop({ type: Object })
    pageVideoViewsDay28: object;

    @Prop({ type: Object })
    pageVideoViewTime: object;

    @Prop({ type: Number })
    engagementRate: number;

    @Prop({ type: String, index: true })
    created_time: string;
}

export type InsightDocument = Insight & Document;
export const InsightSchema = SchemaFactory.createForClass(Insight);
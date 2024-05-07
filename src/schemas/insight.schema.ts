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

    // @Prop({ type: Number })
    // postsCount: number;

    // @Prop({ type: Object })
    // postsTypeTotal: object;

    // @Prop({ type: Object })
    // allReactionsType: FacebookReactionType;

    // @Prop({ type: Number })
    // totalReactions: number;

    // @Prop({ type: Number })
    // totalComments: number;

    // @Prop({ type: Number })
    // totalShares: number;

    @Prop({ type: Object })
    pageVideoViewsDay: object;

    @Prop({ type: Object })
    pageVideoViewsWeek: object;

    @Prop({ type: Object })
    pageVideoViewsDay28: object;

    @Prop({ type: Object })
    pageVideoViewTime: object;

    @Prop({ type: Object })
    postVideoViews15s: object;

    @Prop({ type: Object })
    postVideoCompletedViews: object;

    @Prop({ type: Object })
    postVideoAvgTime: object;

    @Prop({ type: Object })
    postVideoViews60s: object;

    @Prop({ type: Object })
    linkClicks: object;

    @Prop({ type: Number })
    engagementRate: number;

    @Prop({ type: String, index: true })
    created_time: string;
}

export type InsightDocument = Insight & Document;
export const InsightSchema = SchemaFactory.createForClass(Insight);
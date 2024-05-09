import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FacebookReactionType } from "src/facebook-page-post/entities/facebook-page-post.interface";

@Schema({ timestamps: true, versionKey: false })
export class Post {
    @Prop({ type: String, index: true })
    pageId: string;

    @Prop({ type: String, index: true })
    postId: string;

    @Prop({ type: String, index: true })
    postType: string;

    @Prop({ type: String })
    message?: string;

    @Prop({ type: String, index: true })
    created_time?: string;

    @Prop({ type: Object })
    attachments?: object;

    @Prop({ type: Object })
    reactions?: FacebookReactionType;

    @Prop({ type: Number })
    comments?: number;

    @Prop({ type: Number })
    shares?: number;

    @Prop({ type: Number })
    totalPostReactions?: number

    @Prop({ type: Number })
    engagementRate: number;

    @Prop({ type: Number })
    postClicked?: number;

    @Prop({ type: Number })
    postImpressions: number;

    @Prop({ type: Number })
    postImpressionsUnique: number;

    @Prop({ type: Number })
    postImpressionsPaid: number;

    @Prop({ type: Number })
    postImpressionsPaidUnique: number;

    @Prop({ type: Number })
    postImpressionsOrganic: number;

    @Prop({ type: Number })
    postImpressionsOrganicUnique: number;

    @Prop({ type: Object })
    postVideoViews15s: object;

    @Prop({ type: Object })
    postVideoCompletedViews: object;

    @Prop({ type: Object })
    postVideoAvgTime: object;

    @Prop({ type: Object })
    postVideoViews60s: object;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
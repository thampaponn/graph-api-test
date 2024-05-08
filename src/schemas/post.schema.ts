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
    postClicked?: number;

    @Prop({ type: Object })
    postImpressions: object;

    @Prop({ type: Object })
    postImpressionsUnique: object;

    @Prop({ type: Object })
    postImpressionsPaid: object;

    @Prop({ type: Object })
    postImpressionsPaidUnique: object;

    @Prop({ type: Object })
    postImpressionsOrganic: object;

    @Prop({ type: Object })
    postImpressionsOrganicUnique: object;

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
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

    @Prop({ type: Number })
    postsCount: number;

    @Prop({ type: Object })
    postsTypeTotal: object;

    @Prop({ type: Object })
    totalReactions: FacebookReactionType;

    @Prop({ type: Number })
    totalComments: number;

    @Prop({ type: Number })
    totalShares: number;

    @Prop({ type: String, index: true })
    created_time: string;
}

export type InsightDocument = Insight & Document;
export const InsightSchema = SchemaFactory.createForClass(Insight);
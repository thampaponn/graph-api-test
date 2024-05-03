import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Insight {
    @Prop({ type: Object, index: true })
    insightId: ObjectId;

    @Prop({ type: String, index: true })
    pageId: string;

    @Prop({ type: String, index: true })
    pageFans: string;

    @Prop({ type: Number, index: true })
    name: number;

    @Prop({ type: String, index: true })
    created_time: string;

    @Prop({ type: String })
    values: string[];
}

export type InsightDocument = Insight & Document;
export const InsightSchema = SchemaFactory.createForClass(Insight);
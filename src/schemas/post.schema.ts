import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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
    reactions?: object;

    @Prop({ type: Number })
    comments?: number;

    @Prop({ type: Number })
    shares?: number;

    @Prop({ type: Number })
    postClicked?: number;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
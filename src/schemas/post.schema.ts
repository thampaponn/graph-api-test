import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FacebookPostType, FacebookReactionType } from "src/facebook/entities/facebook-page-post.interface";

@Schema({ timestamps: true, versionKey: false})
export class Post {
    @Prop({ type: String })
    pageId: string;

    @Prop({ type: String, index: true })
    id: string;

    // @Prop({ type: String, index: true })
    // postType: FacebookPostType;

    @Prop({ type: String })
    message?: string;

    @Prop({ type: String })
    created_time?: string;

    @Prop({ type: Object })
    attachments?: object;

    @Prop({ type: Object })
    reactions?: object;

    @Prop({ type: Object })
    comments?: object;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
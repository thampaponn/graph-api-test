import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { FacebookPostType, FacebookReactionType } from "src/facebook/entities/facebook-page-post.interface";

export class Post {
    @Prop({ type: String })
    pageId: string;

    @Prop({ type: String, index: true})
    postId: string;

    @Prop({ type: String, index: true})
    postType: FacebookPostType;

    @Prop({ type: String })
    message?: string;

    @Prop({ type: String })
    created_time?: string;

    @Prop({ type: String })
    attachments?: string;

    @Prop({ type: String })
    reactions?: FacebookReactionType[];

    @Prop({ type: String })
    comments?: string[];
}

export type PageDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
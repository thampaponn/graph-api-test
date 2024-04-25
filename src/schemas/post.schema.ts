import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { FacebookPostType, FacebookReactionType } from "src/facebook/entities/facebook-page-post.interface";

export class Post {
    @Prop()
    pageId: string;

    @Prop()
    postId: string;

    @Prop()
    postType: FacebookPostType;

    @Prop()
    message?: string;
    
    @Prop()
    created_time?: string;

    @Prop()
    attachments?: string;

    @Prop()
    reactions?: FacebookReactionType[];

    @Prop()
    comments?: string[];
}

export type PageDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
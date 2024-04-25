import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class Post {
    @Prop()
    pageId: string;

    @Prop()
    postId: string;

    @Prop()
    message?: string;
    
    @Prop()
    created_time?: string;

    @Prop()
    attachments?: string;

    @Prop()
    likes?: string[];

    @Prop()
    reactions?: string[];

    @Prop()
    insights?: string[];

    @Prop()
    comments?: string[];
}

export type PageDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
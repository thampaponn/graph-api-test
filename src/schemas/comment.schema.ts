import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class Comment {
    @Prop()
    commentId: string;

    @Prop()
    message: string;

    @Prop()
    created_time: string;

    @Prop()
    from: string;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
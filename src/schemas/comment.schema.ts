import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class Comment {
    @Prop({ type: String, index: true })
    commentId: string;

    @Prop({ type: String })
    message: string;

    @Prop()
    created_time: string;

    @Prop()
    from: string;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class Likes {
    @Prop()
    userId: string;

    @Prop()
    name: string;
}

export type LikesDocument = Likes & Document;
export const LikesSchema = SchemaFactory.createForClass(Likes);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType } from 'mongoose';
import { ILocation } from 'src/facebook/entities/facebook-page-post.interface';

@Schema({ timestamps: true })
export class Page {
    @Prop({ type: String, unique: true })
    pageId: string;

    @Prop()
    name: string;

    @Prop()
    singleLineAddress?: string;

    @Prop()
    description?: string;

    @Prop()
    bio?: string;

    @Prop()
    email?: string;

    @Prop({ type: Object })
    location?: ILocation;

    @Prop()
    likes: number;

    @Prop()
    postCount: number;
}

export type PageDocument = Page & Document;
export const PageSchema = SchemaFactory.createForClass(Page);
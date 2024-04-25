import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType } from 'mongoose';
import { ILocation } from 'src/facebook/entities/facebook-page-post.interface';

@Schema({ timestamps: true })
export class Page {
    @Prop({ type: String, unique: true })
    pageId: string;

    @Prop({ type: String })
    name: string;

    @Prop({ type: String })
    singleLineAddress?: string;

    @Prop({ type: String })
    description?: string;

    @Prop({ type: String })
    bio?: string;

    @Prop({ type: String })
    email?: string;

    @Prop({ type: Object })
    location?: ILocation;

    @Prop({ type: Number })
    likes: number;

    @Prop({ type: Number })
    postCount: number;
}

export type PageDocument = Page & Document;
export const PageSchema = SchemaFactory.createForClass(Page);
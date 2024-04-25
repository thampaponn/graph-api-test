import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Page {
    @Prop()
    pageId: string;

    @Prop()
    name: string;

    @Prop()
    post?: string[];

    @Prop()
    insights?: string[];

    @Prop()
    albums?: string[];

    @Prop()
    events?: string[];

    @Prop()
    feed?: string[];

    @Prop()
    picture: string;

    @Prop()
    videos?: string[];

    @Prop()
    live_videos?: string[];

    @Prop()
    single_line_address?: string;

    @Prop()
    description?: string;

    @Prop()
    bio?: string;

    @Prop()
    emails?: string;

    @Prop()
    location?: string;

    @Prop()
    likes: string;

    @Prop()
    postCount: string;
}

export type PageDocument = Page & Document;
export const PageSchema = SchemaFactory.createForClass(Page);
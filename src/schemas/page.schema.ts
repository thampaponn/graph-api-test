import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType } from 'mongoose';
import { ILocation } from 'src/facebook-page-post/entities/facebook-page-post.interface';

@Schema({ timestamps: true, versionKey: false})
export class Page {
    @Prop({ type: String, index: true })
    pageId: string;

    @Prop({ type: String, index: true })
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
}

export type PageDocument = Page & Document;
export const PageSchema = SchemaFactory.createForClass(Page);
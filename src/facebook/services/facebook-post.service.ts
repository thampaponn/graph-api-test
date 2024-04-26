import { HttpException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { FacebookPageQuery } from '../dto/facebook-page.dto';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/post.schema';
import { FacebookPostQuery } from '../dto/facebook-post.dto';

@Injectable()
export class FacebookPostService {
    private readonly logger = new Logger(FacebookPostService.name)
    constructor(
        protected readonly httpService: HttpService,
        @InjectModel(Post.name) private postModel: Model<Post>,
    ) { }

    async savePost(page: FacebookPageQuery) {
        const postsInfo = await this.getFacebookPagePosts(page);
        const pageId = page.pageId;
        const postId = postsInfo.map(post => post.id);
        const message = postsInfo.map(post => post.message);
        const created_time = postsInfo.map(post => post.created_time);
        const attachments = postsInfo.map(post => post.attachments);
        const reactions = postsInfo.map(post => post.reactions);
        const comments = postsInfo.map(post => post.comments);
        return await this.postModel.insertMany(postsInfo);
    }
// , attachments, reactions, comments
    async getFacebookPagePosts(query: FacebookPageQuery) {
        let allPosts = [];
        let url = `https://graph.facebook.com/${query.pageId}/posts`;

        while (url) {
            const axiosResponse = await axios.get(url, {
                params: {
                    fields: 'id, created_time, message, attachments, reactions, comments',
                    access_token: query.accessToken,
                    limit: 100
                }
            });

            const data = axiosResponse.data;
            allPosts = allPosts.concat(data.data);

            // check if next is null or not
            url = data.paging && data.paging.next ? data.paging.next : null;
        } while (url);

        return allPosts;
    }

    async getPostType(query: FacebookPostQuery) {
        const axiosResponse = await axios.get(`https://graph.facebook.com/${query.postId}`, {
            params: {
                fields: 'attachments',
                access_token: query.accessToken
            }
        });

        let type = axiosResponse.data.attachments;
        if (type.data[0].media.source) {
            type = 'video';
        } else if (type.data[0].media.image.src) {
            type = 'photo'
        } else {
            type = 'caption';
        }
        console.log(type);
        return type;
    }
}

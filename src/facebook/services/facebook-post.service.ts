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
        console.log(postsInfo);
        return await this.postModel.insertMany(postsInfo);
    }

    async getFacebookPagePosts(query: FacebookPageQuery) {
        let allPosts = [];
        let url = `https://graph.facebook.com/${query.pageId}/posts`;
        while (url) {
            const axiosResponse = await axios.get(url, {
                params: {
                    fields: 'id,created_time,message,attachments,reactions,comments',
                    access_token: query.accessToken,
                    limit: 100
                }
            });

            const data = axiosResponse.data;
            const result = data.data
            for (const post of result) {
                let type = 'caption';

                if (post.attachments && post.attachments.data.length > 0) {
                    const attachment = post.attachments.data[0];

                    if (attachment.media && attachment.media.source) {
                        type = 'video';
                    } else if (attachment.media && attachment.media.image && attachment.media.image.src) {
                        type = 'photo';
                    }
                }
                const reactionCounts = {};
                if (post.reactions && post.reactions.data.length > 0) {
                    for (const reaction of post.reactions.data) {
                        reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1;
                    }
                }

                post.pageId = query.pageId;
                post.postId = post.id
                post.postType = type;
                post.reactions = reactionCounts;
            }
            allPosts = allPosts.concat(result);

            url = data.paging && data.paging.next ? data.paging.next : null;
        } while (url);

        return allPosts;
    }
}

import { HttpException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { FacebookPageQuery } from '../dto/facebook-page.dto';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/post.schema';
import { FacebookPostQuery } from '../dto/facebook-post.dto';
import { access } from 'fs';
import { FacebookPostDate } from '../dto/facebook-post-date.dto';

@Injectable()
export class FacebookPostService {
    private readonly logger = new Logger(FacebookPostService.name)
    constructor(
        protected readonly httpService: HttpService,
        @InjectModel(Post.name) private postModel: Model<Post>,
    ) { }

    async savePost(page: FacebookPageQuery) {
        const postsInfo = await this.getFacebookPagePosts(page);
        return await this.postModel.insertMany(postsInfo);
    }

    async getFacebookPagePosts(query: FacebookPageQuery) {
        let allPosts = [];
        let url = `https://graph.facebook.com/${query.pageId}/posts`;
        while (url) {
            const axiosResponse = await axios.get(url, {
                params: {
                    fields: 'id,created_time,message,attachments,comments',
                    access_token: query.accessToken,
                    limit: 100
                }
            });
            const data = axiosResponse.data;
            const result = data.data;
            for (const post of result) {
                let reactionUrl = `https://graph.facebook.com/${post.id}/insights/post_reactions_by_type_total`;
                const axiosResponse = await axios.get(reactionUrl, {
                    params: {
                        access_token: query.accessToken,
                    }
                })
                const reactionData = axiosResponse.data;
                let clickedUrl = `https://graph.facebook.com/${post.id}/insights/post_clicks`;
                const clickedResponse = await axios.get(clickedUrl, {
                    params: {
                        access_token: query.accessToken,
                    }
                });
                const clickedData = clickedResponse.data;

                let type = 'caption';
                if (post.attachments && post.attachments.data.length > 0) {
                    const attachment = post.attachments.data[0].media ? post.attachments.data[0].media : post.attachments.data[0].subattachments.data[0].media;
                    if (attachment.media && attachment.media.source) {
                        type = 'video';
                    } else if (attachment.media && attachment.media.image && attachment.media.image.src) {
                        type = 'photo';
                    }
                }
                post.pageId = query.pageId;
                post.postId = post.id;
                post.postType = type;
                post.reactions = reactionData.data[0].values[0].value;
                post.postClicked = clickedData.data[0].values[0].value;
            }
            allPosts = allPosts.concat(result);
            url = data.paging && data.paging.next ? data.paging.next : null;
        }

        return allPosts;
    }

    async findPostByDate(query: FacebookPostDate) {
        return await this.postModel.find({
            pageId: { $in: query.pageId },
            created_time: {
                $gte: query.startDate,
                $lt: query.endDate
            }
        });
    }

}

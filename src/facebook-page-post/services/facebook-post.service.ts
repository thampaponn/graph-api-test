import { HttpException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { FacebookPageQuery } from '../dto/facebook-page.dto';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/post.schema';
import { FacebookPostQuery } from '../dto/facebook-post.dto';
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
        this.logger.debug('Posts info: ' + postsInfo)
        return await this.postModel.insertMany(postsInfo);
    }

    async getFacebookPagePosts(query: FacebookPageQuery) {
        let allPosts = [];
        let url = `https://graph.facebook.com/${query.pageId}/posts`;
        while (url) {
            const axiosResponse = await axios.get(url, {
                params: {
                    fields: 'id,created_time,message,attachments,comments,shares',
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
                post.comments = post.comments ? post.comments.data.length : 0;
                post.shares = post.shares ? post.shares.count : 0;
                post.postClicked = clickedData.data[0].values[0].value;
            }
            allPosts = allPosts.concat(result);
            url = data.paging && data.paging.next ? data.paging.next : null;
        }
        this.logger.debug('Posts info being return to another function: ' + allPosts)
        return allPosts;
    }

    async findPostByDate(query: FacebookPostDate) {
        this.logger.debug('Find all posts between 2 times: ' + query.pageId + ' ' + query.startDate + ' ' + query.endDate)
        return await this.postModel.find({
            pageId: { $in: query.pageId },
            created_time: {
                $gte: query.startDate,
                $lt: query.endDate
            }
        });
    }

    async getAllPostsId(query: FacebookPageQuery) {
        const posts = await this.postModel.find({ pageId: query.pageId });
        this.logger.debug('Posts info: ' + posts)
        return posts;
    }

    async updatePagePosts(query: FacebookPageQuery) {
        await this.postModel.deleteMany({ pageId: query.pageId });
        this.logger.debug('Post being updated: ' + query.pageId)
        return await this.savePost(query);
    }

    async deleteOnePost(query: FacebookPostQuery) {
        await this.postModel.findOneAndDelete({ postId: query.postId });
        this.logger.debug('Post being deleted: ' + query.postId)
        return `Deleted post with postId: ${query.postId} successfully`;
    }
}

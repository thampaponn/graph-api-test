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
        try {
            const postsInfo = await this.getFacebookPagePosts(page);
            this.logger.debug('Posts info: ' + postsInfo.length)
            return await this.postModel.insertMany(postsInfo);
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }

    async getFacebookPagePosts(query: FacebookPageQuery) {
        let allPosts = [];
        let url = `https://graph.facebook.com/${query.pageId}/posts`;
        while (url) {
            const axiosResponse = await axios.get(url, {
                params: {
                    fields: 'id,created_time,message,attachments{media,subattachments},comments,shares',
                    access_token: query.accessToken,
                    limit: 100
                }
            });
            const data = axiosResponse.data;
            const result = data.data;
            for (const post of result) {
                let type = 'caption';
                if (post.attachments && post.attachments.data.length > 0) {
                    for (let attachmentData of post.attachments.data) {
                        let media = attachmentData.media || (attachmentData.subattachments ? attachmentData.subattachments.data[0].media : null);
                        if (media) {
                            if (media.source) {
                                type = 'video';
                                break;
                            } else if (media.image && media.image.src) {
                                type = 'photo';
                                break;
                            }
                        }
                    }
                }
                post.pageId = query.pageId;
                post.postId = post.id;
                post.postType = type;
                post.reactions = await this.getPostReactions(post.id, query.accessToken);
                post.comments = post.comments ? post.comments.data.length : 0;
                post.shares = post.shares ? post.shares.count : 0;
                post.postClicked = await this.getPostClicks(post.id, query.accessToken);
                post.postImpressions = await this.getPostImpressions({ postId: post.id, accessToken: query.accessToken });
                post.postImpressionsUnique = await this.getPostImpressionsUnique({ postId: post.id, accessToken: query.accessToken });
                post.postImpressionsPaid = await this.getPostImpressionsPaid({ postId: post.id, accessToken: query.accessToken });
                post.postImpressionsPaidUnique = await this.getPostImpressionsPaidUnique({ postId: post.id, accessToken: query.accessToken });
                post.postImpressionsOrganic = await this.getPostImpressionsOrganic({ postId: post.id, accessToken: query.accessToken });
                post.postImpressionsOrganicUnique = await this.getPostImpressionsOrganicUnique({ postId: post.id, accessToken: query.accessToken });
                post.postVideoViews15s = await this.getPostVideoViews15s({ postId: post.id, accessToken: query.accessToken });
                post.postVideoCompletedViews = await this.getPostVideoCompletedViews({ postId: post.id, accessToken: query.accessToken });
                post.postVideoAvgTime = await this.getPostVideoAvgTime({ postId: post.id, accessToken: query.accessToken });
                post.postVideoViews60s = await this.getPostVideoViews60s({ postId: post.id, accessToken: query.accessToken });
            }
            allPosts = allPosts.concat(result);
            url = data.paging && data.paging.next ? data.paging.next : null;
        }
        this.logger.debug('Posts info being return to another function: ' + JSON.stringify(allPosts));
        return allPosts;
    }

    async getPostImpressions(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_impressions',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postImpressions = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressions)
        return postImpressions.data
    }

    async getPostImpressionsUnique(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_impressions_unique',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postImpressionsUnique = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressionsUnique)
        return postImpressionsUnique.data
    }

    async getPostImpressionsPaid(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_impressions_paid',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postImpressions = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressions)
        return postImpressions.data
    }

    async getPostImpressionsPaidUnique(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_impressions_paid_unique',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postImpressionsUnique = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressionsUnique)
        return postImpressionsUnique.data
    }

    async getPostImpressionsOrganic(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_impressions_organic',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postImpressions = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressions)
        return postImpressions.data
    }

    async getPostImpressionsOrganicUnique(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_impressions_organic_unique',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postImpressionsUnique = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressionsUnique)
        return postImpressionsUnique.data
    }

    async getPostVideoViews15s(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_video_views_15s',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postVideoViews15s = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postVideoViews15s)
        return postVideoViews15s.data
    }

    async getPostVideoCompletedViews(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_video_complete_views_organic',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postVideoCompletedViews = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postVideoCompletedViews)
        return postVideoCompletedViews.data
    }

    async getPostVideoAvgTime(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_video_avg_time_watched',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postVideoAvgTime = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postVideoAvgTime)
        return postVideoAvgTime.data
    }

    async getPostVideoViews60s(query: FacebookPostQuery) {
        const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.postId}/insights`, {
            params: {
                metric: 'post_video_views_60s_excludes_shorter',
                // date_preset: query?.datePreset,
                period: 'lifetime',
                // since: query?.since,
                // until: query?.until,
                access_token: query?.accessToken
            }
        })
        const postVideoViews60s = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postVideoViews60s)
        return postVideoViews60s.data
    }

    async getPostReactions(postId: string, accessToken: string) {
        const url = `https://graph.facebook.com/${postId}/insights/post_reactions_by_type_total`;
        const response = await axios.get(url, {
            params: { access_token: accessToken }
        });
        return response.data.data[0].values[0].value;
    }

    async getPostClicks(postId: string, accessToken: string) {
        const url = `https://graph.facebook.com/${postId}/insights/post_clicks`;
        const response = await axios.get(url, {
            params: { access_token: accessToken }
        });
        return response.data.data[0].values[0].value;
    }


    async findPostByDate(query: FacebookPostDate) {
        try {
            this.logger.debug('Find all posts between 2 times: ' + query.pageId + ' ' + query.startDate + ' ' + query.endDate)
            return await this.postModel.find({
                pageId: { $in: query.pageId },
                created_time: {
                    $gte: query.startDate,
                    $lt: query.endDate
                }
            });
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }

    async getAllPostsId(query: FacebookPageQuery) {
        try {
            const posts = await this.postModel.find({ pageId: query.pageId });
            this.logger.debug('Posts info: ' + posts)
            return posts;
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }

    async updatePagePosts(query: FacebookPageQuery) {
        try {
            await this.postModel.deleteMany({ pageId: query.pageId });
            this.logger.debug('Post being updated: ' + query.pageId)
            return await this.savePost(query);
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }

    async deleteOnePost(query: FacebookPostQuery) {
        try {
            await this.postModel.findOneAndDelete({ postId: query.postId });
            this.logger.debug('Post being deleted: ' + query.postId)
            return `Deleted post with postId: ${query.postId} successfully`;
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }
}

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
        let start = Date.now();
        try {
            const postsInfo = await this.getFacebookPagePosts(page);
            this.logger.debug('Posts info: ' + postsInfo.length)
            let timeTaken = Date.now() - start;
            console.log("Total time taken : " + timeTaken / 1000 + " seconds");
            return await this.postModel.insertMany(postsInfo);
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }

    async getFacebookPagePosts(query: FacebookPageQuery) {
        let date = new Date();
        date.setMonth(date.getMonth() - 3);
        let today = new Date(date).toISOString().slice(0, 19) + "+0000";
        let allPosts = [];
        let url = `https://graph.facebook.com/${query.pageId}/posts`;
        while (url) {
            const axiosResponse = await axios.get(url, {
                params: {
                    since: today,
                    fields: 'id,created_time,message,attachments{media,subattachments},comments,shares',
                    access_token: query.accessToken,
                    limit: 100
                }
            });
            const data = axiosResponse.data;
            const posts = data.data;

            const postsInsights = await Promise.all(posts.map(async (post) => {
                post.pageId = query.pageId;
                post.postId = post.id;
                post.postType = this.getPostType(post);
                post.reactions = await this.getPostReactions({ postId: post.id, accessToken: query.accessToken });
                post.comments = post.comments ? post.comments.data.length : 0;
                post.shares = post.shares ? post.shares.count : 0;
                const metrics = await Promise.all([
                    this.getPostClicks({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostImpressions({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostImpressionsUnique({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostImpressionsPaid({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostImpressionsPaidUnique({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostImpressionsOrganic({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostImpressionsOrganicUnique({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostVideoViews15s({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostVideoCompletedViews({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostVideoAvgTime({ postId: post.id, accessToken: query.accessToken }),
                    this.getPostVideoViews60s({ postId: post.id, accessToken: query.accessToken }),
                ]);
                [post.postClicked, post.postImpressions, post.postImpressionsUnique, post.postImpressionsPaid, post.postImpressionsPaidUnique, post.postImpressionsOrganic, post.postImpressionsOrganicUnique, post.postVideoAvgTime, post.postVideoCompletedViews, post.postVideoViews15s, post.postVideoViews60s] = metrics;
                let like = post.reactions.like ? post.reactions.like : 0;
                let love = post.reactions.love ? post.reactions.love : 0;
                let care = post.reactions.care ? post.reactions.care : 0;
                let haha = post.reactions.haha ? post.reactions.haha : 0;
                let wow = post.reactions.wow ? post.reactions.wow : 0;
                let sad = post.reactions.sad ? post.reactions.sad : 0;
                let angry = post.reactions.angry ? post.reactions.angry : 0;
                let comments = post.comments ? post.comments : 0;
                let shares = post.shares ? post.shares : 0;
                let impressions = metrics[1]
                post.engagementRate = (((like + love + care + haha + wow + sad + angry + comments + shares) * 100) / impressions) ? (((like + love + care + haha + wow + sad + angry + comments + shares) * 100) / impressions) : 0;
                return post;
            }));

            allPosts = allPosts.concat(postsInsights);
            url = data.paging && data.paging.next ? data.paging.next : null;
        }
        return allPosts;
    }

    getPostType(post) {
        if (post.attachments && post.attachments.data.length > 0) {
            for (let attachment of post.attachments.data) {
                let media = attachment.media || (attachment.subattachments ? attachment.subattachments.data[0].media : null);
                if (media && media.source) {
                    return 'video';
                } else if (media && media.image && media.image.src) {
                    return 'photo';
                }
            }
        }
        return 'caption';
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
        return postImpressions.data[0].values[0].value
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
        return postImpressionsUnique.data[0].values[0].value
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
        const postImpressionsPaid = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressionsPaid)
        return postImpressionsPaid.data[0].values[0].value
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
        const postImpressionsPaidUnique = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressionsPaidUnique)
        return postImpressionsPaidUnique.data[0].values[0].value
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
        const postImpressionsOrganic = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressionsOrganic)
        return postImpressionsOrganic.data[0].values[0].value
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
        const postImpressionsOrganicUnique = axiosResponse.data
        this.logger.debug('Facebook insights fetched: ' + postImpressionsOrganicUnique)
        return postImpressionsOrganicUnique.data[0].values[0].value
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

    async getPostReactions(query: FacebookPostQuery) {
        const url = `https://graph.facebook.com/${query.postId}/insights/post_reactions_by_type_total`;
        const reactions = await axios.get(url, {
            params: { access_token: query.accessToken }
        });
        return reactions.data.data[0].values[0].value;
    }

    async getPostClicks(query: FacebookPostQuery) {
        const url = `https://graph.facebook.com/${query.postId}/insights/post_clicks`;
        const postClicks = await axios.get(url, {
            params: { access_token: query.accessToken }
        });
        return postClicks.data.data[0].values[0].value;
    }


    async findPostByDate(query: FacebookPostDate) {
        let start = Date.now();
        try {
            this.logger.debug('Find all posts between 2 times: ' + query.pageId + ' ' + query.startDate + ' ' + query.endDate)
            let timeTaken = Date.now() - start;
            console.log("Total time taken : " + timeTaken / 1000 + " seconds");
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
        let start = Date.now();
        try {
            const posts = await this.postModel.find({ pageId: query.pageId });
            this.logger.debug('Posts info: ' + posts)
            let timeTaken = Date.now() - start;
            console.log("Total time taken : " + timeTaken / 1000 + " seconds");
            return posts;
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }

    async updatePagePosts(query: FacebookPageQuery) {
        let start = Date.now();
        try {
            await this.postModel.deleteMany({ pageId: query.pageId });
            this.logger.debug('Post being updated: ' + query.pageId)
            let timeTaken = Date.now() - start;
            console.log("Total time taken : " + timeTaken / 1000 + " seconds");
            return await this.savePost(query);
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }

    async deleteOnePost(query: FacebookPostQuery) {
        let start = Date.now();
        try {
            await this.postModel.findOneAndDelete({ postId: query.postId });
            this.logger.debug('Post being deleted: ' + query.postId)
            let timeTaken = Date.now() - start;
            console.log("Total time taken : " + timeTaken / 1000 + " seconds");
            return `Deleted post with postId: ${query.postId} successfully`;
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }
}

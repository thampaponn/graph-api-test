import { HttpException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { FacebookPageQuery } from '../dto/facebook-page.dto';
import { HttpService } from "@nestjs/axios";
import { InjectModel } from '@nestjs/mongoose';
import { Page } from 'src/schemas/page.schema';
import { Model } from 'mongoose';

@Injectable()
export class FacebookPageService {
  private readonly logger = new Logger(FacebookPageService.name)
  constructor(
    protected readonly httpService: HttpService,
    @InjectModel(Page.name) private pageModel: Model<Page>,
  ) { }
  //Token
  async getAccessToken(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}`, {
      params: {
        fields: 'access_token',
        access_token: query.accessToken
      }
    })
    const facebookResponse = axiosResponse.data
    this.logger.debug('Access Token: ' + facebookResponse)
    return facebookResponse
  }
  //Post
  async savePage(query: FacebookPageQuery) {
    const pageInfo = await this.getFacebookPage(query)
    const pageId = pageInfo.id
    const pageName = pageInfo.name
    const pageSingleLineAddress = await this.getSingleLineAddress(query)
    const pageDescription = await this.getPageDescription(query)
    const pageBio = await this.getPageBio(query)
    const pageEmails = await this.getPageEmails(query)
    const pageLocation = await this.getPageLocation(query)

    const result = { pageId: pageId, name: pageName, singleLineAddress: pageSingleLineAddress.single_line_address, description: pageDescription.description, bio: pageBio.bio, email: pageEmails.emails[0], location: pageLocation.location }
    this.logger.debug('Page info: ' + result)
    return await this.pageModel.create(result)
  }

  //Patch
  async updatePage(query: FacebookPageQuery) {
    const page = await this.pageModel.findOne({ pageId: query.pageId })
    if (!page) {
      throw new HttpException('Page not found', 404)
    }
    const pageInfo = await this.getFacebookPage(query)
    const pageName = pageInfo.name
    const pageSingleLineAddress = await this.getSingleLineAddress(query)
    const pageDescription = await this.getPageDescription(query)
    const pageBio = await this.getPageBio(query)
    const pageEmails = await this.getPageEmails(query)
    const pageLocation = await this.getPageLocation(query)
    const result = { name: pageName, singleLineAddress: pageSingleLineAddress.single_line_address, description: pageDescription.description, bio: pageBio.bio, email: pageEmails.emails[0], location: pageLocation.location }
    this.logger.debug('Updated page info: ' + result)
    await this.pageModel.updateOne({ pageId: query.pageId }, result)
    return `Page with id ${query.pageId} updated successfully`
  }

  //Delete
  async deletePage(query: FacebookPageQuery) {
    const page = await this.pageModel.findOne({ pageId: query.pageId })
    if (!page) {
      throw new HttpException('Page not found', 404)
    }
    await this.pageModel.deleteOne({ pageId: query.pageId })
    this.logger.debug(query.pageId + ' deleted successfully')
    return `Page with id ${query.pageId} deleted successfully`
  }

  //Get
  async getAllPages() {
    const pages = await this.pageModel.find()
    this.logger.debug(pages + 'info fetched successfully')
    return pages
  }

  async findById(query: FacebookPageQuery) {
    const page = await this.pageModel.findOne({ pageId: query.pageId })
    if (!page) {
      throw new HttpException('Page not found', 404)
    }
    this.logger.debug('Find by pageId: ' + page)
    return page
  }

  async getPageLocation(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}`, {
      params: {
        fields: 'location',
        access_token: query.accessToken
      }
    })
    const location = axiosResponse.data
    this.logger.debug('Location: ' + location)
    return location
  }

  async getPageEmails(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}`, {
      params: {
        fields: 'emails',
        access_token: query.accessToken
      }
    })
    const emails = axiosResponse.data
    this.logger.debug('Emails: ' + emails)
    return emails
  }

  async getPageBio(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}`, {
      params: {
        fields: 'bio',
        access_token: query.accessToken
      }
    })
    const bio = axiosResponse.data
    this.logger.debug('Bio: ' + bio)
    return bio
  }

  async getPageDescription(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}`, {
      params: {
        fields: 'description',
        access_token: query.accessToken
      }
    })
    const description = axiosResponse.data
    this.logger.debug('Description: ' + description)
    return description
  }

  async getSingleLineAddress(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}`, {
      params: {
        fields: 'single_line_address',
        access_token: query.accessToken
      }
    })
    const singleLineAddress = axiosResponse.data
    this.logger.debug('Single Line Address: ' + singleLineAddress)
    return singleLineAddress
  }

  async getPageEvents(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/events`, {
      params: {
        access_token: query.accessToken
      }
    })
    const events = axiosResponse.data
    this.logger.debug('Events: ' + events)
    return events
  }

  async getPageAlbums(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}/albums`, {
      params: {
        access_token: query.accessToken
      }
    })
    const albums = axiosResponse.data
    this.logger.debug('Albums: ' + albums)
    return albums
  }

  async getFacebookPage(query: FacebookPageQuery) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${query.pageId}`, {
      params: {
        access_token: query.accessToken
      }
    })
    const pageInformation = axiosResponse.data
    this.logger.debug('Page Information: ' + pageInformation)
    return pageInformation
  }

  async getFacebookPostComments(postId: string, accessToken: string) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${postId}/comments`, {
      params: {
        access_token: accessToken
      }
    })
    const facebookResponse = axiosResponse.data
    this.logger.debug('Comments: ' + facebookResponse)
    return facebookResponse
  }

  async getFacebookPostLikes(postId: string, accessToken: string) {
    const axiosResponse = await this.httpService.axiosRef.get(`https://graph.facebook.com/${postId}/likes`, {
      params: {
        access_token: accessToken
      }
    })
    const facebookResponse = axiosResponse.data
    this.logger.debug('Posts Likes: ' + facebookResponse)
    return facebookResponse
  }

  async getFacebookPostReactions(postId: string, accessToken: string) {
    let allReactions = [];
    let url = `https://graph.facebook.com/${postId}/reactions`;

    while (url) {
      const axiosResponse = await axios.get(url, {
        params: {
          fields: 'id,name,type',
          access_token: accessToken,
          limit: 100
        }
      });

      const data = axiosResponse.data;
      allReactions = allReactions.concat(data.data);

      // check if next is null or not
      url = data.paging && data.paging.next ? data.paging.next : null;
    } while (url);
    this.logger.debug('All Reactions: ' + allReactions)
    return allReactions.length;
  }

}

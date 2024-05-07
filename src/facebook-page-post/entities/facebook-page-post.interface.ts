export interface FacebookReactionType {
    like: number;
    love: number;
    care: number;
    wow: number;
    haha: number;
    sad: number;
    angry: number;
}

export interface IPage {
    pageId: string;
    name: string;
    events?: string[];
    singleLineAddress?: string;
    description?: string;
    bio?: string;
    emails?: string;
    location?: string;
    likes: number;
    postCount: number;
}

export interface IPost {
    pageid: string;
    postId: string;
    message?: string;
    created_time: string;
    attachments?: string[];
    postType: string;
    reactions: FacebookReactionType;
    comments: string[];
}

export interface IComment {
    postId: string;
    commentId: string;
    name: string;
    message: string;
    created_time: string;
}

export interface IReaction {
    userId: string;
    name: string;
    reactionType: FacebookReactionType;
}

export interface ILocation {
    city: string;
    country: string;
    latitude: number;
    longtitude: number;
    street: string;
    zip: string;
}


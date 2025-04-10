type PostPayloadType = {
    content: string;
    image?: string;
    user_id: string; 
};

type PostType = {
    content:string;
    image?:string;
    created_at:string;
    reply_count:number;
    likes_count:number;
    users: any;
};

type UserType = {
    id:string;
    name:string;
    username:string;
    profile_image:string;
};
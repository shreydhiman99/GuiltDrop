type PostPayloadType = {
    content: string;
    image?: string;
    user_id: string; 
};

type PostType = {
    comments: CommentType[]; // Array of comments associated with the post
    post_id: number;
    user_id: string;
    content: string;
    image?: string;
    name: string;
    username: string;
    email: string;
    profile_image: string;
    reply_count: number; // Number of comments on the post
    likes_count: number; // Number of likes on the post
    created_at: string;
    liked: boolean; // Whether the post is liked by the current user
};

type CommentType = {
    id: number; // Unique ID for the comment
    post_id: number; // ID of the post the comment belongs to
    user_id: string; // ID of the user who made the comment
    content: string; // Content of the comment
    created_at: string; // Timestamp of when the comment was created
    username: string; // Username of the commenter
    profile_image?: string; // Profile image of the commenter (optional)
};

type UserType = {
    id: string;
    name: string;
    username: string;
    profile_image: string;
};
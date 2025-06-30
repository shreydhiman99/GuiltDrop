type PostPayloadType = {
    content: string;
    user_id: string;
    image?: string;
    video?: string;
};

type PostType = {
    post_id: number;         // Maps to p.id from function
    user_id: string;
    content: string;
    image?: string | null;
    video?: string | null;
    created_at: string;
    likes_count: number;
    reply_count: number;
    username: string;
    name: string;
    profile_image?: string | null;
    liked?: boolean;
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
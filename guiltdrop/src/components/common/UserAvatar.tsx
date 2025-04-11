import React from 'react';

interface UserAvatarProps {
  name: string;
  image: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, image }) => {
  return (
    <div className="flex items-center">
      <img
        src={image || 'default-avatar.png'} // Fallback to a default avatar if no image is provided
        alt={name}
        className="w-10 h-10 rounded-full"
      />
      <span className="ml-2 text-sm font-semibold">{name}</span>
    </div>
  );
};

export default UserAvatar;
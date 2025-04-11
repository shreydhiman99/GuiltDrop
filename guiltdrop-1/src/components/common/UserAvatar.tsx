import React from 'react';

interface UserAvatarProps {
  name: string;
  image: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, image }) => {
  return (
    <div className="flex items-center">
      <img
        src={image}
        alt={name}
        className="w-10 h-10 rounded-full border border-gray-300"
      />
      <span className="ml-2 text-sm font-semibold">{name}</span>
    </div>
  );
};

export default UserAvatar;
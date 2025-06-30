import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar({
  name,
  image,
  width = 3,
  height = 3,
}: {
  name?: string;
  image?: string;
  width?: number;
  height?: number;
}) {
  // Debug logging for UserAvatar
  // console.log("UserAvatar Debug:", {
  //   name,
  //   image,
  //   hasImage: !!image,
  //   imageLength: image?.length,
  //   width,
  //   height,
  // });

  return (
    <Avatar style={{ width: `${width}rem`, height: `${height}rem` }}>
      <AvatarImage
        src={image}
        onError={(e) => {
          console.error("UserAvatar - Image failed to load:", image);
          console.error("Error details:", e);
        }}
        onLoad={() => {
          console.log("UserAvatar - Image loaded successfully:", image);
        }}
      />
      <AvatarFallback className="text-xl font-bold">
        {name ? name[0].toUpperCase() : "?"}
      </AvatarFallback>
    </Avatar>
  );
}

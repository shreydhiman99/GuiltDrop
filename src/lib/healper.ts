import Env from "@/Env"
import momemt from "moment"
export const getS3Url = (path: string): string => {
  // If the path is already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Otherwise, construct the S3 URL
  return `https://aamchipirkycsdyxrfkf.supabase.co/storage/v1/object/public/guiltdrop/${path}`;
}

export const formatDate = (date: string) => {
    return momemt(date).fromNow()
}
import Env from "@/Env"
import momemt from "moment"
export const getS3Url = (path: string) => {
    return `${Env.SUAPABASE_URL}/storage/v1/object/public/${Env.S3_BUCKET}/${path}`}

export const formatDate = (date: string) => {
    return momemt(date).fromNow()
}
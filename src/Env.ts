class Env{
    static SUAPABASE_URL:string = process.env.NEXT_PUBLIC_SUPABASE_URL!
    static S3_BUCKET:string = process.env.NEXT_PUBLIC_S3_BUCKET as string
}

export default Env
import { supabase, supabaseAdmin } from '../configs/supabase-config.js'

export const uploadHelper = {
    uploadFile: async (file, bucket = 'medicare', folderName) => {
        try {
            if (!file || !folderName) return null

            const fileExt = file.originalname.split('.').pop()
            const fileName = `${Date.now()}.${fileExt}`
            const filePath = `${folderName}/${fileName}`
            
            const client = supabaseAdmin || supabase;

            const { _ , error } = await client.storage
                .from(bucket)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true // Cho phép ghi đè nếu trùng tên
                })

            if (error) { 
                throw error
            }

            const { data: publicUrlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            return publicUrlData.publicUrl
        } catch (error) {
            console.error('Lỗi Upload Helper:', error.message)
            throw Object.assign(new Error('Không thể upload ảnh lên hệ thống.'), { statusCode: 500 })
        }
    },

    deleteFile: async (url, bucket = 'medicare') => {
        try {
            if (!url) return

            const urlParts = url.split(`${bucket}/`)
            if (urlParts.length < 2) return
            const filePath = urlParts[1]
            
            const client = supabaseAdmin || supabase;

            const { error } = await client.storage
                .from(bucket)
                .remove([filePath])

            if (error) throw error
        } catch (error) {
            console.error('Lỗi Delete Helper:', error.message)
        }
    }
}
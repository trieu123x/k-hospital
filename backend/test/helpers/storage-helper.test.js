import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadHelper } from '@/helpers/storage-helper.js'
import { supabase } from '@/configs/supabase-config.js'

// 1. Mock toàn bộ thư viện supabase-config
vi.mock('@/configs/supabase-config.js', () => ({
  supabase: {
    storage: {
      from: vi.fn()
    }
  }
}))

describe('uploadHelper', () => {
  beforeEach(() => {
    vi.clearAllMocks() 
  })

  describe('uploadFile', () => {
    it('nên trả về null nếu không có file hoặc folderName', async () => {
      const result = await uploadHelper.uploadFile(null, 'medicare', '')
      expect(result).toBeNull()
    })

    it('nên throw error 500 khi upload thất bại', async () => {
      const mockFile = { originalname: 'avatar.png', buffer: Buffer.from(''), mimetype: 'image/png' }
      
      // Giả lập luồng Supabase trả về lỗi
      const mockUpload = vi.fn().mockResolvedValue({ error: new Error('Storage link broken') })
      supabase.storage.from.mockReturnValue({ upload: mockUpload })

      await expect(uploadHelper.uploadFile(mockFile, 'medicare', 'avatars'))
        .rejects.toThrow('Không thể upload ảnh lên hệ thống.')
    })

    it('nên trả về publicUrl khi upload thành công', async () => {
      const mockFile = { originalname: 'test.jpg', buffer: Buffer.from(''), mimetype: 'image/jpeg' }
      const mockPublicUrl = 'https://supabase.co/medicare/avatars/test.jpg'

      // Mock chuỗi hàm .from().upload() và .from().getPublicUrl()
      const storageMethods = {
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } })
      }
      supabase.storage.from.mockReturnValue(storageMethods)

      const result = await uploadHelper.uploadFile(mockFile, 'medicare', 'avatars')
      
      expect(result).toBe(mockPublicUrl)
      expect(storageMethods.upload).toHaveBeenCalled()
    })
  })

  describe('deleteFile', () => {
    it('nên tách đúng filePath và gọi hàm remove', async () => {
      const mockUrl = 'https://abc.supabase.co/storage/v1/object/public/medicare/doctors/doc-123.png'
      const removeSpy = vi.fn().mockResolvedValue({ error: null })
      
      supabase.storage.from.mockReturnValue({ remove: removeSpy })

      await uploadHelper.deleteFile(mockUrl, 'medicare')

      // Kiểm tra xem nó có cắt được phần 'doctors/doc-123.png' không
      expect(removeSpy).toHaveBeenCalledWith(['doctors/doc-123.png'])
    })
  })
})
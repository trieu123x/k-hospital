import { describe, it, expect, vi, beforeEach } from 'vitest'
import { diseaseService } from '@/services/disease.js'
import { diseaseRepository } from '@/repositories/disease.js'
import { uploadHelper } from '@/helpers/storage-helper.js'

// Mock tất cả dependencies
vi.mock('@/repositories/disease.js', () => ({
  diseaseRepository: {
    create: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findWithFilter: vi.fn(),
    findSimilarDiseases: vi.fn()
  }
}))

vi.mock('@/helpers/storage-helper.js', () => ({
  uploadHelper: {
    uploadFile: vi.fn(),
    deleteFile: vi.fn()
  }
}))

describe('diseaseService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createDisease', () => {
    it('nên upload ảnh và gán imageUrl nếu có file truyền vào', async () => {
      const mockData = { name: 'Sốt xuất huyết' }
      const mockFile = { originalname: 'hinh.png' }
      const mockUrl = 'http://supabase.com/hinh.png'

      uploadHelper.uploadFile.mockResolvedValue(mockUrl)
      diseaseRepository.create.mockResolvedValue({ id: 1, ...mockData, imageUrl: mockUrl })

      const result = await diseaseService.createDisease(mockData, mockFile)

      expect(uploadHelper.uploadFile).toHaveBeenCalledWith(mockFile, 'medicare', 'diseases')
      expect(result.imageUrl).toBe(mockUrl)
      expect(diseaseRepository.create).toHaveBeenCalledWith(expect.objectContaining({ imageUrl: mockUrl }))
    })
  })

  describe('updateDisease', () => {
    it('nên xóa ảnh cũ trước khi upload ảnh mới nếu bệnh đã có ảnh', async () => {
      const id = 1
      const mockData = { name: 'Sốt siêu vi' }
      const mockFile = { originalname: 'moi.png' }
      const existingDisease = { id, imageUrl: 'http://old-url.com' }

      diseaseRepository.findById.mockResolvedValue(existingDisease)
      uploadHelper.uploadFile.mockResolvedValue('http://new-url.com')

      await diseaseService.updateDisease(id, mockData, mockFile)

      // Kiểm tra xem có gọi xóa ảnh cũ không
      expect(uploadHelper.deleteFile).toHaveBeenCalledWith(existingDisease.imageUrl, 'medicare')
      // Kiểm tra xem có upload ảnh mới không
      expect(uploadHelper.uploadFile).toHaveBeenCalledWith(mockFile, 'medicare', 'diseases')
      expect(diseaseRepository.update).toHaveBeenCalled()
    })
  })

  describe('deleteDisease', () => {
    it('nên gọi deleteFile nếu bệnh cần xóa có chứa imageUrl', async () => {
      const id = 10
      const existing = { id: 10, imageUrl: 'to-be-deleted.jpg' }
      
      diseaseRepository.findById.mockResolvedValue(existing)

      await diseaseService.deleteDisease(id)

      expect(uploadHelper.deleteFile).toHaveBeenCalledWith('to-be-deleted.jpg', 'medicare')
      expect(diseaseRepository.delete).toHaveBeenCalledWith(id)
    })
  })

  describe('diagnoseBySymptoms', () => {
    it('nên ném lỗi nếu người dùng không nhập triệu chứng', async () => {
      await expect(diseaseService.diagnoseBySymptoms(null))
        .rejects.toThrow('Vui lòng nhập triệu chứng!')
    })
  })
})
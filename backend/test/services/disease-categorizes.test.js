import { describe, it, expect, vi, beforeEach } from 'vitest'
import { diseaseCategoryService } from '@/services/disease-categorizes.js'
import { diseaseCategoryRepository } from '@/repositories/disease-categorizes.js'

// 1. Mock Repository
vi.mock('@/repositories/disease-categorizes.js', () => ({
  diseaseCategoryRepository: {
    findAll: vi.fn(),
    findById: vi.fn()
  }
}))

describe('diseaseCategoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllCategories', () => {
    it('nên trả về danh sách categories đã được format', async () => {
      const mockData = [
        { id: 1, name: 'Tim mạch', description: 'Bệnh tim', createdAt: new Date() },
        { id: 2, name: 'Hô hấp', description: 'Bệnh phổi', updatedAt: new Date() }
      ]
      diseaseCategoryRepository.findAll.mockResolvedValue(mockData)

      const result = await diseaseCategoryService.getAllCategories()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ id: 1, name: 'Tim mạch', description: 'Bệnh tim' })
      expect(diseaseCategoryRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('nên throw lỗi 500 nếu repository trả về null', async () => {
      diseaseCategoryRepository.findAll.mockResolvedValue(null)

      await expect(diseaseCategoryService.getAllCategories())
        .rejects.toThrow('Lấy danh mục bệnh thất bại')
    })
  })

  describe('getCategoryById', () => {
    it('nên trả về một category cụ thể khi tìm thấy ID', async () => {
      const mockCategory = { id: 99, name: 'Nội tiết', description: 'Tiểu đường' }
      diseaseCategoryRepository.findById.mockResolvedValue(mockCategory)

      const result = await diseaseCategoryService.getCategoryById(99)

      expect(result.name).toBe('Nội tiết')
      expect(diseaseCategoryRepository.findById).toHaveBeenCalledWith(99)
    })

    it('nên throw lỗi 404 khi không tìm thấy ID', async () => {
      diseaseCategoryRepository.findById.mockResolvedValue(null)

      try {
        await diseaseCategoryService.getCategoryById(123)
      } catch (error) {
        expect(error.statusCode).toBe(404)
        expect(error.message).toBe('Danh mục bệnh ID 123 không tồn tại')
      }
    })
  })
})
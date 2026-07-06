import { describe, it, expect, vi, beforeEach } from 'vitest'
import { medicineService } from '@/services/medicine.js'
import { medicineRepository } from '@/repositories/medicine.js'

vi.mock('@/configs/supabase-config.js', () => ({
  supabase: {},
  supabaseAdmin: {}
}))

vi.mock('@/repositories/medicine.js', () => ({
  medicineRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

vi.mock('axios', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { chunks: [] } })
  }
}))

describe('medicineService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllMedicines', () => {
    it('should calculate pagination and return data (no filters)', async () => {
      medicineRepository.findAll.mockResolvedValue({ medicines: [{ id: 1 }], total: 15 })
      const res = await medicineService.getAllMedicines({}, 2, 10)
      expect(res.medicines).toHaveLength(1)
      expect(res.pagination.totalItems).toBe(15)
      expect(res.pagination.totalPages).toBe(2)
      expect(medicineRepository.findAll).toHaveBeenCalledWith({}, 10, 10)
    })

    it('should filter by name', async () => {
      medicineRepository.findAll.mockResolvedValue({ medicines: [{ id: 2, name: 'Paracetamol' }], total: 1 })
      const res = await medicineService.getAllMedicines({ name: 'para' }, 1, 10)
      expect(res.medicines).toHaveLength(1)
      expect(res.medicines[0].name).toBe('Paracetamol')
      expect(medicineRepository.findAll).toHaveBeenCalledWith({ name: 'para' }, 0, 10)
    })

    it('should filter by medicineType', async () => {
      medicineRepository.findAll.mockResolvedValue({ medicines: [{ id: 3, medicineType: 'uống' }], total: 1 })
      const res = await medicineService.getAllMedicines({ medicineType: 'uống' }, 1, 10)
      expect(res.medicines).toHaveLength(1)
      expect(medicineRepository.findAll).toHaveBeenCalledWith({ medicineType: 'uống' }, 0, 10)
    })

    it('should filter by both name and medicineType', async () => {
      medicineRepository.findAll.mockResolvedValue({ medicines: [{ id: 4 }], total: 1 })
      const res = await medicineService.getAllMedicines({ name: 'amox', medicineType: 'tiêm' }, 1, 10)
      expect(res.medicines).toHaveLength(1)
      expect(medicineRepository.findAll).toHaveBeenCalledWith({ name: 'amox', medicineType: 'tiêm' }, 0, 10)
    })

    it('should return empty list when no medicine matches', async () => {
      medicineRepository.findAll.mockResolvedValue({ medicines: [], total: 0 })
      const res = await medicineService.getAllMedicines({ name: 'không tồn tại' }, 1, 10)
      expect(res.medicines).toHaveLength(0)
      expect(res.pagination.totalItems).toBe(0)
      expect(res.pagination.totalPages).toBe(0)
    })
  })

  describe('getMedicineById', () => {
    it('should throw if not found', async () => {
      medicineRepository.findById.mockResolvedValue(null)
      await expect(medicineService.getMedicineById(1)).rejects.toThrow('Không tìm thấy thuốc')
    })

    it('should return medicine info', async () => {
      medicineRepository.findById.mockResolvedValue({ id: 1, name: 'Paracetamol' })
      const res = await medicineService.getMedicineById(1)
      expect(res.name).toBe('Paracetamol')
    })
  })

  describe('createMedicine', () => {
    it('should create medicine', async () => {
      medicineRepository.create.mockResolvedValue({ id: 1 })
      const res = await medicineService.createMedicine({ name: 'Med' })
      expect(res.id).toBe(1)
    })
  })

  describe('updateMedicine', () => {
    it('should update medicine', async () => {
      medicineRepository.update.mockResolvedValue({ id: 1, name: 'NewMed' })
      const res = await medicineService.updateMedicine(1, { name: 'NewMed' })
      expect(res.name).toBe('NewMed')
    })
  })

  describe('deleteMedicine', () => {
    it('should delete medicine', async () => {
      medicineRepository.delete.mockResolvedValue(true)
      const res = await medicineService.deleteMedicine(1)
      expect(res).toBe(true)
    })
  })
})

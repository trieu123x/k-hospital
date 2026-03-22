import { describe, it, expect, vi, beforeEach } from 'vitest'
import { medicineService } from '@/services/medicine.js'
import { medicineRepository } from '@/repositories/medicine.js'

vi.mock('@/repositories/medicine.js', () => ({
  medicineRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

describe('medicineService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllMedicines', () => {
    it('should calculate pagination and return data', async () => {
      medicineRepository.findAll.mockResolvedValue({ medicines: [{ id: 1 }], total: 15 })
      const res = await medicineService.getAllMedicines({}, 2, 10)
      expect(res.medicines).toHaveLength(1)
      expect(res.pagination.totalItems).toBe(15)
      expect(res.pagination.totalPages).toBe(2)
      expect(medicineRepository.findAll).toHaveBeenCalledWith({}, 10, 10)
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

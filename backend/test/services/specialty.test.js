import { describe, it, expect, vi, beforeEach } from 'vitest'
import { specialtyService } from '@/services/specialty.js'
import { specialtyRepository } from '@/repositories/specialty.js'

vi.mock('@/repositories/specialty.js', () => ({
  specialtyRepository: {
    findAll: vi.fn(),
    findDoctorsBySpecialtyId: vi.fn()
  }
}))

describe('specialtyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllSpecialties', () => {
    it('should return all specialties', async () => {
      specialtyRepository.findAll.mockResolvedValue([{ id: 1, name: 'Cardio' }])
      const res = await specialtyService.getAllSpecialties()
      expect(res).toHaveLength(1)
      expect(res[0].name).toBe('Cardio')
    })
  })

  describe('getDoctorsBySpecialty', () => {
    it('should calculate pagination for doctors by specialty', async () => {
      specialtyRepository.findDoctorsBySpecialtyId.mockResolvedValue({ doctors: [{ id: 10 }], total: 5 })
      const res = await specialtyService.getDoctorsBySpecialty(1, 1, 10)
      
      expect(res.doctors).toHaveLength(1)
      expect(res.pagination.totalItems).toBe(5)
      expect(res.pagination.totalPages).toBe(1)
      expect(specialtyRepository.findDoctorsBySpecialtyId).toHaveBeenCalledWith(1, 0, 10)
    })
  })
})

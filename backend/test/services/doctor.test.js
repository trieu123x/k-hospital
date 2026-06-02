import { describe, it, expect, vi, beforeEach } from 'vitest'
import { doctorService } from '@/services/doctor.js'
import { doctorRepository } from '@/repositories/doctor.js'

vi.mock('@/repositories/doctor.js', () => ({
  doctorRepository: {
    findAllDoctors: vi.fn(),
    findDoctorById: vi.fn(),
    updateDoctorInfo: vi.fn()
  }
}))

vi.mock('@/configs/supabase-config.js', () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: vi.fn()
      }
    }
  }
}))

vi.mock('@/configs/prisma-config.js', () => {
  return {
    prisma: {
      $transaction: vi.fn(async (callback) => {
        // Mocking the transaction context (tx)
        const tx = {
          profile: { create: vi.fn().mockResolvedValue({}) },
          doctor: { create: vi.fn().mockResolvedValue({ id: 'new-doc-id' }) }
        }
        return await callback(tx)
      })
    }
  }
})

describe('doctorService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllDoctors', () => {
    it('should return doctors and pagination info (no filters)', async () => {
      doctorRepository.findAllDoctors.mockResolvedValue({ doctors: [{ id: 1 }], total: 11 })
      const result = await doctorService.getAllDoctors(2, 10)
      expect(result.doctors).toHaveLength(1)
      expect(result.pagination.totalItems).toBe(11)
      expect(result.pagination.totalPages).toBe(2)
      expect(doctorRepository.findAllDoctors).toHaveBeenCalledWith({}, 10, 10)
    })

    it('should filter by name (case-insensitive)', async () => {
      doctorRepository.findAllDoctors.mockResolvedValue({ doctors: [{ id: 2 }], total: 1 })
      const result = await doctorService.getAllDoctors(1, 10, { name: 'nguyễn' })
      expect(result.doctors).toHaveLength(1)
      expect(doctorRepository.findAllDoctors).toHaveBeenCalledWith(
        { profile: { fullNameClean: { contains: 'nguyen', mode: 'insensitive' } } },
        0,
        10
      )
    })

    it('should filter by specialtyId', async () => {
      const specId = 'spec-uuid-001'
      doctorRepository.findAllDoctors.mockResolvedValue({ doctors: [{ id: 3 }], total: 1 })
      const result = await doctorService.getAllDoctors(1, 10, { specialtyId: specId })
      expect(result.doctors).toHaveLength(1)
      expect(doctorRepository.findAllDoctors).toHaveBeenCalledWith(
        { specialtyId: specId },
        0,
        10
      )
    })

    it('should filter by both name and specialtyId', async () => {
      const specId = 'spec-uuid-002'
      doctorRepository.findAllDoctors.mockResolvedValue({ doctors: [{ id: 4 }], total: 1 })
      const result = await doctorService.getAllDoctors(1, 10, { name: 'an', specialtyId: specId })
      expect(result.doctors).toHaveLength(1)
      expect(doctorRepository.findAllDoctors).toHaveBeenCalledWith(
        {
          profile: { fullNameClean: { contains: 'an', mode: 'insensitive' } },
          specialtyId: specId
        },
        0,
        10
      )
    })

    it('should return empty list when no doctor matches filter', async () => {
      doctorRepository.findAllDoctors.mockResolvedValue({ doctors: [], total: 0 })
      const result = await doctorService.getAllDoctors(1, 10, { name: 'không tồn tại' })
      expect(result.doctors).toHaveLength(0)
      expect(result.pagination.totalItems).toBe(0)
      expect(result.pagination.totalPages).toBe(0)
    })
  })

  describe('getDoctorById', () => {
    it('should throw if doctor not found', async () => {
      doctorRepository.findDoctorById.mockResolvedValue(null)
      await expect(doctorService.getDoctorById(1)).rejects.toThrow('Không tìm thấy thông tin bác sĩ')
    })

    it('should return doctor', async () => {
      doctorRepository.findDoctorById.mockResolvedValue({ id: 1 })
      const res = await doctorService.getDoctorById(1)
      expect(res.id).toBe(1)
    })
  })

  describe('updateDoctorInfo', () => {
    it('should throw if requester is not the doctor', async () => {
      try {
        await doctorService.updateDoctorInfo(1, 2, {})
        expect.fail('Should have thrown an error')
      } catch (err) {
        expect(err.message).toContain('chính mình')
      }
    })

    it('should update and return doctor info', async () => {
      doctorRepository.findDoctorById.mockResolvedValue({ id: 1 })
      doctorRepository.updateDoctorInfo.mockResolvedValue({ id: 1, degree: 'Phd' })
      const res = await doctorService.updateDoctorInfo(1, 1, { degree: 'Phd' })
      expect(res.degree).toBe('Phd')
    })
  })

  describe('createDoctor', () => {
    it('should return new doctor from transaction', async () => {
      const { supabaseAdmin } = await import('@/configs/supabase-config.js')
      supabaseAdmin.auth.admin.createUser.mockResolvedValue({ data: { user: { id: 'supa-user-id' } }, error: null })
      
      const result = await doctorService.createDoctor({
        email: 'doc@a.com', password: '123', fullName: 'A', phone: '12', specialtyId: 1
      })

      expect(result.id).toBe('new-doc-id')
    })
  })
})

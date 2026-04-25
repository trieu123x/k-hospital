import { describe, it, expect, vi, beforeEach } from 'vitest'
import { medicalRecordService } from '@/services/medical-record.js'
import { medicalRecordRepository } from '@/repositories/medical-record.js'
import { appointmentRepository } from '@/repositories/appointment.js'

vi.mock('@/repositories/medical-record.js', () => ({
  medicalRecordRepository: {
    create: vi.fn(),
    findByAppointmentId: vi.fn(),
    update: vi.fn()
  }
}))

vi.mock('@/repositories/appointment.js', () => ({
  appointmentRepository: {
    findById: vi.fn()
  }
}))

vi.mock('@/configs/prisma-config.js', () => ({
  prisma: {
    $transaction: vi.fn(async (cb) => {
      const tx = {
        appointment: { update: vi.fn() }
      }
      return cb(tx)
    })
  }
}))

describe('medicalRecordService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createRecord', () => {
    it('should throw if appointment not found', async () => {
      appointmentRepository.findById.mockResolvedValue(null)
      await expect(medicalRecordService.createRecord(1, {})).rejects.toThrow('Không tìm thấy lịch khám!')
    })

    it('should throw if appointment is already completed', async () => {
      appointmentRepository.findById.mockResolvedValue({ status: 'COMPLETED' })
      await expect(medicalRecordService.createRecord(1, {})).rejects.toThrow('Lịch khám này đã được hoàn thành trước đó!')
    })

    it('should create record within transaction', async () => {
      appointmentRepository.findById.mockResolvedValue({ status: 'pending' })
      medicalRecordRepository.create.mockResolvedValue({ id: 10, diagnosis: 'Flu' })
      
      const res = await medicalRecordService.createRecord(1, { diagnosis: 'Flu', prescription: 'Meds', doctorAdvice: 'Rest' })
      expect(res.id).toBe(10)
    })
  })

  describe('getRecordDetail', () => {
    it('should throw if record does not exist', async () => {
      medicalRecordRepository.findByAppointmentId.mockResolvedValue(null)
      await expect(medicalRecordService.getRecordDetail(1)).rejects.toThrow('Chưa có hồ sơ bệnh án cho lịch khám này!')
    })

    it('should return record', async () => {
      medicalRecordRepository.findByAppointmentId.mockResolvedValue({ id: 10 })
      const res = await medicalRecordService.getRecordDetail(1)
      expect(res.id).toBe(10)
    })
  })

  describe('updateRecord', () => {
    it('should throw if record does not exist to update', async () => {
      medicalRecordRepository.findByAppointmentId.mockResolvedValue(null)
      await expect(medicalRecordService.updateRecord(1, {})).rejects.toThrow('Không tìm thấy hồ sơ bệnh án để sửa!')
    })

    it('should update and prune undefined fields', async () => {
      medicalRecordRepository.findByAppointmentId.mockResolvedValue({ id: 10 })
      medicalRecordRepository.update.mockResolvedValue({ id: 10, diagnosis: 'Fever' })
      
      const res = await medicalRecordService.updateRecord(1, { diagnosis: 'Fever' }) // prescription and note are undefined
      expect(res.diagnosis).toBe('Fever')
      expect(medicalRecordRepository.update).toHaveBeenCalledWith(1, { diagnosis: 'Fever' })
    })
  })
})

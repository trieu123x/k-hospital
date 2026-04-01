import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { appointmentService } from '@/services/appointment.js'
import { appointmentRepository } from '@/repositories/appointment.js'
import { prisma } from '@/configs/prisma-config.js'

vi.mock('@/repositories/appointment.js', () => ({
  appointmentRepository: {
    getAllAppointments: vi.fn(),
    findById: vi.fn(),
    findByPatientId: vi.fn(),
    findByDoctorId: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn()
  }
}))

vi.mock('@/configs/prisma-config.js', () => ({
  prisma: {
    schedule: {
      findMany: vi.fn(),
      findFirst: vi.fn()
    }
  }
}))

describe('appointmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getAllAppointments', () => {
    it('should map appointments correctly', async () => {
      const mockAppointments = [
        {
          id: 1,
          schedule: { date: '2023-12-01', shift: 1 },
          status: 'pending',
          reason: 'sick',
          patient: { id: 2, fullName: 'John', phone: '123', userId: 2 },
          doctor: { id: 3, fullName: 'Dr. Smith', doctorId: 3, doctor: { specialty: { name: 'Cardio' } } }
        },
        {
          id: 2,
          schedule: { date: '2023-12-02', shift: 2 },
          status: 'confirmed',
          reason: 'checkup',
          patient: { id: 4, fullName: 'Jane', phone: '456', userId: 4 },
          doctor: { id: 5, fullName: 'Dr. Brown', doctorId: 5, doctor: { specialty: { name: 'Pediatric' } } }
        }
      ]
      appointmentRepository.getAllAppointments.mockResolvedValue(mockAppointments)

      const result = await appointmentService.getAllAppointments({})
      
      expect(result).toHaveLength(2)
      expect(result[0].appointmentId).toBe(1)
      expect(result[0].patient.name).toBe('John')
      expect(result[0].doctor.specialityName).toBe('Cardio')
      expect(result[1].appointmentId).toBe(2)
      expect(result[1].status).toBe('confirmed')
    })
  })

  describe('getAppointmentDetail', () => {
    it('should throw error if appointment not found', async () => {
      appointmentRepository.findById.mockResolvedValue(null)
      await expect(appointmentService.getAppointmentDetail(1)).rejects.toThrow('Không tìm thấy lịch khám!')
    })

    it('should return mapped appointment detail', async () => {
      appointmentRepository.findById.mockResolvedValue({
        id: 1,
        schedule: { date: '2023-12-01', shift: 1 },
        status: 'pending',
        reason: 'sick',
        patient: { id: 2, fullName: 'John', phone: '123', dob: '1990-01-01', userId: 2 },
        doctor: { id: 3, fullName: 'Dr. Smith', doctorId: 3, doctor: { specialty: { name: 'Cardio' } } }
      })
      const result = await appointmentService.getAppointmentDetail(1)
      expect(result.appointmentId).toBe(1)
      expect(result.patient.name).toBe('John')
      expect(result.patient.userId).toBe(2)
    })
  })

  describe('getAvailableSlots', () => {
    it('should throw error if date or doctorId is not provided', async () => {
      await expect(appointmentService.getAvailableSlots({})).rejects.toThrow('Vui lòng cung cấp đầy đủ mã bác sĩ và ngày cần xem lịch!')
    })

    it('should return available slots successfully', async () => {
      prisma.schedule.findMany.mockResolvedValue([
        { id: 101, shift: 1, date: '2023-12-01' },
        { id: 102, shift: 2, date: '2023-12-01' }
      ])
      const result = await appointmentService.getAvailableSlots({ date: '2023-12-01', doctorId: 1 })
      
      expect(result).toHaveLength(2)
      expect(result[0].shift).toBe(1)
      expect(result[0].scheduleId).toBe(101)
    })
  })

  describe('bookAppointment', () => {
    it('should throw error if booking past date', async () => {
      vi.setSystemTime(new Date('2023-12-02'))
      await expect(appointmentService.bookAppointment({ date: '2023-12-01' })).rejects.toThrow('Không thể đặt lịch khám đã qua!')
    })

    it('should throw error if shift is invalid', async () => {
      vi.setSystemTime(new Date('2023-12-01'))
      await expect(appointmentService.bookAppointment({ date: '2023-12-02', shift: 5 })).rejects.toThrow('Ca khám không hợp lệ (chỉ từ 1 đến 4)!')
    })

    it('should throw error if slot not found or not available', async () => {
      vi.setSystemTime(new Date('2023-12-01'))
      prisma.schedule.findFirst.mockResolvedValue(null)
      await expect(appointmentService.bookAppointment({ doctorId: 1, date: '2023-12-02', shift: 1 })).rejects.toThrow('Bác sĩ không có lịch làm việc vào ca này!')
    })

    it('should create new appointment successfully', async () => {
      vi.setSystemTime(new Date('2023-12-01'))
      prisma.schedule.findFirst.mockResolvedValue({ id: 99 })
      appointmentRepository.create.mockResolvedValue({
        id: 10,
        status: 'pending',
        patientId: 2,
        doctorId: 1,
        scheduleId: 99,
        reason: 'Checkup'
      })
      const result = await appointmentService.bookAppointment({
        doctorId: 1,
        date: '2023-12-02',
        shift: 1,
        patientId: 2,
        reason: 'Checkup'
      })
      expect(result.appointmentId).toBe(10)
      expect(result.status).toBe('pending')
    })
  })

  describe('cancelAppointment', () => {
    it('should throw if appointment not found', async () => {
      appointmentRepository.findById.mockResolvedValue(null)
      await expect(appointmentService.cancelAppointment(1)).rejects.toThrow('Không tìm thấy lịch khám!')
    })

    it('should throw if within 24 hours', async () => {
      vi.setSystemTime(new Date('2023-12-01T10:00:00Z'))
      appointmentRepository.findById.mockResolvedValue({
        id: 1,
        status: 'pending',
        schedule: { date: '2023-12-01T15:00:00Z' }
      })
      await expect(appointmentService.cancelAppointment(1)).rejects.toThrow('Chỉ có thể tự hủy lịch trước ngày khám ít nhất 24 tiếng')
    })

    it('should cancel appointment successfully', async () => {
      vi.setSystemTime(new Date('2023-12-01T10:00:00Z'))
      appointmentRepository.findById.mockResolvedValue({
        id: 1,
        status: 'pending',
        schedule: { date: '2023-12-03T10:00:00Z' }
      })
      appointmentRepository.updateStatus.mockResolvedValue({ id: 1, status: 'cancelled' })
      const result = await appointmentService.cancelAppointment(1)
      expect(result.status).toBe('cancelled')
    })
  })

  describe('updateAppointmentStatus', () => {
    it('should update appointment status successfully', async () => {
      appointmentRepository.updateStatus.mockResolvedValue({
        id: 1,
        status: 'confirmed'
      })
      const result = await appointmentService.updateAppointmentStatus(1, 'confirmed')
      expect(result.id).toBe(1)
      expect(result.status).toBe('confirmed')
    })
  })
})
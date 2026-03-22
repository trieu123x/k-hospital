import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appointmentService } from '@/services/appointment.js'
import { appointmentRepository } from '@/repositories/appointment.js'

vi.mock('@/repositories/appointment.js', () => ({
  appointmentRepository: {
    getAllAppointments: vi.fn(),
    findById: vi.fn(),
    findByPatientId: vi.fn(),
    findByDoctorId: vi.fn(),
    findBookedAppointments: vi.fn(),
    checkSlot: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn()
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
      const mockAppointments = [{
         id: 1, date: '2023-12-01', shift: 1, status: 'pending', reason: 'sick',
         patient: { id: 2, fullName: 'John', phone: '123' },
         doctor: { id: 3, fullName: 'Dr. Smith', doctor: { specialty: { name: 'Cardio' } } }
      }]
      appointmentRepository.getAllAppointments.mockResolvedValue(mockAppointments)

      const result = await appointmentService.getAllAppointments({})
      
      expect(result).toHaveLength(1)
      expect(result[0].appointmentId).toBe(1)
      expect(result[0].patient.name).toBe('John')
      expect(result[0].doctor.specialityName).toBe('Cardio')
    })
  })

  describe('getAppointmentDetail', () => {
    it('should throw error if appointment not found', async () => {
      appointmentRepository.findById.mockResolvedValue(null)
      await expect(appointmentService.getAppointmentDetail(1)).rejects.toThrow('Không tìm thấy lịch khám!')
    })

    it('should return mapped appointment detail', async () => {
      appointmentRepository.findById.mockResolvedValue({
        id: 1, date: '2023-12-01', shift: 1, status: 'pending', reason: 'sick',
        patient: { id: 2, fullName: 'John', phone: '123', dob: '1990-01-01' },
      })
      const result = await appointmentService.getAppointmentDetail(1)
      expect(result.appointmentId).toBe(1)
      expect(result.patient.name).toBe('John')
    })
  })

  describe('getAvailableSlots', () => {
    it('should throw error if date is not provided', async () => {
      await expect(appointmentService.getAvailableSlots({})).rejects.toThrow('Vui lòng cung cấp ngày')
    })

    it('should filter booked slots for a specific doctor', async () => {
      appointmentRepository.findBookedAppointments.mockResolvedValue([{ shift: 1 }, { shift: 2 }])
      const result = await appointmentService.getAvailableSlots({ date: '2023-12-01', doctorId: 1 })
      
      expect(result).toHaveLength(2) // 3 and 4 should be available
      expect(result[0].shift).toBe(3)
      expect(result[1].shift).toBe(4)
    })
  })

  describe('bookAppointment', () => {
    it('should throw error if booking past date', async () => {
      vi.setSystemTime(new Date('2023-12-02'))
      await expect(appointmentService.bookAppointment({ date: '2023-12-01' })).rejects.toThrow('Không thể đặt lịch khám đã qua')
    })

    it('should throw error if shift is invalid', async () => {
      vi.setSystemTime(new Date('2023-12-01'))
      await expect(appointmentService.bookAppointment({ date: '2023-12-02', shift: 5 })).rejects.toThrow('Ca khám không hợp lệ')
    })

    it('should throw error if slot is already booked', async () => {
      vi.setSystemTime(new Date('2023-12-01'))
      appointmentRepository.checkSlot.mockResolvedValue({ id: 99 })
      await expect(appointmentService.bookAppointment({ doctorId: 1, date: '2023-12-02', shift: 1 })).rejects.toThrow('Khung giờ này đã có người đặt')
    })

    it('should create new appointment successfully', async () => {
      vi.setSystemTime(new Date('2023-12-01'))
      appointmentRepository.checkSlot.mockResolvedValue(null)
      appointmentRepository.create.mockResolvedValue({ id: 10, status: 'pending' })
      const result = await appointmentService.bookAppointment({ doctorId: 1, date: '2023-12-02', shift: 1, patientId: 2, reason: 'Checkup' })
      expect(result.appointmentId).toBe(10)
      expect(result.status).toBe('pending')
    })
  })

  describe('cancelAppointment', () => {
    it('should throw if appointment not found', async () => {
      appointmentRepository.findById.mockResolvedValue(null)
      await expect(appointmentService.cancelAppointment(1)).rejects.toThrow('Không tìm thấy lịch khám')
    })

    it('should throw if within 24 hours', async () => {
      vi.setSystemTime(new Date('2023-12-01T10:00:00Z'))
      appointmentRepository.findById.mockResolvedValue({ id: 1, status: 'pending', date: '2023-12-01T15:00:00Z' })
      await expect(appointmentService.cancelAppointment(1)).rejects.toThrow('Chỉ có thể tự hủy lịch trước ngày khám ít nhất 24 tiếng')
    })
  })
})

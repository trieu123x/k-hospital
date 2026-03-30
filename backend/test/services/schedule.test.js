import { describe, it, expect, vi, beforeEach } from 'vitest'
import { scheduleService } from '@/services/schedule.js'
import { scheduleRepository } from '@/repositories/schedule.js'
import { prisma } from '@/configs/prisma-config.js'

vi.mock('@/repositories/schedule.js', () => ({
  scheduleRepository: {
    createSchedules: vi.fn(),
    getDoctorSchedules: vi.fn(),
    deleteSchedule: vi.fn()
  }
}))

vi.mock('@/configs/prisma-config.js', () => ({
  prisma: {
    schedule: {
      findUnique: vi.fn()
    }
  }
}))

describe('scheduleService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createSchedules', () => {
    it('should throw error if schedulesInput is invalid', async () => {
      await expect(scheduleService.createSchedules('doctor-1', null)).rejects.toThrow('Dữ liệu đăng ký lịch không hợp lệ!')
      await expect(scheduleService.createSchedules('doctor-1', [])).rejects.toThrow('Dữ liệu đăng ký lịch không hợp lệ!')
    })

    it('should throw error if no valid shifts to insert', async () => {
      await expect(scheduleService.createSchedules('doctor-1', [{ date: '2023-12-01', shifts: [5, 6] }])).rejects.toThrow('Không có ca làm việc nào hợp lệ để thêm!')
    })

    it('should create schedules successfully', async () => {
      scheduleRepository.createSchedules.mockResolvedValue({ count: 2 })
      const result = await scheduleService.createSchedules('doctor-1', [{ date: '2023-12-01', shifts: [1, 2] }])
      
      expect(result.message).toBe('Đăng ký lịch làm việc thành công!')
      expect(result.slotsCreated).toBe(2)
      expect(scheduleRepository.createSchedules).toHaveBeenCalledWith([
        { doctorId: 'doctor-1', date: new Date('2023-12-01'), shift: 1, isBooked: false },
        { doctorId: 'doctor-1', date: new Date('2023-12-01'), shift: 2, isBooked: false }
      ])
    })
  })

  describe('getDoctorSchedules', () => {
    it('should throw error if fromDate or toDate is missing', async () => {
      await expect(scheduleService.getDoctorSchedules('doctor-1', {})).rejects.toThrow('Vui lòng cung cấp khoảng thời gian cần xem (fromDate, toDate)!')
    })

    it('should return mapped schedules correctly', async () => {
      const mockSchedules = [{
        id: '1', date: '2023-12-01', shift: 1, isBooked: true,
        appointment: { id: 'app-1', status: 'pending', patient: { fullName: 'John', phone: '123' } }
      }]
      scheduleRepository.getDoctorSchedules.mockResolvedValue(mockSchedules)

      const result = await scheduleService.getDoctorSchedules('doctor-1', { fromDate: '2023-12-01', toDate: '2023-12-07' })
      expect(result).toHaveLength(1)
      expect(result[0].scheduleId).toBe('1')
      expect(result[0].appointment.patientName).toBe('John')
    })
  })

  describe('deleteSchedule', () => {
    it('should throw error if schedule not found', async () => {
      prisma.schedule.findUnique.mockResolvedValue(null)
      await expect(scheduleService.deleteSchedule('1', 'doctor-1')).rejects.toThrow('Không tìm thấy ca làm việc này!')
    })

    it('should throw error if doctorId mismatch (unauthorized)', async () => {
      prisma.schedule.findUnique.mockResolvedValue({ id: '1', doctorId: 'doctor-2' })
      await expect(scheduleService.deleteSchedule('1', 'doctor-1')).rejects.toThrow('Bạn không có quyền xóa ca làm việc của người khác!')
    })

    it('should throw error if schedule is already booked', async () => {
      prisma.schedule.findUnique.mockResolvedValue({ id: '1', doctorId: 'doctor-1', isBooked: true })
      await expect(scheduleService.deleteSchedule('1', 'doctor-1')).rejects.toThrow('Ca làm việc này đã có bệnh nhân đặt hẹn! Vui lòng hủy lịch hẹn trước khi xóa ca.')
    })

    it('should delete schedule successfully if authorized and not booked', async () => {
      prisma.schedule.findUnique.mockResolvedValue({ id: '1', doctorId: 'doctor-1', isBooked: false })
      scheduleRepository.deleteSchedule.mockResolvedValue(true)
      const result = await scheduleService.deleteSchedule('1', 'doctor-1')
      expect(result).toBe(true)
      expect(scheduleRepository.deleteSchedule).toHaveBeenCalledWith('1')
    })
  })
})

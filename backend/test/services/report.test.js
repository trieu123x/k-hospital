import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reportService } from '@/services/report.js'
import { reportRepository } from '@/repositories/report.js'

vi.mock('@/repositories/report.js', () => ({
  reportRepository: {
    getReportByTime: vi.fn(),
    getReportById: vi.fn()
  }
}))

describe('reportService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getReportByTime', () => {
    it('nên trả về report khi repository tìm thấy dữ liệu', async () => {
      const params = { reportName: 'summary', mode: 'daily', date: '2026-03-27' }
      const report = { id: 1, ...params }
      reportRepository.getReportByTime.mockResolvedValue(report)

      const result = await reportService.getReportByTime(params)

      expect(reportRepository.getReportByTime).toHaveBeenCalledWith(params)
      expect(result).toEqual(report)
    })

    it('nên throw lỗi 404 khi không tìm thấy report theo thời gian', async () => {
      reportRepository.getReportByTime.mockResolvedValue(null)

      await expect(reportService.getReportByTime({
        reportName: 'summary',
        mode: 'daily',
        date: '2026-03-27'
      })).rejects.toMatchObject({ statusCode: 404 })
    })
  })

  describe('getReportById', () => {
    it('nên trả về report khi tìm thấy id', async () => {
      const report = { id: 99, reportName: 'summary' }
      reportRepository.getReportById.mockResolvedValue(report)

      const result = await reportService.getReportById(99)

      expect(reportRepository.getReportById).toHaveBeenCalledWith(99)
      expect(result).toEqual(report)
    })

    it('nên throw lỗi 404 khi không tìm thấy id', async () => {
      reportRepository.getReportById.mockResolvedValue(null)

      await expect(reportService.getReportById(404)).rejects.toMatchObject({
        statusCode: 404
      })
    })
  })
})

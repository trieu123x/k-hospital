import { beforeEach, describe, expect, it, vi } from 'vitest'
import { eventService } from '@/services/event.js'
import { eventRepository } from '@/repositories/event.js'

vi.mock('@/repositories/event.js', () => ({
  eventRepository: {
    track: vi.fn(),
    findByDate: vi.fn(),
    countByDate: vi.fn()
  }
}))

describe('eventService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('track', () => {
    it('nên gửi payload xuống repository', async () => {
      eventRepository.track.mockResolvedValue({ id: 1 })

      eventService.track('user-1', 'CHAT_CREATED', 'session-1', { source: 'ai' })

      await Promise.resolve()

      expect(eventRepository.track).toHaveBeenCalledWith({
        userId: 'user-1',
        eventType: 'CHAT_CREATED',
        entityId: 'session-1',
        metadata: { source: 'ai' }
      })
    })

    it('nên nuốt lỗi repository để tránh làm vỡ luồng xử lý chính', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      eventRepository.track.mockRejectedValue(new Error('db failed'))

      eventService.track('user-1', 'CHAT_CREATED', 'session-1')
      await Promise.resolve()

      expect(consoleSpy).toHaveBeenCalledWith('[EventTracker]', 'db failed')
      consoleSpy.mockRestore()
    })
  })

  describe('createEvent', () => {
    it('nên tạo event bằng payload được truyền vào', async () => {
      const payload = { userId: 'user-2', eventType: 'LOGIN', entityId: null, metadata: {} }
      const created = { id: 10, ...payload }
      eventRepository.track.mockResolvedValue(created)

      const result = await eventService.createEvent(payload)

      expect(eventRepository.track).toHaveBeenCalledWith(payload)
      expect(result).toEqual(created)
    })
  })

  describe('getEvents', () => {
    it('nên trả về count và danh sách events theo ngày', async () => {
      const events = [{ id: 1 }, { id: 2 }]
      eventRepository.findByDate.mockResolvedValue(events)
      eventRepository.countByDate.mockResolvedValue(2)

      const result = await eventService.getEvents('2026-03-27')

      expect(eventRepository.findByDate).toHaveBeenCalledWith('2026-03-27')
      expect(eventRepository.countByDate).toHaveBeenCalledWith('2026-03-27')
      expect(result).toEqual({ count: 2, events })
    })
  })
})

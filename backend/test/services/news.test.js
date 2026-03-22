import { describe, it, expect, vi, beforeEach } from 'vitest'
import { newsService } from '@/services/news.js'
import { newsRespository } from '@/repositories/news.js'

vi.mock('@/repositories/news.js', () => ({
  newsRespository: {
    create: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    findWithFilter: vi.fn(),
    delete: vi.fn()
  }
}))

// Mocking the global uploadHelper that the news.js file expects
global.uploadHelper = {
  uploadFile: vi.fn(),
  deleteFile: vi.fn()
}

describe('newsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createNews', () => {
    it('should create news without file', async () => {
      newsRespository.create.mockResolvedValue({ id: 1, title: 'News' })
      const res = await newsService.createNews({ title: 'News' }, null)
      expect(res.id).toBe(1)
      expect(global.uploadHelper.uploadFile).not.toHaveBeenCalled()
    })

    it('should upload file and create news if file exists', async () => {
      global.uploadHelper.uploadFile.mockResolvedValue('url-img')
      newsRespository.create.mockResolvedValue({ id: 1, newUrl: 'url-img' })
      const res = await newsService.createNews({ title: 'News' }, { name: 'file.png' })
      expect(global.uploadHelper.uploadFile).toHaveBeenCalled()
      expect(res.newUrl).toBe('url-img')
    })
  })

  describe('updateNews', () => {
    it('should throw if news not found', async () => {
      newsRespository.findById.mockResolvedValue(null)
      await expect(newsService.updateNews(1, {}, null)).rejects.toThrow('Không tìm thấy tin tức!')
    })

    it('should delete old file and upload new if file is provided', async () => {
      newsRespository.findById.mockResolvedValue({ id: 1, newUrl: 'old-url' })
      global.uploadHelper.uploadFile.mockResolvedValue('new-url')
      newsRespository.update.mockResolvedValue({ id: 1, newUrl: 'new-url' })
      
      await newsService.updateNews(1, { title: 'Updated' }, { name: 'new.png' })
      expect(global.uploadHelper.deleteFile).toHaveBeenCalledWith('old-url', 'medicare')
      expect(global.uploadHelper.uploadFile).toHaveBeenCalled()
    })
  })

  describe('getNewsList', () => {
    it('should return list', async () => {
      newsRespository.findWithFilter.mockResolvedValue([{ id: 1 }])
      const res = await newsService.getNewsList({})
      expect(res).toHaveLength(1)
    })
  })

  describe('getNewsDetail', () => {
    it('should throw if not found', async () => {
      newsRespository.findById.mockResolvedValue(null)
      await expect(newsService.getNewsDetail(1)).rejects.toThrow('Không tìm thấy thông tin tin tức!')
    })

    it('should return detail', async () => {
      newsRespository.findById.mockResolvedValue({ id: 1 })
      const res = await newsService.getNewsDetail(1)
      expect(res.id).toBe(1)
    })
  })

  describe('deleteNews', () => {
    it('should throw error if not found', async () => {
      newsRespository.findById.mockResolvedValue(null)
      await expect(newsService.deleteNews(1)).rejects.toThrow('Tin tức không tồn tại hoặc đã bị xóa trước đó!')
    })

    it('should delete file if exists and delete DB record', async () => {
      newsRespository.findById.mockResolvedValue({ id: 1, newUrl: 'del-url' })
      newsRespository.delete.mockResolvedValue(true)
      
      await newsService.deleteNews(1)
      expect(global.uploadHelper.deleteFile).toHaveBeenCalledWith('del-url', 'medicare')
      expect(newsRespository.delete).toHaveBeenCalledWith(1)
    })
  })
})

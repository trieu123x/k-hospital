import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '@/services/auth.js'
import { supabase } from '@/configs/supabase-config.js'
import { profileRepository } from '@/repositories/auth.js'

vi.mock('@/configs/supabase-config.js', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      admin: {
        signOut: vi.fn()
      }
    }
  }
}))

vi.mock('@/repositories/auth.js', () => ({
  profileRepository: {
    findByPhone: vi.fn(),
    create: vi.fn(),
    findById: vi.fn()
  }
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should throw error if phone already exists', async () => {
      profileRepository.findByPhone.mockResolvedValue({ id: 1 })
      await expect(authService.register({ phone: '123' })).rejects.toThrow('Số điện thoại đã được sử dụng')
    })

    it('should throw error if supabase signup fails', async () => {
      profileRepository.findByPhone.mockResolvedValue(null)
      supabase.auth.signUp.mockResolvedValue({ data: null, error: { message: 'Signup failed' } })
      await expect(authService.register({ phone: '123', email: 'test@a.com', password: '123' })).rejects.toThrow('Signup failed')
    })

    it('should create user successfully', async () => {
      profileRepository.findByPhone.mockResolvedValue(null)
      supabase.auth.signUp.mockResolvedValue({ data: { user: { id: 'user-123', email: 'test@a.com' } }, error: null })
      profileRepository.create.mockResolvedValue({ id: 'user-123', fullName: 'Test Name', phone: '123', role: 'patient' })
      
      const result = await authService.register({ phone: '123', email: 'test@a.com', password: '123', fullName: 'Test Name' })
      
      expect(result.userId).toBe('user-123')
      expect(result.role).toBe('patient')
      expect(profileRepository.create).toHaveBeenCalledWith({
        id: 'user-123',
        fullName: 'Test Name',
        phone: '123',
        role: 'patient'
      })
    })
  })

  describe('login', () => {
    it('should throw error if supabase login fails', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: { message: 'Invalid credentials' } })
      await expect(authService.login({ email: 'a@a.com', password: '123' })).rejects.toThrow('Email hoặc mật khẩu không đúng')
    })

    it('should throw error if account not in system DB', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })
      profileRepository.findById.mockResolvedValue(null)
      await expect(authService.login({ email: 'a@a.com', password: '123' })).rejects.toThrow('Tài khoản không tồn tại trong hệ thống')
    })

    it('should successfully login and return tokens', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({ 
        data: { user: { id: 'u1', email: 'a@a.com' }, session: { access_token: 'acc', refresh_token: 'ref' } }, 
        error: null 
      })
      profileRepository.findById.mockResolvedValue({ id: 'u1', fullName: 'John', role: 'patient' })
      const result = await authService.login({ email: 'a@a.com', password: '123' })
      expect(result.accessToken).toBe('acc')
      expect(result.user.fullName).toBe('John')
    })
  })

  describe('logout', () => {
    it('should throw error if supabase signout fails', async () => {
      supabase.auth.admin.signOut.mockResolvedValue({ error: new Error('fail') })
      await expect(authService.logout('token')).rejects.toThrow('Đăng xuất thất bại')
    })

    it('should logout successfully', async () => {
      supabase.auth.admin.signOut.mockResolvedValue({ error: null })
      const result = await authService.logout('token')
      expect(result).toBe(true)
    })
  })
})

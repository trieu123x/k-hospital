import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '@/services/auth.js'
import { supabase, supabaseAdmin } from '@/configs/supabase-config.js'
import { profileRepository } from '@/repositories/auth.js'

vi.mock('@/configs/supabase-config.js', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      verifyOtp: vi.fn(),
      updateUser: vi.fn(),
      signOut: vi.fn(),
      admin: {
        signOut: vi.fn()
      }
    }
  },
  supabaseAdmin: {
    auth: {
      admin: {
        listUsers: vi.fn(),
        updateUserById: vi.fn(),
        deleteUser: vi.fn()
      }
    }
  }
}))

vi.mock('@/repositories/auth.js', () => ({
  profileRepository: {
    findByPhone: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn()
  }
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should throw error if phone already exists', async () => {
      profileRepository.findByPhone.mockResolvedValue({ id: 1 })
      await expect(authService.register({ phone: '123', email: 'test@a.com' })).rejects.toThrow('Số điện thoại đã được sử dụng')
    })


    it('should throw error if email already exists', async () => {
      profileRepository.findByPhone.mockResolvedValue(null)
      profileRepository.findByEmail.mockResolvedValue({ id: 1 })
      await expect(authService.register({ phone: '123', email: 'test@a.com' })).rejects.toThrow('Email đã được sử dụng')
    })

    it('should register user and return instructions', async () => {
      profileRepository.findByPhone.mockResolvedValue(null)
      profileRepository.findByEmail.mockResolvedValue(null)
      supabase.auth.signUp.mockResolvedValue({ error: null })
      
      const result = await authService.register({ phone: '123', email: 'test@a.com', password: '123', fullName: 'Test Name' })
      expect(result.email).toBe('test@a.com')
      expect(result.message).toContain('kích hoạt tài khoản')
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
      await expect(authService.login({ email: 'a@a.com', password: '123' })).rejects.toThrow('Tài khoản không tồn tại trên hệ thống')
    })

    it('should successfully login and return tokens', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({ 
        data: { user: { id: 'u1', email: 'a@a.com' }, session: { access_token: 'acc', refresh_token: 'ref', expires_in: 3600 } }, 
        error: null 
      })
      profileRepository.findById.mockResolvedValue({ id: 'u1', fullName: 'John', role: 'PATIENT' })
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

  describe('forgotPassword', () => {
    it('should return success message if request succeeds', async () => {
      supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null })
      const result = await authService.forgotPassword({ email: 'test@mail.com' })
      expect(result.message).toContain('hướng dẫn đặt lại mật khẩu')
    })

    it('should throw error if supabase request fails', async () => {
      supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: { message: 'Some error' } })
      await expect(authService.forgotPassword({ email: 'test@mail.com' })).rejects.toThrow('Không thể gửi yêu cầu: Some error')
    })
  })

  describe('resetPassword', () => {
    const email = 'test@mail.com'
    const newPassword = 'newPassword123'
    const otp = '123456'

    it('should throw error if verifyOtp fails', async () => {
      supabase.auth.verifyOtp.mockResolvedValue({ error: { message: 'Invalid OTP' } })
      await expect(authService.resetPassword({ email, otp, newPassword })).rejects.toThrow('Mã OTP không hợp lệ hoặc đã hết hạn')
    })

    it('should throw error if updateUser fails', async () => {
      supabase.auth.verifyOtp.mockResolvedValue({ error: null })
      supabase.auth.updateUser.mockResolvedValue({ error: { message: 'Update failed' } })
      await expect(authService.resetPassword({ email, otp, newPassword })).rejects.toThrow('Lỗi cập nhật: Update failed')
    })

    it('should reset password successfully', async () => {
      supabase.auth.verifyOtp.mockResolvedValue({ error: null })
      supabase.auth.updateUser.mockResolvedValue({ error: null })
      supabase.auth.signOut.mockResolvedValue({ error: null })
      
      const result = await authService.resetPassword({ email, otp, newPassword })
      expect(result.message).toBe('Đặt lại mật khẩu thành công!')
    })
  })
})

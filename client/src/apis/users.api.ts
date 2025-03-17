import { LoginResponse } from '@/types/User.type'
import { SuccessResponse } from '@/types/Utils.type'
import http from '@/utils/http'
import { User, RegisterType } from '@/types/User.type'

const userApi = {
  register: (body: RegisterType) =>
    http.post<SuccessResponse<{ access_token: string; refresh_token: string }>>('/users/register', body),

  login: (body: { email: string; password: string }) => http.post<SuccessResponse<LoginResponse>>('/users/login', body),

  logout: (body: { refresh_token: string }) => http.post<SuccessResponse<string>>('/users/logout', body),

  refreshToken: (body: { refresh_token: string }) =>
    http.post<SuccessResponse<{ access_token: string; refresh_token: string }>>('/users/refresh-token', body),

  getProfile: () => http.get<SuccessResponse<User>>('/users/me'),

  updateProfile: (body: Partial<User>) => http.patch<SuccessResponse<User>>('/users/me', body),

  changePassword: (body: { old_password: string; new_password: string; confirm_new_password: string }) =>
    http.post<SuccessResponse<string>>('/users/change-password', body),

  forgotPassword: (body: { email: string }) => http.post<SuccessResponse<string>>('/users/forgot-password', body),

  verifyForgotPassword: (body: { forgot_password_token: string }) =>
    http.post<SuccessResponse<string>>('/users/verify-forgot-password', body),

  resetPassword: (body: { password: string; confirm_password: string; forgot_password_token: string }) =>
    http.post<SuccessResponse<string>>('/users/reset-password', body),

  verifyEmail: (body: { email_verify_token: string }) =>
    http.post<SuccessResponse<{ access_token: string; refresh_token: string }>>('/users/verify-email', body),

  resendVerifyEmail: () => http.post<SuccessResponse<string>>('/users/resend-verify-email')
}

export default userApi

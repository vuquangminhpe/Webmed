/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import userApi from '@/apis/users.api'
import { LoginResponse, RegisterType, User } from '@/types/User.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  getAccessTokenFromLS,
  getProfileFormLS,
  getRefreshTokenFromLS,
  saveAccessTokenToLS,
  setProfileFromLS,
  setRefreshTokenToLS,
  clearLocalStorage
} from '@/utils/auth'
import path from '@/constants/path'
import axios from 'axios'

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (body: RegisterType) => userApi.register(body),
    onSuccess: (data) => {
      toast.success('Registration successful! Please verify your email.')
      navigate(path.login)
    }
  })
}

export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (body: { email: string; password: string }) => userApi.login(body),
    onSuccess: (data) => {
      const { access_token, refresh_token } = data.data.result
      const AboutController = new AbortController()
      const signal = AboutController.signal
      axios
        .get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${access_token}`
          },
          signal: signal
        })
        .then((res) => setProfileFromLS(res.data.result))

      saveAccessTokenToLS(access_token)
      setRefreshTokenToLS(refresh_token)
      toast.success('Login successful!')
      navigate(path.home)
    }
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      const refresh_token = getRefreshTokenFromLS()
      return userApi.logout({ refresh_token })
    },
    onSuccess: () => {
      clearLocalStorage()
      queryClient.setQueryData(['user'], null)
      toast.success('Logout successful!')
      navigate(path.login)
    }
  })
}

export const useProfile = () => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['user'],
    queryFn: () => userApi.getProfile().then((res) => res.data.result),
    initialData: getProfileFormLS(),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(getAccessTokenFromLS())
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Partial<User>) => userApi.updateProfile(body),
    onSuccess: (data) => {
      const updatedUser = data.data.result
      setProfileFromLS(updatedUser)
      queryClient.setQueryData(['user'], updatedUser)
      toast.success('Profile updated successfully!')
    }
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (body: { old_password: string; new_password: string; confirm_new_password: string }) =>
      userApi.changePassword(body),
    onSuccess: () => {
      toast.success('Password changed successfully!')
    }
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (body: { email: string }) => userApi.forgotPassword(body),
    onSuccess: () => {
      toast.success('Check your email to reset password!')
    }
  })
}

export const useResetPassword = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (body: { password: string; confirm_password: string; forgot_password_token: string }) =>
      userApi.resetPassword(body),
    onSuccess: () => {
      toast.success('Password reset successful!')
      navigate(path.login)
    }
  })
}

export const useVerifyEmail = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => userApi.verifyEmail({ email_verify_token: token }),
    onSuccess: (data) => {
      const { access_token, refresh_token } = data.data.result

      saveAccessTokenToLS(access_token)
      setRefreshTokenToLS(refresh_token)

      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Email verified successfully!')
      navigate(path.home)
    }
  })
}

export const useResendVerifyEmail = () => {
  return useMutation({
    mutationFn: () => userApi.resendVerifyEmail(),
    onSuccess: () => {
      toast.success('Verification email has been sent!')
    }
  })
}

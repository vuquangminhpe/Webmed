export interface User {
  _id: string
  name: string
  email: string
  date_of_birth: string
  bio: string
  location: string
  phone: string
  username: string
  avatar: string
  account_type: number
  verify: number
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RegisterType {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

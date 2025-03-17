import { ObjectId } from 'mongodb'
import { AccountStatus, UserVerifyStatus } from '~/constant/enums'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth?: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  account_type: AccountStatus
  bio?: string
  location?: string
  phone?: string
  username?: string
  avatar?: string
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  account_type: AccountStatus
  bio: string
  location: string
  phone: string
  username: string
  avatar: string

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id
    this.name = user.name || ''
    this.email = user.email
    this.date_of_birth = user.date_of_birth || new Date()
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.account_type = user.account_type || AccountStatus.REGULAR
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.phone = user.phone || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
  }
}

export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

export enum AccountStatus {
  REGULAR,
  PREMIUM,
  ADMIN
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  EmailVerifyToken,
  ForgotPasswordToken
}

export enum MediaType {
  Image,
  Video,
  Document
}

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled'
}

export enum PaymentMethod {
  Cash = 'cash',
  Card = 'card',
  Insurance = 'insurance'
}

export enum FeedbackType {
  Website = 'website',
  Doctor = 'doctor',
  Medicine = 'medicine',
  Service = 'service'
}

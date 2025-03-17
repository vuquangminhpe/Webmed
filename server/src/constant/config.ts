import dotenv from 'dotenv'
dotenv.config()

export const envConfig = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || 'localhost',
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'webmed',
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'your-secret-key',
  passwordSecret: process.env.PASSWORD_SECRET || 'password-secret',

  privateKey_access_token: process.env.PRIVATE_KEY_ACCESS_TOKEN,
  privateKey_refresh_token: process.env.PRIVATE_KEY_REFRESH_TOKEN,
  secretOnPublicKey_Email: process.env.SECRET_EMAIL_VERIFY_TOKEN,
  secretOnPublicKey_Forgot: process.env.SECRET_FORGOT_PASSWORD_TOKEN,

  expiresIn_access_token: process.env.EXPIRES_IN_ACCESS_TOKEN || '15m',
  expiresIn_refresh_token: process.env.EXPIRES_IN_REFRESH_TOKEN || '7d',
  expiresIn_email_token: process.env.EXPIRES_IN_EMAIL_VERIFY_TOKEN || '7d',
  expiresIn_forgot_token: process.env.EXPIRES_IN_FORGOT_PASSWORD_TOKEN || '7d',
  client_redirect: process.env.CLIENT_REDIRECT || 'http://localhost:3000',
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  password_secret: process.env.PASSWORD_SECRET || 'password-secret'
}

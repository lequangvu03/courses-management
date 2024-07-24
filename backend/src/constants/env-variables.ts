import 'dotenv/config'

const envs = {
  port: process.env.PORT || 4000,
  host: process.env.HOST as string,
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  dbRefreshTokenName: process.env.DB_REFRESH_TOKEN_TABLE_NAME as string,
  dbTableUserName: process.env.DB_USER_TABLE_NAME as string,
  dbTableForgotPasswordOTP: process.env.DB_FORGOT_PASSWORD_OTP_TABLE_NAME as string,
  dbTableStudent: process.env.DB_STUDENT_TABLE_NAME as string,
  passwordSecret: process.env.PASSWORD_SECRET as string,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
  emailVerifyTokenPrivateKey: process.env.EMAIL_VERIFY_TOKEN_PRIVATE_KEY as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  mailAuthUser: process.env.MAIL_AUTH_USER as string,
  mailAuthPass: process.env.MAIL_AUTH_PASS as string,
  isProduction: (process.env.NODE_ENV === 'production') as boolean
}

export default envs

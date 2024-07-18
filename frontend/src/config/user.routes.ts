export const publicUserRoutes = {
  signin: '/sign-in',
  signup: '/sign-up',
  resetPassword: '/reset-password'
} as const

export const privateUserRoutes = {
  home: '/',
  courses: '/courses'
} as const

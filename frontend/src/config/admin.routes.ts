export const publicAdminRoutes = {
  signin: '/admin/sign-in',
  signup: '/admin/sign-up'
} as const

export const privateAdminRoutes = {
  home: '/admin',
  dashboard: '/admin/dashboard',
  payment: '/admin/payment',
  students: '/admin/students',
  course: '/admin/course',
  settings: '/admin/settings',
  report: '/admin/report'
} as const

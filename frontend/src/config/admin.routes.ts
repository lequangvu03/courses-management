export const publicAdminRoutes = {
  signin: '/admin/sign-in',
  signup: '/admin/sign-up'
} as const

export const privateAdminRoutes = {
  dashboard: '/admin',
  payment: '/admin/payment',
  students: '/admin/students',
  course: '/admin/course',
  settings: '/admin/settings',
  report: '/admin/report'
} as const
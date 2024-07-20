export const publicAdminRoutes = {
  signin: '/admin/sign-in',
  signup: '/admin/sign-up',
  resetPassword: '/admin/reset-password'
} as const

export const privateAdminRoutes = {
  dashboard: '/admin',
  payment: '/admin/payment',
  students: '/admin/students',
  addStudent: '/admin/students/add',
  editStudent: '/admin/students/edit/:id',
  course: '/admin/course',
  settings: '/admin/settings',
  report: '/admin/report'
} as const

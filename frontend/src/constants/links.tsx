import icons from '../assets/icons'
import { privateAdminRoutes } from '../config/admin.routes'

type TNavLink = {
  id: number
  icon?: string
  label: string
  to: string
}

const navlinks: TNavLink[] = [
  {
    id: 1,
    label: 'Home',
    to: privateAdminRoutes.home,
    icon: icons.home
  },
  {
    id: 2,
    label: 'Course',
    to: privateAdminRoutes.course,
    icon: icons.course
  },
  {
    id: 3,
    label: 'Students',
    to: privateAdminRoutes.students,
    icon: icons.student
  },
  {
    id: 4,
    label: 'Payment',
    to: privateAdminRoutes.payment,
    icon: icons.payment
  },
  {
    id: 5,
    label: 'Report',
    to: privateAdminRoutes.report,
    icon: icons.report
  },
  {
    id: 6,
    label: 'Settings',
    to: privateAdminRoutes.settings,
    icon: icons.settings
  }
]

export default navlinks

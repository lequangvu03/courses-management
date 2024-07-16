import icons from '../assets/icons'

type TStat = {
  id: number
  icon?: string
  title: string
  quantity: number
}

const stats: TStat[] = [
  {
    id: 1,
    title: 'Students',
    quantity: 243,
    icon: icons.hat
  },
  {
    id: 2,
    title: 'Course',
    quantity: 13,
    icon: icons.bookmark
  },
  {
    id: 3,
    title: 'Payments',
    quantity: 556_000,
    icon: icons.money
  },
  {
    id: 4,
    title: 'Users',
    quantity: 3,
    icon: icons.user
  }
]

export default stats

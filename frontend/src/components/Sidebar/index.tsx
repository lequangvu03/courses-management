import { NavLink, useNavigate } from 'react-router-dom'
import navlinks from '../../constants/links'
import HeaderBrandTitle from '../HeaderBrandTitle'
import images from '../../assets/images'
import icons from '../../assets/icons'
import styles from './style.module.scss'
import classNames from 'classnames/bind'
import useAuth from '../../hooks/useAuth'
import { useLogoutMutation } from '../../hooks/data/auth.data'
import { privateAdminRoutes } from '../../config/admin.routes'

const cx = classNames.bind(styles)

type SidebarProps = {
  className?: string
}

function Sidebar({ className }: SidebarProps) {
  const logoutMutation = useLogoutMutation()
  const { setIsAuthenticated } = useAuth()
  const navigation = useNavigate()
  const handleLogout = () => {
    navigation('/sign-in')
    logoutMutation.mutate()
    setIsAuthenticated(false)
  }

  return (
    <aside className={cx('sidebar', className)}>
      <HeaderBrandTitle label='CRUD OPERATIONS' className={cx('sidebar__header--title')} />
      <div className={cx('sidebar__info')}>
        <div className={cx('info__avatar')}>
          <img src={images.avatar} className={cx('avatar_img')} />
        </div>
        <div className={cx('info__name')}>
          <div className={cx('label')}>Karthi Madesh</div>
          <span className={cx('role')}>Admin</span>
        </div>
      </div>
      <ul className={cx('sidebar__nav')}>
        {navlinks.map(({ id, label, to, icon }) => (
          <li key={id} className={cx('nav__item')}>
            <NavLink
              end={to === privateAdminRoutes.dashboard}
              className={({ isActive }) =>
                cx(cx('nav__item--link'), {
                  active: isActive
                })
              }
              to={to}
            >
              <div className={cx('nav__icon-wrapper')}>
                <img src={icon} className={cx('nav__icon')} />
              </div>
              <span className={cx('nav__label')}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div>
        <button className={cx('button__logout')} onClick={handleLogout}>
          <span className={cx('button__label')}>Logout</span>
          <img src={icons.logout} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

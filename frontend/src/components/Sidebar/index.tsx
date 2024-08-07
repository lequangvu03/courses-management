import classNames from 'classnames/bind'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import icons from '../../assets/icons'
import images from '../../assets/images'
import { privateAdminRoutes, publicAdminRoutes } from '../../config/admin.routes'
import navlinks from '../../constants/links'
import { useLogoutMutation } from '../../hooks/data/auth.data'
import useBoolean from '../../hooks/useBoolean'
import useAuthStore from '../../stores/auth.store'
import useSidebarStore from '../../stores/toggle-menu.store'
import Hamburger from '../Hamburger'
import HeaderBrandTitle from '../HeaderBrandTitle'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

type SidebarProps = {
  className?: string
}

function Sidebar({ className }: SidebarProps) {
  const { t } = useTranslation()
  const logoutMutation = useLogoutMutation()
  const { setIsAuthenticated } = useAuthStore()
  const navigation = useNavigate()
  const { open, setOpen } = useSidebarStore()
  const { value: openOverlay, setValue: setOpenOverlay } = useBoolean(true)

  useEffect(() => {
    const onResize = () => {
      const condition = window.innerWidth >= 1024
      if (condition) {
        setOpen(condition)
        setOpenOverlay(false)
      } else {
        setOpenOverlay(true)
      }

      setOpen(!(window.innerWidth < 1024))
    }

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = () => {
    navigation(publicAdminRoutes.signin)
    logoutMutation.mutate()
    setIsAuthenticated(false)
  }

  return (
    <>
      {open && openOverlay && <div className={cx('overflay')} onClick={() => setOpen(false)} />}
      <aside
        className={cx('sidebar', className, {
          open: open
        })}
      >
        <Hamburger className={cx('button__hamburger')} />
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
                onClick={() => setOpen(false)}
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
                <span className={cx('nav__label')}>{t(`nav_links.${label}`)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div>
          <button className={cx('button__logout')} onClick={handleLogout}>
            <span className={cx('button__label')}>{t('buttons.logout')}</span>
            <img src={icons.logout} />
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

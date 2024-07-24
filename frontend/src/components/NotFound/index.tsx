import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('title')}>404</h2>
      <p className={cx('sub__title')}>Page not found</p>
      <Button onClick={() => navigate(-1)} size='large' className={cx('button__back')}>
        Back
      </Button>
    </div>
  )
}

export default NotFound

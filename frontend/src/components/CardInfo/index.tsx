import { formatNumber } from '../../lib/utils'
import styles from './style.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

type CardInfoProps = {
  quantity: number
  icon: string
  title: string
  className?: string
}

function CardInfo({ icon, quantity, title, className }: CardInfoProps) {
  return (
    <div className={cx('card-wrapper', className)}>
      <div>
        <img src={icon} alt='card icon' />
        <div className={cx('card-stats__title')}>{title}</div>
      </div>
      <div className={cx('card-stats__quantity')}>
        <span>{formatNumber(quantity)}</span>
      </div>
    </div>
  )
}

export default CardInfo

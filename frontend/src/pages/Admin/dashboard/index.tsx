import classNames from 'classnames/bind'
import CardInfo from '../../../components/CardInfo'
import stats from '../../../constants/stats'
import styles from './style.module.scss'
import { useTranslation } from 'react-i18next'

const cx = classNames.bind(styles)

function Dashboard() {
  const { t } = useTranslation()

  return (
    <div className={cx('home-wrapper')}>
      <div className={cx('home-content')}>
        {stats.map(({ id, quantity, title, icon }, i) => (
          <CardInfo
            key={id}
            className={cx(`card-${i + 1}`)}
            icon={icon!}
            quantity={quantity}
            title={t(`stats.${title}`)}
          />
        ))}
      </div>
    </div>
  )
}

export default Dashboard

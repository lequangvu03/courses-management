import classNames from 'classnames/bind'
import styles from './style.module.scss'
const cx = classNames.bind(styles)

type HeaderBrandTitleProps = {
  className?: string
  label: string
}

function HeaderBrandTitle({ className, label }: HeaderBrandTitleProps) {
  return (
    <h2 className={cx('brand__title', className)}>
      <span>{label}</span>
    </h2>
  )
}

export default HeaderBrandTitle

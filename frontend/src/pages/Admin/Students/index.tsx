import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames/bind'
import request from '../../../api/axios'
import TableStudents from '../../../components/TableStudents'
import { TStudent } from '../../../types/students'
import styles from './style.module.scss'
const cx = classNames.bind(styles)

function Students() {
  const { data } = useQuery({
    queryKey: ['Students'],
    queryFn: () => request.get('/students')
  })

  return (
    <div className={cx('studnets__wrapper')}>
      <TableStudents students={data?.data?.data as TStudent[]} />
    </div>
  )
}

export default Students

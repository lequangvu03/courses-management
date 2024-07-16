import { useQuery } from '@tanstack/react-query'
import TableStudents from '../../../components/TableStudents'
import request from '../../../api/axios'
import { TStudent } from '../../../types/students'
import styles from './style.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

function Students() {
  const { data } = useQuery({
    queryKey: ['Students'],
    queryFn: () => request.get('/students')
  })

  console.log(request.get('/students'))

  return (
    <div className={cx('min-h-screen bg-[#F8F8F8] px-[30px]')}>
      <TableStudents students={data?.data?.data as TStudent[]} />
    </div>
  )
}

export default Students

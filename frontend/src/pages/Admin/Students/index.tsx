import { useQuery } from '@tanstack/react-query'
import TableStudents from '../../../components/TableStudents'
import request from '../../../api/axios'
import { TStudent } from '../../../types/students'
import styles from './style.module.scss'
import classNames from 'classnames/bind'
import { useState } from 'react'
import { Button } from 'antd'
const cx = classNames.bind(styles)

function Students() {
  const [isTrue, setIsTrue] = useState<boolean>(false)
  const { data } = useQuery({
    queryKey: ['Students', isTrue],
    queryFn: () => request.get('/students')
  })

  return (
    <div className={cx('min-h-screen bg-[#F8F8F8] px-[30px]')}>
      <Button onClick={() => setIsTrue((prev) => !prev)}>Get students</Button>
      <TableStudents students={data?.data?.data as TStudent[]} />
    </div>
  )
}

export default Students

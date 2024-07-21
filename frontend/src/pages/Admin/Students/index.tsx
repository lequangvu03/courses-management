import classNames from 'classnames/bind'
import TableStudents from '../../../components/TableStudents'

import { useGetStudentListQuery } from '../../../hooks/data/students.data'
import useQueryConfig from '../../../hooks/useQueryConfig'
import styles from './style.module.scss'
const cx = classNames.bind(styles)

function Students() {
  const { limit, page } = useQueryConfig()

  const studentList = useGetStudentListQuery({
    page: page,
    limit: limit
  })

  return (
    <div className={cx('studnets__wrapper')}>
      <TableStudents
        dataSource={
          studentList?.data?.data?.data || {
            page: page as number,
            limit: limit as number,
            total_pages: 0,
            students: []
          }
        }
      />
    </div>
  )
}

export default Students

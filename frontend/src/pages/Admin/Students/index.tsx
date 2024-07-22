import classNames from 'classnames/bind'
import TableStudents from '../../../components/TableStudents'

import { useGetStudentListQuery } from '../../../hooks/data/students.data'
import useQueryConfig from '../../../hooks/useQueryConfig'
import styles from './style.module.scss'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { privateAdminRoutes } from '../../../config/admin.routes'
import { omit } from 'lodash'
const cx = classNames.bind(styles)

function Students() {
  const params = useQueryConfig()
  const { limit, page } = params
  const navigate = useNavigate()
  const studentList = useGetStudentListQuery({
    page: page,
    limit: limit
  })

  useEffect(() => {
    if (studentList.data?.data.data.students.length === 0 && (page as number) > 1) {
      navigate({
        pathname: privateAdminRoutes.students,
        search: createSearchParams(
          omit({
            ...params,
            page: String((page as number) - 1)
          } as any)
        ).toString()
      })
    }
  }, [studentList.data])

  return (
    <div className={cx('studnets__wrapper')}>
      <TableStudents
        loading={studentList.isPending}
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

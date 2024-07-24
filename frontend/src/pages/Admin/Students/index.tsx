/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames/bind'
import TableStudents from '../../../components/TableStudents'

import { omit } from 'lodash'
import { useEffect, useMemo } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { privateAdminRoutes } from '../../../config/admin.routes'
import { useGetStudentListQuery } from '../../../hooks/data/students.data'
import useQueryConfig from '../../../hooks/useQueryConfig'
import { IStudent } from '../../../types/types'
import styles from './style.module.scss'
const cx = classNames.bind(styles)

function Students() {
  const params = useQueryConfig()
  const { limit, page } = params
  const navigate = useNavigate()
  const studentList = useGetStudentListQuery({ params })

  const dataSource = useMemo(() => {
    if (studentList.isSuccess && studentList.data.data.data.students.length > 0) {
      const students = studentList?.data?.data?.data.students
      return students?.map(
        (student) =>
          ({
            ...student,
            key: student._id
          }) as IStudent & { key: string }
      )
    }
    return []
  }, [studentList])

  useEffect(() => {
    if (dataSource.length === 0 && (page as number) > 1) {
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
    <div className={cx('students__wrapper')}>
      <TableStudents
        loading={studentList.isPending}
        dataSource={
          {
            ...(studentList?.data?.data?.data as {
              limit: number
              page: number
              total_pages: number
              students: IStudent[]
            }),
            students: dataSource
          } || {
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

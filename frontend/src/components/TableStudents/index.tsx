import { Pagination, Popconfirm, Table, TableProps, notification } from 'antd'
import classNames from 'classnames/bind'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import icons from '../../assets/icons'
import { privateAdminRoutes } from '../../config/admin.routes'
import styles from './style.module.scss'
import { IQueryParams, IStudent } from '../../types/types'
import { useDeleteStudentMutation } from '../../hooks/data/students.data'
import useQueryParams from '../../hooks/useQueryParams'

const cx = classNames.bind(styles)

type TableStudentsProps = {
  dataSource: {
    limit: number
    page: number
    total_pages: number
    students: IStudent[]
  }
}

function TableStudents({ dataSource }: TableStudentsProps) {
  const params = useQueryParams()
  const navigate = useNavigate()
  const { page }: IQueryParams = useQueryParams()
  const deleteStudentMutation = useDeleteStudentMutation()
  const columns: TableProps<IStudent>['columns'] = [
    {
      title: '',
      dataIndex: 'avatar',
      render: (url) => (
        <div className={cx('avatar__wrapper')}>
          <img src={url} className={cx('avatar__image')} alt='avatar' />
        </div>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Enroll Number',
      dataIndex: 'enroll_number',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Date of admission',
      dataIndex: 'date_of_admission'
    },
    {
      title: '',
      dataIndex: '_id',
      render: (id, record) => (
        <div className={cx('table__actions')}>
          <Link to={`/admin/students/edit/${id}`} className={cx('button button__edit')}>
            <img src={icons.pen} />
          </Link>
          <Popconfirm
            title='Delete the student'
            description='Are you sure to delete this student?'
            onConfirm={async () => {
              deleteStudentMutation.mutateAsync(id).then(() => {
                notification.success({
                  message: `Deleted student ${record.name} successfully`,
                  duration: 3
                })
              })
            }}
            onCancel={() => {
              console.log('Do nothing!')
            }}
            okText='Yes'
            cancelText='No'
          >
            <button className={cx('button button__detete')}>
              <img src={icons.trash} />
            </button>
          </Popconfirm>
        </div>
      )
    }
  ]

  const onPaginationChange = (page: number) => {
    navigate({
      pathname: privateAdminRoutes.students,
      search: createSearchParams({
        ...params,
        page: String(page)
      }).toString()
    })
  }

  return (
    <div>
      <div className={cx('table__header-wrapper')}>
        <header className={cx('table__header')}>
          <h2 className={cx('table__name')}>Students List</h2>
          <div className={cx('actions__wrapper')}>
            <button className={cx('button__sort')}>
              <img src={icons.sort} alt='icon' />
            </button>
            <Link to={privateAdminRoutes.addStudent} className={cx('button__add')}>
              ADD NEW STUDENT
            </Link>
          </div>
        </header>
      </div>
      <div className={cx('table__wrapper')}>
        <Table
          className={cx('table__students')}
          dataSource={dataSource.students}
          columns={columns}
          pagination={false}
          showSorterTooltip={false}
        />
      </div>

      {dataSource.students.length > 0 && (
        <Pagination
          onChange={onPaginationChange}
          className={cx('pagination')}
          current={Number(page) || 1}
          pageSize={dataSource.limit}
          total={dataSource.total_pages * dataSource.limit}
        />
      )}
    </div>
  )
}

export default TableStudents

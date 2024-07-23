import { Pagination, Popconfirm, Table, TableProps, notification } from 'antd'
import classNames from 'classnames/bind'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import icons from '../../assets/icons'
import { privateAdminRoutes } from '../../config/admin.routes'
import styles from './style.module.scss'
import { IStudent } from '../../types/types'
import { useDeleteStudentMutation } from '../../hooks/data/students.data'
import useQueryParams from '../../hooks/useQueryParams'
import { useTranslation } from 'react-i18next'

const cx = classNames.bind(styles)

type TableStudentsProps = {
  dataSource: {
    limit: number
    page: number
    total_pages: number
    students: (IStudent & { key: string })[]
  }
  loading?: boolean
}

function TableStudents({ dataSource, loading }: TableStudentsProps) {
  const { t } = useTranslation()
  const params = useQueryParams()
  const navigate = useNavigate()
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
      title: t('titles.name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: t('titles.email'),
      dataIndex: 'email',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: t('titles.phone'),
      dataIndex: 'phone',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: t('titles.enroll_number'),
      dataIndex: 'enroll_number',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: t('titles.date_of_admission'),
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any).toString()
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
              {t('buttons.add_student')}
            </Link>
          </div>
        </header>
      </div>
      <div className={cx('table__wrapper')}>
        <Table
          loading={loading}
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
          current={params.page}
          pageSize={dataSource.limit}
          total={dataSource.total_pages * dataSource.limit}
        />
      )}
    </div>
  )
}

export default TableStudents

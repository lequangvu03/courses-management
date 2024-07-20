import { Pagination, Popconfirm, Table, TableProps, notification } from 'antd'
import classNames from 'classnames/bind'
import { Link } from 'react-router-dom'
import icons from '../../assets/icons'
import images from '../../assets/images'
import { privateAdminRoutes } from '../../config/admin.routes'
import { TStudent } from '../../types/students'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

type TableStudentsProps = {
  students: TStudent[]
}

interface DataType {
  key: React.Key
  id: string
  image: string
  name: string
  email: string
  phone: string
  enrollNumber: string
  dateOfAdmission: string
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '',
    dataIndex: 'image',
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
    dataIndex: 'enrollNumber',
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ['ascend', 'descend']
  },
  {
    title: 'Date of admission',
    dataIndex: 'dateOfAdmission'
  },
  {
    title: '',
    dataIndex: 'id',
    render: (id) => (
      <div className={cx('table__actions')}>
        <Link to={`/admin/students/edit/${id}`} className={cx('button button__edit')}>
          <img src={icons.pen} />
        </Link>
        <Popconfirm
          title='Delete the student'
          description='Are you sure to delete this student?'
          onConfirm={async () => {
            notification.success({
              message: `Deleted student ${id} successfully`,
              duration: 3
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

const dataSource: DataType[] = [
  {
    key: '1',
    id: '1',
    image: images.avatar,
    name: 'Karthi',
    email: 'karthi@gmmail.com',
    phone: '73054093760',
    enrollNumber: '12345673032477760',
    dateOfAdmission: '08-Dec, 2021'
  },
  {
    key: '2',
    id: '2',
    image: images.avatar,
    name: 'Vu',
    email: 'karthi@gmmail.com',
    phone: '7305477760',
    enrollNumber: '1234567305477760',
    dateOfAdmission: '08-Dec, 2021'
  }
]

function TableStudents({ students }: TableStudentsProps) {
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
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          showSorterTooltip={false}
        />
      </div>
      <div className={cx('pagination-wrapper')}>
        <Pagination defaultCurrent={1} total={50} align='end' className={cx('pagination')} />
      </div>
    </div>
  )
}

export default TableStudents
